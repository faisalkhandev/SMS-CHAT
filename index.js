const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5566;

const studentRoutes = require("./routes/studentRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/students", studentRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("App is up and running.");
});

connectDB();
app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});
