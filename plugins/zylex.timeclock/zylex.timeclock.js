goog['require']('F');
function getClientLocationE(){
    var locationUpdateE = F.receiverE();
    if (navigator['geolocation']){
    (navigator['geolocation']['getCurrentPosition'])( 
        function (position) {  
            locationUpdateE.sendEvent({position: [position.coords.latitude,position.coords.longitude], error: ""});
        }, 
        // next function is the error callback
        function (error)
        {
            switch(error.code) 
            {
                case error['TIMEOUT']:
                    locationUpdateE.sendEvent({position: undefined, error: 'Timeout'});
                    break;
                case error['POSITION_UNAVAILABLE']:
                    locationUpdateE.sendEvent({position: undefined, error: 'Position unavailable'});
                    break;
                case error['PERMISSION_DENIED']:
                    locationUpdateE.sendEvent({position: undefined, error: 'Permission denied'});
                    break;
                case error['UNKNOWN_ERROR']:
                    locationUpdateE.sendEvent({position: undefined, error: 'Unknown error'});          
                    break;
            }
        }
        );
    }
    return locationUpdateE;
}

/**
 *  TimeClockWidget
 * @constructor
 */
function TimeClockWidget(instanceId, data){
    var id = instanceId+"_container";
    var dayOnButton = createButton("Shift Start", "TimeClockWidgetButton");
    var dayOffButton = createButton("Shift End", "TimeClockWidgetButton");
    var breakOnButton = createButton("Break Start", "TimeClockWidgetButton");
    var breakOffButton = createButton("Break End", "TimeClockWidgetButton");
    var container = document.createElement("div", "TimeClockWidgetButton");
    //container.id = id;
    dayOnButton.id = instanceId+"dayone";
    dayOffButton.id = instanceId+"dayoff";
    breakOnButton.id = instanceId+"breakon";
    breakOffButton.id = instanceId+"breakoff";
    
    container.appendChild(dayOnButton);
    
    container.appendChild(breakOnButton);
    container.appendChild(breakOffButton);
    container.appendChild(dayOffButton);
    container.className = "TimeClockWidget";
    this.loader=function(){
        var showDisabledButtonsB = F.constantB((data["showDisabled"]!=undefined)?data["showDisabled"]:true);
        var clientLocationE = getClientLocationE();
        var clientLocationB = clientLocationE.startsWith(NOT_READY);
        jQuery(".TimeClockWidgetButton").button();
        //jQuery("#"+dayOnButton.id).button("disable");  
        //jQuery("#"+dayOnButton.id).attr("disabled", "disabled"/*(onWorking)?"disabled":"enabled"*/);  
        var timeDataR = DATA.getRemote("zylex_timeclock", "", NOT_READY, POLL_RATES.VERY_FAST);       
        var timeDataB = timeDataR.behaviour;
        var tableAndLocationB = F.liftB(function(tableData, clientLocation){
            if(tableData==NOT_READY||clientLocation==NOT_READY)
                return NOT_READY;
            //log("tableAndLocationB");
            return {data: tableData, location: clientLocation.position, error: clientLocation.error};
        }, timeDataR.behaviour, clientLocationB);
        //liftB(function(trigger){}, triggerB);
        var dayOnClickedE =  F.extractEventE(instanceId+"dayone","click");
        var dayOffClickedE = F.extractEventE(instanceId+"dayoff","click");
        var breakOnClickedE = F.extractEventE(instanceId+"breakon","click");
        var breakOffClickedE = F.extractEventE(instanceId+"breakoff","click");

        dayOnClickedE.snapshotE(tableAndLocationB).mapE(function(tableAndLocation){
            var newTable = tableAndLocation.data; 
            if(tableAndLocation.location==undefined){
                newTable["DATA"].push([-1, -1, "", "DAY_START", "", "", tableAndLocation.error]);
            }
            else{
                newTable["DATA"].push([-1, -1, "", "DAY_START", tableAndLocation.location[0], tableAndLocation.location[1], ""]);
            }
            timeDataB.sendEvent(newTable); 
            UI.showMessage("Success", "You have clocked ON for the day");   
        });
        
        dayOffClickedE.snapshotE(tableAndLocationB).mapE(function(tableAndLocation){
            var newTable = tableAndLocation.data; 
            if(tableAndLocation.location==undefined){
                newTable["DATA"].push([-1, -1, "", "DAY_END", "", "", tableAndLocation.error]);
            }
            else{
                newTable["DATA"].push([-1, -1, "", "DAY_END", tableAndLocation.location[0], tableAndLocation.location[1], ""]);
            }
            timeDataB.sendEvent(newTable); 
            UI.showMessage("Success", "You have clocked OFF for the day");       
        });
        
        breakOnClickedE.snapshotE(tableAndLocationB).mapE(function(tableAndLocation){
            var newTable = tableAndLocation.data; 
            if(tableAndLocation.location==undefined){
                newTable["DATA"].push([-1, -1, "", "BREAK_START", "", "", tableAndLocation.error]);
            }
            else{
                newTable["DATA"].push([-1, -1, "", "BREAK_START", tableAndLocation.location[0], tableAndLocation.location[1], ""]);
            }
            timeDataB.sendEvent(newTable);
            UI.showMessage("Success", "You have clocked OFF for a break");
        });
        
        breakOffClickedE.snapshotE(tableAndLocationB).mapE(function(tableAndLocation){
            var newTable = tableAndLocation.data; 
            if(tableAndLocation.location==undefined){
                newTable["DATA"].push([-1, -1, "", "BREAK_END", "", "", tableAndLocation.error]);
            }
            else{
                newTable["DATA"].push([-1, -1, "", "BREAK_END", tableAndLocation.location[0], tableAndLocation.location[1], ""]);
            }
            timeDataB.sendEvent(newTable);
            UI.showMessage("Success", "You have clocked back ON after a break");    
        });                                                                                                       
        
        var lastEventTypeB = timeDataB.liftB(function(timeData){
            if(timeData==NOT_READY)
                return NOT_READY;  
            if(timeData["DATA"].length==0){
                return undefined;    
            }      
            return getTableValue(timeData, 0, "type");
        });                                        
        F.liftB(function(lastEventType, showDisabledButtons){
            if(showDisabledButtons){
                jQuery("#"+dayOnButton.id).button((lastEventType!="DAY_END"&&lastEventType!=undefined)?"disable":"enable");
                jQuery("#"+dayOffButton.id).button((lastEventType!="DAY_START"&&lastEventType!="BREAK_END")?"disable":"enable");
                jQuery("#"+breakOnButton.id).button((lastEventType!="DAY_START"&&lastEventType!="BREAK_END")?"disable":"enable"); 
                jQuery("#"+breakOffButton.id).button((lastEventType!="BREAK_START")?"disable":"enable");  
            }
            else{
                jQuery("#"+dayOnButton.id).css('display', (lastEventType!="DAY_END"&&lastEventType!=undefined)?"none":"inline");
                jQuery("#"+dayOffButton.id).css('display', (lastEventType!="DAY_START"&&lastEventType!="BREAK_END")?"none":"inline");
                jQuery("#"+breakOnButton.id).css('display', (lastEventType!="DAY_START"&&lastEventType!="BREAK_END")?"none":"inline");
                jQuery("#"+breakOffButton.id).css('display', (lastEventType!="BREAK_START")?"none":"inline");
            }
        },lastEventTypeB, showDisabledButtonsB);            
    }
    this.destroy=function(){        
        //DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return container;
    }                         
}     






/**
 *  ShiftStatusWidget
 * @constructor
 */
function ShiftStatusWidget(instanceId, data){
    this.loader=function(){
        var timeDataR = DATA.getRemote("zylex_timeclock", "", NOT_READY, POLL_RATES.VERY_FAST);       
        var timeDataB = timeDataR.behaviour;
        var lastEventTypeB = timeDataB.liftB(function(timeData){
            if(timeData==NOT_READY || timeData["DATA"].length==0)
                return NOT_READY;        
            return getTableValue(timeData, 0, "type");
        });                                
        var statusB = F.liftB(function(lastEventType){
                if(lastEventType=="DAY_END"){
                    return "Off Shift";
                }
                else if(lastEventType=="DAY_START"||lastEventType=="BREAK_END"){
                    return "On Shift";
                }
                else if(lastEventType=="BREAK_START"){
                    return "On Break";
                }
                return "...";
        },lastEventTypeB);
        F.insertDomB(statusB, instanceId+"_container");
    }
    this.destroy=function(){}
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">"+window['SETTINGS']['user'].username+"</span>"; 
    }                         
}

/**
 *  ShiftStatusWidgetConfigurator
 * @constructor
 */
function ShiftStatusWidgetConfigurator(){
    this['render'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "Shift Status Widget";
    }
    this['getDescription'] = function(){
        return "Text showing the current users shift status";
    }
    this['getImage'] = function(){}
} 
WIDGETS.register("ShiftStatusWidget", ShiftStatusWidget, ShiftStatusWidgetConfigurator); 

/**
 *  TimeClockWidgetConfigurator
 * @constructor
 */
function TimeClockWidgetConfigurator(){
    var id = "TimeClockWidget";
    this['render'] = function(newData){
        return undefined;
        //var targetName = (newData!=undefined&&newData.targetName!=undefined)?newData.targetName:"";
        //return "Target Name: <input type=\"text\" id=\""+id+"\" value=\""+targetName+"\" />";  
    }
    this['getData'] = function(){
        return {targetName: document.getElementById(id).value};
    }
    this['getName'] = function(){
        return "Time Clock Widget";
    }
    this['getDescription'] = function(){
        return "A widget that provides controls to track hours";
    }
    this['getImage'] = function(){
       /* var img = document.createElement("img");
        img.src = "plugins/zylex.timeclock/clock.png";
        img.alt = "";
        return img;   */
    }
}
WIDGETS.register("TimeClockWidget", TimeClockWidget, TimeClockWidgetConfigurator);

/**
 *  TimeClockTableWidget
 * @constructor
 */
function TimeClockTableWidget(instanceId, data){
    var id = instanceId+"_container";
    this.loader=function(){
        var timeDataR = DATA.getRemote("zylex_timeclock", "", NOT_READY, POLL_RATES.VERY_FAST);
        var tableBI = TableWidgetB(instanceId+"_table", data, timeDataR.behaviour);   
        F.insertDomB(tableBI, id);                
    }
    this.destroy=function(){        
        DATA.deregister("zylex_timeclock", "");     
    }
    this.build=function(){
        return "<span id=\""+id+"\">&nbsp;</span>";
        //return "<div id=\""+id+"\" style=\"border: solid 1px #FF0000;\">&nbsp;</div>"; 
    }                         
}     

/**
 *  TimeClockTableWidgetConfigurator
 * @constructor
 */
function TimeClockTableWidgetConfigurator(){
    var id = "Time Clock Table";
    this['render'] = function(newData){
        return undefined;
        //var targetName = (newData!=undefined&&newData.targetName!=undefined)?newData.targetName:"";
        //return "Target Name: <input type=\"text\" id=\""+id+"\" value=\""+targetName+"\" />";  
    }
    this['getData'] = function(){
        return {targetName: document.getElementById(id).value};
    }
    this['getName'] = function(){
        return "Time Clock Table";
    }
    this['getDescription'] = function(){
        return "A widget that provides controls to track hours";
    }
    this['getImage'] = function(){
                      /*        var img = document.createElement("img");
        img.src = "plugins/zylex.timeclock/clock.png";
        img.alt = "";
        return img;  */
    }
}
WIDGETS.register("TimeClockTableWidget", TimeClockTableWidget, TimeClockTableWidgetConfigurator);


/**
 *  TimeClockHoursWorkedWidget
 * @constructor
 */
function TimeClockHoursWorkedWidget(instanceId, data){
    var id = instanceId+"_container";
    this.loader=function(){ 
        var timeDataR = DATA.getRemote("zylex_timeclock", "", NOT_READY, POLL_RATES.VERY_FAST);
        var databaseNowR = DATA.getRemote("zylex_timeclock_now", "", NOT_READY, POLL_RATES.VERY_FAST);
        var timeDataB = timeDataR.behaviour;
        var hoursWorkedB = F.liftB(function(timeData, databaseNow){
            if(timeData==NOT_READY||databaseNow==NOT_READY)
                return 0;
            var time = parseMysqlDate(databaseNow);
            var lastType="";
            var lastTimestamp="";
            var totalDiff = 0;
            for(var rowIndex in timeData["DATA"]){
                var timestamp = getTableValue(timeData, rowIndex, "timestamp");
                var type = getTableValue(timeData, rowIndex, "type");
                if((rowIndex==0&&(type=="DAY_START" || type=="BREAK_END"))){
                    var thisTS = parseMysqlDate(timestamp);
                    var diff = time.getTime()-thisTS.getTime();
                    totalDiff+=diff;
                }
                else if((lastType=="DAY_END"&&(type=="DAY_START"||type=="BREAK_END"))||(lastType=="BREAK_START"&&(type=="DAY_START"||type=="BREAK_END"))){
                    var thisTS = parseMysqlDate(timestamp);
                    var lastTS = parseMysqlDate(lastTimestamp);
                    totalDiff+=(lastTS.getTime()-thisTS.getTime());    
                }                                                 
                if(type=="DAY_START"){
                    break;
                }
   //             function getTableValue(table, rowIndex, columnName)
   // var colIndex = getColumnIndex(table, columnName);
            lastType = type;
            lastTimestamp = timestamp;        
            }
            return (totalDiff/1000/60/60).toPrecision(4);
            //Date.createFromMysql
        }, timeDataB, databaseNowR.behaviour);
        F.insertDomB(hoursWorkedB, id);          
    }
    this.destroy=function(){        
        DATA.deregister("zylex_timeclock", "");     
    }
    this.build=function(){
        return "<span id=\""+id+"\">&nbsp;</span>";
        //return "<div id=\""+id+"\" style=\"border: solid 1px #FF0000;\">&nbsp;</div>"; 
    }                         
}     
/**
 *  TimeClockHoursWorkedWidgetConfigurator
 * @constructor
 */
function TimeClockHoursWorkedWidgetConfigurator(){
    var id = "Time Clock Hours Worked";
    this['render'] = function(newData){
        return undefined;
        //var targetName = (newData!=undefined&&newData.targetName!=undefined)?newData.targetName:"";
        //return "Target Name: <input type=\"text\" id=\""+id+"\" value=\""+targetName+"\" />";  
    }
    //f
    this['getData'] = function(){
        return {targetName: document.getElementById(id).value};
    }
    this['getName'] = function(){
        return "Time Clock Hours Worked";
    }
    this['getDescription'] = function(){
        return "A widget that shows how many hours have been worked in the last shift";
    }
    this['getImage'] = function(){}
}
WIDGETS.register("TimeClockHoursWorkedWidget", TimeClockHoursWorkedWidget, TimeClockHoursWorkedWidgetConfigurator);