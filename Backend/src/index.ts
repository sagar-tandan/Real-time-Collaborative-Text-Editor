import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { AuthRouter } from "./routes/v1/auth";
import { errorHandler } from "./middleware/errorHandler";
import morgan from "morgan";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1", AuthRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING!)
  .then(() => {
    console.log("DB Connected.");
    app.listen(port, () => {
      console.log("Server is Listening at port : " + port);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
