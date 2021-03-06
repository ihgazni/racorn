"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.functionFlags = functionFlags;
// Each scope gets a bitset that may contain these flags
var SCOPE_TOP = exports.SCOPE_TOP = 1,
    SCOPE_FUNCTION = exports.SCOPE_FUNCTION = 2,
    SCOPE_VAR = exports.SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION,
    SCOPE_ASYNC = exports.SCOPE_ASYNC = 4,
    SCOPE_GENERATOR = exports.SCOPE_GENERATOR = 8,
    SCOPE_ARROW = exports.SCOPE_ARROW = 16,
    SCOPE_SIMPLE_CATCH = exports.SCOPE_SIMPLE_CATCH = 32,
    SCOPE_SUPER = exports.SCOPE_SUPER = 64,
    SCOPE_DIRECT_SUPER = exports.SCOPE_DIRECT_SUPER = 128;

function functionFlags(async, generator) {
    return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}

// Used in checkLVal and declareName to determine the type of a binding
var BIND_NONE = exports.BIND_NONE = 0,
    // Not a binding
BIND_VAR = exports.BIND_VAR = 1,
    // Var-style binding
BIND_LEXICAL = exports.BIND_LEXICAL = 2,
    // Let- or const-style binding
BIND_FUNCTION = exports.BIND_FUNCTION = 3,
    // Function declaration
BIND_SIMPLE_CATCH = exports.BIND_SIMPLE_CATCH = 4,
    // Simple (identifier pattern) catch binding
BIND_OUTSIDE = exports.BIND_OUTSIDE = 5; // Special case for function names as bound inside the function
