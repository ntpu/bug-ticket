const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const scanService = require('./scanService');

const app = express();
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.post("/", (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  scanService.xRay(startDate, endDate).then(result => {
    res.json(result);
  });
});

const port = 8888;
app.listen(port);

console.log(`Express app running on port ${port}`);

module.exports = app;