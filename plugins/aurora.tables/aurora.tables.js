var tableBackgroundColor = "#FFFFFF";
var tableBackgroundColorSelected = "#b3ddf8";
var CELL_RENDERERS = {"boolean":BooleanCellRenderer, "string":StringCellRenderer, "int":IntegerCellRenderer,"float":StringCellRenderer, "gender":GenderColumn, "date":(typeof(jQuery)=='undefined')?StringCellRenderer:DateColumn, "RW": ReadWriteColumn, "readWrite": ReadWriteColumn};
                                                                                     
                                    


function cleanFunctions(obj) {
    if(jQuery.isArray(obj)||jQuery.type(obj) === "object"){
        for (var name in obj){
            obj[name] = cleanFunctions(obj[name]);
        }
    }
    else if(jQuery.isFunction(obj)){
        return undefined;   
    }
    return obj;
}

function cleanRenderers(table){
    for(colIndex in table["COLUMNMETADATA"]){
        table["COLUMNMETADATA"][colIndex]["renderer"] = undefined;    
    }
    for(rowIndex in table["ROWMETADATA"]){
        table["ROWMETADATA"][rowIndex]["renderer"] = undefined;    
    }
    for(rowIndex in table["CELLMETADATA"]){
        var row = table["CELLMETADATA"][rowIndex];
        if(row!=undefined){
            for(colIndex in row){
                var cell = row[colIndex];
                cell["renderer"] = undefined; 
            }
        }    
    }
    return table;
}

/**
 *  BasicSelectCellRenderer
 * @constructor
 */
function BasicSelectCellRenderer(options, value, cell, width){
    var element = document.createElement("select");
    var selectedElement = 0;
    for(optionIndex in options){
        var option = options[optionIndex];
        var optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.innerHTML = option.display;
        element.appendChild(optionElement);
        if(optionElement.value==value)
            selectedElement = optionIndex;
    }    
    element.selectedIndex = selectedElement;
    cell.appendChild(element);
    
    this.render = function(){
        element.disabled = true;
    }
    this.getValue = function(){
        return element.value;
    }
    this.renderEditor = function(){
        element.disabled = false;   
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
        element.value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(element);
    }
}
/**
 *  BasicSelectCellRendererContainer
 * @constructor
 */
function BasicSelectCellRendererContainer(options){       
    this.getCellRenderer = function(value, cell, width){
        return new BasicSelectCellRenderer(options, value, cell, width);
    }
}
//table
/**
 *  BasicRadioCellRenderer
 * @constructor
 */
function BasicRadioCellRenderer(name, options, value, cell, width){
    this.elements = [];
    this.events = new Array();
    for(optionIndex in options){
        var div = document.createElement("div");
        div.style.textAlign = "center";
        var option = options[optionIndex];
        var element = document.createElement("input");
        element.type = "radio";
        element.name = name;
        element.value = option.value;
        div.appendChild(document.createTextNode(option.display));
        div.appendChild(element);
        cell.appendChild(div);
        this.elements.push(element);
        if(element.value == value)
            element.checked = true;
        var event = F.extractEventE(element, "change");
        this.events.push(event);
    }
    this.valueChangeEventE = F.mergeE.apply(this, this.events);  
    this.render = function(){
        this.enabled(false);
    }
    this.enabled = function(en){
        for(elementIndex in this.elements){
            var element = this.elements[elementIndex];
            element.disabled = !en;
        }
    }
    this.getValue = function(){
        for(elementIndex in this.elements){
            var element = this.elements[elementIndex];
            if(element.checked==true){
                return element.value;
            }
        }
        return "";
    }
    this.renderEditor = function(){
        this.enabled(true);
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
        for(elementIndex in this.elements){
            var element = this.elements[elementIndex];
            if(element.value==newValue){
               element.checked = true
            }
            else
                element.checked = false;
        }
    }
    this.getUpdateEvent = function(){
        return this.valueChangeEventE;
    }
}
/**
 *  BasicRadioCellRendererContainer
 * @constructor
 */
function BasicRadioCellRendererContainer(name, options){
    this.getCellRenderer = function(value, cell, width){
        return new BasicRadioCellRenderer(name, options, value, cell, width);
    }
}
/**
 *  BasicCellRenderer
 * @constructor
 */
function BasicCellRenderer(type, name){ 
    this.getCellRenderer = function(value, cell, width){
        var renderClass = CELL_RENDERERS[type];
        var renderer = new renderClass(value, cell, width);
        //log(renderer);
        return renderer; 
    }
}
/**
 *  DefaultCellRenderer
 * @constructor
 */
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
        return F.receiverE();
    }
}
/**
 *  BooleanCellRenderer
 * @constructor
 */
function BooleanCellRenderer(value, cell, width){    
    var value = (value!=undefined&&(value=="1"||value==true||value=="true"))?true:false;
    var checkbox = document.createElement("input");
    checkbox.type='checkbox';
    checkbox.checked = value;  
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
        return F.extractValueE(checkbox);
    }
}
/**
 *  ReadWriteColumn
 * @constructor
 */
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
        return F.extractValueE(select);
    }
}
/**
 *  GenderColumn
 * @constructor
 */
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
        return F.extractValueE(select);
    }
}
/**
 *  DateColumn
 * @constructor
 */
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
/**
 *  StringCellRenderer
 * @constructor
 */
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
        return F.extractValueE(textbox);
    }
}
/**
 *  IntegerCellRenderer
 * @constructor
 */
function IntegerCellRenderer(value, cell, width){
    value = (value==undefined||value==null)?"":value;
    var displayDom = document.createElement("div");
    displayDom.className = "TableWidgetStringCellText";     //TableWidgetIntegerCellText
    cell.className="TableWidgetStringCell";
    var textbox = document.createElement("input");
//    textbox.className = "TableWidgetStringCellTextBox";       //TableWidgetIntegerCellTextBox
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
        var val = textbox.value;
        if(val.length==0)
            val = 0;
        return parseFloat(val);
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(textbox);
    }
}

/**                            
 *  TableWidgetB
 * @constructor
 */
function TableWidgetB(instanceId, widgetData, dataB){
    if(arguments.length!=3)
        log("Error TableWidgetB called with wrong argument count");
    var table = document.createElement("table");
    table.id = instanceId+"_table";
    table.className = "TableWidget";
    this.table = table;
    var confirmChanges = (widgetData!=undefined&&widgetData.confirmChanges!=undefined)?widgetData.confirmChanges:true;
    var confirmChangesB = F.constantB(confirmChanges);
   //Control Bar Buttons
    var saveButton = createIcon(window['SETTINGS']['theme'].path+"save.png");
    var cancelButton = createIcon(window['SETTINGS']['theme'].path+"cancel.png");
    var addRowButton = createIcon(window['SETTINGS']['theme'].path+"add.png");
    var deleteRowButton = createIcon(window['SETTINGS']['theme'].path+"delete.png"); 
    
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
    var userEventE = F.receiverE();
    var userEventB = userEventE.startsWith("view");
    
    var triggerSaveE = F.receiverE();
    var saveButtonPressedE = F.mergeE(triggerSaveE, F.extractEventE(saveButton,'click'));
    var cancelButtonPressedE = F.extractEventE(cancelButton,'click');   
    var addButtonPressedE = F.extractEventE(addRowButton,'click');
   var deleteButtonPressedE = F.extractEventE(deleteRowButton,'click');
    
    var sortingDOMColumnE = F.receiverE();
    var sortingDOMColumnB = sortingDOMColumnE.startsWith(NOT_READY);
    
    var sortedTableB = F.liftBI(function(sortingDOMColumn, table){
        //log("sortedTableB");
        if(table==NOT_READY){
            return NOT_READY;
        }
        if(sortingDOMColumn!=NOT_READY){
            var columns = table["COLUMNS"];
            var count = 0;
            for(index in columns){
                if(count==sortingDOMColumn&&columns[index]['visible']){
                    if(table['TABLEMETADATA']['sortColumn']==index){
                        table['TABLEMETADATA']['sortOrder'] = (table['TABLEMETADATA']['sortOrder']=="ASC")?"DESC":"ASC";    
                    }
                    table['TABLEMETADATA']['sortColumn'] = index;
                }
                if(columns[index]['visible']){
                    count++;
                }               
            }
        }
        
        return table;
    },function(value){
        return [NOT_READY, value];
    }, sortingDOMColumnB, dataB);
    
    //extractEventE(table,"click")                   jQuery(table).fj('extEvtE', 'click')
    var tableRowClickedE = F.extractEventE(table,"click").mapE(function(ev){
        stopEventBubble(ev);
        //ev.preventDefault();
        //return NOT_READY;
       // log("Row clicked");
        var target = (ev.target==undefined)?ev.srcElement:ev.target;
        jQuery(target).focus();
        if(target.tagName=="TH"){
            sortingDOMColumnE.sendEvent(jQuery(target).parent().children().index(target));  
            return NOT_READY;
        }
        var cell = findParentNodeWithTag(target, "td");
        var row = findParentNodeWithTag(cell, "tr");
        var table =findParentNodeWithTag(row, "table");
            if(row!=undefined){
                var clickedIndex = jQuery(row).prevAll().length;
                if(clickedIndex<=0 || (table.rows.length-1)==clickedIndex){
                    return NOT_READY;
                }
                return {clickedIndex: clickedIndex, shiftKey: ev.shiftKey, ctrlKey: ev.ctrlKey, target: target};
            }
        return NOT_READY;
    }).filterE(function(v){return v!=NOT_READY;});
    
    var tableBlurE = jQuery(document).fj('extEvtE', 'click').mapE(function(x){return NOT_READY;});    
    var rowSelectionResetE = F.receiverE();
    var tableSelectionRowIndexE = F.mergeE(tableRowClickedE, rowSelectionResetE.mapE(function(v){return NOT_READY;}), tableBlurE);
    var rowSelectionsE = tableSelectionRowIndexE.collectE([],function(newElement,arr) {
        if(newElement==NOT_READY)
            return []; 
           // log("Col");
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
    
    
    
    
    
    var showAddRowsResetE = F.receiverE();
    
    var showAddRowsB = F.mergeE(addButtonPressedE, showAddRowsResetE).collectE(false,function(newVal,lastVal){if(newVal==NOT_READY)return false;return !lastVal; }).startsWith(false);
           
    
    var pageRenderedB = F.liftBI(function(tableData){
        //log("pageRenderedB");
        table.removeChildren();
        addRow.removeChildren();
        //If not ready, show a loading icon
        if(tableData==NOT_READY){
            var element = document.createElement("td");
            element.className = "TableWidgetCell";
            jQuery(element).attr('colspan',visibleColumnCount);                                         
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+window['SETTINGS']['theme'].path+"loading.gif\" alt=\"\"/>";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div"), F.zeroE()];
        }  
        else if(tableData==NO_PERMISSION){
            var element = document.createElement("td");
            element.className = "TableWidgetCell";
            jQuery(element).attr('colspan',visibleColumnCount);                                         
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+window['SETTINGS']['theme'].path+"noperm.png\" alt=\"\"/><br />No Permission";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div"), F.zeroE()];
        }  
        //log(tableData);
        var headingTableRow = document.createElement("tr");
        var visibleColumnCount = 0;
       /* if(tableData['COLUMNS']==undefined){
            for (property in tableData){
                alert(property);
            }
            return;
        }  */
        
        
        var columns = tableData['COLUMNS'];
        var columnClicks = [];
        jQuery(controlsCell).attr('colspan',columns.length); 
        for(index in columns){ 
            var col = columns[index];
            //log(col);
            if(col.visible){
                var cell = document.createElement("th");
                if(col.width!=undefined){
                    cell.width = col.width;
                }
                cell.innerHTML = col.display;
                headingTableRow.appendChild(cell);
                visibleColumnCount++;
                columnClicks.push(F.extractEventE(cell, 'click'));
            }
        }
        var columnClicksE = F.mergeE.apply(this, columnClicks);
        table.appendChild(headingTableRow);
        
        
        //If ready render the table
        var tableMetaData = tableData['TABLEMETADATA'];
        var tablePermissions = (tableMetaData!=undefined&&tableMetaData['permissions']!=undefined&&tableMetaData['permissions']['canEdit']!=undefined)?tableMetaData['permissions']['canEdit']:true; 
      //  log("SortColumn: "+tableMetaData['sortColumn']);
        if(tableMetaData!=undefined&&tableMetaData['sortColumn']!=undefined){
            var sortCol = tableMetaData['sortColumn'];
        //    log(sortCol);
            if(sortCol!=undefined){
              //  log("INIF");
                var sortOrder = (tableMetaData['sortOrder']==undefined)?"DESC":tableMetaData['sortOrder'];
               // log(sortOrder);
                tableData['DATA'].sort(((tableData['COLUMNMETADATA'][sortCol]!=undefined&&tableData['COLUMNMETADATA'][sortCol]['sorter']!=undefined)?tableData['COLUMNMETADATA'][sortCol]['sorter']:function(row1, row2){return (typeof row1[sortCol] === 'string')?row1[sortCol].localeCompare( row2[sortCol]):row1[sortCol] - row2[sortCol];}));    
                if(sortOrder=="ASC"){
                    tableData['DATA'].reverse();
                }
                //return row1[filenameIndex].localeCompare(row2[filenameIndex]); 
            }
        } 
        
        var data = tableData['DATA'];
        renderedTable = new Array(); 
        for(index in data){
            var domRow = document.createElement("tr");
            var dataRow = data[index];
            var rowMetaData = tableData['ROWMETADATA'][index];
            var rowPermissions = (rowMetaData!=undefined&&rowMetaData['permissions']!=undefined)?rowMetaData['permissions']:"RW";
            if(renderedTable[index]==undefined)
                renderedTable[index] = new Array();
            for(cellIndex in columns){
                var columnMetaData = tableData['COLUMNMETADATA'][cellIndex];
                var columnPermissions = columnMetaData==undefined||columnMetaData['permissions']==undefined?"RW":columnMetaData['permissions'];
                var cellMetaData = (tableData['CELLMETADATA']==undefined||tableData['CELLMETADATA'][index]==undefined)?undefined:tableData['CELLMETADATA'][index][cellIndex];
                var cellPermissions = cellMetaData==undefined||cellMetaData['permissions']==undefined?"RW":cellMetaData['permissions']; 
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
                var column = columns[cellIndex];
		var customRenderer = (rowMetaData!=undefined&&rowMetaData["renderer"]!=undefined)?rowMetaData["renderer"]:(columnMetaData!=undefined&&columnMetaData["renderer"]!=undefined)?columnMetaData["renderer"]:(cellMetaData!=undefined&&cellMetaData["renderer"]!=undefined)?cellMetaData["renderer"]:undefined;

                if(customRenderer==undefined){
                    var renderClass = (CELL_RENDERERS[column.type]==undefined)?DefaultCellRenderer:CELL_RENDERERS[column.type];
                    var renderer = new renderClass(dataRow[cellIndex], cell, column.width);
                }
                else{
                    var renderer = customRenderer.getCellRenderer(dataRow[cellIndex], cell, column.width); 
                } 
                
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
                var columnMetaData = tableData['COLUMNMETADATA'][cellIndex];
                var columnPermissions = columnMetaData==undefined?"RW":columnMetaData.permissions;
                
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
                var column = columns[cellIndex];
                var customRenderer = (columnMetaData!=undefined&&columnMetaData["renderer"]!=undefined)?columnMetaData["renderer"]:undefined;	
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
        return [renderedTable, table, tableData, newRowsRenderedTable, columnClicksE];
        // Table of Cell Renderers, The Dom Table, the raw table data
    },function(value){
        return [value];
    }, sortedTableB);
    
    
    var renderedTableB = F.liftB(function(pageRendered){
        return pageRendered[0];
    }, pageRenderedB); 
    
    var domTableB = F.liftB(function(pageRendered){
        return pageRendered[1];
    }, pageRenderedB);
    
    var newRowsRenderedTableB = F.liftB(function(pageRendered){
        return pageRendered[3];
    }, pageRenderedB);  
    
    var columnClickedE = pageRenderedB.changes().mapE(function(pageRendered){
        return (pageRendered[4]);
    }).switchE();
    var columnClickedB = columnClickedE.startsWith(NOT_READY);
    
    
    
    
   /* var sortColumnB = F.liftB(function(columnClicked, data){
        if(!good()){
            return NOT_READY;
        }    
        var target = (columnClicked.target==undefined)?columnClicked.srcElement:columnClicked.target;
        var col = jQuery(target).parent().children().index(target);
        var columns = data["COLUMNS"];
        var count = 0;
        for(index in columns){
            if(count==col&&columns[index]['visible']){
                log(columns[index]['reference']);
                data['TABLEMETADATA']['sortColumn'] = columns[index]['reference'];
                return data;
            }
            if(columns[index]['visible']){
                count++;
            }               
        }
        return NOT_READY;
    }, columnClickedB, dataB);

    sortColumnB.changes().mapE(function(sortColumn){
        log("Sorting Column");
        dataB.sendEvent(sortColumn);
    });   */
    
    var filteredRowSelectionsB = F.liftB(function(rowSelections, renderedTable, newRowsRenderedTable){
            for(index in rowSelections){
                var targetIndex = rowSelections[index];
                if(targetIndex>renderedTable.length){
                    arrayCut(rowSelections, index);
                }                                               
            }
        return rowSelections;
    }, rowSelectionsB, renderedTableB, newRowsRenderedTableB); 
   var rowSelectionsEmptyB = filteredRowSelectionsB.liftB(function(rowSelections){return rowSelections.length==0;});      
    
    
    var renderedRowSelectionsB = F.liftB(function(renderedTable, rowSelections){
        if(renderedTable==NOT_READY||rowSelections==NOT_READY){
            return NOT_READY; 
        }
        var c = document.createElement("div");
            for(index in renderedTable){   
                var isSelected = arrayContains(rowSelections, parseInt(index)+1);
                for(cellIndex in renderedTable[index]){
                    //log("Setting Selected");
                    renderedTable[index][cellIndex]["renderer"].setSelected(isSelected);
                }
            }
    }, renderedTableB, rowSelectionsB);
    
    
       
    
    var tableAllowsAddB = dataB.liftB(function(tableData){
	//log("tableAllowsAddB");
	return (tableData["TABLEMETADATA"]!=undefined&&tableData["TABLEMETADATA"]['permissions']!=undefined&&tableData["TABLEMETADATA"]['permissions']['canAdd']!=undefined)?tableData["TABLEMETADATA"]['permissions']['canAdd']:true;
    });
    var tableAllowsDeleteB = dataB.liftB(function(tableData){
	//log(tableAllowsDeleteB);
	return (tableData["TABLEMETADATA"]!=undefined&&tableData["TABLEMETADATA"]['permissions']!=undefined&&tableData["TABLEMETADATA"]['permissions']['canDelete']!=undefined)?tableData["TABLEMETADATA"]['permissions']['canDelete']:true;
    });
    
    var tableDataChangedB = F.liftB(function(rendererTable, domTable){
        if(rendererTable==NOT_READY||rendererTable.length==0||domTable==NOT_READY)
            return F.receiverE().startsWith(NOT_READY);
//	log("tableDataChangedB");
        var updateEvents = new Array();
        for(var rowIndex in rendererTable){
            for(var colIndex in rendererTable[rowIndex]){
                
                updateE = rendererTable[rowIndex][colIndex]["renderer"].getUpdateEvent();
                updateEvents.push(updateE);
            }
        }                                                             
        //log("ZZZ");
        return F.mergeE.apply(this, updateEvents).startsWith(false);   
    },
    renderedTableB, domTableB).switchB();
    
   var userDataChangeB = F.orB(tableDataChangedB.changes().snapshotE(pageRenderedB).mapE(function(renderedData){
        // Table of Cell Renderers, The Dom Table, the raw table data
       // log("Checking Change");
        var rendererTable = renderedData[0];
        
        var domTable = renderedData[1];
        var columns = renderedData[2]["COLUMNS"];
        var dataTable = renderedData[2]["DATA"];
        /*var newRenderTable = renderedData[3]; */       
        for(var rowIndex in rendererTable){
            for(var colIndex in rendererTable[rowIndex]){
                var renderCell = rendererTable[rowIndex][colIndex];
                var dataCell = dataTable[rowIndex][colIndex];
                //log("Getting Renderer Value");
                
                if(columns[colIndex].visible&&(renderCell["renderer"]).getValue()!=dataCell){
                    
   /*                log("DIFF");
                    log(renderCell["renderer"].getValue()+" != "+dataCell);
                log(renderCell["renderer"]);
                log(typeof(rowIndex)+" "+typeof(colIndex));
                log(rowIndex+" "+colIndex);
                log(renderCell);
                log(dataCell);
                log(dataTable);
                log("/DIFF"); */
                    return true; 
                
                }
            } 
        }
        return false;
    }).startsWith(false), showAddRowsB); 
    
    F.liftB(function(userDataChange, confirmChanges){
        //log(userDataChange+" "+confirmChanges);
        if(userDataChange==NOT_READY||confirmChanges==NOT_READY){
            return NOT_READY;
        }
        
        if(userDataChange&&(!confirmChanges)){
            //log("Sending Update");
            triggerSaveE.sendEvent("ChangeEvent");
        }
    }, userDataChangeB, confirmChangesB);
    
    
    
    /*
    Gui Updates                     
    */
    F.insertValueB(F.ifB(F.andB(userDataChangeB, confirmChangesB), 'inline', 'none'),saveButton, 'style', 'display');
    F.insertValueB(F.ifB(F.andB(userDataChangeB, confirmChangesB), 'inline', 'none'),cancelButton, 'style', 'display');
    
    F.insertValueB(F.ifB(showAddRowsB, 'table-row', 'none'),addRow, 'style', 'display');
  
    F.insertValueB(F.ifB(F.andB(F.notB(showAddRowsB), tableAllowsAddB), 'inline', 'none'),addRowButton, 'style', 'display');
    F.insertValueB(F.ifB(rowSelectionsEmptyB, 'auto', 'pointer'),deleteRowButton, 'style', 'cursor');
    F.insertValueB(F.ifB(tableAllowsDeleteB, 'inline', 'none'),deleteRowButton, 'style', 'display');
    F.insertValueB(F.ifB(F.notB(rowSelectionsEmptyB), window['SETTINGS']['theme'].path+'delete.png', window['SETTINGS']['theme'].path+'delete_disabled.png'),deleteRowButton, 'src'); 

    /*
    Save Rows
    */
    cancelButtonPressedE.snapshotE(dataB).mapE(function(data){
        showAddRowsResetE.sendEvent(NOT_READY);
        dataB.sendEvent(data); 
    });
    saveButtonPressedE.snapshotE(F.liftB(function(pageRendered, showAddRows){return [pageRendered, showAddRows]}, pageRenderedB,showAddRowsB)).mapE(function(data){
//log("saveButtonPressedE");    
    //log("save pressed");    
	var renderedTable = data[0][0];
        var dataTable = data[0][2]["DATA"];
        var columns = data[0][2]["COLUMNS"];
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
               //log("Save Button Get Renderer ");
                var value = cell["renderer"].getValue();
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
                        //log("Save Button Get Renderer "); 
                        var value = cell["renderer"].getValue();
                        dataTable[r][c] = value;
                    }
                }
                if(showAddRows){
                for(rowIndex=0;rowIndex<newRenderedTable.length;rowIndex++){
                    for(c=0;c<newRenderedTable[rowIndex].length;c++){
                        var cell = newRenderedTable[rowIndex][c];
                        //log("Save Button Get Renderer "); 
                        var value = cell["renderer"].getValue();
                        if(dataTable[rowIndex+r]==undefined)
                            dataTable[rowIndex+r] = new Array();
                        dataTable[rowIndex+r][c] = value;
                    }
                }
            }    
        }
        pageRenderedB.sendEvent(data[0][2]);  
        showAddRowsResetE.sendEvent(NOT_READY);    
    });      
    
    
    /*
    Delete Rows
    */
    var pageDataAndRowSelectionsB = F.liftB(function(renderedData, rowSelections){
    if(renderedData==NOT_READY||rowSelections==NOT_READY){
        return NOT_READY;                         
    }
          //  log("Page and row selections");
        return {renderedData: renderedData, rowSelections: rowSelections};
    }, pageRenderedB, rowSelectionsB);
    var deleteTableRowsB = deleteButtonPressedE.snapshotE(pageDataAndRowSelectionsB).startsWith(NOT_READY);
    
    deleteTableRowsB.liftB(function(data){
        if(data==NOT_READY || data.rowSelections.length==0){
            return;
        }
        var rowSelections = data.rowSelections.reverse(); 
        var renderedTable = data.renderedData[0];
        var dataTable = data.renderedData[2]["DATA"];
        var columns = data.renderedData[2]["COLUMNS"];
        for(index=0;index<rowSelections.length;index++){
            arrayCut(data.renderedData[2]["DATA"], (rowSelections[index]-1));
        }      
        UI.confirm("Delete Rows", "Are you sure you wish to delete these "+rowSelections.length+" row(s)", "Yes", function(val){
            rowSelectionResetE.sendEvent(true);
            pageRenderedB.sendEvent(data.renderedData[2]);
        }, "No",
        function(val){
            rowSelectionResetE.sendEvent(true);
        }); 
    });
    
    domTableB.delayB(1000).liftB(function(domTable){
        /*jQuery(domTable).colResizable({
            liveDrag:true, 
            gripInnerHtml:"<div class='grip'></div>", 
            draggingClass:"dragging", 
            onResize:function(resize){
                log(resize);
            }}); */
    });
    return domTableB
}
function getTableRowId(table, rowIndex){
    if(table.TABLEMETADATA!=undefined&&table.TABLEMETADATA['idColumn']!=undefined){
        var idColumnStr = table.TABLEMETADATA['idColumn'];
        var colIndex = getColumnIndex(table, idColumnStr);
        if(colIndex==null)
            return null;
        return table["DATA"][rowIndex][colIndex];
    }
    else
        log("Error, no id column specified in table meta data");
}
function getTableValue(table, rowIndex, columnName){
	var colIndex = getColumnIndex(table, columnName);
    if(colIndex==null)
        return null;
    return table["DATA"][rowIndex][colIndex];
}
function getColumnIndex(table, columnName){
    for(colIndex in table["COLUMNS"]){
        if(table["COLUMNS"][colIndex]["reference"]==columnName){
            return colIndex;
        }
    }
    return null;
}
function JoinTableB(table1B, table2B, columnId){
    return F.liftBI(function(table1, table2){
        if(table1==NOT_READY||table2==NOT_READY){
            return NOT_READY;
        }
        var searchColIndex1 = columnId;
        for(colIndex in table1["COLUMNS"]){
            if(columnId==table1["COLUMNS"]["reference"]){
                searchColIndex = colIndex;
                break;
            }        
        }
        var searchColIndex2 = columnId;
        for(colIndex in table2["COLUMNS"]){
            if(columnId==table2["COLUMNS"]["reference"]){
                searchColIndex = colIndex;
                break;
            }        
        }
        
        /*for(property in table1){
            log(property);
            log(table1[property]);
        }*/  
        
        table1["COLUMNS"] = table1["COLUMNS"].concat(table2["COLUMNS"]);
        //table1["COLUMNMETADATA"] = table1["COLUMNMETADATA"].concat(table2["COLUMNMETADATA"]);
        for(rowIndex in table1["DATA"]){
            var searchCell1 = table1["DATA"][rowIndex][searchColIndex1];
            for(rowIndex2 in table2["DATA"]){
                var searchCell2 = table2["DATA"][rowIndex2][searchColIndex2];
                if(searchCell1==searchCell2){
                    for(colIndex2 in table2["DATA"][rowIndex2]){
                        table1["DATA"][rowIndex][table1["COLUMNS"].length+colIndex2] = table2["DATA"][rowIndex2][colIndex2];
                    }
                }    
            }
        }
        return table1;
    }, function(mergeTable){
    
        return [table1, table2];
    }, table1B, table2B);
}