require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const textFileRoutes = require("./routes/textFileRoutes");
const sessionTemplateRoutes = require("./routes/sessionTemplateRoutes");
const readingSessionRoutes = require("./routes/readingSessionRoutes");
const scrollPosEntryRoutes = require("./routes/scrollPosEntryRoutes");
const defaultRoute = require("./routes/defaultRoute");
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

    app.use(textFileRoutes);
    app.use(sessionTemplateRoutes);
    app.use(readingSessionRoutes);
    app.use(scrollPosEntryRoutes);
    app.use(defaultRoute);

    app.listen(port, () => {
      console.log("Server running on port: ", port);
    });

    // Pick up React index.html file
    // TODO: Make sure this line of code is in the right place for execution order
    app.use(express.static(path.join(__dirname, "../client/build")));
  });
