var express = require('express');
var swig = require('swig');
var fs = require('fs');
var browsers = [
  {id: 'chrome', name: 'Chrome'},
  {id: 'firefox', name: 'Firefox'},
  {id: 'opera', name: 'Opera'},
  {id: 'safari', name: 'Safari'},
  {id: 'ie', name: 'IE'}
];

var app = express();

app.engine('html', swig.renderFile);
app.set('view cache', false);
app.set('views', __dirname + '/../www/');
swig.setDefaults({ cache: false });

app.use('/isserviceworkerready/static', express.static(__dirname + '/../www/static'));
//app.use('/isserviceworkerready/demos', express.static(__dirname + '/../www/demos'));

app.get(RegExp('^/(isserviceworkerready)?$'), function(req, res) {
  res.redirect('/isserviceworkerready/alpha.html');
});

app.get('/isserviceworkerready/alpha.html', function(req, res) {
  var features = JSON.parse(fs.readFileSync(__dirname + '/../data.json', 'utf8'));

  // add "hasDetails" to each feature
  features.forEach(function(feature) {
    var browserSupport;
    feature.hasDetails = false;

    if (feature.details && feature.details.length) {
      feature.hasDetails = true;
      return;
    }

    for (var i = 0; i < browsers.length; i++) {
      browserSupport = feature[browsers[i].id];

      if (browserSupport.details && browserSupport.details.length) {
        feature.hasDetails = true;
        return;
      }
    }
  });

  res.render('index.html', {
    features: features,
    browsers: browsers
  });
});

module.exports = app;