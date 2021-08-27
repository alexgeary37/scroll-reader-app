const mongoose = require("mongoose");

const textFileSchema = {
  text: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
};

const SessionTemplateSchema = mongoose.Schema({
  scrollTextFile: {
    type: textFileSchema,
    required: true,
  },
  speedTextFile: {
    type: textFileSchema,
    required: true,
  },
  questionFormat: {
    type: String,
    required: true,
  },
});

const SessionTemplateModel = mongoose.model(
  "sessionTemplates",
  SessionTemplateSchema
);

module.exports = SessionTemplateModel;
