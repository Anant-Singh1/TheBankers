// For writing all the routes of the particular application
const express = require("express");
const router = express.Router();
const User = require("../models/holders");

router.get("/holders", (req, res) => {
  res.send("All Account Holders");
});

module.exports = router;
