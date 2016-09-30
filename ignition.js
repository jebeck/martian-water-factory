const Chance = require('chance');
const chance = new Chance();
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());

app.get('/burn', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ ignited: chance.weighted([true, false], [90, 10]) }));
});

app.listen(4000, function () {
  console.log('Ignition server listening on port 4000!');
});