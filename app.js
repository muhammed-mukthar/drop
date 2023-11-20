const express = require('express');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const userRoute = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(helmet());
app.use(compression());
 
// Use the route handlers from separate files
app.use('/', userRoute);
app.use('/', authRoutes);

app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is successfully running, and App is listening on port " + PORT);
  else
    console.log("Error occurred, server can't start", error);
});
