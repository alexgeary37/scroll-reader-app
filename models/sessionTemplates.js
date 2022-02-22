const mongoose = require("mongoose");

const SessionTemplateSchema = mongoose.Schema({
  name: { type: String, required: true },
  speedTest: {
    texts: [
      mongoose.Schema(
        {
          fileID: { type: String, required: true },
          style: {
            h1: {
              type: String,
              required: true,
              //   fontFamily: { type: String, required: true },
              //   fontSize: { type: Number, required: true },
              //   fontWeight: { type: Number, required: true },
              //   lineHeight: { type: Number, required: true },
            },
            h2: {
              type: String,
              required: true,
              // fontFamily: { type: String, required: true },
              // fontSize: { type: Number, required: true },
              // fontWeight: { type: Number, required: true },
              // lineHeight: { type: Number, required: true },
            },
            h3: {
              type: String,
              required: true,
              // fontFamily: { type: String, required: true },
              // fontSize: { type: Number, required: true },
              // fontWeight: { type: Number, required: true },
              // lineHeight: { type: Number, required: true },
            },
            paragraph: {
              type: String,
              required: true,
              // fontFamily: { type: String, required: true },
              // fontSize: { type: Number, required: true },
              // fontWeight: { type: Number, required: true },
              // lineHeight: { type: Number, required: true },
            },
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
          h1: {
            type: String,
            required: true,
            // fontFamily: { type: String, required: true },
            // fontSize: { type: Number, required: true },
            // fontWeight: { type: Number, required: true },
            // lineHeight: { type: Number, required: true },
          },
          h2: {
            type: String,
            required: true,
            // fontFamily: { type: String, required: true },
            // fontSize: { type: Number, required: true },
            // fontWeight: { type: Number, required: true },
            // lineHeight: { type: Number, required: true },
          },
          h3: {
            type: String,
            required: true,
            // fontFamily: { type: String, required: true },
            // fontSize: { type: Number, required: true },
            // fontWeight: { type: Number, required: true },
            // lineHeight: { type: Number, required: true },
          },
          paragraph: {
            type: String,
            required: true,
            // fontFamily: { type: String, required: true },
            // fontSize: { type: Number, required: true },
            // fontWeight: { type: Number, required: true },
            // lineHeight: { type: Number, required: true },
          },
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
