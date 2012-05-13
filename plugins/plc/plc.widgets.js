/*

Behaviours
 - plcGetDevice
 - plcPollGroups
 - plcGetDeviceRows
 - plcGetMachineCode
 - plcLog    

*/                                                           
function PLCContinuousDeviceDataGraph(instanceId, data){
    var behaviour = (data.table==undefined)?"plcGetDeviceRows":data.table;   
    var wordR = DATA.getRemote(behaviour, data.device, NOT_READY, POLL_RATES.FAST);
    var newData = {dataB: wordR.behaviour, title: "Status", device: data.device, placeholder: data.placeholder};
    var graphWidget = new GoogleDyGraphWidget(instanceId+"_piegraph", newData);
    this.loader=function(){
        graphWidget.loader();
    }
 
    this.destroy=function(){
        graphWidget.destroy();
    }
    this.build=function(){                    
        return graphWidget.build();
    }
}    
function PLCMachineStatusPieGraph(instanceId, data){    
    var context = jsonSANITIZE(jQuery.toJSON([data.startTime, data.endTime, data.daysAgo, data.deviceAddress]));            
    var dataR = DATA.getRemote("plcGetShift", context, NOT_READY, POLL_RATES.FAST);
    var graphWidget = new GooglePieChartWidget(instanceId+"_piegraph", jQuery.extend({behaviour: dataR.behaviour, title: data.title, width: 800, height: 500}, data));
    this.loader=function(){
        graphWidget.loader();                      
    }
 
    this.destroy=function(){
        graphWidget.destroy();
    }
    this.build=function(){                    
        return graphWidget.build();
    }
}  


widgetTypes['PLCMachineStatusPieGraph']=PLCMachineStatusPieGraph;
widgetTypes['PLCContinuousDeviceDataGraph']=PLCContinuousDeviceDataGraph; 