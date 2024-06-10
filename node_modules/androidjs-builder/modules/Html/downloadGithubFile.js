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
exports.downloadGithubFile = void 0;
const ProgressBar_1 = require("./ProgressBar");
const request = __importStar(require("request"));
const GitListDir_1 = require("../../GitListDir");
const fs = __importStar(require("fs-extra"));
function downloadGithubFile(githubFileLink, file, callback, showProgress) {
    let downloadLink = '';
    if (githubFileLink.dir && githubFileLink.dir.length > 0) {
        downloadLink = GitListDir_1.getFileDownloadLink(githubFileLink.user, githubFileLink.repo, githubFileLink.dir, githubFileLink.file);
    }
    else {
        downloadLink = GitListDir_1.getFileDownloadLink(githubFileLink.user, githubFileLink.repo, githubFileLink.file);
    }
    let writeStream = fs.createWriteStream(file);
    let progress = new ProgressBar_1.LoadingBar();
    request.get(downloadLink)
        .on('response', (res) => {
        if (res.statusCode === 200) {
            if (showProgress) {
                progress.start();
            }
        }
    })
        .on('data', (chunk) => {
        progress.chunksDownloaded += chunk.length;
    })
        .on('error', (error) => {
        if (showProgress) {
            progress.stop();
        }
        callback(error);
    })
        .on('end', (code) => {
        if (showProgress) {
            progress.stop();
        }
        callback();
    })
        .pipe(writeStream);
}
exports.downloadGithubFile = downloadGithubFile;
