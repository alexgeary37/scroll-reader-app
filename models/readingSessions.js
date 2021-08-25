const mongoose = require("mongoose");

const ReadingSessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
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
