"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.TokContext = undefined;

var _state = require("./state");

var _tokentype = require("./tokentype");

var _whitespace = require("./whitespace");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design

var TokContext = exports.TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
   ////
   console.log("tokencontext.js->TokContext->")
  ////
  _classCallCheck(this, TokContext);
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};

var types = exports.types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function (p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};

var pp = _state.Parser.prototype;

pp.initialContext = function () {
  ////
  console.log("tokencontext->pp.initialContext->")
  ////
  return [types.b_stat];
};

pp.braceIsBlock = function (prevType) {
  ////
  console.log("tokencontext->pp.braceIsBlock->")
  ////
  var parent = this.curContext();
  if (parent === types.f_expr || parent === types.f_stat) return true;
  if (prevType === _tokentype.types.colon && (parent === types.b_stat || parent === types.b_expr)) return !parent.isExpr;

  // The check for `tt.name && exprAllowed` detects whether we are
  // after a `yield` or `of` construct. See the `updateContext` for
  // `tt.name`.
  if (prevType === _tokentype.types._return || prevType === _tokentype.types.name && this.exprAllowed) return _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  if (prevType === _tokentype.types._else || prevType === _tokentype.types.semi || prevType === _tokentype.types.eof || prevType === _tokentype.types.parenR || prevType === _tokentype.types.arrow) return true;
  if (prevType === _tokentype.types.braceL) return parent === types.b_stat;
  if (prevType === _tokentype.types._var || prevType === _tokentype.types._const || prevType === _tokentype.types.name) return false;
  return !this.exprAllowed;
};

pp.inGeneratorContext = function () {
  ////
  console.log("tokencontext->pp.inGeneratorContext->")
  ////
  for (var i = this.context.length - 1; i >= 1; i--) {
    var context = this.context[i];
    if (context.token === "function") return context.generator;
  }
  return false;
};

pp.updateContext = function (prevType) {
  ////
  console.log("tokencontext->pp.updateContext->")
  ////
  var update = void 0,
      type = this.type;
  if (type.keyword && prevType === _tokentype.types.dot) this.exprAllowed = false;else if (update = type.updateContext) update.call(this, prevType);else this.exprAllowed = type.beforeExpr;
};

// Token-specific context update code

_tokentype.types.parenR.updateContext = _tokentype.types.braceR.updateContext = function () {
  ////
  console.log("tokencontext->_tokentype.types.parenR.updateContext->")
  ////
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};

_tokentype.types.braceL.updateContext = function (prevType) {
  ////
  console.log("tokencontext->_tokentype.types.braceL.updateContext->")
  ////
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};

_tokentype.types.dollarBraceL.updateContext = function () {
  ////
  console.log("tokencontext->_tokentype.types.dollarBraceL.updateContext->")
  ////

  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};

_tokentype.types.parenL.updateContext = function (prevType) {
  ////
  console.log("tokencontext->_tokentype.types.parenL.updateContext->")
  ////

  var statementParens = prevType === _tokentype.types._if || prevType === _tokentype.types._for || prevType === _tokentype.types._with || prevType === _tokentype.types._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};

_tokentype.types.incDec.updateContext = function () {
  ////
  console.log("tokencontext->_tokentype.types.incDec.updateContext->")
  ////
  // tokExprAllowed stays unchanged
};

_tokentype.types._function.updateContext = _tokentype.types._class.updateContext = function (prevType) {
   ////
  console.log("tokencontext->_tokentype.types._function.updateContext->")
  ////


  if (
	  prevType.beforeExpr 
	  && 
	  prevType !== _tokentype.types.semi 
	  && 
	  prevType !== _tokentype.types._else 
	  && 
	  !(
	       prevType === _tokentype.types._return 
	       &&
	       _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) 
	       && 
	       !(
	            (
			  prevType === _tokentype.types.colon 
			  || 
			  prevType === _tokentype.types.braceL
		    ) 
		    && 
		    this.curContext() === types.b_stat
	       )
     ) 
     this.context.push(types.f_expr);
   else 
       this.context.push(types.f_stat);
  this.exprAllowed = false;
};

_tokentype.types.backQuote.updateContext = function () {
   ////
  console.log("tokencontext->_tokentype.types.backQuote.updateContext->")
  ////
  if (this.curContext() === types.q_tmpl) this.context.pop();else this.context.push(types.q_tmpl);
  this.exprAllowed = false;
};

_tokentype.types.star.updateContext = function (prevType) {
   ////
  console.log("tokencontext->_tokentype.types.star.updateContext->")
  ////
  if (prevType === _tokentype.types._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types.f_expr) 
	  this.context[index] = types.f_expr_gen;
    else this.context[index] = types.f_gen;
  }
  this.exprAllowed = true;
};

_tokentype.types.name.updateContext = function (prevType) {
   ////
  console.log("tokencontext->_tokentype.types.name.updateContext->")
  ////
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== _tokentype.types.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) allowed = true;
  }
  this.exprAllowed = allowed;
};
