# My Story (Backend) — Secure API and User Management.

This project is the backend service for the My Story application. It provides a RESTful API with robust authentication and role-based access control (RBAC) using Node.js, Express, and MongoDB.

## Table of Contents

- [Key Features](#key-features)
- [Technology Used](#technology-used)
- [Run it Locally](#run-it-locally)
- [Live URL](#live-url)
- [Project Dependencies](#project-dependencies)
- [Connect With Me](#connect-with-me)

## Key Features

- **JWT Authentication**
  - Secure token-based authentication system.
- **Role-Based Authorization**
  - Middleware to protect routes and verify administrative privileges.
- **Data Persistence**
  - MongoDB integration using Mongoose ODM.
- **Data Validation**
  - Strict schema validation for incoming requests using Zod.
- **Database Seeding**
  - Built-in script to easily populate the database with initial users.

## Technology Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB, Mongoose
- **Security**: bcryptjs, jsonwebtoken, Zod

## Run it Locally

Please follow the below instructions to run this project in your machine:

1. Clone this repository

   ```sh
   git clone https://github.com/sagormajomder/my-story.git
   ```

2. Open the directory "my-story" into visual studio code
3. Navigate to the backend directory: `cd backend`
4. Open Terminal and run `pnpm install` (or `npm i`) to install all dependencies
5. Set up environment variables:

   Create a .env file in the root directory of `backend` and add the following environment variables:

   ```
      PORT=5000
      MONGODB_URI=your_mongodb_connection_string
      JWT_SECRET=your_super_secret_jwt_key
   ```

6. Run `pnpm run seed` to seed the database (optional).
7. Run `pnpm run dev` to run the project locally.

   The server will be available on http://localhost:5000/ by default.

## Live URL

#### 🚀 Live Project URL: Not deployed yet.

## Project Dependencies

#### Dependencies List

```json
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.6.3",
    "zod": "^4.4.3"
  }
```

## Connect with Me

✨ Let's connect on different platforms! Feel free to reach out.

🐦 **Twitter:** [@sagormajomder](https://twitter.com/sagormajomder)

🐙 **GitHub:** [@sagormajomder](https://github.com/sagormajomder)

📘 **Facebook:** [@sagormajomder](https://facebook.com/sagormajomder)

🔗 **LinkedIn:** [@sagormajomder](https://www.linkedin.com/in/sagormajomder/)
