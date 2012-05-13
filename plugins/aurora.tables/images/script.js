var CELL_RENDERERS = {"boolean":BooleanCellRenderer, "string":StringCellRenderer, "int":IntegerCellRenderer, "gender":GenderColumn, "date":DateColumn};
function DefaultCellRenderer(value, cell){
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
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.setValue = function(newValue){
        value = newValue;
    }
}
function BooleanCellRenderer(value, cell){
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
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetBooleanCell"; 
    }
    this.getValue = function(){
        return checkbox.checked;
    }
    this.setValue = function(newValue){
        checkbox.checked = newValue;
    }
}
function GenderColumn(value, cell){
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
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
}
function DateColumn(value, cell){
   value = (value==undefined||value==null||value=="")?"2012-01-01":value;
    var div = document.createElement("div");
    
    var input = document.createElement("input");
    input.type = "text";
    input.className = "TableWidgetStringCellRenderTextBox";
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
        input.className = "TableWidgetStringCellTextBox";
        input.value = value;
        jQuery(input).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: false,changeYear: true, yearRange: '1910:2100', showButtonPanel: false}); 
        //jQuery(input).datepicker("show");           
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.getValue = function(){
        date = jQuery.datepicker.formatDate('yy-mm-dd',jQuery(input).datepicker("getDate"));
        //date = jQuery(input).datepicker("getDate");
        return date;
    }
    this.setValue = function(newValue){
        jQuery(input).datepicker("setDate", newValue);
    }
}
function StringCellRenderer(value, cell){
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
            textbox.style.width = (cell.scrollWidth==0)?cell.style.width:cell.scrollWidth+"px";
            cell.removeChildren();
            cell.appendChild(textbox);
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetStringCell"; 
    }
    this.getValue = function(){
        return textbox.value;
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
}
function IntegerCellRenderer(value, cell){
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
            textbox.style.width = cell.scrollWidth+"px";
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
}          
/* BASE WIDGETS */
function PluginManagerWidget(instanceId, data){
    var dataR = DATA.getRemote("aurora_plugins", "", NOT_READY, POLL_RATES.SLOW);

    var widget = new TableWidget(instanceId+"TableWidget", {tableB: dataR.behaviour, placeholder: data.placeholder});
    this.loader=function(){
        widget.loader();
    }
    this.destroy=function(){
        DATA.deregister("aurora_plugins", "");
    }
    this.build=function(){
        return widget.build();
    }
}                
widgetTypes['PluginManagerWidget']=PluginManagerWidget;

function AuroraUserGroupColumn(groups, columnIndex){
    this.columnIndex = columnIndex; //This is required
    this.groups = groups;
    this.getCellRenderer = function(value, cell){
        return new AuroraGroupCellRenderer(groups, value, cell);    
    }
}
function AuroraGroupCellRenderer(groups, value, cell){
    var select = document.createElement("select");
    var index;
    for(index in groups){
                var group = groups[index];
                var option=document.createElement("OPTION");
                option.appendChild(document.createTextNode(group.name));
                option.value = group.id;
                select.appendChild(option);       
            }
            select.value = value;     
    this.render = function(){
        select.disabled = true;
        cell.removeChildren();
        cell.appendChild(select);    
    }
    this.renderEditor = function(){
        select.disabled = false;  
        cell.removeChildren();
        cell.appendChild(select);
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
}                                                            
function UsersManagerWidget(instanceId, data){
    
    this.loader=function(){
        
        
        var dataR = DATA.getRemote("aurora_users", "");  //, NOT_READY, POLL_RATES.SLOW
        var groupsR = DATA.getRemote("aurora_groups", ""); //, NOT_READY, POLL_RATES.SLOW
        var columns = [
                {'display': "user_id", 'type': "int", 'visible': false, 'readonly': true},
                {'display': "First Name", 'type': "string", 'visible': true, 'readonly': false},
                {'display': "Last Name", 'type': "string", 'visible': true, 'readonly': false},
                {'display': "Username", 'type': "string", 'visible': true, 'readonly': false},
                {'display': "Email Address", 'type': "string", 'visible': true, 'readonly': false},
                {'display': "Group", 'type': "auroraGroup", 'visible': true, 'readonly': false},
                {'display': "Validated", 'type': "boolean", 'visible': true, 'readonly': false},
                //{'display': "Logged In", 'type': "boolean", 'visible': true, 'readonly': false},
                {'display': "Gender", 'type': "gender", 'visible': true, 'readonly': false},
                {'display': "Date Of Birth", 'type': "date", 'visible': true, 'readonly': false}
                ];
        var renderedTableB = liftBI(function(data, groups){
            if(data==NOT_READY||groups==NOT_READY)
                return NOT_READY;
            var groupsColumn = new AuroraUserGroupColumn(groups, 5);
            return [data, [groupsColumn]];
        },function(value){
            var data = value[0];
            var columns = value[1];
            return [data, null];
        }, [dataR.behaviour, groupsR.behaviour]);
    
    tableB = TableWidgetB(instanceId+"_table", columns, data, renderedTableB);    
    insertDomB(tableB, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("aurora_users", "");
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
function auroraBaseFindCustomRendererForCol(renderers, colIndex){
    for(var index in renderers){
        if(renderers[index].columnIndex==colIndex)
            return renderers[index];
    }
    return undefined;
}           
widgetTypes['UsersManagerWidget']=UsersManagerWidget;
function TableWidgetB(instanceId, columns, widgetData, dataB){
    this.columns = columns;
    var table = document.createElement("table");
    table.id = instanceId+"_table";
    table.className = "TableWidget";
    this.table = table;
    var width = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.width!=undefined)?widgetData.placeholder.style.width:undefined;
    var height = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.height!=undefined)?widgetData.placeholder.style.height:undefined;
    var containerId = instanceId+"_cont";
    
    //Build Heading Row
    renderColumns = columns;
    var headingTableRow = document.createElement("tr");
    var visibleColumnCount = 0;
    for(index in columns){ 
        var col = columns[index];
        if(col.visible){
            var cell = document.createElement("th");
            cell.innerHTML = col.display;
            headingTableRow.appendChild(cell);
            visibleColumnCount++;
        }
    }
    table.appendChild(headingTableRow);
    
    //Control Bar Buttons
    var saveButton = createIcon(SETTINGS.theme.path+"save.png");
    var cancelButton = createIcon(SETTINGS.theme.path+"cancel.png");
    var addRowButton = createIcon(SETTINGS.theme.path+"add.png");
    var editRowButton = createIcon(SETTINGS.theme.path+"edit.png");
    var deleteRowButton = createIcon(SETTINGS.theme.path+"delete.png");
    
    
    //Events
    var userEventE = receiverE();
    var userEventB = userEventE.startsWith("view");
    
    var saveButtonPressedE = extractEventE(saveButton,'click');
    var cancelButtonPressedE = extractEventE(cancelButton,'click');   
    var addButtonPressedE = extractEventE(addRowButton,'click');
    var editButtonPressedE = extractEventE(editRowButton,'click'); 
   var deleteButtonPressedE = extractEventE(deleteRowButton,'click');
    
    
    var tableSelectionsReset = receiverE();
    var tableRowClickedE = extractEventE(table,"click").mapE(function(ev){
        try{
            var blah = ev.originalTarget.parentNode;
        }
        catch(err){
            log(err);
            return NOT_READY;
        };
        if(ev.originalTarget.parentNode!=null&&ev.originalTarget.parentNode.parentNode!=null){    
            var table = ev.originalTarget.parentNode.parentNode.parentNode;
            var rowCount = (table.rows==undefined)?0:table.rows.length;
            var clickedIndex = parseInt(ev.originalTarget.parentNode.parentNode.rowIndex);
            if(rowCount!=clickedIndex&&clickedIndex!=0){
                return clickedIndex;
            }
        }
        return NOT_READY;
    }).filterE(function (v) { return v != NOT_READY; });
    var tableSelectionRowIndexE = mergeE(tableRowClickedE, tableSelectionsReset);
    var rowSelectionsE = tableSelectionRowIndexE.collectE({rowSelections: [], mode: "view"},function(newElement,data) {
        if(newElement==NOT_READY)
            return {rowSelections: [], mode: "view"}; 
        var arr = data.rowSelections; 
        log("Row Selections CHange");
        
        if(arrayContains(arr, newElement)){
            log("Remove");
            arr = jQuery.grep(arr, function(value) {return value != newElement;});
        }
        else {
            log("Add");
            arr[arr.length] = newElement;
        }
        log(arr);
        return {rowSelections: arr, mode: "view"};
    });
    var rowSelectionsB = rowSelectionsE.startsWith({rowSelections: [], mode: "view"}); 
                            
    var userChangesE = mergeE(
        addButtonPressedE.snapshotE(rowSelectionsB).mapE(function(rowSelections){
            log("Add Button Pressed");
            return {rowSelections: [], mode: "add"};
        }),
        editButtonPressedE.snapshotE(rowSelectionsB).mapE(function(rowSelections){
            return {rowSelections: rowSelectionsB, mode: "edit"};
        }),
        deleteButtonPressedE.snapshotE(rowSelectionsB).mapE(function(rowSelections){
            return {rowSelections: [], mode: "view"};
        }), 
        cancelButtonPressedE.snapshotE(rowSelectionsB).mapE(function(rowSelections){
            return {rowSelections: [], mode: "view"};
        }),
        rowSelectionsE
    ).startsWith({rowSelections: [], mode: "view"});
    
                 
    
    var pageRenderedB = liftBI(function(tableData, userChanges){
        log("Rending Table");
        table.removeChildren();
        table.appendChild(headingTableRow);
        if(tableData==NOT_READY||userChanges==NOT_READY){
            var element = document.createElement("td");
            element.colSpan = visibleColumnCount;
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+SETTINGS.theme.path+"loading.gif\" alt=\"\"/>";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div")];
        }  
        
        var tableMode = userChanges.mode;
        var rowSelections = userChanges.rowSelections;
        var data = tableData[0];
        var customRenderers = tableData[1];
        log(rowSelections);
        log("Table MOde: "+tableMode);
        
        renderedTable = new Array(); 
        
                
        for(index in data){
            var domRow = document.createElement("tr");
            var dataRow = data[index];
            var isSelected = arrayContains(rowSelections, parseInt(index)+1);
            if(renderedTable[index]==undefined)
                renderedTable[index] = new Array();
                    
            for(cellIndex in columns){
                var rowNumber = parseInt(cellIndex)+1;
                
                
                var cell = document.createElement("td");
                var column = columns[cellIndex];
                var customColumnRenderer = auroraBaseFindCustomRendererForCol(customRenderers, cellIndex);
                if(customColumnRenderer==undefined){
                    var renderClass = (CELL_RENDERERS[column.type]==undefined)?DefaultCellRenderer:CELL_RENDERERS[column.type];
                    renderer = new renderClass(dataRow[cellIndex], cell);
                }
                else
                    renderer = customColumnRenderer.getCellRenderer(dataRow[cellIndex], cell);  
                
                renderer.render();    
                renderer.setSelected(isSelected);
                if(renderedTable[index]==undefined)
                    renderedTable[index] = new Array();
                
                renderedTable[index][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":index,"colIndex":cellIndex};          
                if(column.visible){                                
                    domRow.appendChild(cell);
                }
            }
            table.appendChild(domRow);    
        }
          var controlsRow = document.createElement("tr");
          var controlsCell = document.createElement("td");
            controlsCell.colSpan=columns.length;
            controlsRow.appendChild(controlsCell);
            controlsCell.className = "TableWidgetControlBar";
            
        if(tableMode=="add"){
            var newRowIndex = renderedTable.length;
            renderedTable[newRowIndex] = new Array();
            var domRow = document.createElement("tr");
            for(cellIndex in columns){    
                var column = columns[cellIndex]; 
                    var cell = document.createElement("td");
                    cell.style.width = renderedTable[newRowIndex-1][cellIndex].domCell.scrollWidth+"px";
                    var customColumnRenderer = auroraBaseFindCustomRendererForCol(customRenderers, cellIndex);
                 
                     if(customColumnRenderer==undefined){
                        var renderClass = (CELL_RENDERERS[column.type]==undefined)?DefaultCellRenderer:CELL_RENDERERS[column.type];
                        renderer = new renderClass(undefined, cell);
                    }
                    else
                        renderer = customColumnRenderer.getCellRenderer(undefined, cell);
                    renderer.renderEditor();                   
                    renderedTable[newRowIndex][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":index,"colIndex":cellIndex};
                  if(column.visible){
                    domRow.appendChild(cell);
                } 
            }
            table.appendChild(domRow); 
            
            controlsCell.appendChild(saveButton);
            controlsCell.appendChild(cancelButton); 
        }
        else{
            controlsCell.appendChild(addRowButton);
            controlsCell.appendChild(editRowButton);
            controlsCell.appendChild(deleteRowButton);  
        }  
        table.appendChild(controlsCell);    
        return [renderedTable, table, tableData, controlsCell];
    },function(value){
        var tableData = value[2][0];
        var customRenderers = value[2][1];
        log("Transform up!");
        return [[tableData, customRenderers], {mode: "view", rowSelections: []}];
    }, [dataB, userChangesE]);
    
    var domTableB = pageRenderedB.liftB(function(tableData){
        if(tableData==NOT_READY)
            return NOT_READY; 
        var c = document.createElement("div");
        return tableData[1];
    });
    
    saveButtonPressedE.snapshotE(pageRenderedB).mapE(function(data){
        var renderedTable = data[0];
        var dataTable = data[2][0];
        var columns = data[2][1];
        var renderRowIndex = renderedTable.length-1;
        var dataRowIndex = dataTable.length;
        dataTable[dataRowIndex] = Array();
        for(c=0;c<renderedTable[renderRowIndex].length;c++){
            var cell = renderedTable[renderRowIndex][c];
            var value = cell.renderer.getValue();
            data[2][0][dataRowIndex][c] = value;
        }
        userEventE.sendEvent("view");   //Tgis is bad, the value should be passed up the graph
        pageRenderedB.sendEvent(data);       
    });      
    
    var pageDataAndRowSelectionsB = liftB(function(renderedData, rowSelections){
        if(renderedData==NOT_READY||rowSelections==NOT_READY)
            return NOT_READY;
        return {renderedData: renderedData, rowSelections: rowSelections};
    }, pageRenderedB, rowSelectionsB);
    var deleteTableRowsB = deleteButtonPressedE.snapshotE(pageDataAndRowSelectionsB).startsWith(NOT_READY);
    
    liftB(function(data){
        if(data==NOT_READY)
            return;
        var rowSelections = data.rowSelections;
        var renderedTable = data.renderedData[0];
        var dataTable = data.renderedData[2][0];
        var columns = data.renderedData[2][1];
        for(rowIndex=0;rowIndex<renderedTable.length;rowIndex++){
            if(arrayContains(rowSelections, parseInt(rowIndex)+1)){
                arrayCut(data.renderedData[2][0], rowIndex);
            }
        }
        tableSelectionsReset.sendEvent(NOT_READY);
        pageRenderedB.sendEvent(data.renderedData);
        
    }, deleteTableRowsB);
    
    return domTableB
}




                
     StringBuilderEx = function()
    {
        this._buffer = new Array();
    }

    StringBuilderEx.prototype =
    {
    // This method appends the string into an array 
        append : function(text)
        {
            this._buffer[this._buffer.length] = text;
        },
        
    // This method does concatenation using JavaScript built-in function
        toString : function()
        {
            return this._buffer.join("");
        }
    }; 