const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require('morgan');

// Local module
const routes = require("./routes/appRoutes");

const PORT = process.env.PORT || 7000;

// Middleware
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// sendind static file
app.use(express.static(path.join(__dirname, "client", "Assets")));
app.use(express.static(path.join(__dirname, "client", "css")));
app.use(express.static(path.join(__dirname, "client", "js")));

// MongoDB Connection
const dbURI = process.env.NODE_MONGODB_API_KEY;
mongoose.set("strictQuery", false);
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log("app running on port:" + PORT);
    });
  })
  .catch((err) => console.log(err));

// Routes
app.use(routes);
app.use((req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, "client", "notFound.html"));
});
