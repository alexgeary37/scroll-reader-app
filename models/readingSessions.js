const mongoose = require("mongoose");

const textSchema = mongoose.Schema(
  {
    fileID: { type: String, required: true },
    startTime: { type: Date, required: true },
    pauses: [
      {
        action: { type: String, required: true },
        time: { type: Date, required: true },
      },
    ],
    endTime: { type: Date, required: false },
  },
  { _id: false }
);

const ReadingSessionSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  templateID: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: false },
  speedTexts: [textSchema],
  scrollTexts: [textSchema],
});

const ReadingSessionModel = mongoose.model(
  "readingSessions",
  ReadingSessionSchema
);

module.exports = ReadingSessionModel;
