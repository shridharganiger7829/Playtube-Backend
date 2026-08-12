# 🎥 YouTube Clone — Backend

A backend implementation of a **YouTube-like video-sharing platform** built using **Node.js, Express.js, MongoDB, and Mongoose**.

This project was built to understand and implement real-world backend development concepts such as **REST APIs, authentication, authorization, JWT, access & refresh tokens, cookies, MongoDB aggregation pipelines, `$lookup`, file uploads, Cloudinary, middleware, controllers, models, and API error handling**.

> 🚀 **Backend development learning project completed successfully.**

---

## 📌 Project Overview

This project provides the backend functionality required for a video-sharing platform similar to YouTube.

The backend handles:

* User registration and login
* JWT-based authentication
* Access and refresh token management
* Secure HTTP cookies
* User profile management
* Avatar and cover image uploads
* Video management
* Likes and comments
* Subscriptions
* Channel information
* Watch history
* MongoDB aggregation pipelines
* Relationships between multiple collections
* RESTful API architecture
* Centralized error handling

The authentication system generates access and refresh tokens and stores the refresh token in the user's database record.

---

# 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT (JSON Web Token)**
* **Multer**
* **Cloudinary**
* **Cookie Parser**
* **CORS**
* **dotenv**

### Development Tools

* VS Code
* Postman
* MongoDB Compass
* Git
* GitHub
* Nodemon

---

# 🏗️ Backend Architecture

The project follows a structured backend architecture:

```text
Client
   ↓
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

Additional services:

```text
File Upload
     ↓
   Multer
     ↓
Cloudinary
     ↓
 Image/Video URL
     ↓
   MongoDB
```

---

# 🔐 Authentication & Authorization

One of the major parts of this project is implementing a complete authentication system.

## User Registration

The registration process includes:

1. Receiving user details
2. Validating required fields
3. Checking whether username/email already exists
4. Receiving avatar and cover image
5. Uploading images to Cloudinary
6. Creating the user in MongoDB
7. Removing sensitive information from the response

The registration controller validates the fields, checks existing users, uploads the avatar/cover image and creates the user document.

---

## User Login

The login system supports authentication using:

* Username or email
* Password verification
* Access token generation
* Refresh token generation
* HTTP-only cookies

```text
User Login
    ↓
Find User
    ↓
Verify Password
    ↓
Generate Access Token
    ↓
Generate Refresh Token
    ↓
Store Refresh Token
    ↓
Send Cookies
```

The implementation uses secure HTTP cookies for the access and refresh tokens.

---

# 🔑 Access Token & Refresh Token

This project helped me understand how modern authentication systems work using two tokens.

### Access Token

Used for accessing protected resources.

```text
Client → Access Token → Protected API
```

### Refresh Token

Used to generate a new access token when the access token expires.

```text
Refresh Token
      ↓
Verify Token
      ↓
Find User
      ↓
Compare Stored Token
      ↓
Generate New Access Token
      ↓
Generate New Refresh Token
```

The refresh-token controller verifies the JWT, finds the user, compares the incoming refresh token with the stored token, and generates new tokens.

---

# 🍪 Cookies

The project uses cookies for token storage.

```javascript
.cookie("accessToken", AccessToken, options)
.cookie("refreshToken", RefreshToken, options)
```

The cookies are configured with:

```javascript
{
    httpOnly: true,
    secure: true
}
```

This helped me understand how authentication information can be securely transferred between the client and server.

---

# 🚪 Logout

During logout:

* Refresh token is removed from the database
* Access token cookie is cleared
* Refresh token cookie is cleared

```text
Logout
  ↓
Remove Refresh Token
  ↓
Clear Cookies
  ↓
User Logged Out
```

---

# 👤 User Management

The backend supports:

* Get current user
* Change password
* Update account details
* Update avatar
* Update cover image
* Get channel details
* Get watch history

For example, password changes require verification of the old password before saving the new password.

---

# ☁️ Cloudinary Integration

Cloudinary is used for storing uploaded media.

The backend receives uploaded files and sends them to Cloudinary instead of storing large media files directly inside the application server.

```text
Client
  ↓
Multer
  ↓
Local File
  ↓
Cloudinary
  ↓
Cloudinary URL
  ↓
MongoDB
```

Avatar and cover images are uploaded through Cloudinary in the user-management controllers.

---

# 🗄️ MongoDB & Mongoose

MongoDB is used as the primary database.

Mongoose is used for:

* Schema definition
* Models
* Queries
* Validation
* Relationships
* Aggregation pipelines

The project uses multiple collections such as:

```text
users
videos
likes
comments
subscriptions
```

---

# 🔎 MongoDB Aggregation Pipeline

One of the most important concepts I learned from this project is the **MongoDB Aggregation Framework**.

I implemented aggregation pipelines to combine information from multiple collections.

Important aggregation stages learned:

```text
$match
$lookup
$unwind
$group
$project
$addFields
$size
$in
```

---

# 🔗 MongoDB `$lookup`

The project uses `$lookup` to connect documents from different collections.

For example, channel information can be combined with subscription information:

```javascript
{
    $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
    }
}
```

This allows the backend to find users who subscribed to a particular channel.

Another `$lookup` is used to find channels that a user has subscribed to:

```javascript
{
    $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed"
    }
}
```

This helped me understand how relationships between MongoDB collections can be handled using aggregation.

---

# 📺 Channel Details

The backend provides channel information such as:

* Full name
* Username
* Avatar
* Cover image
* Subscriber count
* Subscribed-to count
* Subscription status

The subscriber count and subscribed-to count are calculated using aggregation and `$size`.

---

# ▶️ Watch History

Users can maintain a watch history of videos.

The watch-history aggregation:

1. Finds the current user
2. Looks up videos from the `watchHistory`
3. Retrieves video owner information
4. Projects required owner fields
5. Returns the watch history

```text
User
 ↓
watchHistory IDs
 ↓
$lookup
 ↓
Videos
 ↓
Video Owner
 ↓
User Details
```

---

# 📡 REST API Concepts

Through this project I learned how to design backend APIs using HTTP methods.

### GET

Used for retrieving resources.

```text
GET /users/current-user
GET /users/channel/:username
```

### POST

Used for creating resources.

```text
POST /users/register
POST /users/login
```

### PATCH / PUT

Used for updating resources.

```text
PATCH /users/update-account
PATCH /users/change-password
```

### DELETE

Used for deleting resources.

```text
DELETE /...
```

---

# 🧩 Middleware

I learned how middleware works in Express.js and how it can be used for:

* Authentication
* Authorization
* File uploads
* Error handling
* Request processing
* Cookie handling
* CORS

Middleware acts as a bridge between the incoming request and the controller.

```text
Request
   ↓
Middleware
   ↓
Authentication
   ↓
Controller
   ↓
Response
```

---

# ⚠️ Error Handling

The project uses custom error handling with an `ApiError` class and an `asyncHandler`.

Example:

```javascript
throw new ApiError(
    400,
    "All fields are required"
);
```

This makes API errors more structured and easier to handle.

---

# 📦 Standard API Response

The project also uses a custom `ApiResponse` class to maintain a consistent response structure.

Example:

```javascript
new ApiResponse(
    200,
    data,
    "User logged in successfully"
)
```

This helped me understand the importance of maintaining consistent API responses across backend applications.

---

# 📁 Project Structure

```text
backend/
│
├── controllers/
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── like.controller.js
│   ├── comment.controller.js
│   └── subscription.controller.js
│
├── models/
│   ├── user.model.js
│   ├── video.model.js
│   ├── like.model.js
│   ├── comment.model.js
│   └── subscription.model.js
│
├── routes/
│   ├── user.routes.js
│   ├── video.routes.js
│   ├── like.routes.js
│   ├── comment.routes.js
│   └── subscription.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
│
├── db/
│   └── database.js
│
├── app.js
├── index.js
├── .env
└── package.json
```

---

# 🧠 What I Learned

This project was not just about building a YouTube clone. It helped me understand the fundamentals of **backend development from practical implementation**.

### JavaScript / Node.js

* Async/await
* Promises
* Modules
* Error handling
* Object manipulation
* Destructuring
* Higher-order functions

### Express.js

* Routing
* Middleware
* Controllers
* Request/response cycle
* HTTP methods
* Cookies
* CORS
* REST APIs

### MongoDB

* CRUD operations
* MongoDB queries
* Mongoose
* Schema design
* References
* Aggregation
* `$lookup`
* `$match`
* `$unwind`
* `$group`
* `$project`
* `$addFields`

### Authentication

* Password hashing
* Password verification
* JWT
* Access tokens
* Refresh tokens
* Token rotation
* Protected routes
* Cookies
* Authentication middleware

### File Handling

* Multer
* Local file handling
* Cloudinary
* Image/video upload

### Backend Architecture

* MVC-style structure
* Controllers
* Routes
* Models
* Middleware
* Utility functions
* Error handling
* API response handling

---

# 🎯 Main Goal of the Project

The main goal of this project was to move beyond simply learning syntax and understand **how a real backend application is designed and how different components communicate with each other.**

```text
Frontend
   ↓
REST API
   ↓
Express Server
   ↓
Middleware
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

I also learned how multiple collections can work together to build real application features such as subscriptions, likes, comments, videos, channels, and watch history.

---

# 🚀 Future Improvements

Possible future improvements include:

* Video streaming optimization
* Video recommendation system
* Search functionality
* Pagination
* Advanced video analytics
* Notification system
* Email verification
* Forgot/reset password
* Better authorization/role management
* Improved subscription status logic
* API documentation using Swagger
* Unit and integration testing
* Rate limiting
* Production deployment

---

# 📚 Learning Outcome

By completing this project, I gained practical experience in building a backend application from the ground up.

The most important thing I learned was not just **how to write backend code**, but **how to think about backend logic, database relationships, authentication flows, API design, and communication between different components of an application.**

---

# 👨‍💻 Author

**Shridhar Ganiger**

Computer Science & Engineering Student

Backend Development | Node.js | Express.js | MongoDB

---

## ⭐ If you find this project useful

Feel free to explore the repository, suggest improvements, or use the project as a learning reference.

**Built with ❤️ while learning Backend Development.**


