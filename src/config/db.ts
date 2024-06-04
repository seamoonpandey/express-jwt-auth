import mongoose from "mongoose";

const uri: string = process.env.MONGO_URI || "";
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
