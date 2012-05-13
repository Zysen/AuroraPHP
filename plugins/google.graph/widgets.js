/*function GoogleGraphGuageWidget(instanceId, data){
    var divId = instanceId+"_container";
    var device = data.device;
    this.loader=function(){
    var wordR = DATA.getRemote("plcGetDevice", device);
         var options = {
              width: 300, height: 300,
              redFrom: 90, redTo: 100,
              yellowFrom:75, yellowTo: 90,
              minorTicks: 5
            };
         var data = new google.visualization.DataTable();
            data.addColumn('string', 'Label');
            data.addColumn('number', 'Value');
            data.addRows([
                  [device+"", 0]
                ]);
         
         var chartB = googleReadyB.liftB(function(value){
            if(value==NOT_READY)
                return NOT_READY;
            return new google.visualization.Gauge(document.getElementById(divId));
         });
         
         liftB(function(row, chart){
            
            if(row==NOT_READY||chart==NOT_READY)
                return NOT_READY;
            data.setValue(0, 1, row.value);  
            chart.draw(data, options);   
         }, wordR.behaviour, chartB);   
    }
 
    this.destroy=function(){
    }
    this.build=function(){
        return "<div id=\""+divId+"\" style=\"margin-bottom: 20px;\">&nbsp;</div>";
    }
}    */



/*function GoogleLineGraphWidget(instanceId, data){
    var divId = instanceId+"_container";
    this.loader=function(){ 
         var wordR = DATA.getRemote("plcGetDevice", "D100");   
        var options = {
          height: 400,
          title: 'D0'
        };
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Timestamp');
        data.addColumn('number', 'D0');
        
         var chartB = googleReadyB.liftB(function(value){
            return new google.visualization.LineChart(document.getElementById(divId));

         });
         
         deviceB = wordR.behaviour;
         deviceB.liftB(function(row, chart){
            data.addRows([                           
              [row.timestamp, row.value]
            ]);  
            chart.draw(data, options);   
         }, deviceB, chartB);   
    }
 
    this.destroy=function(){
    }
    this.build=function(){
        return "<div id=\""+divId+"\"  style=\"margin-bottom: 20px;\">&nbsp;</div>";
    }
}  */

/*function GoogleAnnodatedTimeLineWidget(instanceId, data){
    var divId = instanceId+"_container";
    this.loader=function(){ 
    var wordR = DATA.getRemote("plcGetDevice", "D100");
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Timestamp');
        data.addColumn('number', 'D0');
         var chartB = googleReadyB.liftB(function(value){
            return new google.visualization.AnnotatedTimeLine(document.getElementById(divId)); 

         });
         var oldDeviceDrawnB = liftB(function(oldDeviceData, chart){
            if(oldDeviceData==NOT_READY)
                return false;
            for(index in oldDeviceData){
                row = oldDeviceData[index];
                data.addRows([
                  [mysqlDateToJS(row.timestamp), row.value]      //new Date(2008, 1 ,1)  new Date()
                ]);
            }
            log("Written old data to graph");
            chart.draw(data, {displayAnnotations: false, allowRedraw: true});
            return true;
         }, wordR.behaviour, chartB);   
    }
 
    this.destroy=function(){
    }
    this.build=function(){
        return "<div id=\""+divId+"\" style=\"width: 100%; height: 400px; margin-bottom: 20px;\">&nbsp;</div>";
    }
} */                                                            

function GoogleDyGraphWidget(instanceId, data){
    var divId = instanceId+"_container";
    this.loader=function(){ 
        var csvDataB = liftB(function(deviceData){
            if(deviceData==NOT_READY)
                return NOT_READY;  
            return AuroraTableToCSVTable(deviceData);
        }, data.dataB);
        
        liftB(function(csvData){
            if(csvData==NOT_READY){
                return NOT_READY;
            }
             g = new Dygraph(document.getElementById(divId),csvData);
        }, csvDataB);          
          
    }
 
    this.destroy=function(){
    }
    this.build=function(){
        return "<div id=\""+divId+"\" style=\"width: 100%; background-color: #FFFFFF;\">&nbsp;</div>";
    }
}

   

function GooglePieChartWidget(instanceId, data){
    var divId = instanceId+"_container";
    this.loader=function(){                         
        liftB(function(dataTable, googleReady){
        
            if(dataTable==NOT_READY||googleReady==NOT_READY)
                return NOT_READY;      
            googleTable = AuroraTableToGoogleTable(dataTable);            
            var options = {
              width: (data.width==undefined)?1000:data.width, height: (data.height==undefined)?800:data.height,
              title: (dataTable.TITLE==undefined)?"":data.title+" "+dataTable.TITLE
            };
            var chart = new google.visualization.PieChart(document.getElementById(divId));
            chart.draw(googleTable, options);
        }, data.behaviour, googleReadyB);                                                  

        
    }
 
    this.destroy=function(){
    }
    this.build=function(){
        return "<div style=\"text-align: center;\"><div id=\""+divId+"\" style=\"margin: 0 auto;\">&nbsp;</div></div>";
    }
}
function GoogleTableWidgetB(behaviour, targetDiv){
        liftB(function(data, googleReady){
            if(data!=NOT_READY){
                var table = new google.visualization.Table(document.getElementById(targetDiv));
                data = AuroraTableToGoogleTable(data); 
                table.draw(data, {showRowNumber: false});
            }
        }, behaviour, googleReadyB);
                                
}
               
widgetTypes['GooglePieChartWidget']=GooglePieChartWidget;                                 
widgetTypes['GoogleDyGraphWidget']=GoogleDyGraphWidget;


/*widgetTypes['GoogleAnnodatedTimeLineWidget']=GoogleAnnodatedTimeLineWidget;
widgetTypes['GoogleLineGraphWidget']=GoogleLineGraphWidget;  
widgetTypes['GoogleGraphGuageWidget']=GoogleGraphGuageWidget;*/