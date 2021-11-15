require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes/routes");
const port = process.env.PORT;
const mongoUrl = process.env.ATLAS_URI;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: false, limit: "50mb" }));
    app.use(routes);

    app.listen(port, () => {
      console.log("Server running on port: ", port);
    });

    // Pick up React index.html file
    // TODO: Make sure this line of code is in the right place for execution order
    app.use(express.static(path.join(__dirname, "../client/build")));
  });
