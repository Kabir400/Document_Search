//imports
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());

const port = process.env.PORT || 8000;

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", require("./router/user.router.js"));
app.use("/api/v1", require("./router/document.router.js"));
app.use("/api/v1", require("./router/chat.router.js"));
app.use("/api/v1", require("./router/messages.router.js"));

//defalut error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const suceess = err.suceess || false;
  let message = err.message || "something went wrong";
  const data = err.data || null;

  if (err.code === 11000) {
    message = "Email already exists";
  }
  res.status(status).json({
    status,
    message,
    suceess,
    data,
  });
});

//connecting to database and listning on a port
connectDB()
  .then(() => {
    //checking for error
    app.on("error", (err) => {
      console.log(`Error: ${err}`);
      process.exit(1);
    });

    //listning to the server
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Database connection error: ${err}`);
  });
