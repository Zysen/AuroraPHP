(function() {
    var getPlaceholder = function(editor, widType, dataString){
        var abbr = editor.document.createElement('img');
        abbr.setAttribute('src', SETTINGS.scriptPath+"resources/noWidget.png");
        abbr.setAttribute('width', 350);
        abbr.setAttribute('height', 250);
        abbr.setAttribute('class', "widget_"+widType);
        if(dataString!=undefined)
            abbr.setAttribute('alt', dataString);
        return abbr;
    };
    var saveCmd =
    {
        modes: { wysiwyg: 1, source: 1 },                    
        exec: function(editor) {
            var sel = editor.getSelection();
            var element = sel.getStartElement();
            if(element.$!=undefined&&element.$.className.contains("widget_")){
                var altText = element.$.alt.replaceAll("'", "\"");
                if(altText!="{}"){
                    var tagName = element.$.className.replace("widget_", "");
                    var existingData = JSON.parse(altText);
                    var optionsDef = WIDGETS.getWidgetInterface(tagName);
                    if(optionsDef!=undefined){
                        var options = new optionsDef();
                        var interfaceElements = WIDGETS.renderWidget(options, JSON.parse(altText));
                        UI.confirm("Please Configure Your Widget", interfaceElements,"OK", function(arg){
                            var data = options.getData(); 
                            var dataString = JSON.stringify(data).replaceAll("\"", "'");
                            element.setAttribute( "alt", dataString);
                        },
                        "Cancel",
                        function(arg){
                        }); 
                    }
                }
            }
            else{

            
            var editorHTML = [];
            for(widType in WIDGETS.getWidgetTypes()){
                    var optionsDef = WIDGETS.getWidgetInterface(widType);
                    if(optionsDef!=undefined){
                        var options = new optionsDef();
                        //var image = WIDGETS.getImage(options);
                        var image = options.getImage();
                        var description = options.getDescription();
                        var name = options.getName();
                        var img = (image!=undefined)?"<img src=\""+image['src']+"\" style=\"float: right; width: 100px;\" alt=\"\" />":"";
                        editorHTML.push({value: widType, display: "<div class=\"dialogHeading\">"+name+"</div>"+img+description+"<div style=\"width: 100%; clear: both;\"></div>"});
                    }
            }
            var HTMLSelectWidgetDef = WIDGETS.getWidgetDef("HTMLSelectWidget");
            var selectionWidgetW = new HTMLSelectWidgetDef("aurora_widgetSelector", {dataB: createBehaviour(editorHTML)});

            UI.confirm("Please Select Your Widget", WIDGETS.buildWidget(selectionWidgetW),"OK", function(arg){
                var widType = selectionWidgetW.selectedValue();
                var optionsDef = WIDGETS.getWidgetInterface(widType);
                if(optionsDef!=undefined){
                    var options = new optionsDef();
                    var interfaceElements = WIDGETS.renderWidget(options);
                    if(interfaceElements==undefined||interfaceElements==null){
                        editor.insertElement(getPlaceholder(editor, widType));
                    }
                    else{
                        interfaceElements = (typeof(interfaceElements)=='string')?interfaceElements:interfaceElements.innerHTML;
                        UI.confirm("Please Configure Your Widget", interfaceElements,"OK", function(arg){
                            var data = options.getData();
                            var jsonString = JSON.stringify(data);
                            var dataString = jsonString.replaceAll("\"", "'");//.replace('"', "'").replace('&quot;', '\''); 
                            editor.insertElement(getPlaceholder(editor, widType, dataString));
                        }, "Cancel", function(arg){});
                    }
                }
                else{
                    editor.insertElement(getPlaceholder(editor, widType));
                }
            },
            "Cancel",
            function(arg){
                
            },
            false,
            function(){
                WIDGETS.loadWidget(selectionWidgetW);
            });
            
            
            }   
        }
    };
    var pluginName = 'auroraWidgets';
    CKEDITOR.plugins.add(pluginName,
    {
      init: function(editor) {
          var command = editor.addCommand(pluginName, saveCmd);
          editor.ui.addButton('auroraWidgetSelector',{
                 label: "Add Widget",
                 command: pluginName,
                 icon: SETTINGS.scriptPath+"plugins/ckeditor/ckeditor/plugins/auroraWidgets/save.png"
          });
            if (editor.contextMenu){
                editor.addMenuGroup( 'Widgets' );
                editor.addMenuItem( 'editWidget',
                {
                    label : 'Edit Widget',
                    icon : SETTINGS.scriptPath+"plugins/ckeditor/ckeditor/plugins/auroraWidgets/save.png",
                    command : pluginName,
                    group : 'Widgets'
                });
                editor.contextMenu.addListener( function( element ){
                    if (element)
                        element = element.getAscendant( 'img', true );
                    if (element && !element.isReadOnly() && !element.data( 'cke-realelement' ) ){
                         return { editWidget : CKEDITOR.TRISTATE_OFF };
                    }
                    return null;
                });
            }
      }
  }); 
})();