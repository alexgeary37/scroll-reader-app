const mongoose = require("mongoose");

const SessionTemplateSchema = mongoose.Schema({
  name: { type: String, required: true },
  speedTest: {
    texts: [
      mongoose.Schema(
        {
          fileID: { type: String, required: true },
          style: {
            h1ID: { type: String, required: true },
            h2ID: { type: String, required: true },
            h3ID: { type: String, required: true },
            paragraphID: { type: String, required: true },
          },
        },
        { _id: false }
      ),
    ],
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
        questionIDs: [{ type: String, required: true }],
        style: {
          h1ID: { type: String, required: true },
          h2ID: { type: String, required: true },
          h3ID: { type: String, required: true },
          paragraphID: { type: String, required: true },
        },
      },
      { _id: false }
    ),
  ],
  createdAt: { type: Date, required: true },
});

const SessionTemplateModel = mongoose.model(
  "sessionTemplates",
  SessionTemplateSchema
);

module.exports = SessionTemplateModel;
