import mongoose from "mongoose";
import { app } from "./app";

// mongoose connection
const start = async () => {
  if (!process.env.JWTSECRET) {
    throw new Error("JWTSECRET must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(4000, () => {
    console.log("Auth service listening on Port 4000!");
  });
};

start();
