import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes/index";
import connectDB from "./database";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'https://work-tasks-management.netlify.app' }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server working properly!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
