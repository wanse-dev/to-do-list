import express, { Request, Response } from 'express';
import cors from "cors";
import "dotenv/config";
import routes from "./routes/index";
import connectDB from "./database";

const allowedOrigins = [
  "http://localhost:5173",
  "https://work-tasks-management.netlify.app",
];

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server working properly!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
