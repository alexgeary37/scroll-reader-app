const mongoose = require("mongoose");

const SessionTemplateStructure = {
  name: {
    type: String,
    required: true,
  },
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
};
const SessionTemplateSchema = mongoose.Schema(SessionTemplateStructure);

const SessionTemplateModel = mongoose.model(
  "sessionTemplates",
  SessionTemplateSchema
);

module.exports = {
  SessionTemplateStructure,
  SessionTemplateModel,
};
