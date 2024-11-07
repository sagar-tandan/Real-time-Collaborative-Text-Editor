import express from "express";
import { router } from "./routes/v1/auth";

const app = express();
const port = 3000;

app.use("/api/v1", router);

app.listen(port, () => {
  console.log("Server is Listening at port : " + port);
});
