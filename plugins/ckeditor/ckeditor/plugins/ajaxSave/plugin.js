(function() {
    var saveCmd =
    {
        modes: { wysiwyg: 1, source: 1 },
        exec: function(editor) {
            ckeditor_ajaxSave(editor);
        }
    };
    var pluginName = 'ajaxSave';
    CKEDITOR.plugins.add(pluginName,
    {
      init: function(editor) {
          var command = editor.addCommand(pluginName, saveCmd);
          editor.ui.addButton('AjaxSave',
         {
             label: editor.lang.save,
             command: pluginName,
             icon: SETTINGS.scriptPath+"plugins/ckeditor/ckeditor/plugins/ajaxSave/save.png"
         });
      }
  });
})();