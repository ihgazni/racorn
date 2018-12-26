"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.nonASCIIwhitespace = exports.lineBreakG = exports.lineBreak = exports.isNewLine = exports.Token = exports.isIdentifierStart = exports.isIdentifierChar = exports.tokContexts = exports.TokContext = exports.keywordTypes = exports.tokTypes = exports.TokenType = exports.Node = exports.getLineInfo = exports.SourceLocation = exports.Position = exports.defaultOptions = exports.Parser = undefined;

var _state = require("./state");

Object.defineProperty(exports, "Parser", {
  enumerable: true,
  get: function get() {
    return _state.Parser;
  }
});

var _options = require("./options");

Object.defineProperty(exports, "defaultOptions", {
  enumerable: true,
  get: function get() {
    return _options.defaultOptions;
  }
});

var _locutil = require("./locutil");

Object.defineProperty(exports, "Position", {
  enumerable: true,
  get: function get() {
    return _locutil.Position;
  }
});
Object.defineProperty(exports, "SourceLocation", {
  enumerable: true,
  get: function get() {
    return _locutil.SourceLocation;
  }
});
Object.defineProperty(exports, "getLineInfo", {
  enumerable: true,
  get: function get() {
    return _locutil.getLineInfo;
  }
});

var _node = require("./node");

Object.defineProperty(exports, "Node", {
  enumerable: true,
  get: function get() {
    return _node.Node;
  }
});

var _tokentype = require("./tokentype");

Object.defineProperty(exports, "TokenType", {
  enumerable: true,
  get: function get() {
    return _tokentype.TokenType;
  }
});
Object.defineProperty(exports, "tokTypes", {
  enumerable: true,
  get: function get() {
    return _tokentype.types;
  }
});
Object.defineProperty(exports, "keywordTypes", {
  enumerable: true,
  get: function get() {
    return _tokentype.keywords;
  }
});

var _tokencontext = require("./tokencontext");

Object.defineProperty(exports, "TokContext", {
  enumerable: true,
  get: function get() {
    return _tokencontext.TokContext;
  }
});
Object.defineProperty(exports, "tokContexts", {
  enumerable: true,
  get: function get() {
    return _tokencontext.types;
  }
});

var _identifier = require("./identifier");

Object.defineProperty(exports, "isIdentifierChar", {
  enumerable: true,
  get: function get() {
    return _identifier.isIdentifierChar;
  }
});
Object.defineProperty(exports, "isIdentifierStart", {
  enumerable: true,
  get: function get() {
    return _identifier.isIdentifierStart;
  }
});

var _tokenize = require("./tokenize");

Object.defineProperty(exports, "Token", {
  enumerable: true,
  get: function get() {
    return _tokenize.Token;
  }
});

var _whitespace = require("./whitespace");

Object.defineProperty(exports, "isNewLine", {
  enumerable: true,
  get: function get() {
    return _whitespace.isNewLine;
  }
});
Object.defineProperty(exports, "lineBreak", {
  enumerable: true,
  get: function get() {
    return _whitespace.lineBreak;
  }
});
Object.defineProperty(exports, "lineBreakG", {
  enumerable: true,
  get: function get() {
    return _whitespace.lineBreakG;
  }
});
Object.defineProperty(exports, "nonASCIIwhitespace", {
  enumerable: true,
  get: function get() {
    return _whitespace.nonASCIIwhitespace;
  }
});
exports.parse = parse;
exports.parseExpressionAt = parseExpressionAt;
exports.tokenizer = tokenizer;

require("./parseutil");

require("./statement");

require("./lval");

require("./expression");

require("./location");

require("./scope");

var version = exports.version = "6.0.4";

// The main exported interface (under `self.acorn` when in the
// browser) is a `parse` function that takes a code string and
// returns an abstract syntax tree as specified by [Mozilla parser
// API][api].
//
// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

function parse(input, options) {
  return _state.Parser.parse(input, options);
}

// This function tries to parse a single expression at a given
// offset in a string. Useful for parsing mixed-language formats
// that embed JavaScript expressions.

function parseExpressionAt(input, pos, options) {
  return _state.Parser.parseExpressionAt(input, pos, options);
}

// Acorn is organized as a tokenizer and a recursive-descent parser.
// The `tokenizer` export provides an interface to the tokenizer.

function tokenizer(input, options) {
  return _state.Parser.tokenizer(input, options);
}

////dli
//
var expression = require('./expression')
var identifier = require('./identifier')
var location = require('./location')
var locutil = require('./locutil')
var lval = require('./lval')
var node = require('./node')
var options = require('./options')
var parseutil = require('./parseutil')
var regexp = require('./regexp')
var scopeflags = require('./scopeflags')
var scope = require('./scope')
var state = require('./state')
var statement = require('./statement')
var tokencontext = require('./tokencontext')
var tokenize = require('./tokenize')
var tokentype = require('./tokentype')
var unicodePropertyData = require('./unicode-property-data')
var util = require('./util')
var whitespace = require('./whitespace')




/*
console.log(module.exports === exports)
console.log(exports)
console.log("-----")
console.log(module.exports)
console.log("-----")
*/

exports.expression=expression
exports.identifier=identifier
exports.location=location
exports.locutil=locutil
exports.lval=lval
exports.node=node
exports.options=options
exports.parseutil=parseutil
exports.regexp=regexp
exports.scopeflags=scopeflags
exports.scope=scope
exports.state=state
exports.statement=statement
exports.tokencontext=tokencontext
exports.tokenize=tokenize
exports.tokentype=tokentype
exports.unicodePropertyData=unicodePropertyData
exports.util=util
exports.whitespace=whitespace


/*
console.log(exports)
console.log("-----")
console.log(module.exports)
console.log("-----")
*/

////console.log(module)
////console.log(module.exports === exports)

////
