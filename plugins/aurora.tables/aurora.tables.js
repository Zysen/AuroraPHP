var tableBackgroundColor = "#FFFFFF";
var tableBackgroundColorSelected = "#b3ddf8";
var CELL_RENDERERS = {"boolean":BooleanCellRenderer, "string":StringCellRenderer, "int":IntegerCellRenderer, "gender":GenderColumn, "date":DateColumn, "RW": ReadWriteColumn, "readWrite": ReadWriteColumn};
function BasicCellRenderer(type){
    this.renderClass = CELL_RENDERERS[type]; 
    this.getCellRenderer = function(value, cell, width){
        return new this.renderClass(value, cell, width);
    }
}
function DefaultCellRenderer(value, cell, width){
    this.render = function(){
        cell.innerHTML = value;
    }
    this.getValue = function(){
        return cell.innerHTML;
    }
    this.renderEditor = function(){
        
    }
    this.setSelected = function(selected){ 
        if(selected){
            cell.className="TableWidgetCellSelected"; 
           // cell.style.backgroundColor=tableBackgroundColorSelected; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.setValue = function(newValue){
        value = newValue;
    }
    this.getUpdateEvent = function(){
        return receiverE();
    }
}
function BooleanCellRenderer(value, cell, width){    
    var value = (value!=undefined&&(value=="1"||value==true||value=="true"))?true:false;
    var checkbox = document.createElement("input");
    checkbox.type='checkbox';
    checkbox.checked = (value==undefined||value==null||value=="")?false:value;  
    cell.className="TableWidgetBooleanCell";
    checkbox.disabled = true; 
    
    this.render = function(){
        cell.removeChildren();
        checkbox.disabled = true; 
        cell.appendChild(checkbox);
        //jQuery(cell).fj('extEvtE', 'click').mapE(function(x){userChangeE.sendEvent()});
    }
    this.renderEditor = function(){
        cell.removeChildren();
        checkbox.disabled = false;
        cell.appendChild(checkbox);
    }
    this.setSelected = function(selected){
        //log("Chaning boolean "+selected);
        if(selected){
            cell.className="TableWidgetBooleanCellSelected";
            //cell.style.backgroundColor=tableBackgroundColorSelected;  
        }
        else  {
            cell.className="TableWidgetBooleanCell"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
    }
    this.getValue = function(){
        return checkbox.checked;
    }
    this.setValue = function(newValue){
        checkbox.checked = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(checkbox);
    }
}
function ReadWriteColumn(value, cell, width){
    value = (value==undefined||value==null||value=="")?"":value;
    var select = document.createElement("select");
    
noneOption=document.createElement("OPTION");
    noneOption.appendChild(document.createTextNode("--"));
    noneOption.value = "";
    select.appendChild(noneOption)

readOption=document.createElement("OPTION");
    readOption.appendChild(document.createTextNode("Read"));
    readOption.value = "R";
    select.appendChild(readOption);

    writeOption=document.createElement("OPTION");
    writeOption.appendChild(document.createTextNode("Write"));
    writeOption.value = "W";
    select.appendChild(writeOption)

rwOption=document.createElement("OPTION");
    rwOption.appendChild(document.createTextNode("Read+Write"));
    rwOption.value = "RW";
    select.appendChild(rwOption); 
    select.className="TableWidgetPermissionsCell";
    select.value = value;
     cell.className="TableWidgetCell"; 
           
    this.render = function(){
        cell.removeChildren();
        select.disabled = true; 
        cell.appendChild(select);
    }
    this.renderEditor = function(){
        cell.removeChildren();
        cell.appendChild(select);
        select.disabled = false;            
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(select);
    }
}
function GenderColumn(value, cell, width){
    value = (value==undefined||value==null||value=="")?"M":value;
    var select = document.createElement("select");
    maleOption=document.createElement("OPTION");
    maleOption.appendChild(document.createTextNode("Male"));
    maleOption.value = "M";
    femaleOption=document.createElement("OPTION");
    femaleOption.appendChild(document.createTextNode("Female"));
    femaleOption.value = "F";
    select.appendChild(maleOption);
    select.appendChild(femaleOption); 
    select.className="TableWidgetGenderCell";
    select.value = value;
     cell.className="TableWidgetCell"; 
           
    this.render = function(){
        cell.removeChildren();
        select.disabled = true; 
        cell.appendChild(select);
    }
    this.renderEditor = function(){
        cell.removeChildren();
        cell.appendChild(select);
        select.disabled = false;            
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(select);
    }
}
function DateColumn(value, cell, width){
   value = (value==undefined||value==null||value=="")?"2012-01-01":value;
    var div = document.createElement("div");
    cell.className="TableWidgetCell"; 
           
    var input = document.createElement("input");
    input.type = "text";
    //input.className = "TableWidgetStringCellRenderTextBox";
    this.render = function(){
        jQuery(input).datepicker("destroy");
        div.innerHTML = value;
        //jQuery(input).datepicker("setDate", value); 
        cell.removeChildren(); 
        cell.appendChild(div);
        
    }
    this.renderEditor = function(){     
        cell.removeChildren(); 
        cell.appendChild(input);
        //input.className = "TableWidgetStringCellTextBox";
        input.value = value;
        jQuery(input).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: false,changeYear: true, yearRange: '1910:2100', showButtonPanel: false});
        jQuery(input).datepicker("setDate", value); 
        //jQuery(input).datepicker("show");           
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
           // cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        date = jQuery.datepicker.formatDate('yy-mm-dd',jQuery(input).datepicker("getDate"));
        //date = jQuery(input).datepicker("getDate");
        return date;
    }
    this.setValue = function(newValue){
        jQuery(input).datepicker("setDate", newValue);
    }
    this.getUpdateEvent = function(){
        return jQuery(input).datepicker().fj('jQueryBind', 'change');
    }
}
function StringCellRenderer(value, cell, width){
    value = (value==undefined||value==null)?"":value;
    var displayDom = document.createElement("div");
    displayDom.className = "TableWidgetStringCellText";
    cell.className="TableWidgetStringCell";
    var textbox = document.createElement("input");
    textbox.className = "TableWidgetStringCellTextBox";
    textbox.type='text';
    textbox.value = value;
    //textbox.disabled = true;                 
    this.render = function(){ 
            displayDom.innerHTML = textbox.value; 
            cell.removeChildren(); 
            cell.appendChild(displayDom);
    }
    this.renderEditor = function(){
            var scrollWidth = (cell.scrollWidth==0)?cell.style.width:cell.scrollWidth+"px";
            if(width!=undefined){
                textbox.style.width = width+"px";
            }    
            cell.removeChildren();
            cell.appendChild(textbox);
    }                                         
    this.setSelected = function(selected){
        
        if(selected){
            cell.className="TableWidgetStringCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected;
        }
        else{
            cell.className="TableWidgetStringCell"; 
            ///cell.style.backgroundColor=tableBackgroundColor;
        }
    }
    this.getValue = function(){
        return textbox.value;
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(textbox);
    }
}
function IntegerCellRenderer(value, cell, width){
    var displayDom = document.createElement("div");
    displayDom.className = "TableWidgetIntegerCellText";
    cell.className="TableWidgetStringCell";
    var textbox = document.createElement("input");
    textbox.className = "TableWidgetIntegerCellTextBox";
    textbox.type='text';
    textbox.value = value;
    //textbox.disabled = true;                 
    this.render = function(){ 
            displayDom.innerHTML = textbox.value; 
            cell.removeChildren(); 
            cell.appendChild(displayDom);
    }
    this.renderEditor = function(){
            textbox.value = value;
            var scrollWidth = (cell.scrollWidth==0)?cell.style.width:cell.scrollWidth+"px";
            if(width!=undefined){
                textbox.style.width = width+"px";
            }
            cell.removeChildren();
            cell.appendChild(textbox);
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.getValue = function(){
        return textbox.value;
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(textbox);
    }
} 

function TableWidgetB(instanceId, widgetData, dataB){
    var table = document.createElement("table");
    table.id = instanceId+"_table";
    table.className = "TableWidget";
    this.table = table;
    
    
   //Control Bar Buttons
    var saveButton = createIcon(SETTINGS.theme.path+"save.png");
    var cancelButton = createIcon(SETTINGS.theme.path+"cancel.png");
    var addRowButton = createIcon(SETTINGS.theme.path+"add.png");
    var deleteRowButton = createIcon(SETTINGS.theme.path+"delete.png"); 
    
    var addRow = document.createElement("tr");
    var controlsRow = document.createElement("tr");
    var controlsCell = document.createElement("td");
            
            controlsCell.className = "TableWidgetControlBar";
            controlsCell.appendChild(saveButton);
            controlsCell.appendChild(cancelButton); 
            controlsCell.appendChild(addRowButton);
            controlsCell.appendChild(deleteRowButton);
            controlsRow.appendChild(controlsCell);
    
    var width = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.width!=undefined)?widgetData.placeholder.style.width:undefined;
    var height = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.height!=undefined)?widgetData.placeholder.style.height:undefined;
    var containerId = instanceId+"_cont";
    
    //Build Heading Row
    //Events
    var userEventE = receiverE();
    var userEventB = userEventE.startsWith("view");
    
    var saveButtonPressedE = extractEventE(saveButton,'click');
    var cancelButtonPressedE = extractEventE(cancelButton,'click');   
    var addButtonPressedE = extractEventE(addRowButton,'click');
   var deleteButtonPressedE = extractEventE(deleteRowButton,'click');
    
    
    //extractEventE(table,"click")                   jQuery(table).fj('extEvtE', 'click')
    var tableRowClickedE = extractEventE(table,"click").mapE(function(ev){
        stopEventBubble(ev);
        //ev.preventDefault();
        //return NOT_READY;
        var target = (ev.target==undefined)?ev.srcElement:ev.target;
        jQuery(target).focus();
        var cell = findParentNodeWithTag(target, "td");
        var row = findParentNodeWithTag(cell, "tr");
        var table =findParentNodeWithTag(row, "table");
            if(row!=undefined){
                var clickedIndex = jQuery(row).prevAll().length;
                if(clickedIndex<=0){
                    return NOT_READY;
                }
                return {clickedIndex: clickedIndex, shiftKey: ev.shiftKey, ctrlKey: ev.ctrlKey, target: target};
            }
        return NOT_READY;
    }).filterE(function(v){return v!=NOT_READY;});
    
    var tableBlurE = jQuery(document).fj('extEvtE', 'click').mapE(function(x){return NOT_READY;});    
    var rowSelectionResetE = receiverE();
    var tableSelectionRowIndexE = mergeE(tableRowClickedE, rowSelectionResetE.mapE(function(v){return NOT_READY;}), tableBlurE);
    var rowSelectionsE = tableSelectionRowIndexE.collectE([],function(newElement,arr) {
        if(newElement==NOT_READY)
            return []; 
        var clickedIndex = newElement.clickedIndex;
        var shiftKey = newElement.shiftKey;
        var ctrlKey = newElement.ctrlKey;
        if(ctrlKey){        
            if(arrayContains(arr, clickedIndex)){
                arr = jQuery.grep(arr, function(value) {return value != clickedIndex;});
            }
            else {
                arr[arr.length] = clickedIndex;
            }
        }
        else if(shiftKey){
            var min = Array.max(arr);
            var max = Array.min(arr);
            if(clickedIndex<min){
                for(i=clickedIndex;i<min;i++)
                    arr[arr.length] = i;    
            }
            else if(clickedIndex>max){
                for(i=max+1;i<=clickedIndex;i++)
                    arr[arr.length] = i; 
            }
        }
        else{
            if(arr.length==1&&arrayContains(arr, clickedIndex)){
                arr = [];
            }
            else{
                arr = [clickedIndex];
            }
        }
        
           
        return arr;
    });
    var rowSelectionsB = rowSelectionsE.startsWith([]);
    
    
    
    
    
    var showAddRowsResetE = receiverE();
    
    var showAddRowsB = mergeE(addButtonPressedE, showAddRowsResetE).collectE(false,function(newVal,lastVal){if(newVal==NOT_READY)return false;return !lastVal; }).startsWith(false);
           
    
    var pageRenderedB = liftBI(function(tableData){
        table.removeChildren();
        addRow.removeChildren();
        //If not ready, show a loading icon
        if(tableData==NOT_READY){
            var element = document.createElement("td");
            element.className = "TableWidgetCell";
            jQuery(element).attr('colspan',visibleColumnCount);                                         
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+SETTINGS.theme.path+"loading.gif\" alt=\"\"/>";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div")];
        }  
        else if(tableData==NO_PERMISSION){
            var element = document.createElement("td");
            element.className = "TableWidgetCell";
            jQuery(element).attr('colspan',visibleColumnCount);                                         
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+SETTINGS.theme.path+"noperm.png\" alt=\"\"/><br />No Permission";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div")];
        }  
	//log("TABLE DATA");
        //log(tableData);
        var headingTableRow = document.createElement("tr");
        var visibleColumnCount = 0;
        var columns = tableData.COLUMNS;
        jQuery(controlsCell).attr('colspan',columns.length);

        
        for(index in columns){ 
            var col = columns[index];
            if(col.visible){
                var cell = document.createElement("th");
                if(col.width!=undefined){
                    cell.width = col.width;
                }
                cell.innerHTML = col.display;
                headingTableRow.appendChild(cell);
                visibleColumnCount++;
            }
        }
        table.appendChild(headingTableRow);
        
        //If ready render the table
        var tableMetaData = tableData.TABLEMETADATA;
        var tablePermissions = (tableMetaData!=undefined&&tableMetaData.permissions!=undefined&&tableMetaData.permissions.canEdit!=undefined)?tableMetaData.permissions.canEdit:true; 
        var data = tableData.DATA;
        renderedTable = new Array(); 
        for(index in data){
            var domRow = document.createElement("tr");
            var dataRow = data[index];
            var rowMetaData = tableData.ROWMETADATA[index];
            /*if(rowMetaData!=undefined){
            
            }*/
            var rowPermissions = (rowMetaData!=undefined&&rowMetaData.permissions!=undefined)?rowMetaData.permissions:"RW";
            if(renderedTable[index]==undefined)
                renderedTable[index] = new Array();
            for(cellIndex in columns){
                var columnMetaData = tableData.COLUMNMETADATA[cellIndex];
                var columnPermissions = columnMetaData==undefined||columnMetaData.permissions==undefined?"RW":columnMetaData.permissions;
                var cellMetaData = (tableData.CELLMETADATA[index]==undefined)?undefined:tableData.CELLMETADATA[index][cellIndex];
                var cellPermissions = cellMetaData==undefined||cellMetaData.permissions==undefined?"RW":cellMetaData.permissions; 
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
                var column = columns[cellIndex];
		var customRenderer = (rowMetaData!=undefined&&rowMetaData.renderer!=undefined)?rowMetaData.renderer:(columnMetaData!=undefined&&columnMetaData.renderer!=undefined)?columnMetaData.renderer:(cellMetaData!=undefined&&cellMetaData.renderer!=undefined)?cellMetaData.renderer:undefined;

                if(customRenderer==undefined){
                    var renderClass = (CELL_RENDERERS[column.type]==undefined)?DefaultCellRenderer:CELL_RENDERERS[column.type];
                    renderer = new renderClass(dataRow[cellIndex], cell, column.width);
                }
                else
                    renderer = customRenderer.getCellRenderer(dataRow[cellIndex], cell, column.width);  
                
		if(tablePermissions==true&&rowPermissions=="RW"&&columnPermissions=="RW"&&cellPermissions=="RW")
                    renderer.renderEditor();    
                else
                    renderer.render();
                if(renderedTable[index]==undefined)
                    renderedTable[index] = new Array();
                
                renderedTable[index][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":index,"colIndex":cellIndex};          
                if(column.visible){                                
                    domRow.appendChild(cell);
                }
            }                                                                                           
            table.appendChild(domRow);    
        }
            
            newRowsRenderedTable = new Array();
            for(cellIndex in columns){
                var columnMetaData = tableData.COLUMNMETADATA[cellIndex];
                var columnPermissions = columnMetaData==undefined?"RW":columnMetaData.permissions;
                
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
                var column = columns[cellIndex];
                var customRenderer = (columnMetaData!=undefined&&columnMetaData.renderer!=undefined)?columnMetaData.renderer:undefined;	
		if(customRenderer==undefined){                           
			var renderClass = (CELL_RENDERERS[column.type]!=undefined)?CELL_RENDERERS[column.type]:DefaultCellRenderer;
                    	renderer = new renderClass(undefined, cell, column.width);
                }
                else{                   
			renderer = customRenderer.getCellRenderer(undefined, cell, column.width);  
                }
                renderer.renderEditor();
                if(newRowsRenderedTable[0]==undefined)
                    newRowsRenderedTable[0] = new Array();
                newRowsRenderedTable[0][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":0,"colIndex":cellIndex};
                if(columns[cellIndex].visible){    
                    addRow.appendChild(cell);
                }
            }                                                                                           
            table.appendChild(addRow);
            table.appendChild(controlsRow);
        return [renderedTable, table, tableData, newRowsRenderedTable];
        // Table of Cell Renderers, The Dom Table, the raw table data
    },function(value){
        return [value];
    }, dataB);
    
    var filteredRowSelectionsB = liftB(function(rowSelections, pageRendered){
        var renderedTable = pageRendered[0]
        var newRowsRenderedTable = pageRendered[3];
            for(index in rowSelections){
                var targetIndex = rowSelections[index];
                if(targetIndex>renderedTable.length){
                    arrayCut(rowSelections, index);
                }
            }
        return rowSelections;
    }, rowSelectionsB, pageRenderedB); 
   var rowSelectionsEmptyB = filteredRowSelectionsB.liftB(function(rowSelections){return rowSelections.length==0;});      
    
    
    var renderedRowSelectionsB = liftB(function(tableData, rowSelections){
        if(tableData==NOT_READY||rowSelections==NOT_READY)
            return NOT_READY; 
        var c = document.createElement("div");
            for(index in tableData[0]){   
                var isSelected = arrayContains(rowSelections, parseInt(index)+1);
                for(cellIndex in tableData[0][index]){
                    tableData[0][index][cellIndex].renderer.setSelected(isSelected);
                }
            }
    }, pageRenderedB, rowSelectionsB);
    
    
    var domTableB = liftB(function(pageRendered){
	//log("domTableB");
        return pageRendered[1];
    }, pageRenderedB);    
    
    var tableAllowsAddB = pageRenderedB.liftB(function(data){
	//log("tableAllowsAddB");
	var tableData = data[2];
	return (tableData.TABLEMETADATA!=undefined&&tableData.TABLEMETADATA.permissions!=undefined&&tableData.TABLEMETADATA.permissions.canAdd!=undefined)?tableData.TABLEMETADATA.permissions.canAdd:true;
    });
    var tableAllowsDeleteB = pageRenderedB.liftB(function(data){
	//log(tableAllowsDeleteB);
	var tableData = data[2];
	return (tableData.TABLEMETADATA!=undefined&&tableData.TABLEMETADATA.permissions!=undefined&&tableData.TABLEMETADATA.permissions.canDelete!=undefined)?tableData.TABLEMETADATA.permissions.canDelete:true;
    });
    
    var tableDataChangedB = pageRenderedB.liftB(function(pageRendered){
        if(pageRendered==NOT_READY||pageRendered[0].length==0)
            return receiverE().startsWith(NOT_READY);
	//log("tableDataChangedB");
        var rendererTable = pageRendered[0];
        var domTable = pageRendered[1];
        var dataTable = pageRendered[2][0];
        /*var newRenderTable = pageRendered[3];*/
        var updateEvents = new Array();
        for(rowIndex in rendererTable){
            for(colIndex in rendererTable[rowIndex]){
                updateE = rendererTable[rowIndex][colIndex].renderer.getUpdateEvent();
                updateEvents.push(updateE);
            }
        }
        /*for(rowIndex in newRenderTable){
            for(colIndex in newRenderTable[rowIndex]){
                updateE = newRenderTable[rowIndex][colIndex].renderer.getUpdateEvent();
                updateEvents.push(updateE);
            }
        } */
        return mergeE.apply(this, updateEvents).startsWith(false);   
    }).switchB();
    
   var userDataChangeB = orB(tableDataChangedB.changes().snapshotE(pageRenderedB).mapE(function(renderedData){
        // Table of Cell Renderers, The Dom Table, the raw table data
        var rendererTable = renderedData[0];
        var domTable = renderedData[1];
        var dataTable = renderedData[2].DATA;
        /*var newRenderTable = renderedData[3]; */       
        for(rowIndex in rendererTable){
            for(colIndex in rendererTable[rowIndex]){
                var renderCell = rendererTable[rowIndex][colIndex];
                var dataCell = dataTable[rowIndex][colIndex];
                if(renderCell.renderer.getValue()!=dataCell){
                    return true; 
                }
            } 
        }
        
        return false;
    }).startsWith(false), showAddRowsB); 
    /*
    Gui Updates
    */
    insertValueB(ifB(userDataChangeB, 'inline', 'none'),saveButton, 'style', 'display');
    insertValueB(ifB(userDataChangeB, 'inline', 'none'),cancelButton, 'style', 'display');
    insertValueB(ifB(showAddRowsB, 'table-row', 'none'),addRow, 'style', 'display');
  
    insertValueB(ifB(andB(notB(showAddRowsB), tableAllowsAddB), 'inline', 'none'),addRowButton, 'style', 'display');
    insertValueB(ifB(rowSelectionsEmptyB, 'auto', 'pointer'),deleteRowButton, 'style', 'cursor');
    insertValueB(ifB(tableAllowsDeleteB, 'inline', 'none'),deleteRowButton, 'style', 'display');
    insertValueB(ifB(notB(rowSelectionsEmptyB), SETTINGS.theme.path+'delete.png', SETTINGS.theme.path+'delete_disabled.png'),deleteRowButton, 'src');
 

    /*
    Save Rows
    */
    cancelButtonPressedE.snapshotE(dataB).mapE(function(data){
        showAddRowsResetE.sendEvent(NOT_READY);
        dataB.sendEvent(data); 
    });
    saveButtonPressedE.snapshotE(liftB(function(pageRendered, showAddRows){return [pageRendered, showAddRows]}, pageRenderedB,showAddRowsB)).mapE(function(data){
//log("saveButtonPressedE");        
	var renderedTable = data[0][0];
        var dataTable = data[0][2].DATA;
        var columns = data[0][2].COLUMNS;
        var newRenderedTable = data[0][3];  
        var renderRowIndex = renderedTable.length-1;
        var showAddRows = data[1];
        //log(data[2][0]);
        //log("ABOVE:"+data[2][0].length);                               
        if(renderedTable.length>dataTable.length){
        var dataRowIndex = dataTable.length;
        dataTable[dataRowIndex] = Array();
            for(c=0;c<renderedTable[renderRowIndex].length;c++){
                var cell = renderedTable[renderRowIndex][c];
                var value = cell.renderer.getValue();
                dataTable[dataRowIndex][c] = value;
            }
        }
        else{
            r=0;
                for(r=0;r<renderedTable.length;r++){
              //  log("Row "+r);
                    for(c=0;c<renderedTable[r].length;c++){
                        //log();
                        var cell = renderedTable[r][c];
                        var value = cell.renderer.getValue();
                        dataTable[r][c] = value;
                    }
                }
                if(showAddRows){
                for(rowIndex=0;rowIndex<newRenderedTable.length;rowIndex++){
                    for(c=0;c<newRenderedTable[rowIndex].length;c++){
                        var cell = newRenderedTable[rowIndex][c];
                        var value = cell.renderer.getValue();
                        if(dataTable[rowIndex+r]==undefined)
                            dataTable[rowIndex+r] = new Array();
                        dataTable[rowIndex+r][c] = value;
                    }
                }
                }
                
                
                
                
        }
        //log(data[0][2]);
        pageRenderedB.sendEvent(data[0][2]);  
        showAddRowsResetE.sendEvent(NOT_READY);    
    });      
    
    
    /*
    Delete Rows
    */
    var pageDataAndRowSelectionsB = liftB(function(renderedData, rowSelections){
//log(pageDataAndRowSelectionsB);        
if(renderedData==NOT_READY||rowSelections==NOT_READY)
            return NOT_READY;
        return {renderedData: renderedData, rowSelections: rowSelections};
    }, pageRenderedB, rowSelectionsB);
    var deleteTableRowsB = deleteButtonPressedE.snapshotE(pageDataAndRowSelectionsB).startsWith(NOT_READY);
    
    deleteTableRowsB.liftB(function(data){
//log("deleteTableRowsB");
        if(data==NOT_READY || data.rowSelections.length==0)
            return;
        var rowSelections = data.rowSelections.reverse(); 
        var renderedTable = data.renderedData[0];
        var dataTable = data.renderedData[2].DATA;
        var columns = data.renderedData[2].COLUMNS;
        for(index=0;index<rowSelections.length;index++){
            arrayCut(data.renderedData[2].DATA, (rowSelections[index]-1));
        }              
        UI.confirm("Delete Rows", "Are you sure you wish to delete these "+rowSelections.length+" row(s)", "Yes", function(val){
            rowSelectionResetE.sendEvent(true);
            pageRenderedB.sendEvent(data.renderedData[2]);
        }, "No",
        function(val){
            rowSelectionResetE.sendEvent(true);
        }); 
    });
    
    return domTableB
}
function getTableValue(table, rowIndex, columnName){
	for(colIndex in table.COLUMNS){
		if(table.COLUMNS[colIndex].reference==columnName){
			return table.DATA[rowIndex][colIndex];
		}
	}
	return null;
}
function JoinTableB(table1B, table2B, columnId){
    return liftBI(function(table1, table2){
        if(table1==NOT_READY||table2==NOT_READY)
            return NOT_READY;
        var searchColIndex1 = columnId;
        for(colIndex in table1.COLUMNS){
            if(columnId==table1.COLUMNS.reference){
                searchColIndex = colIndex;
                break;
            }        
        }
        var searchColIndex2 = columnId;
        for(colIndex in table2.COLUMNS){
            if(columnId==table2.COLUMNS.reference){
                searchColIndex = colIndex;
                break;
            }        
        }
        
        /*for(property in table1){
            log(property);
            log(table1[property]);
        }*/  
        
        table1.COLUMNS = table1.COLUMNS.concat(table2.COLUMNS);
        //table1.COLUMNMETADATA = table1.COLUMNMETADATA.concat(table2.COLUMNMETADATA);
        for(rowIndex in table1.DATA){
            var searchCell1 = table1.DATA[rowIndex][searchColIndex1];
            for(rowIndex2 in table2.DATA){
                var searchCell2 = table2.DATA[rowIndex2][searchColIndex2];
                if(searchCell1==searchCell2){
                    for(colIndex2 in table2.DATA[rowIndex2]){
                        table1.DATA[rowIndex][table1.COLUMNS.length+colIndex2] = table2.DATA[rowIndex2][colIndex2];
                    }
                }    
            }
        }
        return table1;
    }, function(mergeTable){
    
        return [table1, table2];
    }, table1B, table2B);
}
