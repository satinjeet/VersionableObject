import BaseObject from "../../base";

export function DefineGetterAndSetter(key: string, value: any) {

    let _getter = function () {
        let trueValues = this._values[key];

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
        let versions = this.version.getPrevious();
        let _version = versions.reverse().find((version: string) => {
            return trueValues.hasOwnProperty(version);
        });
        let _value = trueValues[_version];

        return _value;
    };

    let _setter = function (value: any) {
        this.hookSetter();
        this._values[key][this.version.is()] = value;
    };

    Object.defineProperties(this, {
        [key]: {get: _getter, set: _setter}
    });
}