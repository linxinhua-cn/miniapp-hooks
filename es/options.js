"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var options = {
    _catchError: function (error, vnode, oldVNode, errorInfo) {
        console.error(error);
        throw error;
    },
    _render: function (node) {
        var _a;
        (_a = node === null || node === void 0 ? void 0 : node._component) === null || _a === void 0 ? void 0 : _a.render();
    }
};
exports.default = options;
