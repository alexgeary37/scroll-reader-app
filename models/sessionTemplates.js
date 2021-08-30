const mongoose = require("mongoose");

const SessionTemplateSchema = mongoose.Schema({
  scrollTextFileID: {
    type: String,
    required: true,
  },
  speedTextFileID: {
    type: String,
    required: true,
  },
  questionFormat: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const SessionTemplateModel = mongoose.model(
  "sessionTemplates",
  SessionTemplateSchema
);

module.exports = SessionTemplateModel;
