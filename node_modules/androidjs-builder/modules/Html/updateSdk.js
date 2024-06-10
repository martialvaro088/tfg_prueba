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
exports.updateSdk = void 0;
const path = __importStar(require("path"));
const admZip = require('adm-zip');
const GitListDir_1 = require("../../GitListDir");
const downloadGithubRepo_1 = require("./downloadGithubRepo");
const fs = __importStar(require("fs-extra"));
function updateSdk(env, callback) {
    const sdkZip = path.join(env.builder.cache, env.sdk.repo + '.zip');
    const sdkFolder = path.join(env.builder.cache);
    console.log("Downloading Androidjs-SDK:", GitListDir_1.getDownloadLink(env.sdk.user, env.sdk.repo));
    downloadGithubRepo_1.downloadGithubRepo(env.sdk, sdkZip, (error) => {
        if (error) {
            console.log('Failed to download sdk');
            process.exit();
        }
        else {
            try {
                let zip = new admZip(sdkZip);
                zip.extractEntryTo(env.sdk.repo + '-master/', sdkFolder, true, true);
                fs.removeSync(path.join(sdkFolder, env.sdk.repo));
                fs.renameSync(path.join(sdkFolder, env.sdk.repo + '-master'), path.join(sdkFolder, env.sdk.repo));
                if (callback) {
                    callback();
                }
            }
            catch (e) {
                console.log("Failed to extract sdk");
                process.exit();
            }
        }
    });
}
exports.updateSdk = updateSdk;
