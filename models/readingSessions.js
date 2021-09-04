const mongoose = require("mongoose");

const ReadingSessionSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  templateID: {
    type: String,
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
  scrollTest: {
    type: {
      startTime: {
        type: Date,
        required: false,
      },
      endTime: {
        type: Date,
        required: false,
      },
    },
    required: false,
  },
  speedTest: {
    type: {
      startTime: {
        type: Date,
        required: false,
      },
      endTime: {
        type: Date,
        required: false,
      },
    },
    required: false,
  },
});

const ReadingSessionModel = mongoose.model(
  "readingSessions",
  ReadingSessionSchema
);

module.exports = ReadingSessionModel;
