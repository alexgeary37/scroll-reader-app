const express = require("express");
const router = express.Router();
const ReadingSessionModel = require("../models/readingSessions");

router.post("/api/createReadingSession", async (req, res) => {
  const newSession = req.body;
  ReadingSessionModel.create(newSession, (err, session) => {
    if (err) {
      res.send(err);
    } else {
      res.send(session);
    }
  });
});

router.get("/api/getReadingSession", async (req, res) => {
  const id = req.query;
  ReadingSessionModel.findOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/getReadingSessions", async (req, res) => {
  ReadingSessionModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/api/addViewportChange", async (req, res) => {
  const id = req.body.id;
  const width = req.body.width;
  const height = req.body.height;
  const time = req.body.time;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    {
      $push: {
        viewportDimensions: {
          width: width,
          height: height,
          time: time,
        },
      },
    },
    { new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Added new object to viewportDimensions");
      }
    }
  );
});

router.put("/api/addEndTime", async (req, res) => {
  const id = req.body.id;
  const time = req.body.time;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    { $set: { endTime: time } },
    { new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Added endTime to readingSession");
      }
    }
  );
});

router.put("/api/addNewSpeedText", async (req, res) => {
  const id = req.body.id;
  const fileID = req.body.fileID;
  const startTime = req.body.startTime;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    {
      $push: {
        speedTexts: {
          fileID: fileID,
          startTime: startTime,
        },
      },
    },
    { new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Added speedText[fileID].startTime");
      }
    }
  );
});

router.put("/api/addNewScrollText", async (req, res) => {
  const id = req.body.id;
  const fileID = req.body.fileID;
  const startTime = req.body.startTime;
  const familiarity = req.body.familiarity;
  const interest = req.body.interest;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    {
      $push: {
        scrollTexts: {
          fileID: fileID,
          startTime: startTime,
          familiarity: familiarity,
          interest: interest,
        },
      },
    },
    { new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Added scrollText[fileID].startTime");
      }
    }
  );
});

router.put("/api/updateCurrentSpeedText", async (req, res) => {
  const id = req.body.id;
  const fileID = req.body.fileID;
  const endTime = req.body.endTime;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    { $set: { "speedTexts.$[elem].endTime": endTime } },
    { arrayFilters: [{ "elem.fileID": fileID }], new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Added endTime to current speedText");
      }
    }
  );
});

router.put("/api/updateCurrentScrollText", async (req, res) => {
  const id = req.body.id;
  const fileID = req.body.fileID;
  const endTime = req.body.endTime;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    { $set: { "scrollTexts.$[elem].endTime": endTime } },
    { arrayFilters: [{ "elem.fileID": fileID }], new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Added endTime to current scrollText");
      }
    }
  );
});

router.put("/api/updateCurrentSpeedTextPauses", async (req, res) => {
  const id = req.body.id;
  const fileID = req.body.fileID;
  const action = req.body.action;
  const time = req.body.time;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    {
      $push: {
        "speedTexts.$[elem].pauses": { action: action, time: time },
      },
    },
    { arrayFilters: [{ "elem.fileID": fileID }], new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Updated pauses in current speedText");
      }
    }
  );
});

router.put("/api/updateCurrentScrollTextPauses", async (req, res) => {
  const id = req.body.id;
  const fileID = req.body.fileID;
  const action = req.body.action;
  const time = req.body.time;

  ReadingSessionModel.findByIdAndUpdate(
    id,
    {
      $push: {
        "scrollTexts.$[elem].pauses": { action: action, time: time },
      },
    },
    { arrayFilters: [{ "elem.fileID": fileID }], new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Updated pauses in current scrollText");
      }
    }
  );
});

router.put("/api/addAnswerButtonClick", async (req, res) => {
  const sessionID = req.body.sessionID;
  const fileID = req.body.fileID;
  const questionNumber = req.body.questionNumber;
  const action = req.body.action;
  const time = req.body.time;

  ReadingSessionModel.findByIdAndUpdate(
    sessionID,
    {
      $push: {
        "scrollTexts.$[elem].answerButtonClicks": {
          questionNumber: questionNumber,
          action: action,
          time: time,
        },
      },
    },
    {
      arrayFilters: [{ "elem.fileID": fileID }],
      new: true,
    },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Updated answerButtonClicks in current scrollText");
      }
    }
  );
});

router.put("/api/addCurrentScrollTextQuestionAnswer", async (req, res) => {
  const sessionID = req.body.sessionID;
  const fileID = req.body.fileID;
  const questionNumber = req.body.questionNumber;
  const questionID = req.body.questionID;
  const answer = req.body.answer;
  const skip = req.body.skip;
  const yPos = req.body.yPos;
  const time = req.body.time;

  ReadingSessionModel.findByIdAndUpdate(
    sessionID,
    {
      $push: {
        "scrollTexts.$[elem].questionAnswers": {
          questionNumber: questionNumber,
          answer: answer,
          skip: skip,
          yPosition: yPos,
          time: time,
        },
      },
    },
    {
      arrayFilters: [{ "elem.fileID": fileID }],
      new: true,
    },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        session.save();
        res.send("Updated questionAnswers in current scrollText");
      }
    }
  );
});

router.put("/api/deleteReadingSessions", async (req, res) => {
  const sessionIDs = req.body.readingSessionIDs;

  ReadingSessionModel.deleteMany(
    { _id: { $in: sessionIDs } },
    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Deleted sessions");
      }
    }
  );
});

module.exports = router;
