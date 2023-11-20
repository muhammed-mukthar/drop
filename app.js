// app.js
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const userRoute = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');
const { connectToDatabase } = require('./config/connection');
const corsConfig = require('./config/corsConfig'); // Import the corsConfig middleware
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT;

// Connect to MongoDB
const db = connectToDatabase();

// Middleware
app.use(corsConfig); // Use the corsConfig middleware
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Use the route handlers from separate files
app.use('/', userRoute);
app.use('/', authRoutes);

app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is successfully running, and App is listening on port " + PORT);
  else
    console.log("Error occurred, server can't start", error);
});
