const mongoose = require("mongoose");

const ScrollPosEntrySchema = mongoose.Schema({
  yPos: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  sessionID: {
    type: String,
    required: true,
  },
});

const ScrollPosEntryModel = mongoose.model(
  "scrollPosEntries",
  ScrollPosEntrySchema
);

module.exports = ScrollPosEntryModel;
