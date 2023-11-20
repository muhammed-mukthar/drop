const express = require('express');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const userRoute = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');
const cors = require("cors") 
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const app = express();

dotenv.config();  

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

 
//middleware 
app.use((req, res, next) => {  
res.header("Access-Control-Allow-Credentials", true); 
next();
});
app.use(express.json()); 
app.use(
cors({
  origin: ["http://localhost:3000","https://liansocialmedia.ml"],
})
); 
app.use(compression())
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
