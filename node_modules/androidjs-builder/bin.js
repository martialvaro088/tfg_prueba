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
const commander_1 = require("commander");
const path = __importStar(require("path"));
// import {IContext, loadModules, getClassName} from './loadModules';
const fs = __importStar(require("fs"));
const inquirer = __importStar(require("inquirer"));
const webview_1 = require("./modules/webview");
const static_app_1 = require("./modules/static_app");
const react_1 = require("./modules/react");
const pkg = require('./package.json');
const project = {
    dir: process.cwd(),
    name: 'myapp',
    type: 'webview'
};
const builder = {
    dir: __dirname,
    commander: new commander_1.Command(),
    cache: path.join(process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH, '.androidjs', 'cache'),
    debug: false
};
const env = {
    force: false,
    release: false,
    project,
    builder
};
// create cache folder
if (!fs.existsSync(path.join(env.builder.cache, '..'))) {
    try {
        fs.mkdirSync(path.join(env.builder.cache, '..'));
        fs.mkdirSync(env.builder.cache);
    }
    catch (e) {
        if (env.builder.debug) {
            console.warn(e.message);
        }
    }
}
const context = {
    webview: webview_1.Webview,
    static: static_app_1.StaticApp,
    'react-native': react_1.ReactApp
};
let commander = new commander_1.Command();
commander.version(pkg.version, '-v, --version')
    .description(`Android-Js Builder: ${pkg.version}`, {});
commander
    .command('init')
    .description('Create new project')
    .option('-f, --force', 'Force to download the required modules and examples')
    .option('-d, --debug', 'Enable debug')
    .action((args) => {
    let ans = inquirer.prompt(questions);
    ans.then(data => {
        //@ts-ignore
        const { APPNAME, APPTYPE } = data;
        env.project.name = APPNAME;
        env.project.type = APPTYPE;
        env.force = args.forceBuild ? true : false;
        env.builder.debug = args.debug ? true : false;
        // load module
        if (context.hasOwnProperty(APPTYPE)) {
            let mod = new context[APPTYPE]();
            mod.installModule(env, {});
            mod.create();
        }
    });
});
commander
    .command('build')
    .alias('b')
    .option('-f, --force', 'Force to download sdk and build tools')
    .option('-d, --debug', 'Enable debug')
    .option('--release', 'Generate apk in release mode')
    .description('Build project')
    .action((args) => {
    if (fs.existsSync(path.join(env.project.dir, 'package.json'))) {
        let _package = require(path.join(env.project.dir, 'package.json'));
        env.force = args.force ? true : false;
        env.release = args.release ? true : false;
        env.builder.debug = args.debug ? true : false;
        // check for the project type
        if (context.hasOwnProperty(_package['project-type'])) {
            let mod = new context[_package['project-type']]();
            mod.installModule(env, {});
            mod.build();
        }
        else {
            console.log("Invalid project type:", _package['project-type']);
        }
    }
    else {
        console.log('can not find package.json');
        process.exit();
    }
});
commander
    .command('update')
    .alias('u')
    .description('Update module')
    .action((args) => {
    let mod = new context['webview']();
    mod.installModule(env, {});
    // @ts-ignore
    mod.downloadSDK((error) => {
        if (error) {
            console.log("error:", error);
        }
        else {
            console.log("Update complete");
        }
    }, true);
});
commander.on('command:*', function () {
    commander.help();
});
if (process.argv.length == 2) {
    commander.help();
}
// commander.on('--help', function () {
// for (const key in context) {
//     loadModules(env, context);
// context[key]._.commander.help();
// }
// });
const questions = [
    {
        name: "APPNAME",
        type: "input",
        message: "Application name:"
    },
    {
        type: "list",
        name: "APPTYPE",
        message: "Project type:",
        choices: [
            // chalk.yellow("React"),
            // chalk.green("Flutter"),
            "webview",
            "static",
        ],
    }
];
commander.parse(process.argv);
// env.builder.commander.parse(process.argv);
// context.Webview.create();
// context.Webview.build();
