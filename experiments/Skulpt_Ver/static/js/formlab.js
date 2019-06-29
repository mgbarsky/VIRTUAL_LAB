
$(function(){
    editor = CodeMirror.fromTextArea(codebox, {
        mode: "python",
        lineNumbers: true,
        theme: "mbo",
    });
    editor.setSize("40vw", "18vw");
    editor.refresh();
});

function outf(text) {
    var mypre = document.getElementById("output");
    mypre.innerHTML = mypre.innerHTML + text;
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function run() {
    let prog = editor.getValue();
    //let json = {data: prog};
    //alert(json.data);
    let mypre = document.getElementById("output");
    mypre.innerHTML = '';
    Sk.pre = "output";
    Sk.configure({ output: outf, read: builtinRead });
    let myPromise = Sk.misceval.asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then((mod) => {
        console.log('success');
    },
    function (err) {
        mypre.innerHTML = err.toString();
    });
    //editor.getDoc().setValue(json.data + "\nprint(\"Goodbye World\")");
}
