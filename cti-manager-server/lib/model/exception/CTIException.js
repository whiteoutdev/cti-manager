"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CTIException = function CTIException(type, message, e) {
    _classCallCheck(this, CTIException);

    this.type = type;
    this.message = message;
    this.e = e;
    if (!message && e && e.message) {
        this.message = e.message;
    }
};

exports.default = CTIException;