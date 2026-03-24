import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRouter from "./analyzeRouteFile.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:4000",
  }),
);

app.use(express.json());

// routes
app.use("/api", analyzeRouter);

// health check
app.get("/", (req, res) => {
  res.send("CV Analyzer API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
