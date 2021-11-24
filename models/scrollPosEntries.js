const mongoose = require("mongoose");

const ScrollPosEntrySchema = mongoose.Schema({
  yPos: { type: Number, required: true },
  time: { type: Date, required: true },
  sessionID: { type: String, required: true },
  textNumber: { type: Number, required: true },
});

const ScrollPosEntryModel = mongoose.model(
  "scrollPosEntries",
  ScrollPosEntrySchema
);

module.exports = ScrollPosEntryModel;
