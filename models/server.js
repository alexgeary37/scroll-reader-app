const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const ReadingSessionModel = require("./readingSessions");
const ScrollPosEntryModel = require("./scrollPosEntries");

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
    this.app.use(express.json());

    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Pick up React index.html file
    this.app.use(express.static(path.join(__dirname, "../client/build")));
  }

  routes() {
    this.app.post("/addReadingSession", async (req, res) => {
      const newSession = req.body;
      const session = new ReadingSessionModel(newSession);
      await session.save();
      res.send(session);
    });

    this.app.put("/updateReadingSession", async (req, res) => {
      const id = req.body.id;
      const newEndTime = req.body.endTime;

      await ReadingSessionModel.findById(id, (err, session) => {
        session.endTime = newEndTime;
        session.save();
      });

      res.send("Updated");
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
