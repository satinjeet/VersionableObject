import VObject from "./index";
import * as CodeMirror from "codemirror";
import 'codemirror/mode/javascript/javascript';

//
// // add styleActiveLine to CodeMirror.EditorConfiguration:
// declare module "codemirror" {
//     interface EditorConfiguration {
//         //  when set to true, adds 'CodeMirror-activeline' and
//         // 'CodeMirror-activeline-background' to the current line
//         // styleActiveLine?: boolean;
//     }
// }


let sandBox: Function = function(): any {
    return null
};

document.querySelector('#run').addEventListener('click', function(e) {
    e.preventDefault();
    let code: string = editor.getValue();

    sandBox = getScope(code);
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



function getScope(code: string) : Function {
    let regex = new RegExp("([$0-9a-zA-Z]+) ?=", "gmi");
    let found;
    let scope = "let scope = {};";
    while(found = regex.exec(code)) {
        regex.lastIndex = found.index + found[0].length;
        scope += `scope["${found[1]}"] = ${found[1]};`;
    }
    let fnTemplate: string = `
    
    // actual code
    ${code};
    // code end
    
    ${scope}
    
    return function execute(varName) {
        return scope[varName];
    }
`;
    return (new Function(fnTemplate))();
}


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