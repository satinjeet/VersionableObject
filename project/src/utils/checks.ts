/**
 * underscore js definitions of checking functions
 * @type {[type]}
 */
let toString = Object.prototype.toString;

export function isArray(obj: Array<any>): boolean {
    return toString.call(obj) == '[object Array]';
};

export function isObject(obj: Object): boolean {
    return obj === Object(obj);
};

export function isFunction(obj: Function): boolean {
    return toString.call(obj) == '[object Function]';
};

export function hasProp(obj: Object, key: string): boolean {
    return Object.hasOwnProperty.apply(obj, [key]);
}