import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) =>
  res.send("Library Management Server is running on port 5000...")
);

export default app;
