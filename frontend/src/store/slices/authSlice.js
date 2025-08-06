import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";
import { act } from "react";

//  Get current logged-in user
export const getUsers = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance("/user/me");
      connectSocket(res.data.user);

      return res.data.user;
    } catch (error) {
      console.error("Error in getUsers:", error);
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Failed to fetch user"
      );
    }
  }
);

//  Register user
export const signup = createAsyncThunk(
  "user/sign-up",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-up", data);
      toast.success("Registered successfully");
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Login user
export const login = createAsyncThunk(
  "user/sign-in",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-in", data);
      
      connectSocket(res.data._id); //  instead of res.data

      toast.success("Logged in successfully");
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Logout user
export const logout = createAsyncThunk(
  "user/sign-out",
  async (navigate, thunkAPI) => {
    try {
      await axiosInstance.get("/user/sign-out"); //  logs out from server
      disconnectSocket();
      navigate("/login"); //  may decouple this later
      return null;
    } catch (error) {
      const message = error?.response?.data?.message || "Logout failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// update profile
export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      toast.success("profile updated sucessfully ");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

//  Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigninUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false, 
    isCheckingAuth: true,
    onlineUsers: [],
    logoutError: null,
  },
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔍 Check current user
      .addCase(getUsers.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUsers.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      // 🔐 Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // 🚪 Logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
        state.logoutError = null;
      })
      .addCase(logout.pending, (state) => {
        state.logoutError = null; // clear old error
      })

      .addCase(logout.rejected, (state, action) => {
        state.logoutError = action.payload || "Logout failed";
      })

      // Register
      .addCase(signup.pending, (state) => {
        state.isSigninUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSigninUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigninUp = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isUpdatingProfile = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
