import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n MONGO_DB_Connected: DB_HOST ${connectionInstance.connection.host}`)
  } catch (err) {
    console.log("ERR: MONGO_DB_CONNECTION_FAILED", err);
    process.exit(1);
  }
}

export default connectDB;