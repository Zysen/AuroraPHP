(function() {
    var saveCmd =
    {
        modes: { wysiwyg: 1, source: 1 },
        exec: function(editor) {
            //ckeditor_ajaxSave(editor);
            alert("AJAX SAVE");
        }
    };
    var pluginName = 'auroraWidgets';
    alert("RAR");
    CKEDITOR.plugins.add(pluginName,
    {
      init: function(editor) {
          alert(SETTINGS.scriptPath+"plugins/ckeditor/ckeditor/plugins/auroraWidgets/save.png");
          
          var command = editor.addCommand(pluginName, saveCmd);
          editor.ui.addButton('auroraWidgetSelector',
         {
             label: editor.lang.save,
             command: pluginName,
             icon: SETTINGS.scriptPath+"plugins/ckeditor/ckeditor/plugins/auroraWidgets/save.png"
         });
      }
  });
})();