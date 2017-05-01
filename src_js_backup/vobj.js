/**
 * Define Vobj in given scope scope
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
 */
(function(scope) {

    var hasProp = function(obj, key) {
        return Object.hasOwnProperty.apply(obj, [key]);
    }

    function objectCreateGetterAndSetter(obj, key, value) {

        _getter = function () {
            obj.hookGetter();
            var trueValues = this._values[key];

            if (trueValues.hasOwnProperty(this.version.is())) {
                return this._values[key][obj.version.is()];
            }

            var versions = this.version.getPrevious();
            var _version = versions.pop();
            var _value = undefined;
            do {
                if (trueValues.hasOwnProperty(_version)) {
                    _value = trueValues[_version];
                    break;
                }
            } while (true && versions.length > 0);

            return _value;
        };

        _setter = function (value) {
            obj.hookSetter();
            this._values[key][obj.version.is()] = value;
        };

        Object.defineProperties(obj, {
            [key]: {get: _getter, set: _setter}
        });
    }

    /**
     * Wrapper function to create options Object.
     *
     * Later this will be used to handle reverts and validations
     */
    var Version = (function() {


        function Version(options = {}) {
            this.step = options.step !== undefined ? options.step : 1;
            this.format = options.format !== undefined ? options.format : "@v.@r.@p";
            this.version = options.version !== undefined ? options.version : 0;
            this.release = options.release !== undefined ? options.release : 0;
            this.patch = options.patch !== undefined ? options.patch : 0;
        }

        Version.short = function(v, r, p) {
            var _options = {
                version: v,
                release: r,
                patch: p
            }

            return new Version(_options);
        }

        Version.prototype = Object.create({
            _previousVersions: [],
            _type: 'VERSION',
            is () {
                return this.format.replace("@v", this.version).replace("@r", this.release).replace("@p", this.patch);
            },

            nextMinorVersion () {
                this._previousVersions.push(this.is());
                this.release++;
                this.patch = 0;
            },

            nextPatch () {
                this._previousVersions.push(this.is());
                this.patch++;
            },

            nextVersion () {
                this._previousVersions.push(this.is());
                this.version++;
                this.release = 0;
                this.patch = 0;
            }
        });

        Version.prototype.getPrevious = function () {
            return JSON.parse(JSON.stringify(this._previousVersions));
        }

        return Version;
    })();


    /**
     * Options :
     * store every value change as patch :
     * patchify: true|false
     */
    function VObject(options = {}) {
        this.version = new Version(options);

        this.patchify = options.patchify || false;
    }

    VObject.prototype = Object.create({
        _values: {},
        source: function(rawData = {}) {
            if (typeof rawData != 'object') {
                throw new Error('Invalid source for creating Object');
            }

            this.startPatch();
            this.startIndexing(rawData);
            // this.finish();

            // return this.returnObject();
        },

        hookGetter () {

        },

        hookSetter () {
            if (this.patchify) {
                this.startPatch();
            }
        },

        startPatch: function() {
            this.version.nextPatch();
        },

        startSubVersion: function() {
            this.version.nextMinorVersion();
        },

        startNewVersion () {
            this.version.nextVersion();
        },

        startIndexing: function(rawData) {
            /**
             * Do not create patch for initial assignment.
             * @type {[type]}
             */
            var _patch = this.patchify;
            this.patchify = false;

            for (var key in rawData) {

                if (hasProp(rawData, key)) {
                    objectCreateGetterAndSetter(this, key, rawData[key]);
                    this._values[key] = {};
                    this[key] = rawData[key];
                }
            }

            this.patchify = _patch;
        },


        getAt(version) {
            if (arguments.length == 3) {
                version = Version.short.apply(null, arguments);
            }

            if (version._type != 'VERSION') {
                throw new Error('require version object');
            }

            if (version.is() > this.version.is()) {
                throw new Error('this version on this object does not exist.');
            }

            var _neededVersion = version.is(),
                _clone = {};

            for ( var k in this._values) {
                var _cache = this._values[k];

                /**
                 * if the property has a version that is needed, send back that value
                 */
                if (_cache.hasOwnProperty(_neededVersion)) {
                    _clone[k] = _cache[_neededVersion];
                    continue;
                }

                /**
                 * otherwise send the key first-lesser than the version demanded
                 */
                var _versions = Object.keys(_cache)
                var _version = _versions.filter(function(_v) {
                    return _v <= _neededVersion;
                }).sort().pop()

                _clone[k] = _cache[_version];
                continue;
            }

            return _clone;
        }
    });

    scope.VObject = VObject;

})(window.VOBJ_SCOPE? window.VOBJ_SCOPE: window)





/**
 * Tests
 */

var obj = {
    prp1: 90,
    prp2: {
        subprp: [1,2,3,4]
    }
}

var vo = new VObject({patchify: true});
vo.source(obj);

vo.prp1 = 900
