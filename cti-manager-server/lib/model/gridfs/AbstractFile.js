"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractFile = function AbstractFile(fileType, name) {
    _classCallCheck(this, AbstractFile);

    this.fileType = fileType;
    this.name = name;
};

exports.default = AbstractFile;