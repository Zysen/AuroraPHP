(function() {
    var saveCmd =
    {
        modes: { wysiwyg: 1, source: 1 },
        exec: function(editor) {
            afterCommit(editor);
        }
    };
    var pluginName = 'auroraCancel';
    CKEDITOR.plugins.add(pluginName,
    {
      init: function(editor) {
          var command = editor.addCommand(pluginName, saveCmd);
          editor.ui.addButton('AuroraCancel',
         {
             label: editor.lang.save,
             command: pluginName,
             icon: SETTINGS.scriptPath+"plugins/ckeditor/ckeditor/plugins/auroraCancel/cancel.png"
         });
      }
  });
})();