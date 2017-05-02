import BaseObject from "./base";
import {Version, Options, short} from './utils/version';
import {GenericObject} from './types/generic_object';

class VObject extends BaseObject {
    constructor(options: Options) {
        super();
        this.version = new Version(options);
        this.patchify = options.patchify;
    }
}

(<any>window).VObject = VObject;

// /**
//  * Tests
//  */

// let obj:GenericObject  = {
//     prp1: 90,
//     prp2: {
//         subprp: [1,2,3,4]
//     }
// }

// let options = new Options();
// options.patchify = true;
// let vo = new VObject(options);
// vo.source(obj);

// vo.prp1 = 900;

// (<any>window).vo = vo;
