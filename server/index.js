var express = require('express');
var swig = require('swig');

var app = express();

app.engine('html', swig.renderFile);
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use('/isserviceworkerready/static', express.static(__dirname + '/../www/static'));

app.get(RegExp('^/(isserviceworkerready)?$'), function(req, res) {
  res.redirect('/isserviceworkerready/');
});

app.get('/isserviceworkerready/', function(req, res) {
  res.render('../www/index.html');
});

module.exports = app;