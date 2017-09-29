/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Options {
    constructor() {
        this.step = 1;
        this.format = "@v.@r.@p";
        this.version = 0;
        this.release = 0;
        this.patch = 0;
        this.patchify = false;
        Object.seal(this);
    }
}
exports.Options = Options;
class Version {
    constructor(options = new Options()) {
        let op = new Options();
        Object.assign(op, options);
        this.step = options.step;
        this.format = options.format;
        this.version = options.version;
        this.release = options.release;
        this.patch = options.patch;
        this._previousVersions = [];
        this._type = 'VERSION';
    }
    is() {
        return this.format
            .replace(/@v/, this.version.toString())
            .replace(/@r/, this.release.toString())
            .replace(/@p/, this.patch.toString());
    }
    nextMinorVersion() {
        this._previousVersions.push(this.is());
        this.release++;
        this.patch = 0;
    }
    nextPatch() {
        this._previousVersions.push(this.is());
        this.patch++;
    }
    nextVersion() {
        this._previousVersions.push(this.is());
        this.version++;
        this.release = 0;
        this.patch = 0;
    }
    getPrevious() {
        return JSON.parse(JSON.stringify(this._previousVersions));
    }
}
exports.Version = Version;
function Short(v, r, p) {
    let _options = new Options();
    _options.version = v;
    _options.release = r;
    _options.patch = p;
    return new Version(_options);
}
exports.Short = Short;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __webpack_require__(2);
const version_1 = __webpack_require__(0);
class VObject extends base_1.default {
    constructor(options = new version_1.Options) {
        super();
        if (!options) {
            throw new Error('options object missing');
        }
        this.version = new version_1.Version(options);
        this.patchify = options.patchify;
    }
}
exports.default = VObject;
// /**
//  * Tests
//  */
let obj = {
    prp1: 90,
    prp2: {
        subprp: [1, 2, 3, 4]
    }
};
let options = new version_1.Options();
options.patchify = true;
let vo = new VObject(options);
vo.source(obj);
vo.prp1 = 900;
vo.prp1 = 1000;
vo.prp1 = 1100;
vo.prp1 = 1200;
vo.prp2 = { foo: 'bar' };
vo.prp1 = "some string";
if (window) {
    debugger;
    window.vo = vo;
    Object.defineProperty(window, 'VObject', { value: VObject });
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const checks_1 = __webpack_require__(3);
const version_1 = __webpack_require__(0);
class BaseObject {
    constructor() {
        this._values = {};
        this.version = this.version || version_1.Short(0, 0, 0);
    }
    source(rawData = {}) {
        if (!checks_1.isObject(rawData)) {
            throw new Error('Object is required in key:value format');
        }
        this.startPatch();
        this.startIndexing(rawData);
        return this;
    }
    startPatch() {
        this.version.nextPatch();
    }
    startSubVersion() {
        this.version.nextMinorVersion();
    }
    startNewVersion() {
        this.version.nextVersion();
    }
    hookSetter() {
        if (this.patchify) {
            this.startPatch();
        }
    }
    startIndexing(rawData) {
        /**
         * Do not create patch for initial assignment.
         * @type {boolean}
         */
        let _patch = this.patchify;
        this.patchify = false;
        for (let key in rawData) {
            if (checks_1.hasProp(rawData, key)) {
                this.objectCreateGetterAndSetter(this, key, rawData[key]);
                this._values[key] = {};
                this[key.toString()] = rawData[key];
            }
        }
        this.patchify = _patch;
    }
    objectCreateGetterAndSetter(obj, key, value) {
        let _getter = function () {
            let trueValues = this._values[key];
            /**
             * check if the object key has current version value in it. if it does return that
             * value, otherwise start hunting.
             */
            if (trueValues.hasOwnProperty(this.version.is())) {
                return this._values[key][obj.version.is()];
            }
            /**
             * more compact version of getting latest available version for an attribute and returning it.
             * find the highest available version from the list of versions, then return it.
             * @type {Object}
             */
            let versions = this.version.getPrevious();
            let _version = versions.reverse().find((version) => {
                return trueValues.hasOwnProperty(version);
            });
            let _value = trueValues[_version];
            return _value;
        };
        let _setter = function (value) {
            this.hookSetter();
            this._values[key][obj.version.is()] = value;
        };
        Object.defineProperties(obj, {
            [key]: { get: _getter, set: _setter }
        });
    }
    getState(version = this.version, release, patch) {
        if (arguments.length == 3) {
            version = version_1.Short.apply(null, arguments);
        }
        if (!(version instanceof version_1.Version)) {
            throw new Error('require version object');
        }
        if (version.is() > this.version.is()) {
            throw new Error('this version on this object does not exist.');
        }
        let _neededVersion = version.is();
        let _clone = {};
        for (let k in this._values) {
            let _cache = this._values[k];
            /**
             * if the property has a version that is needed, send back that value
             */
            if (_cache.hasOwnProperty(_neededVersion)) {
                _clone[k] = _cache[_neededVersion.toString()];
                continue;
            }
            /**
             * otherwise send the key first-lesser than the version demanded
             */
            let _versions = Object.keys(_cache);
            let _version = _versions.filter(function (_v) {
                return _v <= _neededVersion;
            }).sort().pop();
            _clone[k] = _cache[_version];
            continue;
        }
        return _clone;
    }
}
exports.default = BaseObject;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * underscore js definitions of checking functions
 * @type {[type]}
 */
let toString = Object.prototype.toString;
function isArray(obj) {
    return toString.call(obj) == '[object Array]';
}
exports.isArray = isArray;
;
function isObject(obj) {
    return obj === Object(obj);
}
exports.isObject = isObject;
;
function isFunction(obj) {
    return toString.call(obj) == '[object Function]';
}
exports.isFunction = isFunction;
;
function hasProp(obj, key) {
    return Object.hasOwnProperty.apply(obj, [key]);
}
exports.hasProp = hasProp;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map