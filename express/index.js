var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.type('text/plain'); // set content-type
  res.send('Simple Text Demo'); // send text response
});


app.get('/checkservice', function(req, res) {
  res.type('text/plain'); // set content-type
  res.send('Check service health'); // send text response
});


app.listen(process.env.PORT || 80);
