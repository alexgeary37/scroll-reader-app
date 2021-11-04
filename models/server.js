const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const ReadingSessionModel = require("./readingSessions");
const ScrollPosEntryModel = require("./scrollPosEntries");
const SessionTemplateModel = require("./sessionTemplates");
const TextFileModel = require("./textFiles");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.mongoUrl = process.env.ATLAS_URI;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: false, limit: "50mb" }));

    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    // Pick up React index.html file
    this.app.use(express.static(path.join(__dirname, "../client/build")));
  }

  routes() {
    this.app.post("/uploadTextFile", async (req, res) => {
      const newTextFile = req.body;
      TextFileModel.create(newTextFile, (err, textFile) => {
        if (err) {
          res.send(err);
        } else {
          res.send(textFile);
        }
      });
    });

    this.app.get("/getTextFile", async (req, res) => {
      const id = req.query;
      TextFileModel.findOne({ _id: id }, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    });

    this.app.get("/getTextFiles", async (req, res) => {
      TextFileModel.find({}, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    });

    this.app.put("/addTextFileQuestion", async (req, res) => {
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

    this.app.put("/deleteTextFile", async (req, res) => {
      const fileID = req.body.fileID;

      TextFileModel.findByIdAndDelete(fileID, (err, textFile) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Deleted textFile");
        }
      });
    });

    this.app.put("/removeTextFileQuestion", async (req, res) => {
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

    this.app.post("/createSessionTemplate", async (req, res) => {
      const newTemplate = req.body;
      SessionTemplateModel.create(newTemplate, (err, template) => {
        if (err) {
          res.send(err);
        } else {
          res.send(template);
        }
      });
    });

    this.app.get("/getSessionTemplate", async (req, res) => {
      const id = req.query;
      SessionTemplateModel.findOne({ _id: id }, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    });

    this.app.get("/getSessionTemplates", async (req, res) => {
      SessionTemplateModel.find({}, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    });

    this.app.put("/deleteTemplate", async (req, res) => {
      const templateID = req.body.templateID;

      SessionTemplateModel.findByIdAndDelete(templateID, (err, template) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Deleted template");
        }
      });
    });

    this.app.post("/createReadingSession", async (req, res) => {
      const newSession = req.body;
      ReadingSessionModel.create(newSession, (err, session) => {
        if (err) {
          res.send(err);
        } else {
          res.send(session);
        }
      });
    });

    this.app.get("/getCurrentSession", async (req, res) => {
      const id = req.query;
      ReadingSessionModel.findOne({ _id: id }, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    });

    this.app.get("/getReadingSessions", async (req, res) => {
      ReadingSessionModel.find({}, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    });

    this.app.put("/addNewSpeedText", async (req, res) => {
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

    this.app.put("/addNewScrollText", async (req, res) => {
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

    this.app.put("/updateCurrentSpeedText", async (req, res) => {
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

    this.app.put("/updateCurrentScrollText", async (req, res) => {
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

    this.app.put("/updateCurrentSpeedTextPauses", async (req, res) => {
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

    this.app.put("/updateCurrentScrollTextPauses", async (req, res) => {
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

    this.app.put("/addCurrentScrollTextQuestionAnswer", async (req, res) => {
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

    this.app.post("/insertScrollPosEntries", async (req, res) => {
      const newScrollPosEntries = req.body;
      ScrollPosEntryModel.insertMany(newScrollPosEntries, (err, entries) => {
        if (err) {
          res.send(error);
        } else {
          res.send(entries);
        }
      });
    });

    this.app.get("/getScrollPosEntries", async (req, res) => {
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
    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port: ", this.port);
    });
  }
}

module.exports = Server;
