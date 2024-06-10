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
exports.update = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const modify_xml_1 = require("modify-xml");
function update(env) {
    try {
        // loading required files
        const pkg = require(path.join(env.project.dir, 'package.json'));
        const androidManifestPath = path.join(env.builder.cache, 'AndroidManifest.xml');
        let app_name = pkg['app-name'];
        let package_name = pkg['package-name'];
        let permissions = pkg['permission'];
        if (package_name === undefined || app_name === undefined) {
            console.warn("'app-name' or 'package-name' not define in package.json");
            process.exit();
        }
        /// Debug
        if (env.builder.debug) {
            console.log(`App name: ${app_name}`);
        }
        // let parser = new xml2js.Parser({});
        // let builder = new xml2js.Builder();
        let androidManifest = fs.readFileSync(androidManifestPath);
        // let parsedManifest = parser.parseString();
        // updating package name
        let data = androidManifest.toString().replace('"com.android.js.webview"', `"com.android.js.${package_name}"`);
        const document = modify_xml_1.parse(data);
        console.log('Package name:', document['childNodes'][1]['attributes']['package']);
        // set user permissions
        for (const i in permissions) {
            let permission = permissions[i];
            if (env.builder.debug) {
                console.log(`Adding '${permission.slice(19)}' permission`);
            }
            document['childNodes'][1]['childNodes'].push({
                "type": "element",
                "name": "uses-permission",
                "childNodes": [],
                "attributes": {
                    "android:name": permission
                },
                "selfClosing": true,
                "openTag": `<uses-permission android:name=\"${permission}\"/>`,
                "closeTag": `<uses-permission android:name=\"${permission}\"/>`
            });
            document['childNodes'][1]['childNodes'].push({
                "type": "text",
                "value": "\n    "
            });
        }
        // set intent filter
        fs.writeFileSync('../../androidManifest.json', JSON.stringify(document, null, 4));
        // saving back to sdk folder
        const result = modify_xml_1.render(document, { indent: '  ' });
        fs.writeFileSync(path.join(env.builder.cache, 'sdk', 'AndroidManifest.xml'), result);
    }
    catch (e) {
        console.log(`Failed to update android manifest`, e.message);
        process.exit();
    }
    return 0;
}
exports.update = update;
