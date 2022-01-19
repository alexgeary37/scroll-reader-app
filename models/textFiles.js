const mongoose = require("mongoose");

const TextFileSchema = mongoose.Schema({
  text: { type: String, required: true },
  fileName: { type: String, required: true },
  questions: [
    mongoose.Schema({
      question: { type: String, required: true },
      questionFormat: { type: String, required: true },
      answerRegion: {
        startIndex: { type: Number, required: true },
        endIndex: { type: Number, required: true },
      },
    }),
  ],
  styles: [
    mongoose.Schema({
      fontFamily: { type: String, required: true },
      fontSize: { type: Number, required: true },
      lineHeight: { type: Number, required: true },
    }),
  ],
  createdAt: { type: Date, required: true },
});

const TextFileModel = mongoose.model("textFiles", TextFileSchema);

module.exports = TextFileModel;
