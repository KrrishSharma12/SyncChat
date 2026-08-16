# SyncChat Technical Documentation

## 1. Introduction

SyncChat is a full-stack real-time messaging application.

The application combines REST APIs for persistent operations with Socket.IO for real-time events such as messaging, online presence and typing indicators.

---

# 2. System Architecture

SyncChat follows a client-server architecture.

```text
React Client
     │
     ├──────── REST API ────────┐
     │                          │
     └──────── Socket.IO ───┐   │
                            │   │
                       Express Server
                            │
                    ┌───────┴────────┐
                    │                │
                  Prisma         Cloudinary
                    │
                 Database
```

---

# 3. Frontend

The frontend is implemented using React and TypeScript.

Major responsibilities include:

- Authentication UI
- User discovery
- Recent chats
- Chat interface
- Real-time socket listeners
- Typing indicators
- Online status
- Unread counts
- Profile settings
- Theme management

---

# 4. Backend

The backend is implemented using Node.js, Express and TypeScript.

The backend is responsible for:

- Authentication
- Authorization
- User management
- Conversation management
- Message persistence
- Socket connections
- Online user tracking
- Input validation
- Cloudinary uploads
- Database access

---

# 5. Authentication

## Email Signup

```text
User submits signup
        ↓
Validate request
        ↓
Check existing account
        ↓
Hash password
        ↓
Create user
        ↓
Generate OTP
        ↓
Send verification email
        ↓
Verify OTP
        ↓
Account activated
```

## Login

```text
Email + Password
       ↓
Find user
       ↓
Verify password
       ↓
Generate Access Token
       ↓
Generate Refresh Token
       ↓
Store hashed refresh token
       ↓
Set HTTP-only cookies
```

## Google Authentication

```text
Continue with Google
       ↓
Google OAuth
       ↓
Backend verifies Google identity
       ↓
Find existing user
          OR
Create new user
       ↓
Generate SyncChat tokens
       ↓
Set authentication cookies
```

Google is used to authenticate the identity of the user.

SyncChat still manages its own application session.

---

# 6. Access and Refresh Tokens

The access token is used for authenticated API requests.

The refresh token allows a new access token to be issued without requiring the user to log in again.

The refresh token stored in the database is hashed.

```text
Access Token
    │
    └── Short-lived authentication

Refresh Token
    │
    └── Longer-lived session renewal
```

---

# 7. Middleware

## Authentication Middleware

Protected routes pass through authentication middleware.

```text
Request
   ↓
Read access-token cookie
   ↓
Verify JWT
   ↓
Extract user
   ↓
req.user
   ↓
Controller
```

## Validation Middleware

Zod schemas are used to validate incoming data.

```text
Request
   ↓
Zod Schema
   ↓
safeParse()
   │
   ├── Invalid → 400
   │
   └── Valid → Controller
```

This prevents invalid request data from reaching application logic.

---

# 8. Conversations

A conversation represents a chat between participants.

For direct messages, the backend determines whether a conversation already exists.

```text
Sender + Receiver
       ↓
Generate Direct Chat Key
       ↓
Search Conversation
       │
    ┌──┴──┐
    │     │
 Found   Not Found
    │     │
    │     └── Create Conversation
    │
    ▼
Send Message
```

This prevents duplicate direct conversations between the same users.

---

# 9. Messages

When a message is sent:

1. Validate sender.
2. Validate receiver.
3. Find/create conversation.
4. Save message.
5. Update conversation timestamp.
6. Emit message through Socket.IO.
7. Return message to sender.

```text
Sender
   ↓
REST Request
   ↓
Backend
   ├── Database
   │     ↓
   │   Save
   │
   └── Socket.IO
         ↓
      Receiver
```

---

# 10. Socket.IO

Socket.IO provides the real-time layer of SyncChat.

The client connects when the application starts.

After authentication, the client identifies itself to the socket server.

```text
Browser
   ↓
Socket Connection
   ↓
setup(userId)
   ↓
Backend
   ↓
userSocketMap
```

Conceptually:

```text
userId → socket connection
```

This allows the server to locate an online user.

---

# 11. Online Presence

The backend tracks connected users.

```text
User connects
     ↓
Store socket
     ↓
Online

User disconnects
     ↓
Remove socket
     ↓
Offline
```

The frontend listens for presence events and updates the chat interface.

---

# 12. Real-Time Messages

After a message has been stored:

```text
receiverId
    ↓
Find receiver socket
    ↓
io.to(socketId)
    ↓
receive-message
```

The receiver's frontend listens for:

```text
receive-message
```

and updates the message state without refreshing the page.

---

# 13. Typing Indicator

Typing state does not need to be persisted in the database.

```text
User types
    ↓
typing event
    ↓
Socket.IO server
    ↓
Receiver
    ↓
"Typing..."
```

When typing stops:

```text
stop-typing
```

is emitted.

---

# 14. Unread Messages

Messages contain information that allows the backend to determine whether they have been read.

The Recent Chats API calculates unread messages for the logged-in user.

```text
New Message
    ↓
Receiver hasn't opened chat
    ↓
Unread count increases
```

When the conversation is opened:

```text
Open conversation
      ↓
Mark messages as read
      ↓
Unread count becomes 0
```

---

# 15. User Discovery

Users can search for other SyncChat users.

```text
Search Input
     ↓
User API
     ↓
Database Search
     ↓
Matching Users
```

Selecting a user navigates to:

```text
/chat/user/:receiverId
```

If an existing conversation exists, its history can be loaded.

Otherwise a conversation is created when the first message is sent.

---

# 16. Recent Chats

Recent conversations are ordered using their latest update time.

Each result contains information such as:

```text
conversationId
participant
lastMessage
updatedAt
unreadCount
```

This allows the frontend to render a WhatsApp-style recent conversation list.

---

# 17. Profile Management

The Settings page currently supports:

- Username update
- Password change
- Profile-picture update

Email modification is intentionally not exposed.

---

# 18. Profile Images

Profile pictures are uploaded using:

```text
Frontend File
      ↓
multipart/form-data
      ↓
Multer
      ↓
Backend Buffer
      ↓
Cloudinary
      ↓
Image URL
      ↓
Database
```

Only the Cloudinary URL needs to be stored in the user record.

---

# 19. Password Change

```text
Current Password
       ↓
Verify hash
       ↓
New Password
       ↓
Hash
       ↓
Update database
```

The current password must be verified before the new password is accepted.

---

# 20. Theme

The frontend supports:

```text
Light Mode
Dark Mode
```

Theme state is handled on the client and reused across components such as:

- Sidebar
- Settings
- Chat
- Recent Chats
- Footer

---

# 21. Routing

Important frontend routes include:

```text
/login

/signup

/verify-email

/

/recents

/chat/:conversationId

/chat/user/:receiverId

/settings/:userId
```

Both chat routes render the same ChatPage.

The difference is how the conversation is initially identified.

---

# 22. Environment Variables

Sensitive values must be stored in environment variables.

Examples include:

```text
DATABASE_URL

ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

SMTP credentials
```

Never commit production secrets to GitHub.

---

# 23. Production Deployment

Before deployment:

```text
1. Configure production database
2. Configure environment variables
3. Configure frontend API URL
4. Configure CORS
5. Configure production cookie settings
6. Add production Google OAuth origin
7. Generate Prisma client
8. Apply database migrations
9. Build frontend
10. Build/start backend
```

---

# 24. Production CORS

Development currently uses a localhost frontend.

For production, configure CORS using the deployed frontend domain.

Example concept:

```ts
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

Do not leave production authentication dependent on localhost URLs.

---

# 25. Production Cookies

When frontend and backend are deployed on different origins, review:

```text
httpOnly
secure
sameSite
domain
```

Production authentication cookies should be transmitted securely over HTTPS.

---

# 26. Google OAuth Deployment

After deploying the frontend, add the production frontend origin to the Google OAuth configuration.

For example:

```text
Development:
http://localhost:5173

Production:
https://your-domain.com
```

Use the actual deployed domain.

---

# 27. Database Deployment

Run Prisma generation during the backend build:

```bash
npx prisma generate
```

For production migrations, typically use:

```bash
npx prisma migrate deploy
```

rather than creating new development migrations on the production server.

---

# 28. Security Checklist

Before making SyncChat public, verify:

- `.env` is ignored
- Database credentials aren't committed
- Google client secret isn't in frontend
- Cloudinary secret isn't in frontend
- Passwords are hashed
- Refresh tokens are hashed
- Protected routes use auth middleware
- Message APIs verify conversation membership
- Profile update APIs verify current user
- CORS allows only intended frontend origins
- Production uses HTTPS
- Production cookies use secure settings
- Request payloads are validated

---

# 29. Future Architecture Improvements

As the application grows, consider:

- Redis for socket/user presence
- Socket.IO Redis adapter
- Pagination for messages
- Cursor-based conversation loading
- Rate limiting
- Message attachments
- Background jobs
- Push notifications
- Group conversations
- Message delivery/read receipts
- User blocking
- Chat archive/delete functionality

---

# 30. Summary

SyncChat separates responsibilities into two communication models:

```text
REST
│
├── Authentication
├── Database operations
├── Message persistence
├── Profile management
└── Conversation retrieval


Socket.IO
│
├── Live messages
├── Online presence
└── Typing indicators
```

This architecture allows the database to remain the source of truth while Socket.IO provides the real-time user experience.

---

## Author

**Krish Sharma**

SyncChat was built as a full-stack real-time messaging project focused on modern authentication, real-time communication and scalable web application architecture.