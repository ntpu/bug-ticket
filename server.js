const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const scanService = require('./scanService');
const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

let browser;
const launchBrowser = async () => {
  browser = await puppeteer.launch({
    headless: false
  });
};

const processRequest = async (req) => {
  const request = {
    options: {
      browserWSEndpoint: browser.wsEndpoint()
    },
    body: req.body
  };
  const { error, result } = await scanService.runExpedia(request);
  return error ? Promise.reject(error) : Promise.resolve(result);
};

(async () => {
  await launchBrowser();

  server.post('/', (req, res) => {
    processRequest(req).then((result) => {
      res.status(200).send(result);
    }).catch((error) => {
      res.status(500).send(error);
    });
  });

  server.listen(8888, () => console.log('listening on port 8888!'));
})();