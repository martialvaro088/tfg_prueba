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
exports.updateIcon = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function updateIcon(env, args) {
    const sdkPath = path.join(env.builder.cache, args.sdk.repo);
    let iconPath = undefined;
    try {
        iconPath = require(path.join(env.project.dir, 'package.json')).icon;
        if (!iconPath) {
            console.log("can not find icon path in package.json");
            process.exit();
        }
        if (iconPath[0] === '.') {
            iconPath = path.join(env.project.dir, iconPath);
        }
    }
    catch (e) {
        console.log('failed to update icon');
        process.exit();
    }
    let icon_paths = [];
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-hdpi', 'ic_launcher.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-hdpi', 'ic_launcher_round.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-mdpi', 'ic_launcher.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-mdpi', 'ic_launcher_round.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-xhdpi', 'ic_launcher.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-xhdpi', 'ic_launcher_round.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-xxhdpi', 'ic_launcher.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-xxhdpi', 'ic_launcher_round.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-xxxhdpi', 'ic_launcher.png'));
    icon_paths.push(path.join(sdkPath, 'res', 'mipmap-xxxhdpi', 'ic_launcher_round.png'));
    for (const i in icon_paths) {
        fs.writeFileSync(icon_paths[i], fs.readFileSync(iconPath));
    }
}
exports.updateIcon = updateIcon;
