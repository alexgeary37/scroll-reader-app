const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const textFileRoutes = require("./routes/textFileRoutes");
const sessionTemplateRoutes = require("./routes/sessionTemplateRoutes");
const readingSessionRoutes = require("./routes/readingSessionRoutes");
const scrollPosEntryRoutes = require("./routes/scrollPosEntryRoutes");
const defaultRoute = require("./routes/defaultRoute");

const corsOptions = {
  origin: "https://scroll-reader-app.herokuapp.com",
  optionsSuccessStatus: 200,
};

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3002;
    // this.mongoUrl = process.env.ATLAS_URI;
    this.mongoUrl = process.env.MONGO_URI;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // this.app.use(cors(corsOptions));
    this.app.use(cors())
    // this.app.options("*", cors());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: false, limit: "50mb" }));

    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log("Mongodb is connected..."));

    // Pick up React index.html file
    this.app.use(express.static(path.join(__dirname, "./client/build")));
  }

  routes() {
    this.app.use(textFileRoutes);
    this.app.use(sessionTemplateRoutes);
    this.app.use(readingSessionRoutes);
    this.app.use(scrollPosEntryRoutes);
    this.app.use(defaultRoute);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port: ", this.port);
    });
  }
}

module.exports = Server;
