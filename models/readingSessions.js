const mongoose = require("mongoose");

const ReadingSessionSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  template: {
    type: ,
    required: true,
  },
  
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: false,
  },
});

const ReadingSessionModel = mongoose.model(
  "readingSessions",
  ReadingSessionSchema
);

module.exports = ReadingSessionModel;
