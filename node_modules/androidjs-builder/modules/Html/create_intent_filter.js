"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntentFilter = void 0;
function getIntentFilter(filter_action, filter_category) {
    return {
        "type": "element",
        "name": "intent-filter",
        "childNodes": [
            {
                "type": "text",
                "value": "\n                "
            },
            {
                "type": "element",
                "name": "action",
                "childNodes": [],
                "attributes": {
                    "android:name": filter_action
                },
                "selfClosing": true,
                "openTag": "<action android:name=\"" + filter_action + "\"/>",
                "closeTag": "<action android:name=\"" + filter_action + "\"/>"
            },
            {
                "type": "text",
                "value": "\n                "
            },
            {
                "type": "element",
                "name": "category",
                "childNodes": [],
                "attributes": {
                    "android:name": filter_category
                },
                "selfClosing": true,
                "openTag": "<category android:name=\"" + filter_category + "\"/>",
                "closeTag": "<category android:name=\"" + filter_category + "\"/>"
            },
            {
                "type": "text",
                "value": "\n            "
            }
        ],
        "attributes": {},
        "selfClosing": false,
        "openTag": "<intent-filter>",
        "closeTag": "</intent-filter>"
    };
}
exports.getIntentFilter = getIntentFilter;
