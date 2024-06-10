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
exports.getUpdateMessage = exports.getUpdate = void 0;
const dns = require('dns');
const GitListDir_1 = require("../../GitListDir");
const downloadGithubFile_1 = require("./downloadGithubFile");
const path = __importStar(require("path"));
const semver = require('semver');
let isSearchComplete = false;
let isAvailable = false;
let _hostname = '';
let _service = '';
let msg = '';
dns.lookupService('8.8.8.8', 53, function (err, hostname, service) {
    isSearchComplete = true;
    if (err) {
    }
    else {
        _hostname = hostname;
        _service = service;
        if (_hostname.length > 0 && _service.length > 0) {
            isAvailable = true;
        }
    }
    // google-public-dns-a.google.com domain
});
function getSdkVersion(env, callback) {
    let tempFilePath = path.join(env.builder.cache, 'TEMP-sdk-config.json');
    let sdkConfigFileLink = GitListDir_1.getFileDownloadLink(env.sdk.user, env.sdk.repo, 'config.json');
    let _sdkConfigFileLink = {
        user: env.sdk.user,
        repo: env.sdk.repo,
        file: 'config.json',
        dir: ''
    };
    downloadGithubFile_1.downloadGithubFile(_sdkConfigFileLink, tempFilePath, () => {
        try {
            let sdkConfig = require(tempFilePath);
            callback(sdkConfig.version);
        }
        catch (e) {
            ///...
        }
    }, false);
}
function getUpdate(env) {
    return new Promise(resolve => {
        let loopCount = 0;
        let loop = setInterval(() => {
            // check for 5 seconds for network connectivity
            if (++loopCount === 5) {
                clearInterval(loop);
            }
            if (isSearchComplete && (true || clearInterval(loop))) {
                if (isAvailable) {
                    try {
                        let oldSdk = require(path.join(env.builder.cache, env.sdk.repo, 'config.json'));
                        getSdkVersion(env, sdkVersion => {
                            if (semver.lt(oldSdk.version, sdkVersion)) {
                                msg = `Androidjs-sdk: ${sdkVersion} available`;
                                msg += `Update using $androidjs u`;
                            }
                            else {
                                ///...
                            }
                        });
                    }
                    catch (e) {
                        ///...
                    }
                }
            }
            else {
                /// if search is not complete then do nothing for 5 seconds
            }
        }, 1000);
    });
}
exports.getUpdate = getUpdate;
function getUpdateMessage() {
    if (msg.length > 1) {
        console.log(msg);
    }
}
exports.getUpdateMessage = getUpdateMessage;
