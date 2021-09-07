const mongoose = require("mongoose");

const ReadingSessionSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  templateID: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: false },
  speedTest: {
    type: {
      texts: [
        {
          fileID: { type: String, required: false },
          startTime: { type: Date, required: false },
          endTime: { type: Date, required: false },
        },
      ],
    },
    required: false,
  },
  scrollTest: {
    type: {
      texts: [
        {
          fileID: { type: String, required: true },
          startTime: { type: Date, required: true },
          endTime: { type: Date, required: false },
        },
      ],
    },
    required: false,
  },
});

const ReadingSessionModel = mongoose.model(
  "readingSessions",
  ReadingSessionSchema
);

module.exports = ReadingSessionModel;
