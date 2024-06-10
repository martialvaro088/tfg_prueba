"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.javaVersion = void 0;
const findJava = require('find-java-home');
function javaVersion(callback) {
    findJava(callback);
}
exports.javaVersion = javaVersion;
