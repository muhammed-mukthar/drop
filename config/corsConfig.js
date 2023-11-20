// corsConfig.js
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "https://liansocialmedia.ml"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
