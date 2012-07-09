/**
 *  WidgetManager
 * @constructor
 */
function WidgetManager(){
    this.widgetTypes=new Array(); 
    this.widgetInterface=new Array();
    this.widgets = new Array();
    this.register = function(name, classDef, configInterface){
        this.widgetTypes[name] = classDef;
        if(configInterface!=undefined){
            this.widgetInterface[name] = configInterface;
        }
    }
    this.add = function(widget){
        this.widgets.push(widget);
    }
    this.load = function()
    {
        for(index in this.widgets){
            var widget = this.widgets[index];
            widget.loader();
        }
    }
    this.clear = function(){
        this.widgets = new Array();     
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
        return (widget['render'])(data);
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
    this["renderConfigurator"] = function(widget, data){
        return widget.render(data);
    }
    this["getDescription"] = function(widget){
        return widget.getDescription();
    }
    this["getImage"] = function(widget){
        log(widget);
        return widget.getImage();
    }
    this["getName"] = function(widget){
        return widget.getName();
    }
    this["getData"] = function(widget){
        return widget.getData();
    }
}

