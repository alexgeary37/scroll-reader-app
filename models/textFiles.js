const mongoose = require("mongoose");

const TextFileSchema = mongoose.Schema({
  text: { type: String, required: true },
  fileName: { type: String, required: true },
  questions: [
    mongoose.Schema({
      question: { type: String, required: true },
      answerRegion: {
        startIndex: { type: Number, required: true },
        endIndex: { type: Number, required: true },
      },
    }),
  ],
  questionFormat: { type: String, required: false },
  createdAt: { type: Date, required: true },
});

const TextFileModel = mongoose.model("textFiles", TextFileSchema);

module.exports = TextFileModel;
