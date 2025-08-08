import express from "express";
import cors from "cors";
import bookRoute from "./routes/book.route";
import borrowROute from "./routes/borrow.route";
const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) =>
  res.send("Library Management Server is running on port 5000...")
);

app.use("/api/books", bookRoute);
app.use("/api/borrow", borrowROute);

export default app;
