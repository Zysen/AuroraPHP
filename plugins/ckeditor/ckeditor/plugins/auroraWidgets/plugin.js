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
    var selectedWidget = undefined;
    var selectedWidType = undefined;
    var saveCmd =
    {
        modes: { wysiwyg: 1, source: 1 },                    
        exec: function(editor) {
            var sel = editor.getSelection();
            var element = sel.getStartElement();

            //IF EDITING WIDGET
            if(element.$!=undefined&&(element.$.alt!=undefined||element.$.title!=undefined)&&element.$.className.contains("widget_")){
                var altText = ((element.$.alt!=undefined)?element.$.alt:element.$.title).replaceAll("'", "\"");
                var tagName = element.$.className.replace("widget_", "");
                if(altText!="{}"){
                    var existingData = JSON.parse(altText);
                    existingData.placeholder = element.$;
                    var optionsDef = WIDGETS.getWidgetInterface(tagName);
                                        if(optionsDef!=undefined){
                                            var options = new optionsDef();
                                            var interfaceElements = WIDGETS.renderWidget(options, existingData);
                                            UI.confirm("Please Configure Your Widget", interfaceElements,"OK", function(arg){
                                                var newPlaceholder = options.getPlaceholder(editor);
                                                editor.insertHtml(newPlaceholder.$.outerHTML);
                                            },
                                            "Cancel",
                                            function(arg){
                                            }, true,
                                            function(){
                                            	options.load(existingData);
                                            }); 
                                        }
                }
            }
            else{
            var packages = {};
            var widgetDefinitions = {};
            var editorHTML = [];
            for(widType in WIDGETS.getWidgetTypes()){
                    var optionsDef = WIDGETS.getWidgetInterface(widType);
                    try{
	                    if(optionsDef!=undefined){
	                        var options = new optionsDef();
	                        var description = options.getDescription();
	                        var name = options.getName();
	                        var packageName = options.getPackage();
	                        if(packages[packageName]==undefined){
	                        	packages[packageName] = {};
	                        }
	                        packages[packageName][widType]=name;
	                        widgetDefinitions[widType+""] = {name: name, description:description, packageName:packageName};
	                        editorHTML.push({value: widType, display: "<div class=\"dialogHeading\">"+name+"</div>"+"<div style=\"width: 100%; clear: both;\">"+options.build()+"</div>"});
	                    }
                    }
                    catch(e){
                    	log("Widget Interface Error");
                    	log(e);
                    }
            }
            var listViewHtml = "<div id=\"widgetSelector\" style=\"text-align: left;\"><ul>";
            for(var packageName in packages){
            	var widgets = packages[packageName];
            	listViewHtml += "<li class=\"folder\">"+packageName+"<ul>";
            	for(var widType in widgets){
            		var widgetName = widgets[widType];
            		listViewHtml+="<li id=\""+widType+"\" class=\"ckeditor_widgetSelection\">"+widgetName+"</li>";
            	}
            	listViewHtml+="</ul></li>";
            }
            listViewHtml+="</ul></div>";
            var HTMLSelectWidgetDef = WIDGETS.getWidgetDef("HTMLSelectWidget");
            var selectionWidgetW = new HTMLSelectWidgetDef("aurora_widgetSelector", {dataB: createBehaviour(editorHTML)});
			var pageHTML = "<table id=\"widgetSelectionTable\" height=\"100%\"><tr><td id=\"widgetTreePanel\" valign=\"top\">"+listViewHtml+"</td><td id=\"widgetDescription\" valign=\"top\">Please browse through the widget tree in the left panel. Information and configuration options will appear in this panel when a widget is selected.</td></tr></table>";
			//WIDGETS.buildWidget(selectionWidgetW)
			var widType = undefined;
            UI.confirm("Widget Browser", pageHTML,"Add to Page", function(arg){
                var widType = selectedWidType;
                if(widType==undefined){
                	return;
                }
                if(selectedWidget!=undefined){
                	var selectedData = selectedWidget.getData();
                	var dataString = "{}";
                	if(selectedData!=undefined){
                		try{
                			var dataString = JSON.stringify(selectedData).replaceAll("\"", "'");	
                		}
                		catch(e){log(e);}
                	}   
                	if(selectedWidget.getPlaceholder==undefined){       
		            	editor.insertElement(getPlaceholder(editor, widType, dataString));
	                }   
	                else{
	                	editor.insertElement(selectedWidget.getPlaceholder(editor));
	                }              
                }
            },
            "Cancel",
            function(arg){
                
            },
            true,
            function(){
                //WIDGETS.loadWidget(selectionWidgetW);
                
                $("#widgetSelector").dynatree({
                	noLink: true,
		            onActivate: function(node) {
		                widType = node.data.key; //widgetDescription
		                var widget = widgetDefinitions[widType];
		                if(widget==undefined){
		                	jQuery(".ui-dialog-buttonpane button:contains('Add to Page')").button("disable");
		                }
		                else{
		                	var optionsDef = WIDGETS.getWidgetInterface(widType);
		                	var configurator = new optionsDef();
		                	selectedWidget = configurator;
		            		selectedWidType = widType;
		                	log("PRE BUILD");
		                	var renderData = configurator.build();
		                	log("MID BUILD");
		                	log(renderData);
		                	var renderData = (renderData==undefined)?"":renderData;
		                	log("POST BUILD");
		                	log(renderData);
		                	jQuery("#widgetDescription").html(renderData);//"<h2>"+widget.name+"</h2>"+widget.description+"<br /><br />"+
		                	//DOM.get("widgetDescription").innerHTML = image+"<h2>"+widget.name+"</h2>"+widget.description+render;
		            		jQuery(".ui-dialog-buttonpane button:contains('Add to Page')").button("enable");
		            		configurator.load();
		            		
		            	}
						//{name: name, description:description, image:image, packageName:packageName};
		            },
		            classNames: {
				        container: "dynatree-container",
				        node: "dynatree-node",
				        folder: "dynatree-folder",
				
				        empty: "dynatree-empty",
				        vline: "dynatree-vline",
				        expander: "dynatree-expander",
				        connector: "dynatree-connector",
				        checkbox: "dynatree-checkbox",
				        nodeIcon: "dynatree-icon",
				        title: "ckeditor_widgetSelection",
				        noConnector: "dynatree-no-connector",
				
				        nodeError: "dynatree-statusnode-error",
				        nodeWait: "dynatree-statusnode-wait",
				        hidden: "dynatree-hidden",
				        combinedExpanderPrefix: "dynatree-exp-",
				        combinedIconPrefix: "dynatree-ico-",
				        hasChildren: "dynatree-has-children",
				        active: "dynatree-active",
				        selected: "dynatree-selected",
				        expanded: "dynatree-expanded",
				        lazy: "dynatree-lazy",
				        focused: "dynatree-focused",
				        partsel: "dynatree-partsel",
				        lastsib: "dynatree-lastsib"
				    }
		        });
        
        
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