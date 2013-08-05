/**
 *  WidgetManager
 * @constructor
 */
function WidgetManager(){
	this.instances = {};
    this.widgetTypes=new Array(); 
    this.widgetInterface=new Array();
    this.widgets = new Array();
    this.register = function(name, classDef, configInterface){
        this.widgetTypes[name] = classDef;
        if(configInterface!=undefined){
            this.widgetInterface[name] = configInterface;
        }
    }
    this.add = function(key, widget){
    	if(this.instances[key]===undefined){
    		this.instances[key] = [];
    	}
        this.instances[key].push(widget);
    }
    this.getInstanceId = function(key){
    	if(WIDGETS.instances[key]==undefined){
			WIDGETS.instances[key] = [];
		}
		return WIDGETS.instances[key].length+1;
    }
    this.load = function()
    {
    	for(var widgetKey in this.instances){
    		for(var index in this.instances[widgetKey]){
    			var widget = this.instances[widgetKey][index];
    			//try{
	    			if(widget.load!=undefined){
		           		widget.load();
		           	}
		           	else{
		           		widget.loader();
		            }
	          //  }
	         //   catch(e){
	         //   	log("Widgetmanager: "+widgetKey+" exception during load");
	          // 		log(e);
	          //  }
    		 }
    	}
    }
    this.clear = function(){
        this.widgets = new Array();     
    }
    this.findWidgetsInElement = function(element){
    	var recElements = [];
    	if(element.className && element.className.startsWith("widget_")){
    		recElements.push(element);
    	}
    	for(var index=0;index<element.childNodes.length;index++){
    		var child = element.childNodes[index];
    		recElements = recElements.concat(this.findWidgetsInElement(child));
    	}
    	return recElements;
    }
    //These method are for scripts that are not compiled. String keys are used to avoid abfuscation.
    this['getWidgetDef'] = function(str){
        return this.widgetTypes[str];
    }
    this['buildWidget'] = function(widget){
        return widget.build();
    }
    this['renderWidget'] = function(widget, data){
        //log(widget);
        return (widget['build'])(data);
    }
    this['loadWidget'] = function(widget){
        return widget.loader();
    }
    this['getWidgetInterface'] = function(name){
        return this.widgetInterface[name];
    }
    this['getWidgetTypes'] = function(){
        return this.widgetTypes;
    }
    this["loadConfigurator"] = function(widget, data){
        return widget.load(data);
    }
    this["renderConfigurator"] = function(widget, data){
        return widget.build(data);
    }
    this["getDescription"] = function(widget){
        return widget.getDescription();
    }
    this["getName"] = function(widget){
        return widget.getName();
    }
    this["getData"] = function(widget){
        return widget.getData();
    }
}

