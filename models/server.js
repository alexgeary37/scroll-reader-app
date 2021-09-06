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
      const textFile = new TextFileModel(newTextFile);
      await textFile.save();
      res.send(textFile);
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

    this.app.post("/createSessionTemplate", async (req, res) => {
      const newTemplate = req.body;
      const template = new SessionTemplateModel(newTemplate);
      await template.save();
      res.send(template);
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

    this.app.post("/createReadingSession", async (req, res) => {
      const newSession = req.body;
      const session = new ReadingSessionModel(newSession);
      await session.save();
      res.send(session);
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

    this.app.put("/startReadingSessionScrollTest", async (req, res) => {
      const id = req.body.id;
      const startTime = req.body.startTime;

      ReadingSessionModel.findByIdAndUpdate(
        id,
        { $set: { "scrollTest.startTime": startTime } },
        (err, session) => {
          if (err) {
            res.send(err);
          } else {
            session.save();
            res.send("Added scrollText.startTime");
          }
        }
      );
    });

    this.app.put("/startReadingSessionSpeedTest", async (req, res) => {
      const id = req.body.id;
      const startTime = req.body.startTime;

      ReadingSessionModel.findByIdAndUpdate(
        id,
        { $set: { "speedTest.startTime": startTime } },
        (err, session) => {
          if (err) {
            res.send(err);
          } else {
            session.save();
            res.send("Added speedTest.startTime");
          }
        }
      );
    });

    this.app.put("/finishReadingSessionScrollTest", async (req, res) => {
      const id = req.body.id;
      const endTime = req.body.endTime;

      ReadingSessionModel.findByIdAndUpdate(
        id,
        { $set: { "scrollTest.endTime": endTime } },
        { new: true },
        (err, session) => {
          if (err) {
            res.send(err);
          } else {
            session.save();
            res.send("Added scrollTest.endTime");
          }
        }
      );
    });

    this.app.put("/finishReadingSessionSpeedTest", async (req, res) => {
      const id = req.body.id;
      const endTime = req.body.endTime;

      ReadingSessionModel.findByIdAndUpdate(
        id,
        { $set: { "speedTest.endTime": endTime } },
        (err, session) => {
          if (err) {
            res.send(err);
          } else {
            session.save();
            res.send("Added speedText.endTime");
          }
        }
      );
    });

    this.app.post("/addScrollPosEntry", async (req, res) => {
      const newScrollPosEntry = req.body;
      const scrollPosEntry = new ScrollPosEntryModel(newScrollPosEntry);
      await scrollPosEntry.save();
      res.send(scrollPosEntry);
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
