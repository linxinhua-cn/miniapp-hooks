"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diff = exports.isEqual = exports.hasOwn = exports.isArray = exports.isFunction = exports.isObject = exports.isPlainObject = exports.typeOf = void 0;
function typeOf(value) {
    return Object.prototype.toString.call(value);
}
exports.typeOf = typeOf;
function isPlainObject(value) {
    return typeOf(value) === '[object Object]';
}
exports.isPlainObject = isPlainObject;
function isObject(value) {
    return value !== null && typeof value === 'object';
}
exports.isObject = isObject;
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
}
exports.hasOwn = hasOwn;
function isEqual(value, other) {
    return value === other || (value !== value && other !== other);
}
exports.isEqual = isEqual;
;
function _diff(pre, current, difference, path) {
    if (path === void 0) {
        path = '';
    }
    if (isPlainObject(pre) && isPlainObject(current)) {
        var keys = Object.keys(current);
        if (keys.some(function (key) { return key.indexOf('.') > -1 || key.indexOf('[') > -1 || key.indexOf(']') > -1; })) {
            difference[path] = current;
            return;
        }
        keys.forEach(function (key) {
            var value = current[key];
            if (!hasOwn(pre, key)) {
                var pathKey = path ? path + "." + key : key;
                difference["" + pathKey] = value;
            }
            else {
                if (!isEqual(value, pre[key])) {
                    var pathKey = path ? path + "." + key : key;
                    _diff(pre[key], value, difference, pathKey);
                }
            }
        });
    }
    else if (isArray(pre) && isArray(current)) {
        if (current.length < pre.length) {
            difference[path] = current;
        }
        else {
            current.forEach(function (item, index) {
                _diff(pre[index], item, difference, path + "[" + index + "]");
            });
        }
    }
    else if (typeOf(pre) === typeOf(current)) {
        if (!isEqual(pre, current)) {
            difference[path] = current;
        }
    }
    else if (typeOf(pre) !== typeOf(current)) {
        difference[path] = current;
    }
}
function diff(pre, current) {
    if (isEqual(pre, current))
        return null;
    var diffrence = {};
    _diff(pre, current, diffrence);
    return Object.keys(diffrence).length > 0 ? diffrence : null;
}
exports.diff = diff;
