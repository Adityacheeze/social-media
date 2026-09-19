# Project Journey

##  1 - Project Setup

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

##  2 - Prettier Setup 
- Added **Prettier** as a dev dependency
- Added .prettierrc and .prettierignore 

##  3 - Mongo Atlas Connection 
- Added **dotenv, mongoose, express** dependencies
- DB connection logic inside a method `connectDB` in a sepearte file on `/db/index.js` 
 

##  4 - Backend Utilities
- Added **cookie-parser, cors** dependencies
- Added **ApiError** class for standardized API error handling
- Added **ApiResponse** class for standardized API success responses
- Added **asyncHandler** wrapper to handle errors from asynchronous route handlers
- Configured **Express** middleware `app.js` for request parsing - [JSON, URL-encoded data, static files], CORS and cookies
  - `cors()` → Enables cross-origin requests with credentials support
  - `express.json()` → Parses incoming JSON request bodies (16KB limit)
  - `express.urlencoded()` → Parses URL-encoded form data (16KB limit)
  - `express.static()` → Serves static files from the `public` directory
  - `cookieParser()` → Parses cookies from incoming requests


##  5 - Video Model and User Model
- Added **bcrypt, jsonwebtoken, mongoose-paginate-v2** dependencies
- Added **User** schema with authentication fields, profile information and video watch history in `user.models.js`
- Added **Video** schema with video metadata, owner reference and publishing status in `video.models.js`
- Added **password hashing** using bcrypt before saving users using the `userSchema.pre` method
- Added methods for **password verification** and **JWT access and refresh token generation** - `isPasswordCorrect`, `generateAccessToken`, `generateRefreshToken`
- Added **aggregate pagination** support for the Video model 
  ```
  videoSchema.plugin(mongooseAgregatePaginate);
  ```

##  6 - Added Cloudinary Utility and Multer Middleware

- Added **cloudinary** and **multer** dependencies
- Configured Multer to temporarily store uploaded files inside `public/temp`
  ```
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  export const upload = multer({ storage });
  ```
- Added Cloudinary utility to upload temporary local files to Cloudinary and obtain their cloud URL

  ```
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) return null;

      // upload file to cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });

      console.log("Cloudinary file upload successfull; URL: ", response.url);
      // file uploaded successfully

      fs.unlinkSync(localFilePath); // delete the local file if upload fails
      return response;
    }
  };

  export { uploadOnCloudinary };
  ```
- Client → Multer → Temporary local file → Cloudinary → Cloud URL

##  7 - Register Route Setup
- Added **user controller** with an initial dummy `registerUser` controller
- Added **user routes** and configured the register endpoint as `POST /register`
- Mounted the user router in `app.js` under the `/api/v1/users` base path

  ```
  import userRouter from "./routes/user.routes.js";

  // Routes Declaration
  app.use("/api/v1/users", userRouter);
  ```
- Wrapped the `registerUser` controller with **asyncHandler** for asynchronous error handling

##  8 - User Registration Logic

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
