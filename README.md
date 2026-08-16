<div align="center">

# 💬 SyncChat

### Connect. Chat. Sync. Instantly.

A modern real-time messaging application built for fast, seamless and secure conversations.

**React • TypeScript • Node.js • Express • Prisma • Socket.IO**

---

</div>

## ✨ About SyncChat

**SyncChat** is a full-stack real-time chat application designed to provide a smooth and responsive messaging experience.

Users can discover people, start conversations, exchange messages in real time, see online presence, receive typing indicators, manage unread messages and personalize their profile.

The project combines traditional REST APIs with **Socket.IO** to provide both reliable data persistence and real-time communication.

---

## 🚀 Features

### 💬 Real-Time Messaging

- Instant message delivery using Socket.IO
- Persistent message history
- One-to-one conversations
- Automatic conversation creation
- Recent conversations

### 🟢 Presence System

- Online/offline indicators
- Socket-based user tracking
- Real-time presence updates

### ⌨️ Typing Indicators

Users can see when the other participant is currently typing.

### 🔔 Unread Messages

- Unread message counter
- Messages marked as read when opened
- Real-time unread state

### 🔎 Discover Users

Search for other SyncChat users and instantly start a conversation.

### 🔐 Authentication

SyncChat supports:

- Email/password signup
- Email OTP verification
- Secure login
- Google authentication
- Access tokens
- Refresh tokens
- HTTP-only authentication cookies
- Protected backend routes

### 👤 Profile Settings

Users can:

- Change username
- Change password
- Update profile picture
- Switch between dark and light mode

Profile images are uploaded using **Cloudinary**.

### 🌙 Dark Mode

Responsive light and dark themes across the application.

### 📱 Responsive Design

Optimized for:

- Mobile
- Tablet
- Laptop
- Desktop

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- Axios
- Socket.IO Client
- React Icons
- Shadcn

## Backend

- Node.js
- Express.js
- TypeScript
- Socket.IO
- Prisma ORM
- JWT Authentication
- Zod Validation
- Multer
- Cloudinary
- Google OAuth
- Nodemailer

## Database

Prisma is used as the application's ORM for managing users, conversations and messages.

---

# 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │      React       │
                    │     Frontend     │
                    └────────┬─────────┘
                             │
                   REST API  │  Socket.IO
                             │
                    ┌────────▼─────────┐
                    │ Express + Node   │
                    │     Backend      │
                    └──────┬─────┬─────┘
                           │     │
                    Prisma │     │ Cloudinary
                           │     │
                    ┌──────▼──┐  │
                    │Database │  │
                    └─────────┘  │
                                 ▼
                           Profile Images
```

---

# 🔄 Messaging Flow

```text
User A
  │
  │ Send Message
  ▼
React Frontend
  │
  │ POST /chat/...
  ▼
Express Backend
  │
  ├──── Save Message ────► Database
  │
  └──── Socket Event ────► User B
                              │
                              ▼
                       Message appears
                         instantly
```

REST is responsible for persisting the message while Socket.IO provides real-time delivery.

---

# 🔐 Authentication Flow

```text
Login
  │
  ▼
Backend verifies credentials
  │
  ├── Access Token
  │
  └── Refresh Token
          │
          ▼
     HTTP-only Cookies
          │
          ▼
    Protected Routes
```

Google authentication ultimately connects to the same SyncChat authentication/session system.

---

# 📁 Project Structure

```text
SyncChat/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── store/
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── prisma/
│   ├── socket/
│   └── ...
│
├── README.md
└── DOCUMENTATION.md
```

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/KrrishSharma12/SyncChat.git
cd SyncChat
```

## 2. Install frontend dependencies

```bash
cd frontend
npm install
```

Create:

```text
.env
```

using `.env.example`.

Then:

```bash
npm run dev
```

## 3. Install backend dependencies

```bash
cd ../backend
npm install
```

Create your backend `.env`.

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

---

# 🌐 Development URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

# 🔒 Security

SyncChat implements several security practices including:

- Password hashing
- JWT authentication
- Refresh-token rotation/session handling
- HTTP-only cookies
- Backend authentication middleware
- Request validation
- Google token verification
- Environment-based secret management
- Server-side authorization checks



---

# 🛣️ Future Improvements

Possible future additions:

- Group chats
- Image/file messages
- Voice messages
- Message reactions
- Reply to messages
- Edit/delete messages
- Push notifications
- Delivered/read receipts
- User blocking
- Chat deletion/archive
- Audio/video calling

---

# 👨‍💻 Built By

**Krish Sharma**

Built as a full-stack project to explore real-time systems, authentication, WebSockets, REST APIs and modern frontend development.

---

<div align="center">

### 💜 Built with React, Node.js and Socket.IO

**SyncChat — Stay connected. Stay synced.**

</div>