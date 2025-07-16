<p align="center">
  <img width="350" height="140" alt="Chitai Logo" src="https://github.com/user-attachments/assets/6acb14f3-5371-4e48-841f-3a31a2b915c5" />
</p>

# 📝 Chitai – Full Stack Blog Platform

**Chitai** is a full-stack blog app built using **React**, **Express**, and **Prisma**.

It allows users to:
<ul>
  <li>Create an account and log in</li>
  <li>Write and publish blog posts</li>
  <li>Read posts from other users</li>
  <li>Comment on posts and engage with the community</li>
</ul>

## ⚙️ Tech Stack

**Frontend:**
- React
- Vite

**Backend:**
- Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)

---

## 🚀 Getting Started

### 🔧 Backend Setup

Navigate to the API folder:

    cd api/

Create a .env file with the following variables:

    DATABASE_URL=your_postgres_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION=1h
    PORT=5000

Then run the following commands:

    npx prisma generate
    npx prisma db push
    node app.js

💻 Frontend Setup

  Navigate to the client folder:

    cd client/

Create a .env file with the following variable:

    VITE_API_URL=chitai-api.onrender.com

Do not include http:// or https:// <br>
❌ Incorrect: "https://chitai-api.onrender.com" <br>
✅ Correct: "chitai-api.onrender.com"

Start the frontend server:

    npm install
    npm run dev
