const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const IndexRouter = require("./routes/index.routes");
const EventRouter = require("./routes/event.routes");
const CertificateRouter = require("./routes/certificate.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");
const path = require("path");
// const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(
  cors()
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' http://localhost:* http://127.0.0.1:* https://cdn.jsdelivr.net"
  );
  next();
});

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", IndexRouter);
app.use("/api/event", EventRouter);
app.use("/api/certificate", CertificateRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Certificate Generator");
});

app.use(errorHandler);

module.exports = app;
