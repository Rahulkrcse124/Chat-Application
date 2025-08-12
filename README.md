💬 Real Time Chat Application

A full-stack real-time chat application built with React for the frontend and Node.js + Express + Socket.IO for the backend. This app supports user authentication, one-to-one chat, group chats, media sharing, and real-time notifications.

📸 Project Images
Login Page:

User List:

Chat Window:

Group Chat:

(Replace the paths above with actual screenshot locations)

🚀 Tech Stack
🔧 Frontend
React with Vite

React Router DOM

Axios

Tailwind CSS / Bootstrap (whichever you use)

Context API or Redux (if applicable)

🛠 Backend
Node.js

Express.js

Socket.IO for real-time communication

MongoDB + Mongoose

JWT for authentication

dotenv for environment variables

🎯 Features
✅ User Features
User registration and login with JWT authentication

Real-time one-to-one chat messaging

Group chats with multiple users

Online/offline user status indicators

Send and receive text messages, emojis, and images

View chat history and unread message notifications

⚙️ Admin Features (if applicable)
Manage users and chat rooms

Moderate conversations (optional)

📁 Project Structure
Chat-Application/
├── client/               # Frontend (React + Vite)
│   ├── src/
│   ├── .env              # Frontend environment variables
│   └── vite.config.js
├── server/               # Backend (Node.js + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/           # Socket.IO related logic
│   ├── .env              # Backend environment variables
│   └── server.js
├── .gitignore
└── README.md

⚙️ Setup Instructions
   1: Clone the repository
   git clone https://github.com/Rahulkrcse124/Chat-Application.git
   cd Chat-Application

2:Backend Setup
cd backend
npm install

Create a .env file in the server/ directory with:
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend server:
npm run dev

3: Frontend Setup
cd ../frontend
npm install
Create a .env file in the client/ directory with:
VITE_API_URL=http://localhost:5000

Start the frontend server:
npm run dev

4: Open your browser at http://localhost:4000 to use the chat application.

🧪 API Endpoints (Sample)
| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/v1/auth/register`    | Register new user     |
| POST   | `/api/v1/auth/login`       | User login            |
| GET    | `/api/v1/users`            | Get list of all users |
| GET    | `/api/v1/messages/:chatId` | Get messages for chat |
| POST   | `/api/v1/messages`         | Send a new message    |

🧾 Environment Variables Summary
| Key            | Description                       |
| -------------- | --------------------------------- |
| `MONGO_URI`    | MongoDB connection string         |
| `JWT_SECRET`   | JWT secret for authentication     |
| `PORT`         | Backend server port               |
| `VITE_API_URL` | Backend API base URL for frontend |


✅ .gitignore Summary
node_modules/
.env
client/node_modules/
client/.env
dist/
build/
.vscode/

💡 Future Improvements
Add typing indicators

Implement message reactions and read receipts

Video and voice call support

Mobile app version (React Native)

Enhanced group chat management

Better UI/UX with dark mode support


👨‍💻 Author
Rahul Kumar
GitHub: @Rahulkrcse124
