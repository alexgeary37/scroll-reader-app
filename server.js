const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const auth = require("./routes/auth");
const textFileRoutes = require("./routes/textFileRoutes");
const sessionTemplateRoutes = require("./routes/sessionTemplateRoutes");
const readingSessionRoutes = require("./routes/readingSessionRoutes");
const scrollPosEntryRoutes = require("./routes/scrollPosEntryRoutes");
const styleRoutes = require("./routes/styleRoutes");
const styleModel = require("./models/styles");

// const corsOptions = {
//   origin: "https://scroll-reader-app.herokuapp.com",
//   optionsSuccessStatus: 200,
// };

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3002;
    // this.mongoUrl = process.env.ATLAS_URI;
    this.mongoUrl = process.env.MONGO_URI;
    this.middlewares();
    this.routes();
    this.initializeStyles();
  }

  middlewares() {
    // this.app.use(cors(corsOptions));
    this.app.use(cors());
    this.app.options("*", cors());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: false, limit: "50mb" }));
    this.app.set("trust proxy", "loopback, 130.217.218.13");

    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // auth: {
        //   authSource: "admin",
        // },
        // user: process.env.DB_USER,
        // pass: process.env.DB_PASSWORD,
      })
      .then(() => console.log("Mongodb is connected..."));

    // Pick up React index.html file
    this.app.use(express.static(path.join(__dirname, "./client/build")));
  }

  routes() {
    this.app.use(auth);
    this.app.use(textFileRoutes);
    this.app.use(sessionTemplateRoutes);
    this.app.use(readingSessionRoutes);
    this.app.use(scrollPosEntryRoutes);
    this.app.use(styleRoutes);

    // Handle all other requests.
    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "./client/build/index.html"));
    });
  }

  async initializeStyles() {
    const allStyles = await styleModel.find();
    if (allStyles.length === 0) {
      const styleH1 = new styleModel({
        style: `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "36px"}`,
      });
      styleH1.save();

      const styleH2 = new styleModel({
        style: `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "30px"}`,
      });
      styleH2.save();

      const styleH3 = new styleModel({
        style: `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "24px"}`,
      });
      styleH3.save();

      const styleParagraph = new styleModel({
        style: `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "15px"}`,
      });
      styleParagraph.save();

      const styleParagraph2 = new styleModel({
        style: `{fontFamily: "Helvetica, 'Helvetica Neue', Arial, Verdana, sans-serif", fontSize: "15px"}`,
      });
      styleParagraph2.save();
    }
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port: ", this.port);
    });
  }
}

module.exports = Server;
