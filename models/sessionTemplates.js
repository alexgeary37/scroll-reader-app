const mongoose = require("mongoose");

const SessionTemplateSchema = mongoose.Schema({
  name: { type: String, required: true },
  speedTest: {
    fileIDs: [{ type: String, required: true }],
    instructions: { type: String, required: true },
  },
  scrollTexts: [
    mongoose.Schema(
      {
        fileID: { type: String, required: true },
        instructions: {
          main: { type: String, required: true },
          hasFamiliarityQuestion: { type: String, required: true },
          hasInterestQuestion: { type: String, required: true },
        },
        questions: [{ type: String, required: true }],
      },
      { _id: false }
    ),
  ],

  questionFormat: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

const SessionTemplateModel = mongoose.model(
  "sessionTemplates",
  SessionTemplateSchema
);

module.exports = SessionTemplateModel;
