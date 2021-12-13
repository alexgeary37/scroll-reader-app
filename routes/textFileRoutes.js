const express = require("express");
const router = express.Router();
const TextFileModel = require("../models/textFiles");

router.post("/api/uploadTextFile", async (req, res) => {
  const newTextFile = req.body;
  TextFileModel.create(newTextFile, (err, textFile) => {
    if (err) {
      res.send(err);
    } else {
      res.send(textFile);
    }
  });
});

router.get("/api/getTextFile", async (req, res) => {
  const id = req.query;
  TextFileModel.findOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/getTextFiles", async (req, res) => {
  const fileIDs = Object.values(req.query);
  TextFileModel.find({ _id: { $in: fileIDs } }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/getAllTextFiles", async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  TextFileModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/api/addTextFileQuestion", async (req, res) => {
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

router.put("/api/addTextFileStyle", async (req, res) => {
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

router.put("/api/deleteTextFile", async (req, res) => {
  const fileID = req.body.fileID;

  TextFileModel.findByIdAndDelete(fileID, (err, textFile) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted textFile");
    }
  });
});

router.put("/api/removeTextFileQuestion", async (req, res) => {
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

router.put("/api/removeTextFileStyle", async (req, res) => {
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

module.exports = router;
