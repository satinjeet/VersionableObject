import {isObject, hasProp} from './utils/checks';
import {Version, Short} from './utils/version';
import {GenericObject} from './types/generic_object';
import {IVersionControl} from "./utils/version-control";
import {IVersionableObject} from "./types/IVersionableObject";
import {DefineGetterAndSetter} from "./utils/context/DefineGetterAndSetter";
import {IToString} from "./types/IToString";

export default class BaseObject implements IVersionableObject, IVersionControl, IToString {
    protected _values: GenericObject;
    protected patchify: boolean;
    
    public version: Version;

    [key: string]: any;

    toString() {
        return JSON.stringify(this.getState(), null, 4);
    }

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
                this.objectCreateGetterAndSetter(key, rawData[key]);
                this._values[key] = {};
                this[key.toString()] = rawData[key];
            }
        }

        this.patchify = _patch;
    }

    private objectCreateGetterAndSetter = (key: string, rawData: any) => {
        DefineGetterAndSetter.call(this, key, rawData);
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

    commit(version: Version): string {
        throw new Error("Method not implemented.");
    }

    reset(version: Version): string {
        throw new Error("Method not implemented.");
    }

    resetAndDump(version: Version): BaseObject {
        throw new Error("Method not implemented.");
    }

    makeFirst(version: Version): string {
        throw new Error("Method not implemented.");
    }


    static toString() {
        return "class VObject { [native code] }";
    }
}