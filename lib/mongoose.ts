import mongoose from "mongoose";

let isConnected = false; // variable to track the connection status

export const connectToDB = async () => {
  // connect to db
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.log("Mongodb_URI is not defined");

  if (isConnected) return console.log("=> using existing database connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected: true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
