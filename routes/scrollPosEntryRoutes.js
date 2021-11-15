const express = require("express");
const router = express.Router();
const ScrollPosEntryModel = require("../models/scrollPosEntries");

router.post("/insertScrollPosEntries", async (req, res) => {
  const newScrollPosEntries = req.body;
  ScrollPosEntryModel.insertMany(newScrollPosEntries, (err, entries) => {
    if (err) {
      res.send(error);
    } else {
      res.send(entries);
    }
  });
});

router.get("/getScrollPosEntries", async (req, res) => {
  const sessionID = req.query.sessionID;
  ScrollPosEntryModel.find({ sessionID: sessionID }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
