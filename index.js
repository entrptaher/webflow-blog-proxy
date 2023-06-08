var express = require("express");
const Axios = require("axios");
const { setupCache } = require("axios-cache-interceptor");
const cheerio = require("cheerio");

const axios = setupCache(Axios, { interpretHeader: false });

const app = express();

app.use(express.static("public"));

app.get("*", async function (req, res) {
  let rawData;
  try {
    rawData = await axios.get(
      "http://md-abus-first-project.webflow.io" + req.url,
      {
        responseType: "arraybuffer",
      }
    );
    const contentType = rawData.headers.get("content-type");
    res.setHeader("content-type", contentType);
    body = await rawData.data;

    if (contentType.includes("text/html")) {
      const $ = cheerio.load(body.toString());
      $("body").append(
        `<style>[class="w-webflow-badge"] {display: none !important;}</style>`
      );
      body = $.html();
    }

    res.send(body);
  } catch (e) {
    res.send();
  }
});

app.listen(3000);

// http
//   .createServer(async function (req, res) {
//     var url = req.url;
//     const rawData = await fetch("http://flowbangladesh.com" + url);
//     const contentType = rawData.headers.get("content-type");
//     let body;
//     if (contentType.includes("text/html")) {
//       body = await rawData.text();
//       await res.write(body);
//       res.end();
//     } else {
//       console.log()
//       res.writeHead(200, { "Content-Type": contentType });
//       res.write(Buffer.from(await rawData.clone().text()));
//       return res.end();

//       rawData.body.pipeTo(
//         new WritableStream({
//           start() {
//             res.writeHead(200, { "Content-Type": contentType });
//           },
//           write(chunk) {
//             res.write(chunk);
//           },
//           close() {
//             res.end();
//           },
//         })
//       );
//     }
//   })
//   .listen(3000, function () {
//     console.log("server start at port 3000"); //the server object listens on port 3000
//   });
