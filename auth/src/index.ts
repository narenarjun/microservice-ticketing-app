import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from 'cookie-session'

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set('trust proxy',true );
app.use(json());
app.use(cookieSession({
  signed:false,
  // secure:true  //! when this is set to true, it'll only work on connection coming with https://
}))

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

// mongoose connection
const start = async () => {
  if(!process.env.JWTSECRET){
    throw new Error('JWTSECRET must be defined')
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');
    
  } catch (err) {
    console.error(err);
  }
  app.listen(4000, () => {
    console.log("Auth service listening on Port 4000!");
  });
};

start();