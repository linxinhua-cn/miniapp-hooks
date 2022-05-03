"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var options = {
    _catchError: function (error, vnode, oldVNode, errorInfo) {
        console.error(error);
        throw error;
    }
};
exports.default = options;
