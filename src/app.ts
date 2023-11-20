import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import connect from "./utils/connect";
import cors from "cors";
import { userRouter } from "./routes/user";

import "./utils/passport";

const app: Application = express();
//For env File
dotenv.config();

// Configure CORS
app.use(cors());


app.use(express.json());
app.use("/api/auth", userRouter);


const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`);
  await connect();
});
