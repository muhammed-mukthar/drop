const express = require('express');
const router = express.Router();

router.get('/auth', (req, res) => {
  res.status(200).send("Welcome to the /auth URL");
});

module.exports = router;
