import VObject from "./index";
import * as CodeMirror from "codemirror";
import 'codemirror/mode/javascript/javascript';
import {SandBox} from "./UI/sandbox";

let sandBox: Function = function(command: string): any {
    let scope: any = { "VObject": VObject};
    return scope[command];
};

document.querySelector('#run').addEventListener('click', function(e) {
    e.preventDefault();
    let code: string = editor.getValue();

    sandBox = SandBox(code, [{objName: "VObject", obj: VObject}]);
})

var editor = CodeMirror.fromTextArea(
    document.querySelector('#editor') as HTMLTextAreaElement, {
    lineNumbers: true,
    theme: "dracula",
    mode: "javascript"
});

(jQuery('#terminal') as any).terminal(function(command: string) {
    if (command !== '') {
        try {
            var result: any = sandBox(command);
            if (!result) {
                result = eval(command);
            }

            if (result !== undefined) {
                this.echo(new String(result));
            }
        } catch(e) {
            this.error(new String(e));
        }
    } else {
        this.echo('');
    }
}, {
    greetings: 'Test VObject here',
    name: 'js_demo',
    prompt: 'v-obj:: > '
});


function blah() {
    // try typing model in the console in the right.
    var model = (new VObject)
    model.source({
        prp1: 90,
        prp2: 'Hello',
        prp3: 'Something Else',
        prp4: 90.19,

        prp5: {
            anArray: [1,2,3,4,5],
            somethingElse: {}
        }
    });


    return function execute(varName: string) {

    }
}