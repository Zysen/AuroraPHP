/*function PluginManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_plugins", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_plugins", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
widgetTypes['PluginManagerWidget']=PluginManagerWidget;*/

function CSRDemoTable(instanceId, data){
    this.loader=function(){
        var triggerB = DATA.getB("txTransmissionsRate");                    
        //var triggerB = triggerE.startsWith(NOT_READY);
        var tableBI = liftBI(
            function(trigger){
                if(trigger==NOT_READY||trigger==undefined)
                    return NOT_READY;
               log(trigger); 
                var data = trigger[0];

                var newTable = {DATA: data, COLUMNS: [{reference: "x", display: "X", type: "int", visible: true},{reference: "y", display: "Y", type: "int", visible: true}], TABLEMETADATA: {permissions: {canAdd: false, canDelete: false, canEdit: true}}, ROWMETADATA: [], CELLMETADATA: [], COLUMNMETADATA: []};

                return newTable;
            },
            function(v){
                return [[v.DATA]];
            }, triggerB);
        var tableWidgetBI = TableWidgetB(instanceId+"_table", data, tableBI);    
        insertDomB(tableWidgetBI, instanceId+"_container"); 
    }
    this.destroy=function(){
    
        //DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<div id=\""+instanceId+"_container\" style=\"border: solid 1px #FF0000;\">&nbsp;</div></div>"; 
    }
}     
widgetTypes['CSRDemoTable']=CSRDemoTable;