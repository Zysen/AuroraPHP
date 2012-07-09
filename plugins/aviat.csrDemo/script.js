/**
 *  GraphWidget
 * @constructor
 */
function GraphWidget(instanceId, data){
    var graphWidget = new JQPlotWidget(instanceId+"_graph", data);
    this.loader=function(){
        //var triggerB = DATA.getB(data['targetName']);
        var triggerB = DATA.getRemote("auroraDemo_intTable");
        /*var graphDataBI = F.liftBI(function(table){
            if(table==NOT_READY)
                return NOT_READY;
            for(var rowIndex=0;rowIndex<table.DATA.length;rowIndex++){
                var rowId = getTableValue(table, rowIndex, "dataPointId");
                table.DATA[rowIndex].splice(0, 1);     
                if(table.ROWMETADATA[rowIndex]==undefined)
                    table.ROWMETADATA[rowIndex] = {rowId: rowId};
                else
                    table.ROWMETADATA[rowIndex].rowId = rowId;
            }
            return table;
        }, function(table){
            if(table==NOT_READY)
                return NOT_READY;
            for(var rowIndex=0;rowIndex<table.DATA.length;rowIndex++){
                var rowId = table.ROWMETADATA[rowIndex].rowId;
                table.DATA[rowIndex].splice(0,0,rowId);
            }
            return [table];
        }, triggerB.behaviour); */
        graphWidget.loader(triggerB.behaviour);
          
        //triggerB.sendEvent([[[-1, 1, Math.floor(Math.random()*11)],[-1, 3,Math.floor(Math.random()*11)],[-1, 5,Math.floor(Math.random()*11)],-1, [7,Math.floor(Math.random()*11)],[-1, 9,Math.floor(Math.random()*11)],[-1, 11,Math.floor(Math.random()*11)]]]);       
    }
    this.destroy=function(){
        DATA.deregister("auroraDemo_intTable");
    }
    this.build=function(){
        return graphWidget.build(); 
    }
} 
/**
 *  GraphWidgetConfigurator
 * @constructor
 */
function GraphWidgetConfigurator(){
    var id1 = "GraphWidgetCont1";
    var id2 = "GraphWidgetCont2";
    var id3 = "GraphWidgetCont3";
    this['render'] = function(newData){
        var targetName = (newData!=undefined&&newData['targetName']!=undefined)?newData['targetName']:"";
        var title = (newData!=undefined&&newData['title']!=undefined)?newData['title']:"";
        var fontSize = (newData!=undefined&&newData['fontSize']!=undefined)?newData['fontSize']:"";
        return "Target Name: <input type=\"text\" id=\""+id1+"\" value=\""+targetName+"\"/><br />Title: <input type=\"text\" id=\""+id2+"\" value=\""+title+"\" /><br />Font Size: <input type=\"text\" id=\""+id3+"\" value=\""+fontSize+"\" />";  
    }
    this['getData'] = function(){
        var ob = {"targetName": document.getElementById(id1).value};
        var title = document.getElementById(id2).value;
        var fontSize = document.getElementById(id3).value;
        log("Title: "+title);
        if(title.length!=0)
            ob.title = title;
        if(fontSize.length!=0)
            ob.fontSize = fontSize; 
        return ob;
    }
    this['getName'] = function(){
        return "GraphWidget";
    }
    this['getDescription'] = function(){
        return "A line graph visual representation of a one or two-dimensional array of integers.";
    }
    this['getImage'] = function(){
        var img = document.createElement("img");
        img.src = "plugins/aviat.csrDemo/graph.png";
        img.alt = "";
        return img;
    }
}   
WIDGETS.register("GraphWidget", GraphWidget, GraphWidgetConfigurator);
/**
 *  IntergerTableWidget
 * @constructor
 */
function IntegerTableWidget(instanceId, data){
    this.loader=function(){
        //var triggerB = DATA.getB(data['targetName']);                    
        var triggerB = DATA.getRemote("auroraDemo_intTable");
        //var triggerB = triggerE.startsWith(NOT_READY);
        var tableBI = triggerB.behaviour;
        /*var tableBI = F.liftBI(
            function(trigger){
                if(trigger==NOT_READY||trigger==undefined)
                    return NOT_READY;
               //log(trigger); 
                //var data = trigger[0];         
                var data = [trigger.DATA];
               var newTable = {"DATA": data, "COLUMNS": [{"reference": "x", "display": "X", "type": "int", "visible": true},{"reference": "y", "display": "Y", "type": "int", "visible": true}], "TABLEMETADATA": {"permissions": {"canAdd": true, "canDelete": true, "canEdit": true}}, "ROWMETADATA": [], "CELLMETADATA": [], "COLUMNMETADATA": []};

                return newTable;
            },
            function(v){
                return [[v["DATA"]]];
            }, triggerB); */
        var tableWidgetBI = new TableWidgetB(instanceId+"_table", {"confirmChanges": true}, tableBI);    
        F.insertDomB(tableWidgetBI, instanceId+"_container"); 
        //triggerB.sendEvent([[[1, Math.floor(Math.random()*11)],[3,Math.floor(Math.random()*11)],[5,Math.floor(Math.random()*11)],[7,Math.floor(Math.random()*11)],[9,Math.floor(Math.random()*11)],[11,Math.floor(Math.random()*11)]]]);
   
    }
    this.destroy=function(){
                                                   
        //DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<div id=\""+instanceId+"_container\" style=\"border: solid 1px #FF0000;\">&nbsp;</div></div>"; 
    }                         
    this.editorData = {previewHTML: "An Example of an interactive Graph"};
}     
/**
 *  IntegerTableWidgetConfigurator
 * @constructor
 */
function IntegerTableWidgetConfigurator(){
    var id = "IntegerTableWidgetCont";
    this['render'] = function(newData){
        var targetName = (newData!=undefined&&newData['targetName']!=undefined)?newData['targetName']:"";
        return "Target Name: <input type=\"text\" id=\""+id+"\" value=\""+targetName+"\" />";  
    }
    this['getData'] = function(){
        return {"targetName": document.getElementById(id).value};
    }
    this['getName'] = function(){
        return "Integer TableWidget";
    }
    this['getDescription'] = function(){
        return "A one or two-dimensional table of integers. WIth controls to add, edit or delete data.";
    }
    this['getImage'] = function(){
        var img = document.createElement("img");
        img.src = "plugins/aviat.csrDemo/table.png";
        img.alt = "";
        return img;
    }
}
WIDGETS.register("IntegerTableWidget", IntegerTableWidget, IntegerTableWidgetConfigurator);