import VObject from '../../src/index'
import {Options} from '../../src/utils/version'
import { expect } from 'chai';

declare var describe: Function;
declare var it: Function;

describe("Suite 1: Base test suite for VObject test cases", () => {
    it("simple constructor rule violation", () => {
        let exec = () => {
            new VObject();
        }

        expect(exec).to.throw('options object missing')
    });

    it("start Object with initial version, no patch", () => {
        let op = new Options();
        op.version = 1;

        let o1 = new VObject(op);

        expect(o1.version.is()).to.equal('1.0.0');
    });

    it("start Object with initial version and value, no patch", () => {
        let op = new Options();
        op.version = 1;

        let o1 = new VObject(op);
        o1.source({
            prop1: 89,
            prop2: 800,
            prop3: "String__",
            prop4: [1,2,3,4]
        })

        expect(o1.version.is()).to.equal('1.0.1');
        expect(o1.prop1).to.equal(89);
        expect(o1.prop3).to.equal("String__");
    });

    it("start Object with initial version and value, patch on each change", () => {
        let op = new Options();
        op.version = 1;
        op.patchify = true;

        let o1 = new VObject(op);
        o1.source({
            prop1: 89,
            prop2: 800,
            prop3: "String__",
            prop4: [1,2,3,4]
        })

        o1.prop1 = 90;

        expect(o1.version.is()).to.equal('1.0.2');
        expect(o1.prop1).to.equal(90);
        expect(o1.prop3).to.equal("String__");
    });

    it("start Object with initial version and value, patch on each change", () => {
        let op = new Options();
        op.version = 1;
        op.patchify = true;

        let o1 = new VObject(op);
        o1.source({
            prop1: 89,
            prop2: 800,
            prop3: "String__",
            prop4: [1,2,3,4]
        })

        o1.prop1 = 90;

        expect(o1.version.is()).to.equal('1.0.2');
        expect(o1.prop1).to.equal(90);
        expect(o1.prop3).to.equal("String__");
    })
});


describe("Suite 2: Test use cases", () => {
    it("2.1 : Get object state", () => {
        let op = new Options();
        op.version = 1;
        op.patchify = false;

        let o1 = new VObject(op);
        o1.source({
            prop1: 89,
            prop2: 800,
            prop3: "String__",
            prop4: [1,2,3,4]
        })

        let state = o1.getState();

        expect(state.prop1).to.equal(89);
        expect(state.prop2).to.equal(800);
        expect(state.prop3).to.equal('String__');
        expect(state.prop4).to.contain(1);
        expect(state.prop4).to.contain(2);
        expect(state.prop4).to.contain(3);
        expect(state.prop4).to.contain(4);

    })

    it("2.1 : Object state should not manipulate version object itself", () => {
        let op = new Options();
        op.version = 1;
        op.patchify = false;

        let o1 = new VObject(op);
        o1.source({
            prop1: 89,
            prop2: 800,
            prop3: "String__",
            prop4: [1,2,3,4]
        })

        let state = o1.getState();
        state.prop2 = 1000;

        expect(state.prop1).to.equal(89);
        expect(state.prop2).to.equal(1000);
        expect(state.prop3).to.equal('String__');
        expect(state.prop4).to.contain(1);
        expect(state.prop4).to.contain(2);
        expect(state.prop4).to.contain(3);
        expect(state.prop4).to.contain(4);
        expect(state.prop4).not.to.contain(10);

        expect(o1.prop2).to.equal(800);
    })

    it("2.2 : Patch object on each change and get all states", () => {
        let op = new Options();
        op.version = 1;
        op.patchify = true;

        let o1 = new VObject(op);
        o1.source({
            p1: "1.0.1",
            p2: {
                foo: "bar"
            }
        })

        
        // start changing
        o1.p1 = "1.0.2"
        expect(o1.version.is()).to.equal('1.0.2');

        o1.p1 = "1.0.3"
        expect(o1.version.is()).to.equal('1.0.3');

        o1.p2 = {
            foo2: "bazbat"
        };
        expect(o1.version.is()).to.equal('1.0.4');

        // patching a nested object should not do anything
        o1.p2.foo2 = "bazbat 2 ";
        expect(o1.version.is()).to.equal('1.0.4');

        o1.p1 = "1.0.5 ";
        expect(o1.version.is()).to.equal('1.0.5');

    })
})