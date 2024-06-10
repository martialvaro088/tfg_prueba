#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSDK = void 0;
const fs = __importStar(require("fs"));
const request = __importStar(require("request"));
const ProgressBar_1 = require("./ProgressBar");
function downloadSDK(env, url, to, callback) {
    // process.stdout.write(`Downloading ${link}`);
    let fileStream = fs.createWriteStream(to);
    let loading = new ProgressBar_1.LoadingBar();
    let receivedBytes = 0;
    request
        .get({ url: url, headers: { 'User-Agent': 'request' } })
        .on('response', response => {
        if (response.statusCode === 200) {
            loading.start();
            // bar.total = parseInt(response.headers['content-length']);
            // console.log("H:",parseInt(response.headers['content-length']));
        }
        else {
            console.log("error");
        }
    })
        .on('data', (chunk) => {
        receivedBytes += chunk.length;
    })
        .on('end', (code) => {
        loading.stop();
    })
        .on('error', (err) => {
        // @ts-ignore
        fs.unlink(local_file);
        loading.stop();
    })
        .pipe(fileStream);
    // callback();
}
exports.downloadSDK = downloadSDK;
