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
exports.loadModules = exports.getClassName = void 0;
const commander_1 = require("commander");
const fs_1 = require("fs");
const path = __importStar(require("path"));
function getClassName(name) {
    return `${name[0].toUpperCase()}${name.slice(1, name.length)}`;
}
exports.getClassName = getClassName;
function loadModules(env, context) {
    let ls = fs_1.readdirSync(path.join(__dirname, 'modules'));
    for (const i in ls) {
        try {
            let mod = require(path.join(__dirname, 'modules', ls[i]));
            if (ls[i].slice(ls[i].length - 3) !== '.js' && ls[i].slice(ls[i].length - 3) !== '.ts') {
                continue;
            }
            let moduleClassName = getClassName(ls[i].slice(0, ls[i].length - 3));
            let mod_instance = new mod[moduleClassName]();
            if (env.builder.debug) {
                console.log(`loading '${mod_instance.constructor.name}' module ...`);
            }
            //@ts-ignore
            let newContext = { commander: new commander_1.Command() };
            let returnCode = mod_instance.installModule(env, newContext);
            if (returnCode !== 0) {
                console.warn(`'${mod_instance.constructor.name}' module exit with code: ${returnCode}`);
            }
            else {
                context[mod_instance.constructor.name] = mod_instance;
                //@ts-ignore
                context[mod_instance.constructor.name]._ = newContext;
            }
        }
        catch (error) {
            console.log('failed to load modules', error.message);
            process.exit();
        }
    }
    return context;
}
exports.loadModules = loadModules;
