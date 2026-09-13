// require('dotenv').config({path: "./env"})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env"
})
connectDB()
.then(() => {
  app.on("error", (err) => {
    console.log("APPLICATION_START_ERR: ", err);
    throw err;
  })
  app.listen(process.env.PORT || 8000, () => {
    console.log(`APP Listening on PORT: ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO_DB_CONNECTION_FAILED :", err);
})






/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express"

const app = express()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (err) => {
      console.log("ERR: ", err);
      throw err;
    })

    app.listen(process.env.PORT, () => {
      console.log(`process is listening on PORT: ${process.env.PORT}`);
    })
  } catch (err) {
    console.error(err);
    throw err;
  }
})()

*/