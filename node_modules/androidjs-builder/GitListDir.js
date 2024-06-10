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
exports.getFileDownloadLink = exports.getDownloadLink = exports.lsGit = void 0;
const request = __importStar(require("request"));
function lsGit(user, repo, dir, callback) {
    if (!callback) {
        callback = dir;
        dir = '';
    }
    let options = {
        url: `https://api.github.com/repos/${user}/${repo}/contents/${dir}?ref=HEAD`,
        headers: {
            'User-Agent': 'request'
        }
    };
    request.get(options, callback);
}
exports.lsGit = lsGit;
function getDownloadLink(user, repo, branch = "master") {
    return `https://github.com/${user}/${repo}/archive/${branch}.zip`;
}
exports.getDownloadLink = getDownloadLink;
/// TODO: need to update this function
// @ts-ignore
function getFileDownloadLink(user, repo, dir, file) {
    if (file === undefined)
        return `https://raw.githubusercontent.com/${user}/${repo}/HEAD/${dir}`;
    else
        return `https://raw.githubusercontent.com/${user}/${repo}/HEAD/${dir}/${file}`;
}
exports.getFileDownloadLink = getFileDownloadLink;
// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         const ls: Array<{name: string, type: string}> = JSON.parse(body);
//         ls.forEach(e => {
//             console.log(e.type.toUpperCase(), e.name);
//         })
//     }
// }
