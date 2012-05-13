alert("Loaded the visualoze widget");
function jQueryVisualizeWidget(instanceId, data){
    var divId = instanceId+"_container";
    var tableId = instanceId+"_table";
    var table = document.createElement("table");
    var device = data.device;
    this.loader=function(){                           
         var dataR = DATA.getRemote("plcGetMachineStatus", device);
        var plcDeviceRowDataTableB = dataR.behaviour.liftB(function(dataTable){
            if(dataTable==NOT_READY)
                return NOT_READY;
            
            var header = document.createElement("th");
            header.appendChild(createDomElement("td", '', '', "Duration"));
            header.appendChild(createDomElement("td", '', '', "Status")); 
            table.appendChild(header);
            for(i=0;i<dataTable.length;i++){
                var row = document.createElement("tr");
                row.appendChild(document.createTextNode(row.duration));
                row.appendChild(document.createTextNode(row.status));
                table.appendChild(row);
            }
            return table;
        });
        plcDeviceRowDataTableB.liftB(function(data){
            if(data==NOT_READY)
                return document.createTextElement("Loading Graph");
            document.getElementById(tableId).appendChild(data);
            jQuery(table).visualize();
            return data;
        });     
        //insertDomB(data, divId);                                             
    }
 
    this.destroy=function(){
    }
    this.build=function(){
        return "<div id=\""+divId+"\">&nbsp;</div>";
    }
}               
widgetTypes['jQueryVisualizeWidget']=jQueryVisualizeWidget;                                 
