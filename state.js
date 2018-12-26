"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _identifier = require("./identifier");

var _tokentype = require("./tokentype");

var _whitespace = require("./whitespace");

var _options = require("./options");

var _scopeflags = require("./scopeflags");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function keywordRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
}

var Parser = exports.Parser = function () {
  function Parser(options, input, startPos) {
    _classCallCheck(this, Parser);

    this.options = options = (0, _options.getOptions)(options);
    this.sourceFile = options.sourceFile;
    this.keywords = keywordRegexp(_identifier.keywords[options.ecmaVersion >= 6 ? 6 : 5]);
    var reserved = "";
    if (!options.allowReserved) {
      for (var v = options.ecmaVersion;; v--) {
        if (reserved = _identifier.reservedWords[v]) break;
      }if (options.sourceType === "module") reserved += " await";
    }
    this.reservedWords = keywordRegexp(reserved);
    var reservedStrict = (reserved ? reserved + " " : "") + _identifier.reservedWords.strict;
    this.reservedWordsStrict = keywordRegexp(reservedStrict);
    this.reservedWordsStrictBind = keywordRegexp(reservedStrict + " " + _identifier.reservedWords.strictBind);
    this.input = String(input);

    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.
    this.containsEsc = false;

    // Set up token state

    // The current position of the tokenizer in the input.
    if (startPos) {
      this.pos = startPos;
      this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
      this.curLine = this.input.slice(0, this.lineStart).split(_whitespace.lineBreak).length;
    } else {
      this.pos = this.lineStart = 0;
      this.curLine = 1;
    }

    // Properties of the current token:
    // Its type
    this.type = _tokentype.types.eof;
    // For tokens that include more information than their type, the value
    this.value = null;
    // Its start and end offset
    this.start = this.end = this.pos;
    // And, if locations are used, the {line, column} object
    // corresponding to those offsets
    this.startLoc = this.endLoc = this.curPosition();

    // Position information for the previous token
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;

    // The context stack is used to superficially track syntactic
    // context to predict whether a regular expression is allowed in a
    // given position.
    this.context = this.initialContext();
    this.exprAllowed = true;

    // Figure out if it's a module code.
    this.inModule = options.sourceType === "module";
    this.strict = this.inModule || this.strictDirective(this.pos);

    // Used to signify the start of a potential arrow function
    this.potentialArrowAt = -1;

    // Positions to delayed-check that yield/await does not exist in default parameters.
    this.yieldPos = this.awaitPos = 0;
    // Labels in scope.
    this.labels = [];

    // If enabled, skip leading hashbang line.
    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") this.skipLineComment(2);

    // Scope tracking for duplicate variable names (see scope.js)
    this.scopeStack = [];
    this.enterScope(_scopeflags.SCOPE_TOP);

    // For RegExp validation
    this.regexpState = null;
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse() {
      var node = this.options.program || this.startNode();
      this.nextToken();
      return this.parseTopLevel(node);
    }
  }, {
    key: "inNonArrowFunction",


    // Switch to a getter for 7.0.0.
    value: function inNonArrowFunction() {
      return (this.currentThisScope().flags & _scopeflags.SCOPE_FUNCTION) > 0;
    }
  }, {
    key: "inFunction",
    get: function get() {
      return (this.currentVarScope().flags & _scopeflags.SCOPE_FUNCTION) > 0;
    }
  }, {
    key: "inGenerator",
    get: function get() {
      return (this.currentVarScope().flags & _scopeflags.SCOPE_GENERATOR) > 0;
    }
  }, {
    key: "inAsync",
    get: function get() {
      return (this.currentVarScope().flags & _scopeflags.SCOPE_ASYNC) > 0;
    }
  }, {
    key: "allowSuper",
    get: function get() {
      return (this.currentThisScope().flags & _scopeflags.SCOPE_SUPER) > 0;
    }
  }, {
    key: "allowDirectSuper",
    get: function get() {
      return (this.currentThisScope().flags & _scopeflags.SCOPE_DIRECT_SUPER) > 0;
    }
  }], [{
    key: "extend",
    value: function extend() {
      var cls = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      for (var i = 0; i < plugins.length; i++) {
        cls = plugins[i](cls);
      }return cls;
    }
  }, {
    key: "parse",
    value: function parse(input, options) {
      return new this(options, input).parse();
    }
  }, {
    key: "parseExpressionAt",
    value: function parseExpressionAt(input, pos, options) {
      var parser = new this(options, input, pos);
      parser.nextToken();
      return parser.parseExpression();
    }
  }, {
    key: "tokenizer",
    value: function tokenizer(input, options) {
      return new this(options, input);
    }
  }]);

  return Parser;
}();
