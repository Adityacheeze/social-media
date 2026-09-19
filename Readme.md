# Project Journey

## Commit 1 — Project Setup

- Set up the Node.js project
- Added **Nodemon** as a development dependency to automatically restart the server whenever code changes during development.
- Created the initial backend folder structure
- Added environment variable configuration using `.env`
- Added gitignore
### Folder Structure

```text
src/
├── controllers/   → Handles request logic
├── db/            → Database connection & configuration
├── middlewares/   → Request/response middleware
├── models/        → MongoDB/Mongoose schemas
├── routes/        → API route definitions
├── utils/         → Reusable helper functions
│
├── app.js         → Express app configuration
├── constants.js   → Project-wide constants
└── index.js       → Application entry point

.env               → Stores environment variables
```

## Commit 2 - Prettier Setup 
- Added **Prettier** as a dev dependency
- Added .prettierrc and .prettierignore 

## Commit 3 - Mongo Atlas Connection 
- Added **dotenv, mongoose, express** dependencies
- DB connection logic inside a method `connectDB` in a sepearte file on `/db/index.js` 
 

## Commit 4 - Backend Utilities
- Added **cookie-parser, cors** dependencies
- Added **ApiError** class for standardized API error handling
- Added **ApiResponse** class for standardized API success responses
- Added **asyncHandler** wrapper to handle errors from asynchronous route handlers
- Configured **Express** middleware for request parsing - [JSON, URL-encoded data, static files], CORS and cookies
  - `cors()` → Enables cross-origin requests with credentials support
  - `express.json()` → Parses incoming JSON request bodies (16KB limit)
  - `express.urlencoded()` → Parses URL-encoded form data (16KB limit)
  - `express.static()` → Serves static files from the `public` directory
  - `cookieParser()` → Parses cookies from incoming requests


## Commit 5 - Video Model and User Model
- Added **bcrypt, jsonwebtoken, mongoose-paginate-v2** dependencies
- Added **User** schema with authentication fields, profile information and video watch history
- Added **Video** schema with video metadata, owner reference and publishing status
- Added **password hashing** using bcrypt before saving users 
- Added methods for **password verification** and **JWT access and refresh token generation**
- Added **aggregate pagination** support for the Video model

## Commit 6 - Added Cloudinary Utility and Multer Middleware

- Added **cloudinary** and **multer** dependencies
- Configured Multer to temporarily store uploaded files inside `public/temp`
- Added Cloudinary utility to upload temporary local files to Cloudinary and obtain their cloud URL
- Added **temporary file cleanup** if Cloudinary upload fails
- Client → Multer → Temporary local file → Cloudinary → Cloud URL

## Commit 7 - Register Route Setup
- Added **user controller** with an initial dummy `registerUser` controller
- Added **user routes** and configured the register endpoint as `POST /register`
- Mounted the user router in `app.js` under the `/api/v1/users` base path
- Wrapped the `registerUser` controller with **asyncHandler** for asynchronous error handling

## Commit 8 - User Registration Logic

- Added complete **user registration logic** in `registerUser`
- Extracted and validated required user details from `req.body`

  ```
  if (
      [username, email, fullname, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  ```
- Checked for **existing users** using username or email
  ```
    const existedUser = User.findOne({
      $or: [{ username }, { email }],
    });
  ```
- Used **Multer Middleware** to receive avatar and cover image uploads inside `user.routes.js`
  ```
  router.route("/register").post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
      {
        name: "coverImage",
        maxCount: 1,
      },
    ]),
    registerUser
  );
  ```
- Get LocalFilePath of images via  
  ```
    const avatarLocalPath = req.files?.avatar[0]?.path;
  ```
- Uploaded user images from LocalFilePath to **Cloudinary** and obtained their URLs
  ```
    const avatar = await uploadOnCloudinary(avatarLocalPath);
  ```
- Created the user document in **MongoDB** with the uploaded image URLs
- Fetched the newly created user while excluding **password and refreshToken** from the response
  ```
  const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

  ```
- Returned a standardized **ApiResponse** with `201 Created` on successful registration
