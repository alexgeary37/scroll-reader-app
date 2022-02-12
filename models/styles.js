const mongoose = require("mongoose");

const StyleSchema = mongoose.Schema({
  fontFamily: { type: String, required: true },
  fontSize: { type: Number, required: true },
  lineHeight: { type: Number, required: true },
  bold: { type: Boolean, required: true },
});

const StyleModel = mongoose.model("styles", StyleSchema);

module.exports = StyleModel;
