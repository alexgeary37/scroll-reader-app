const express = require("express");
const router = express.Router();
const TextFileModel = require("../models/textFiles");
const SessionTemplateModel = require("../models/sessionTemplates");
const ReadingSessionModel = require("../models/readingSessions");
const ScrollPosEntryModel = require("../models/scrollPosEntries");

router.post("/uploadTextFile", async (req, res) => {
  const newTextFile = req.body;
  TextFileModel.create(newTextFile, (err, textFile) => {
    if (err) {
      res.send(err);
    } else {
      res.send(textFile);
    }
  });
});

router.get("/getTextFile", async (req, res) => {
  const id = req.query;
  TextFileModel.findOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/getTextFiles", async (req, res) => {
  TextFileModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/addTextFileQuestion", async (req, res) => {
  const id = req.body.id;
  const question = req.body.question;
  const answerRegion = req.body.answerRegion;
  const questionFormat = req.body.questionFormat;

  TextFileModel.findByIdAndUpdate(
    id,
    {
      $push: {
        questions: {
          question: question,
          answerRegion: answerRegion,
        },
      },
      $set: {
        questionFormat: questionFormat,
      },
    },
    { new: true },
    (err, textFile) => {
      if (err) {
        res.send(err);
      } else {
        textFile.save();
        res.send(textFile);
      }
    }
  );
});

router.put("/addTextFileStyle", async (req, res) => {
  const id = req.body.id;
  const style = req.body.style;

  TextFileModel.findByIdAndUpdate(
    id,
    {
      $push: {
        styles: style,
      },
    },
    { new: true },
    (err, textFile) => {
      if (err) {
        res.send(err);
      } else {
        textFile.save();
        res.send(textFile);
      }
    }
  );
});

router.put("/deleteTextFile", async (req, res) => {
  const fileID = req.body.fileID;

  TextFileModel.findByIdAndDelete(fileID, (err, textFile) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted textFile");
    }
  });
});

router.put("/removeTextFileQuestion", async (req, res) => {
  const fileID = req.body.fileID;
  const questionID = req.body.questionID;
  const questionFormat = req.body.questionFormat;

  TextFileModel.findByIdAndUpdate(
    fileID,
    {
      $pull: {
        questions: {
          _id: questionID,
        },
      },
      $set: {
        questionFormat: questionFormat,
      },
    },
    { new: true },
    (err, textFile) => {
      if (err) {
        res.send(err);
      } else {
        textFile.save();
        res.send(textFile);
      }
    }
  );
});

router.put("/removeTextFileStyle", async (req, res) => {
  const fileID = req.body.fileID;
  const styleID = req.body.styleID;

  TextFileModel.findByIdAndUpdate(
    fileID,
    {
      $pull: {
        styles: {
          _id: styleID,
        },
      },
    },
    { new: true },
    (err, textFile) => {
      if (err) {
        res.send(err);
      } else {
        textFile.save();
        res.send(textFile);
      }
    }
  );
});

router.post("/createSessionTemplate", async (req, res) => {
  const newTemplate = req.body;
  SessionTemplateModel.create(newTemplate, (err, template) => {
    if (err) {
      res.send(err);
    } else {
      res.send(template);
    }
  });
});

router.get("/getSessionTemplate", async (req, res) => {
  const id = req.query;
  SessionTemplateModel.findOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/getSessionTemplates", async (req, res) => {
  SessionTemplateModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/getUsedQuestions", async (req, res) => {
  SessionTemplateModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const questions = [];
      result.forEach((template) => {
        template.scrollTexts.forEach((text) => {
          questions.push(...text.questionIDs);
        });
      });
      res.send(questions);
    }
  });
});

router.get("/getUsedStyles", async (req, res) => {
  SessionTemplateModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const styles = [];
      result.forEach((template) => {
        template.speedTest.texts.forEach((text) => styles.push(text.styleID));
        template.scrollTexts.forEach((text) => styles.push(text.styleID));
      });
      res.send(styles);
    }
  });
});

router.put("/deleteTemplate", async (req, res) => {
  const templateID = req.body.templateID;

  SessionTemplateModel.findByIdAndDelete(templateID, (err, template) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted template");
    }
  });
});

router.post("/createReadingSession", async (req, res) => {
  const newSession = req.body;
  ReadingSessionModel.create(newSession, (err, session) => {
    if (err) {
      res.send(err);
    } else {
      res.send(session);
    }
  });
});

router.get("/getCurrentSession", async (req, res) => {
  const id = req.query;
  ReadingSessionModel.findOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/getReadingSessions", async (req, res) => {
  ReadingSessionModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/addViewportChange", async (req, res) => {
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

router.put("/addNewSpeedText", async (req, res) => {
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

router.put("/addNewScrollText", async (req, res) => {
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

router.put("/updateCurrentSpeedText", async (req, res) => {
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

router.put("/updateCurrentScrollText", async (req, res) => {
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

router.put("/updateCurrentSpeedTextPauses", async (req, res) => {
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

router.put("/updateCurrentScrollTextPauses", async (req, res) => {
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

router.put("/addCurrentScrollTextQuestionAnswer", async (req, res) => {
  const sessionID = req.body.sessionID;
  const fileID = req.body.fileID;
  const answer = req.body.answer;
  const skip = req.body.skip;
  const yPos = req.body.yPos;
  const time = req.body.time;

  ReadingSessionModel.findByIdAndUpdate(
    sessionID,
    {
      $push: {
        "scrollTexts.$[elem].questionAnswers": {
          answer: answer,
          skip: skip,
          yPosition: yPos,
          time: time,
        },
      },
    },
    { arrayFilters: [{ "elem.fileID": fileID }], new: true },
    (err, session) => {
      if (err) {
        res.send(err);
      } else {
        // session.markModified("scrollTexts.$[elem].questionAnswers.-1.answer");
        session.save();
        res.send("Updated questionAnswers in current scrollText");
      }
    }
  );
});

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

// Catch all requests that don't match any route
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
