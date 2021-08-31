const mongoose = require("mongoose");
const SessionTemplate = require("./sessionTemplates");

const ReadingSessionSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  template: {
    type: SessionTemplate.SessionTemplateStructure,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: false,
  },
});

const ReadingSessionModel = mongoose.model(
  "readingSessions",
  ReadingSessionSchema
);

module.exports = ReadingSessionModel;
