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
exports.downloadGithubRepo = void 0;
const ProgressBar_1 = require("./ProgressBar");
const request = __importStar(require("request"));
const GitListDir_1 = require("../../GitListDir");
const fs = __importStar(require("fs-extra"));
function downloadGithubRepo(githubReplLink, file, callback) {
    let downloadLink = GitListDir_1.getDownloadLink(githubReplLink.user, githubReplLink.repo);
    let writeStream = fs.createWriteStream(file);
    let progress = new ProgressBar_1.LoadingBar();
    request.get(downloadLink)
        .on('response', (res) => {
        if (res.statusCode === 200) {
            progress.start();
        }
    })
        .on('data', (chunk) => {
        progress.chunksDownloaded += chunk.length;
    })
        .on('end', (code) => {
        progress.stop();
        callback();
    })
        .on('error', (error) => {
        progress.stop();
        console.log("ERROR:", error);
        callback(error);
    })
        .pipe(writeStream);
}
exports.downloadGithubRepo = downloadGithubRepo;
