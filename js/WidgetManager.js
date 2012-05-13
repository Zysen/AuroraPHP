function WidgetManager(){
    this.widgets = new Array();
    this.add = function(widget){
        this.widgets.push(widget);
    }
    this.load = function(){
        for(index in this.widgets){
            var widget = this.widgets[index];
            widget.loader();
        }
    }
    this.clear = function(){
        this.widgets = new Array();     
    }
}