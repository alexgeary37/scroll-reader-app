const mongoose = require("mongoose");

const StyleSchema = mongoose.Schema({
  fontFamily: { type: String, required: true },
});

const StyleModel = mongoose.model("styles", StyleSchema);

module.exports = StyleModel;
