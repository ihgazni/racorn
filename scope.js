"use strict";

var _state = require("./state");

var _scopeflags = require("./scopeflags");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pp = _state.Parser.prototype;

var Scope = function Scope(flags) {
  _classCallCheck(this, Scope);

  this.flags = flags;
  // A list of var-declared names in the current lexical scope
  this.var = [];
  // A list of lexically-declared names in the current lexical scope
  this.lexical = [];
};

// The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.

pp.enterScope = function (flags) {
  this.scopeStack.push(new Scope(flags));
};

pp.exitScope = function () {
  this.scopeStack.pop();
};

pp.declareName = function (name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === _scopeflags.BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
  } else if (bindingType === _scopeflags.BIND_SIMPLE_CATCH) {
    var _scope = this.currentScope();
    _scope.lexical.push(name);
  } else if (bindingType === _scopeflags.BIND_FUNCTION) {
    var _scope2 = this.currentScope();
    redeclared = _scope2.lexical.indexOf(name) > -1;
    _scope2.var.push(name);
  } else {
    for (var i = this.scopeStack.length - 1; i >= 0; --i) {
      var _scope3 = this.scopeStack[i];
      if (_scope3.lexical.indexOf(name) > -1 && !(_scope3.flags & _scopeflags.SCOPE_SIMPLE_CATCH) && _scope3.lexical[0] === name) redeclared = true;
      _scope3.var.push(name);
      if (_scope3.flags & _scopeflags.SCOPE_VAR) break;
    }
  }
  if (redeclared) this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
};

pp.currentScope = function () {
  return this.scopeStack[this.scopeStack.length - 1];
};

pp.currentVarScope = function () {
  for (var i = this.scopeStack.length - 1;; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & _scopeflags.SCOPE_VAR) return scope;
  }
};

// Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
pp.currentThisScope = function () {
  for (var i = this.scopeStack.length - 1;; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & _scopeflags.SCOPE_VAR && !(scope.flags & _scopeflags.SCOPE_ARROW)) return scope;
  }
};
