var traverse = require('traverse');
var debug = require('debug')("schema-refs");

module.exports = function toRefs (schema) {

  var baseUrl = normalizeUri((schema.id || "").replace(/#.*/, ''));

  var refs = {};

  traverse(schema).forEach(function (node) {
    if (this.isRoot) {
      refs["/"] = normalizeUri(this.node.id);
    } else if (this.node['$ref']) {
      var jsonPointer = toPointer(toJsonPath(this.path));
      refs[jsonPointer] = normalizeUri(this.node['$ref']);
    } else if (this.path[this.path.length - 2] === "properties") {
      var jsonPointer = toPointer(toJsonPath(this.path));
      var schemaPointer = toPointer(this.path)
      refs[jsonPointer] = baseUrl + schemaPointer;
    }
  });

  return refs;
};

function normalizeUri (uri) {
  // if has pound
  if (uri.match('#')) {
    return uri;
  } else {
    return uri + "#";
  }
}

function toJsonPath (schemaPath) {
  debug("toJsonPath(", schemaPath, ")");

  var ret = schemaPath.filter(function (key) {
    return key !== 'properties';
  });

  debug("toJsonPath() ->", ret);
  return ret;
}

var jsonPointerLib = require('json-pointer');

function toPointer (path) {
  debug("toPointer(", path, ")");

  var ret = jsonPointerLib.compile(path);

  debug("toPointer() ->", ret);
  return ret
}
