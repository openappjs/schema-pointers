var traverse = require('traverse');
var debug = require('debug')("schema-refs");

module.exports = function toRefs (schema) {
  debug("toRefs(", schema, ")");

  var baseUrl = normalizeUri((schema.id || "").replace(/#.*/, ''));

  var ptrs = {};

  traverse(schema).forEach(function (node) {
    if (this.isRoot) {
      ptrs["/"] = normalizeUri(this.node.id);
    } else if (this.node['$ref']) {
      var dataPointer = toPointer(toDataPath(this.path));
      ptrs[dataPointer] = normalizeUri(this.node['$ref']);
    } else if (this.path[this.path.length - 2] === "properties") {
      var dataPointer = toPointer(toDataPath(this.path));
      var schemaPointer = toPointer(this.path);
      ptrs[dataPointer] = baseUrl + schemaPointer;
    }
  });

  debug("toRefs() ->", ptrs);
  return ptrs;
};

function normalizeUri (uri) {
  // if has pound
  if (uri.match('#')) {
    return uri;
  } else {
    return uri + "#";
  }
}

function toDataPath (schemaPath) {
  debug("toDataPath(", schemaPath, ")");

  var ret = schemaPath.filter(function (key) {
    return key !== 'properties';
  });

  debug("toDataPath() ->", ret);
  return ret;
}

var jsonPointer = require('json-pointer');

function toPointer (path) {
  debug("toPointer(", path, ")");

  var ret = jsonPointer.compile(path);

  debug("toPointer() ->", ret);
  return ret
}
