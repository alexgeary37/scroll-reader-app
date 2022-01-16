const mongoose = require("mongoose");

const textSchema = mongoose.Schema(
  {
    fileID: { type: String, required: true },
    startTime: { type: Date, required: true },
    familiarity: { type: String, required: false },
    interest: { type: String, required: false },
    pauses: [
      mongoose.Schema(
        {
          action: { type: String, required: true },
          time: { type: Date, required: true },
        },
        { _id: false }
      ),
    ],
    questionAnswers: [
      {
        answer: { type: mongoose.Schema.Types.Mixed, required: true },
        skip: { type: Boolean, required: true },
        yPosition: { type: Number, required: true },
        time: { type: Date, required: true },
      },
    ],
    endTime: { type: Date, required: false },
  },
  { _id: false }
);

const ReadingSessionSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  viewportDimensions: [
    {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      time: { type: Date, required: true },
    },
  ],
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
