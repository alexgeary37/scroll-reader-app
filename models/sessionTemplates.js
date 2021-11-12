const mongoose = require("mongoose");

const SessionTemplateSchema = mongoose.Schema({
  name: { type: String, required: true },
  speedTest: {
    fileIDs: [{ type: String, required: true }], // TODO: Make these list items objects with fileID and styleID
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
        styleID: { type: String, required: true },
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
