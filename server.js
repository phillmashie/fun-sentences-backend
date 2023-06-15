require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Routes import
const sentenceRouter = require("./routes/sentences.route");
const authenticationRouter = require("./routes/authentication.route");

// Port connection
const PORT = process.env.PORT;

// Cors management
app.use(cors());
app.use(express.json());

// middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

// Welcome Endpoint for fun sentences
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Fun Sentences 🎉." });
});

// Route for the Fun sentences
app.use("/", sentenceRouter);
app.use("/", authenticationRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on 🟢 ${PORT}`);
});
