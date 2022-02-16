const express = require("express");
const router = express.Router();
const ScrollPosEntryModel = require("../models/scrollPosEntries");

router.post("/api/insertScrollPosEntries", async (req, res) => {
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
router.get("/api/getScrollPosEntries", async (req, res) => {
  const sessionID = req.query.sessionID;
  ScrollPosEntryModel.find({ sessionID: sessionID }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  }).sort({ textNumber: 1, time: 1 });
});

router.put("/api/deleteScrollPosEntries", async (req, res) => {
  const sessionIDs = req.body.sessionIDs;

  ScrollPosEntryModel.deleteMany(
    { sessionID: { $in: sessionIDs } },
    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Deleted scrollPosEntries");
      }
    }
  );
});

module.exports = router;
