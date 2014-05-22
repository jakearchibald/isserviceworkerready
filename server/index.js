var express = require('express');
var swig = require('swig');
var fs = require('fs');
var features = JSON.parse(fs.readFileSync(__dirname + '/../data.json', 'utf8'));
var browsers = [
  {id: 'chrome', name: 'Chrome'},
  {id: 'firefox', name: 'Firefox'},
  {id: 'opera', name: 'Opera'},
  {id: 'safari', name: 'Safari'},
  {id: 'ie', name: 'IE'}
];

// add "hasDetails" to each feature
features.forEach(function(feature) {
  var browserSupport;
  feature.hasDetails = false;

  for (var i = 0; i < browsers.length; i++) {
    browserSupport = feature[browsers[i].id];

    if (browserSupport.details && browserSupport.details.length) {
      feature.hasDetails = true;
      return;
    }
  }
});

var app = express();

app.engine('html', swig.renderFile);
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use('/isserviceworkerready/static', express.static(__dirname + '/../www/static'));

app.get(RegExp('^/(isserviceworkerready)?$'), function(req, res) {
  res.redirect('/isserviceworkerready/');
});

app.get('/isserviceworkerready/', function(req, res) {
  res.render('../www/index.html', {
    features: features,
    browsers: browsers
  });
});

module.exports = app;