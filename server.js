const https = require("https");
const http = require("http");


const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const httpsOptions = {
  key: fs.readFileSync("/home/johnhaldeman/localhostcert/localhost.key"),
  cert: fs.readFileSync("/home/johnhaldeman/localhostcert/localhost.crt"),
};
app.prepare().then(() => {

  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(443, (err) => {
    if (err) throw err;
    console.log("> Server started on https://localhost");
  });

  // http.createServer({}, (req, res) => {
  //   const parsedUrl = parse(req.url, true);
  //   handle(req, res, parsedUrl);
  // }).listen(80, (err) => {
  //   if (err) throw err;
  //   console.log("> Server started on http://localhost");
  // });

  http.createServer({}, (req, res) => {
    res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
    res.end();
  }).listen(80, (err) => {
     if (err) throw err;
     console.log("> Server started on http://localhost");
  });
});

