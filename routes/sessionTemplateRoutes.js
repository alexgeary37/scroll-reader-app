const express = require("express");
const router = express.Router();
const SessionTemplateModel = require("../models/sessionTemplates");

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

module.exports = router;