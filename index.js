var traverse = require('traverse');
var debug = require('debug')("schema-refs");

module.exports = function toRefs (schema) {

  var baseUrl = (schema.id || "").replace(/#.*/, '') + "#";

  var refs = {};

  traverse(schema).forEach(function (node) {
    if (this.isRoot) {
      refs["/"] = baseUrl;
    } else if (this.path[this.path.length - 2] === "properties") {
      var jsonPath = toJsonPath(this.path);
      var jsonPointer = toPointer(jsonPath);
      var schemaPointer = toPointer(this.path)
      refs[jsonPointer] = baseUrl + schemaPointer;
    }
  });

  return refs;
};

function toJsonPath (schemaPath) {
  debug("toJsonPath(", schemaPath, ")");
  var ret = schemaPath.filter(function (key) {
    return key !== 'properties';
  });
  debug("toJsonPath() ->", ret);
  return ret;
}

var jsonPointer = require('json-pointer');

function toPointer (path) {
  debug("toPointer(", path, ")");
  var ret = jsonPointer.compile(path);
  debug("toPointer() ->", ret);
  return ret
}
