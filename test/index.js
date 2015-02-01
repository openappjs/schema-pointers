var test = require('tape');

var toPointers;

test("require module", function (t) {
  toPointers = require('../');
  t.equal(typeof toPointers, "function");
  t.end();
});

test("schema with property", function (t) {
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

test("schema with ref", function (t) {
  var schema = {
    id: "Person",
    properties: {
      friend: {
        '$ref': "Person",
      },
    },
  };
  var pointes = toPointers(schema);
  t.deepEqual(pointes, {
    "/": "Person#",
    "/friend": "Person#",
  });
  t.end();
});
