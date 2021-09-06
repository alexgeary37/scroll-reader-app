const mongoose = require("mongoose");

const SessionTemplateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  speedTest: {
    type: {
      fileID: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
        required: true,
      },
    },
  },
  scrollTest: {
    type: {
      fileID: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
        required: true,
      },
    },
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
