const express = require("express");
const router = express.Router();
const StyleModel = require("../models/styles");

router.post("/api/createStyle", async (req, res) => {
  const style = req.body.style;
  StyleModel.create(style, (err, s) => {
    if (err) {
      res.send(err);
    } else {
      res.send(s);
    }
  });
});

router.get("/api/getStyle", async (req, res) => {
  const id = req.query;
  StyleModel.findOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/getStyles", async (req, res) => {
  StyleModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/api/deleteStyle", async (req, res) => {
  const styleID = req.body.styleID;

  StyleModel.findByIdAndDelete(styleID, (err, style) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted style");
    }
  });
});

module.exports = router;
