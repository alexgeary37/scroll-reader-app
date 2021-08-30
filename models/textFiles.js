const mongoose = require("mongoose");

const TextFileSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const TextFileModel = mongoose.model("textFiles", TextFileSchema);

module.exports = TextFileModel;
