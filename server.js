const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const scanService = require('./scanService');
const server = express();

server.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

const processRequest = async (req) => {
  const { error, result } = await scanService.runExpedia(req.body);
  return error ? Promise.reject(error) : Promise.resolve(result);
};

(async () => {
  server.post('/', (req, res) => {
    processRequest(req).then((result) => {
      res.status(200).send(result);
    }).catch((error) => {
      res.status(500).send(error);
    });
  });

  server.listen(8888, () => console.log('listening on port 8888!'));
})();