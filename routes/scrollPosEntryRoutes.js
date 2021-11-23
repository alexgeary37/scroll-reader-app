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

// Get scroll position entries from multiple sessions, ordered by session and time.
router.get("/getScrollPosEntries", async (req, res) => {
  const sessionIDs = req.query.sessionIDs;
  ScrollPosEntryModel.find(
    { sessionID: { $in: sessionIDs } },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  ).sort({ sessionID: 1, time: 1 });
});

module.exports = router;
