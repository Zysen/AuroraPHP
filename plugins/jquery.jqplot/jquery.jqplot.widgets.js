/**
 *  JQPlotWidget
 * @constructor
 */
function JQPlotWidget(instanceId, data){
    var title = (data["title"]==undefined)?"":data["title"];
    var showTitle = (data["showTitle"]==undefined)?true:data["showTitle"];
    var fontSize = (data["fontSize"]==undefined)?"15pt":data["fontSize"];
    var width = (data["width"]!=null)?data["width"]:data["placeholder"]["style"]["width"].replace('px', '');
    var height = (data["height"]!=null)?data["height"]:data["placeholder"]["style"]["height"].replace('px', '');
    
    
    var id = instanceId+"_container1";
    var id2 = instanceId+"_container2";                 
    var parent = this;
    this.loader=function(triggerB){
        jQuery.jqplot.config.enablePlugins = true;
        var plot = undefined;
        //var plot = jQuery.jqplot(id2,[[[0,0]]],options);
        var dragedE = jQuery("#"+id2).fj('jQueryBind', 'jqplotSeriesPointChange');
        var dragStoppedE = jQuery("#"+id2).fj('jQueryBind', 'jqplotDragStop');
        
       var options = {
                "title":{
                    "show": showTitle,
                    "text":title,
                    "fontSize":fontSize 
                },                                                              
                 "highlighter": {
                     "sizeAdjust": 10,
                     "tooltipLocation": 'n',
                     "tooltipAxes": 'y',
                     "tooltipFormatString": '<b><i><span style="color:red;">hello</span></i></b> %.2f',
                     "useAxesFormatters": false
                 },
                 "cursor": {
                     "show": true
                 },
                 "dragable": {
                 "color": '#FF0000',
                 "constrainTo": 'y'
                 },
                "series":[{"color":'#5FAB78'}]   
            };                  
            
        var lastEventB = F.mergeE(dragStoppedE, dragedE).mapE(function(event){
            return event[0].type;
        }).startsWith("jqplotDragStop");
                 
        var plotB = F.liftB(function(data, lastEvent){
                                    
            if(data==NOT_READY||lastEvent!="jqplotDragStop")
                return F.receiverE().startsWith(NOT_READY);
                                   
            var formattedData = [];
            for(var rowIndex=0;rowIndex<data.DATA.length;rowIndex++){  
                var rowId =  getTableRowId(data, rowIndex);
                var newRow = [];                         
                var dataRow = data.DATA[rowIndex];
                data.ROWMETADATA[rowIndex] = {"id":rowId};
                for(var colIndex=0;colIndex<data.COLUMNS.length;colIndex++){
                    var column = data.COLUMNS[colIndex];
                    var dataCell = dataRow[colIndex];
                    if(column.visible){
                        newRow.push(dataCell);  
                    }
                }
                formattedData[rowIndex] = newRow;
            }
            formattedData = [formattedData]; 
            
            
            if(plot==undefined)
                plot = jQuery.jqplot(id2,formattedData,options);   // [[[0,0]]]
            else{
                jQuery.jqplot(id2, formattedData,options).replot();
            }
            return {"plot": plot, "divId": id2};
        }, triggerB, lastEventB);
       
        
        var dragUpdatedDataB = F.liftB(function(dragEnd, trigger){
            if(dragEnd==NOT_READY||trigger==NOT_READY)
                return NOT_READY;
            var newDataTable = trigger.DATA.slice();
            var rowIndex = dragEnd[1];
            var colIndex = dragEnd[2];
            var newData = dragEnd[3];
            var pixelPos = dragEnd[4];
            
            var newArray = trigger.DATA.slice();
            newArray[colIndex][1] = newData[0];
            newArray[colIndex][2] = newData[1]; 
            trigger.DATA = newArray;
            log(trigger);
            log(trigger['ROWMETADATA']);
            //var rowId = trigger.ROWMETADATA[colIndex]['id'];
            //log("RID: "+rowId);
            return trigger;
        }, dragedE.startsWith(NOT_READY), triggerB);
        
        dragedE.snapshotE(dragUpdatedDataB).mapE(function(trigger){
            triggerB.sendEvent(trigger);
        });
   //triggerB.sendEvent([[[1, Math.floor(Math.random()*11)],[3,Math.floor(Math.random()*11)],[5,Math.floor(Math.random()*11)],[7,Math.floor(Math.random()*11)],[9,Math.floor(Math.random()*11)],[11,Math.floor(Math.random()*11)]]]);
    }
    this.destroy=function(){
        //DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<div id=\""+id+"\" style=\"width: "+width+"px; text-align: center; padding-bottom: 50px;\"><div id=\""+id2+"\" style=\"margin: 0 auto;width:"+(width - 50)+"px;height:"+height+"px;\"></div></div>"; 
    }
}     
WIDGETS.register("JQPlotWidget", JQPlotWidget);  