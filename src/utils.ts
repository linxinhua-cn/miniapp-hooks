

export function typeOf(value: any) {
  return Object.prototype.toString.call(value);
}
export function isPlainObject(value: any) {
  return typeOf(value) === '[object Object]';
}
export function isObject(value: any) {
  return value !== null && typeof value === 'object';
}
export function isFunction(value: any) {
  return typeof value === 'function';
}
export function isArray(value: any) {
  return Array.isArray(value);
}
export function hasOwn(object: any, key:string) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

export function isEqual (value: any, other: any) {
  // eslint-disable-next-line
  return value === other || (value !== value && other !== other);
};

function _diff(pre: any, current: any, difference: any, path?: string) {
  if (path === void 0) { path = ''; }
  if (isPlainObject(pre) && isPlainObject(current)) {
      var keys = Object.keys(current);
      // 先验证下当前迭代的对象的 key 列表是否合法，如果不合法，则不进行递归 diff，将原始对象进行赋值
      if (keys.some(function (key) { return key.indexOf('.') > -1 || key.indexOf('[') > -1 || key.indexOf(']') > -1; })) {
          difference[path] = current;
          return;
      }
      keys.forEach(function (key) {
          var value = current[key];
          if (!hasOwn(pre,key)) {
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
          current.forEach(function (item:any, index:number) {
              _diff(pre[index], item, difference, path + "[" + index + "]");
          });
      }
  }
  else if (typeOf(pre) === typeOf(current)) {
      // boolean,null,undefined,number,bigint,string,symbol
      if (!isEqual(pre, current)) {
          difference[path] = current;
      }
  }
  else if (typeOf(pre) !== typeOf(current)) {
      difference[path] = current;
  }
}
export function diff(pre:any, current:any) {
  if (isEqual(pre, current))
      return null;
  let diffrence:any = {};
  _diff(pre, current, diffrence);
  return Object.keys(diffrence).length > 0 ? diffrence : null;
}