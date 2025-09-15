# 📝 Todos Backend

A **production-ready backend** for the **Todos Web App**. Handles user authentication, session management, and persistent storage for todos. Built with **Node.js**, **Express**, and **MongoDB**, it provides a secure and efficient REST API to power all frontend todo operations.

---

## 🚀 Features

- 🔐 User registration & login with JWT (Access + Refresh tokens)
- 🍪 Cookie-based authentication
- 📝 Full CRUD operations for todos
- ✅ Input validation via `express-validator`
- 🔒 Secure password hashing with `bcrypt`
- ⚡ Session management and token refresh logic

---

## ⚡ Tech Stack

- **Node.js + Express** – REST API framework
- **MongoDB + Mongoose** – Database & ODM
- **JWT** – Access & Refresh token authentication
- **Cookie Parser + CORS** – Secure cookie handling

---

## 🛠️ Setup

1. **Clone the repository:**

```bash
git clone https://github.com/sule-codeman/todos-backend.git
cd todos-backend
```

2. **Create a `.env` file in the root:**

```env
PORT=5000
MONGO_URI=mongodb+srv://sule-codeman:<password>@cluster.xxxxxxx.mongodb.net/
CORS_ORIGIN=https://sule-codeman.github.io          # Frontend URL
SALT_ROUNDS=8                                       # Bcrypt rounds
JWT_SECRET=a-string-secret-at-least-256-bits-long
JWT_ACCESS_TOKEN_EXPIRY=1200                        # 20 minutes
JWT_REFRESH_TOKEN_EXPIRY=604800                     # 7 days
COOKIES_SECURE=false
COOKIE_SAMESITE=lax
```

3. **Install dependencies:**

```bash
npm install
```

4. **Start the server:**

```bash
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint           | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| POST   | `/register`        | Create a new account (username + password) |
| POST   | `/login`           | Login and send access & refresh cookies    |
| GET    | `/check-cookies`   | Check Cookies                              |
| GET    | `/logout`          | Clear Cookies                              |
| GET    | `/fetch-data`      | Fetch Username + todos                     |
| POST   | `/create-todo`     | Create a new todo                          |
| PATCH  | `/update-todo/:id` | Toggle todo completion                     |
| DELETE | `/delete-todo/:id` | Delete a todo by its ID                    |
