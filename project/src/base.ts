import {isObject, hasProp} from './utils/checks';
import {Version, Short} from './utils/version';
import {GenericObject} from './types/generic_object';

export default class BaseObject {
    protected _values: GenericObject;
    protected patchify: boolean;
    
    public version: Version;

    [key: string]: any;

    constructor () {
        this._values = {};
        this.version = this.version || Short(0,0,0);
    }

    source (rawData: Object = {}): BaseObject {
        if (!isObject(rawData)) {
            throw new Error('Object is required in key:value format');
        }

        this.startPatch();
        this.startIndexing(rawData);

        return this;
    }

    startPatch () {
        this.version.nextPatch();
    }

    startSubVersion () {
        this.version.nextMinorVersion();
    }

    startNewVersion () {
        this.version.nextVersion();
    }

    hookSetter (): void {
        if (this.patchify) {
            this.startPatch();
        }
    }

    startIndexing (rawData: any) {
        /**
         * Do not create patch for initial assignment.
         * @type {boolean}
         */
        let _patch = this.patchify;
        this.patchify = false;

        for (let key in rawData) {

            if (hasProp(rawData, key)) {
                this.objectCreateGetterAndSetter(this, key, rawData[key]);
                this._values[key] = {};
                this[key.toString()] = rawData[key];
            }
        }

        this.patchify = _patch;
    }

    objectCreateGetterAndSetter(obj: BaseObject, key: string, value: any) {

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
            let _version = versions.reverse().find((version: string) => {
                return trueValues.hasOwnProperty(version);
            });
            let _value = trueValues[_version];

            return _value;
        };

        let _setter = function (value: any) {
            this.hookSetter();
            this._values[key][obj.version.is()] = value;
        };

        Object.defineProperties(obj, {
            [key]: {get: _getter, set: _setter}
        });
    }

    getState(version: any = this.version, release?: number, patch?: number): GenericObject {
        if (arguments.length == 3) {
            version = Short.apply(null, arguments);
        }

        if (!(version instanceof Version)) {
            throw new Error('require version object');
        }

        if (version.is() > this.version.is()) {
            throw new Error('this version on this object does not exist.');
        }

        let _neededVersion: string = version.is();
        let _clone: GenericObject = {};

        for ( let k in this._values) {
            let _cache: GenericObject = this._values[k];

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
            let _versions: Array<string> = Object.keys(_cache)
            let _version: string = _versions.filter(function(_v) {
                return _v <= _neededVersion;
            }).sort().pop();

            _clone[k] = _cache[_version];
            continue;
        }

        return _clone;
    }
}