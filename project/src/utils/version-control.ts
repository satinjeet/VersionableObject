import BaseObject from "../base";
import {Version} from "./version";

interface VersionControlI {
    /**
     * commit current start of the object as a symbol and make sure it is not editable.
     * this state will serve as checkpoint in the object change.
     */
    commit(version: Version): string;

    /**
     * Reset the object to a previous version.
     * Remove all the changes after that
     */
    reset(version: Version): string;

    /**
     * like reset, but after reseting the changes, return the future states
     * maybe they would be used afterwards
     */
    resetAndDump(version: Version): BaseObject;

    /**
     * make the version as the first version of object, i.e remove all other versions before that
     */
    makeFirst(version: Version): string;
}

export default class VersionControl implements VersionControlI {

}