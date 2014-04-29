var Stream = require('stream').Readable;
var File = require('vinyl');
var http = require('http');

module.exports = function(root, paths) {
  var pathIndex = -1;
  var stream = new Stream({
    objectMode: true
  });

  stream._read = function() {
    pathIndex++;

    var path = paths[pathIndex];

    if (pathIndex >= paths.length) {
      stream.push(null);
      return;
    }

    http.get(root + path, function(res) {
      var filePath = path;
      if (!filePath || filePath.slice(-1) == '/') {
        filePath += 'index.html';
      }

      stream.push(new File({
        path: filePath,
        contents: res
      }));
    });
  };

  return stream;
};