
$(function(){
    editor = CodeMirror.fromTextArea(codebox, {
        mode: "python",
        lineNumbers: true,
        theme: "mbo",
    });
    editor.setSize("66vw", "22vw");

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

function LabModel(){
    self = this;
    self.api_url = "api/problem";
    self.problem = null;

    self.init = function(){
        app.ajax(self.api_url + "/1", 'GET').done(function(data){
            console.log(data.problem);
            self.problem = new ProblemData(data.problem);
            console.log(self.problem.instructions());
        });
    }
}

function ProblemData(data){
    var self = this;
    self.id = ko.observable(data?data.id:0);
    self.instructions = ko.observable(data?data.instructions:"");
    self.starter_code = ko.observable(data?data.starter_code:"");
    self.title = ko.observable(data?data.title:"");
    self.weight = ko.observable(data?data.weight:0);
}

var LabModel = new LabModel();
LabModel.init();
ko.applyBindings(LabModel);