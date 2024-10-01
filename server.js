import express from "express";
import dotenv from "dotenv";

import errorHandlerMiddleware from "./middleware/error-middleware.js";
import mongoose from "mongoose";

const app = express();
dotenv.config();
const port = process.env.PORT || 3003;

// Not found Routes Error.
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route Not found" });
});

//Error Handler Middlewar.
app.use(errorHandlerMiddleware);

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `server running and connected to Database on http://localhost:${port}`
    );
  } catch (error) {
    console.log(error);
    console.log("falid to connect to the data base.");
    process.exit(1);
  }
});
