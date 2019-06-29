$(function(){
    seditor = CodeMirror.fromTextArea(smallbox, {
        mode: "python",
        lineNumbers: true,
        theme: "mbo",
    });
    seditor.setSize("70%", "100%");
    seditor.getWrapperElement().style.float = "right";
    seditor.refresh();
});