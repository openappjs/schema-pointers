var test = require('tape');

var toPointers;

test("require module", function (t) {
  toPointers = require('../');
  t.equal(typeof toPointers, "function");
  t.end();
});

test("simple schema", function (t) {
  var schema = {
    id: "Person",
    properties: {
      name: {
        type: "string",
      },
    },
  };
  var pointes = toPointers(schema);
  t.deepEqual(pointes, {
    "/": "Person#",
    "/name": "Person#/properties/name",
  });
  t.end();
});
