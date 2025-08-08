import app from "./app";
import connectdb from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectdb().then(() => {
  app.listen(PORT, () => {
    console.log(`Library Management Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
