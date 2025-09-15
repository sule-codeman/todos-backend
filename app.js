const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db/db");
connectDB();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes/routes");

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

module.exports = app;
