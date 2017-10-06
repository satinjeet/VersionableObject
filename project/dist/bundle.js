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
var Options = (function () {
    function Options() {
        this.step = 1;
        this.format = "@v.@r.@p";
        this.version = 0;
        this.release = 0;
        this.patch = 0;
        this.patchify = false;
        Object.seal(this);
    }
    return Options;
}());
exports.Options = Options;
var Version = (function () {
    function Version(options) {
        if (options === void 0) { options = new Options(); }
        var op = new Options();
        Object.assign(op, options);
        this.step = options.step;
        this.format = options.format;
        this.version = options.version;
        this.release = options.release;
        this.patch = options.patch;
        this._previousVersions = [];
        this._type = 'VERSION';
    }
    Version.prototype.is = function () {
        return this.format
            .replace(/@v/, this.version.toString())
            .replace(/@r/, this.release.toString())
            .replace(/@p/, this.patch.toString());
    };
    Version.prototype.nextMinorVersion = function () {
        this._previousVersions.push(this.is());
        this.release++;
        this.patch = 0;
    };
    Version.prototype.nextPatch = function () {
        this._previousVersions.push(this.is());
        this.patch++;
    };
    Version.prototype.nextVersion = function () {
        this._previousVersions.push(this.is());
        this.version++;
        this.release = 0;
        this.patch = 0;
    };
    Version.prototype.getPrevious = function () {
        return JSON.parse(JSON.stringify(this._previousVersions));
    };
    return Version;
}());
exports.Version = Version;
function Short(v, r, p) {
    var _options = new Options();
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__(2);
var version_1 = __webpack_require__(0);
var VObject = (function (_super) {
    __extends(VObject, _super);
    function VObject(options) {
        if (options === void 0) { options = new version_1.Options; }
        var _this = _super.call(this) || this;
        if (!options) {
            throw new Error('options object missing');
        }
        _this.version = new version_1.Version(options);
        _this.patchify = options.patchify;
        return _this;
    }
    return VObject;
}(base_1.default));
exports.default = VObject;
// /**
//  * Tests
//  */
var obj = {
    prp1: 90,
    prp2: {
        subprp: [1, 2, 3, 4]
    }
};
var options = new version_1.Options();
options.patchify = true;
var vo = new VObject(options);
vo.source(obj);
vo.prp1 = 900;
vo.prp1 = 1000;
vo.prp1 = 1100;
vo.prp1 = 1200;
vo.prp2 = { foo: 'bar' };
vo.prp1 = "some string";
// if (window) {
//     (<any>window).vo = vo;
//     Object.defineProperty(window, 'VObject', {value: VObject});
// }


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var checks_1 = __webpack_require__(3);
var version_1 = __webpack_require__(0);
var DefineGetterAndSetter_1 = __webpack_require__(4);
var BaseObject = (function () {
    function BaseObject() {
        var _this = this;
        this.objectCreateGetterAndSetter = function (key, rawData) {
            DefineGetterAndSetter_1.DefineGetterAndSetter.call(_this, key, rawData);
        };
        this._values = {};
        this.version = this.version || version_1.Short(0, 0, 0);
    }
    BaseObject.prototype.toString = function () {
        return JSON.stringify(this.getState(), null, 4);
    };
    BaseObject.prototype.source = function (rawData) {
        if (rawData === void 0) { rawData = {}; }
        if (!checks_1.isObject(rawData)) {
            throw new Error('Object is required in key:value format');
        }
        this.startPatch();
        this.startIndexing(rawData);
        return this;
    };
    BaseObject.prototype.startPatch = function () {
        this.version.nextPatch();
    };
    BaseObject.prototype.startSubVersion = function () {
        this.version.nextMinorVersion();
    };
    BaseObject.prototype.startNewVersion = function () {
        this.version.nextVersion();
    };
    BaseObject.prototype.hookSetter = function () {
        if (this.patchify) {
            this.startPatch();
        }
    };
    BaseObject.prototype.startIndexing = function (rawData) {
        /**
         * Do not create patch for initial assignment.
         * @type {boolean}
         */
        var _patch = this.patchify;
        this.patchify = false;
        for (var key in rawData) {
            if (checks_1.hasProp(rawData, key)) {
                this.objectCreateGetterAndSetter(key, rawData[key]);
                this._values[key] = {};
                this[key.toString()] = rawData[key];
            }
        }
        this.patchify = _patch;
    };
    BaseObject.prototype.getState = function (version, release, patch) {
        if (version === void 0) { version = this.version; }
        if (arguments.length == 3) {
            version = version_1.Short.apply(null, arguments);
        }
        if (!(version instanceof version_1.Version)) {
            throw new Error('require version object');
        }
        if (version.is() > this.version.is()) {
            throw new Error('this version on this object does not exist.');
        }
        var _neededVersion = version.is();
        var _clone = {};
        for (var k in this._values) {
            var _cache = this._values[k];
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
            var _versions = Object.keys(_cache);
            var _version = _versions.filter(function (_v) {
                return _v <= _neededVersion;
            }).sort().pop();
            _clone[k] = _cache[_version];
            continue;
        }
        return _clone;
    };
    BaseObject.prototype.commit = function (version) {
        throw new Error("Method not implemented.");
    };
    BaseObject.prototype.reset = function (version) {
        throw new Error("Method not implemented.");
    };
    BaseObject.prototype.resetAndDump = function (version) {
        throw new Error("Method not implemented.");
    };
    BaseObject.prototype.makeFirst = function (version) {
        throw new Error("Method not implemented.");
    };
    return BaseObject;
}());
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
var toString = Object.prototype.toString;
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Context , can be called for any object's scope using DefineGetterAndSetter.call(obj, ...arguments)
 * @param {string} key
 * @param { any} value
 */
function DefineGetterAndSetter(key, value) {
    var _getter = function () {
        var trueValues = this._values[key];
        /**
         * check if the object key has current version value in it. if it does return that
         * value, otherwise start hunting.
         */
        if (trueValues.hasOwnProperty(this.version.is())) {
            return this._values[key][this.version.is()];
        }
        /**
         * more compact version of getting latest available version for an attribute and returning it.
         * find the highest available version from the list of versions, then return it.
         * @type {Object}
         */
        var versions = this.version.getPrevious();
        var _version = versions.reverse().find(function (version) {
            return trueValues.hasOwnProperty(version);
        });
        var _value = trueValues[_version];
        return _value;
    };
    var _setter = function (value) {
        this.hookSetter();
        this._values[key][this.version.is()] = value;
    };
    Object.defineProperties(this, (_a = {},
        _a[key] = { get: _getter, set: _setter },
        _a));
    var _a;
}
exports.DefineGetterAndSetter = DefineGetterAndSetter;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map