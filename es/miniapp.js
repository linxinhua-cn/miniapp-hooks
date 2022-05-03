"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = exports.createPage = exports.options = void 0;
var options_1 = require("./options");
var utils_1 = require("./utils");
exports.options = options_1.default;
function setupRender(vnode) {
    var _a;
    var instance = (_a = vnode === null || vnode === void 0 ? void 0 : vnode._component) === null || _a === void 0 ? void 0 : _a.instance;
    if (!instance || !instance['setup']) {
        console.log("no setup");
        return;
    }
    var _b = instance.setup(), data = _b.data, methods = _b.methods;
    var difference = (0, utils_1.diff)(instance.data, data);
    instance.setData(difference);
    vnode._component.methods = methods;
    return vnode;
}
function createPage(page) {
    var vnodeAry = [];
    var realOnLoad = page.onLoad;
    var setupMethods = page.setupMethods || [];
    var _loop_1 = function (e) {
        if (e && (!page[e])) {
            page[e] = function () {
                var _a;
                var instance = this;
                var id = instance.$id;
                var vnode = vnodeAry[id];
                var context = vnode._component;
                (_a = context === null || context === void 0 ? void 0 : context.methods[e]) === null || _a === void 0 ? void 0 : _a.apply(this, arguments);
            };
        }
    };
    for (var _i = 0, setupMethods_1 = setupMethods; _i < setupMethods_1.length; _i++) {
        var e = setupMethods_1[_i];
        _loop_1(e);
    }
    function onLoad(query) {
        var instance = this;
        var id = instance.$id;
        var vnode = {
            props: query,
            _component: {
                instance: instance,
                render: function () {
                    return setupRender(vnode);
                }
            }
        };
        vnodeAry[id] = vnode;
        options_1.default._render(vnode);
        if ((0, utils_1.isFunction)(realOnLoad)) {
            realOnLoad.call(this, query);
        }
    }
    var realonUnload = page.onUnload;
    function onUnload() {
        var instance = this;
        var id = instance.$id;
        options_1.default.unmount(vnodeAry[id]);
        delete vnodeAry[id];
        if ((0, utils_1.isFunction)(realonUnload)) {
            realonUnload.call(this);
        }
    }
    page.onLoad = onLoad;
    page.onUnload = onUnload;
    return page;
}
exports.createPage = createPage;
function createComponent(component) {
    var vnodeAry = [];
    var setupMethods = component.setupMethods || [];
    if (!component.methods)
        component.methods = {};
    var _loop_2 = function (e) {
        if (e && (!component.methods[e])) {
            component.methods[e] = function () {
                var _a;
                var instance = this;
                var id = instance.$id;
                var vnode = vnodeAry[id];
                var context = vnode._component;
                (_a = context === null || context === void 0 ? void 0 : context.methods[e]) === null || _a === void 0 ? void 0 : _a.apply(this, arguments);
            };
        }
    };
    for (var _i = 0, setupMethods_2 = setupMethods; _i < setupMethods_2.length; _i++) {
        var e = setupMethods_2[_i];
        _loop_2(e);
    }
    var realOnInit = component.onInit;
    var realDidUnmount = component.didUnmount;
    function onInit() {
        var instance = this;
        var id = instance.$id;
        var vnode = {
            props: {},
            _component: {
                instance: instance,
                render: function () {
                    return setupRender(vnode);
                }
            }
        };
        vnodeAry[id] = vnode;
        options_1.default._render(vnode);
        if ((0, utils_1.isFunction)(realOnInit)) {
            realOnInit.call(this);
        }
    }
    function didUnmount() {
        var instance = this;
        var id = instance.$id;
        options_1.default.unmount(vnodeAry[id]);
        delete vnodeAry[id];
        if ((0, utils_1.isFunction)(realDidUnmount)) {
            realDidUnmount.call(this);
        }
    }
    component.onInit = onInit;
    component.didUnmount = didUnmount;
    return component;
}
exports.createComponent = createComponent;
