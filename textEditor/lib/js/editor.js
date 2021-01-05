//retrieve elemetns

const executeCodeBtn = document.querySelector('.editor__run')
const resetCodeBtn = document.querySelector('.editor__reset')



//setup ace
let codeEditor = ace.edit("editorCode");

let editorLib = {
    init() {
        //configure Ace 


        //Theme
        codeEditor.setTheme("ace/theme/dracula");
        codeEditor.session.setMode("ace/mode/c_cpp");
        codeEditor.setOptions({
            //fontFamily: "Inconsolata", // uncomment mat krna, ma chud jaegi code ki
            fontSize: "12pt",
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });
    }
}

// // Events
// executeCodeBtn.addEventListener("click", () => {
//     // get input from the coe editor
//     const userCode = codeEditor.getValue();


//     // Run the code
//     try {
//         new Function(userCode)();
//     } catch (err) {
//         console.log(err)
//     }
// });

editorLib.init()
