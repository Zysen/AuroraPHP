/* BASE WIDGETS */        
/**
 *  WebpageSettingsWidget
 * @constructor
 */
function WebpageSettingsWidget(instanceId, data){
    this.loader=function(){
        
        var targetPlugin = (data!=undefined&&data.plugin!=undefined)?data.plugin:"aurora";
        var themesR = DATA.getRemote("aurora_theme_list", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW 
        var dataR = DATA.getRemote("aurora_settings", targetPlugin, NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW    
        var dataBI = dataR.behaviour;
        //log("loader");
        var rendererTypedB = F.liftBI(
        function(settingTable, themes){
            //log("lift1");  
            if(settingTable==NOT_READY||themes==NOT_READY)
                return NOT_READY;
            if(settingTable==NO_PERMISSION||themes==NO_PERMISSION)
                return NO_PERMISSION;
            //log("lift2");        
            //var settingTable = clone(settingTable);
            var cellMetaData = [];
            for(rowIndex in settingTable["DATA"]){
              //  log("Loop: "+rowIndex);
                var cellMetaDataRow = [];
                var name = getTableValue(settingTable, rowIndex, "name"); 
                var type = getTableValue(settingTable, rowIndex, "type");
                var description = getTableValue(settingTable, rowIndex, "description");
                var value = getTableValue(settingTable, rowIndex, "value");
                var valueColIndex = getColumnIndex(settingTable, "value");
                
                                                                              
                if(CELL_RENDERERS[type]!=undefined){
                    var renderer = new BasicCellRenderer(type, name);
                    cellMetaDataRow[valueColIndex] = {"renderer": renderer};    
                }
                else if(type=="userDisplay"){
                    var options = [{"display": "Username", value: 1}, {"display": "Firstname", "value": 2}, {"display": "Full Name", "value": 3}];
                    var renderer = new BasicRadioCellRendererContainer(name, options);
                    cellMetaDataRow[valueColIndex] = {"renderer": renderer};  
                }
                else if(type=="themeSelect"){
                    var options = [];
                    for(rowId in themes["DATA"]){
                        var themeId = getTableValue(themes, rowId, "theme_id");
                        var themeName = getTableValue(themes, rowId, "theme_name");
                        options.push({"display": themeName, "value": themeId});
                    }
                    var renderer = new BasicSelectCellRendererContainer(options);
                    cellMetaDataRow[valueColIndex] = {"renderer": renderer};            
                }
                cellMetaData.push(cellMetaDataRow);
            }
            settingTable["CELLMETADATA"] = cellMetaData;
            //log("Lift Return");
            return settingTable;
        },
        function(settingTable, themes){
           // var settingTable = clone(settingTable);
            return [settingTable, undefined];
        },
        dataBI, themesR.behaviour);   
        tableBI = TableWidgetB(instanceId+"_table", data, rendererTypedB);    
        F.insertDomB(tableBI, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("aurora_settings", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("WebpageSettingsWidget", WebpageSettingsWidget); 
/**
 *  GroupsManagerWidget
 * @constructor
 */
function GroupsManagerWidget(instanceId, data){
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW    
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        F.insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("GroupsManagerWidget", GroupsManagerWidget);
/**
 *  PluginManagerWidget
 * @constructor
 */
function PluginManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_plugins", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        F.insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_plugins", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("PluginManagerWidget", PluginManagerWidget);

/**
 *  BehaviourPermissionsWidget
 * @constructor
 */
function BehaviourPermissionsWidget(instanceId, data){      
    this.loader=function(){
    	var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);
    	var behavioursR = DATA.getRemote("aurora_permissions", "", NOT_READY, POLL_RATES.VERY_FAST);
        var behaviourPermissionsR = DATA.getRemote("aurora_permissions_set", "", NOT_READY, POLL_RATES.VERY_FAST);  
        
	    var groupsB = groupsR.behaviour;
        var behavioursB = behavioursR.behaviour;
        var newTableB = F.liftBI(function(behaviourPermissions, groups, behaviours){   	
	        if(groups==NOT_READY||behaviours==NOT_READY||behaviourPermissions==NOT_READY)
                return NOT_READY;
            if(groups==NO_PERMISSION||behaviours==NO_PERMISSION||behaviourPermissions==NO_PERMISSION)
                return NO_PERMISSION;
            var columns = [{"reference": "behaviour", "display": "", "type": "string", "visible":true, "readOnly": false}];
            var groupColMap = new Array();
            var count = 1;
            for(groupIndex in groups["DATA"]){
                var groupId = getTableValue(groups, groupIndex, "groupId");
                var groupName = getTableValue(groups, groupIndex, "group");
        	    //var group = groups["DATA"][groupIndex];
        	    columns.push({"reference": groupId, "display": groupName,"visible":true, "readOnly": false});
        	    groupColMap[groupId+""] = count++;
            }
            var data = [];
            var rowMetaData = [];
            var cellMetaData = [];
            var columnMetaData = [];
            columnMetaData[0] = {"permissions": "R"};
            for(behaviourIndex in behaviours["DATA"]){
        	    var behaviour = behaviours["DATA"][behaviourIndex];
        	    var behaviourId = getTableValue(behaviours, behaviourIndex, "permissionRegisterId");
                var permissionRegType = getTableValue(behaviours, behaviourIndex, "type");
                var typeRenderer = new BasicCellRenderer(permissionRegType);
                var behaviourDescription = getTableValue(behaviours, behaviourIndex, "description");
           		var dataRow = [behaviourDescription];
           		var cellMetaDataRow = [];
                for(groupIndex in groups["DATA"]){           
                    cellMetaDataRow[parseInt(groupIndex)+1] = {"renderer": typeRenderer}; 
                }
        	    for(permissionIndex in behaviourPermissions["DATA"]){
        		    var bPermissionsBehaviourId = getTableValue(behaviourPermissions, permissionIndex, "permissionRegisterId");
                    if(behaviourId==bPermissionsBehaviourId){
        			    var bPermission = behaviourPermissions["DATA"][permissionIndex];
				        var bPermissionId = getTableValue(behaviourPermissions, permissionIndex, "permissionId");
           				var bPermissionGroupId = getTableValue(behaviourPermissions, permissionIndex, "groupId");
           				var bPermissionPermission = getTableValue(behaviourPermissions, permissionIndex, "permissions");
        			    var colIndex = groupColMap[bPermissionGroupId+""];
                        //alert(colIndex);
                        if(bPermissionPermission=="true"||bPermissionPermission=="false"){
                            bPermissionPermission = auroraParseBoolean(bPermissionPermission);
                        }
        			    dataRow[colIndex] = bPermissionPermission;
                        cellMetaDataRow[colIndex]["permissionId"] = bPermissionId;
                        if(bPermissionGroupId==3&&(bPermissionsBehaviourId==2||bPermissionsBehaviourId==4||bPermissionsBehaviourId==5))
                            cellMetaDataRow[colIndex]["permissions"] = {"canEdit": false};
        		    }
        	    }
        	    cellMetaData.push(cellMetaDataRow);
        	    data.push(dataRow);
        	    rowMetaData.push(behaviourId);
            }
	        var table = {"DATA": data, "COLUMNS": columns, "TABLEMETADATA": {"originalColumns": behaviourPermissions["COLUMNS"], "permissions": {"canAdd": false, "canDelete": false, "canEdit": true}}, "ROWMETADATA": rowMetaData, "CELLMETADATA": cellMetaData, "COLUMNMETADATA": columnMetaData};
            return table;
        },
        function(value){
        	var permissionsData = value["DATA"];
        	var newData = [];
        	for(rowIndex in permissionsData){
        		newRow = [];
        		var row = permissionsData[rowIndex];
        		var behaviourName = row[0];
        		var behaviourId = value["ROWMETADATA"][rowIndex];
        		for(colIndex in value["COLUMNS"]){
        			if(colIndex==0)
        				continue;
        			var dataIndex = parseInt(colIndex)+1;
        			var column = value["COLUMNS"][colIndex];
        			var groupId = column["reference"];
        			var dataCell = row[colIndex];
        			if(dataCell!=undefined){
        			   //log(value["CELLMETADATA"][rowIndex][colIndex]);
                       /* log("RI: "+rowIndex);
                        log("CI: "+colIndex);
                        log("permissionId: "+value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]);
                        log(value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]);
                        for(index in value["CELLMETADATA"][rowIndex][colIndex]){
                            log("Index: "+index);
                        }
                        log("");*/
                        var id=(value["CELLMETADATA"][rowIndex][colIndex]!=undefined&&value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]!=undefined)?value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]:"NULL";
        				///log("ID: "+id+", RI:"+rowIndex+", CI:"+colIndex);
                        newData.push([id, behaviourId, groupId, undefined, dataCell]);
        			}
        		}		
        	}
        	var newTable = {"DATA": newData, "COLUMNS": value["TABLEMETADATA"].originalColumns, "TABLEMETADATA": {"permissions": {"canAdd": false, "canDelete": false, "canEdit": true}}, "ROWMETADATA": [], "CELLMETADATA": [], "COLUMNMETADATA": []};
		return [newTable, undefined,undefined];		
        },
        behaviourPermissionsR.behaviour, groupsB, behavioursB);        
        tableB = TableWidgetB(instanceId+"_table", data, newTableB);    
        F.insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_groups", "");
        DATA.deregister("aurora_permissions", "");
        DATA.deregister("aurora_permissions_set", "");
        
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("BehaviourPermissionsWidget", BehaviourPermissionsWidget);

/**
 *  AuroraUserGroupColumn
 * @constructor
 */
function AuroraUserGroupColumn(groups){
    this.groups = groups;
    this.getCellRenderer = function(value, cell, width){
	    if(cell==undefined){
		    //alert("caller is " + arguments.callee.caller.toString());
		    return null;
	    }	   
        return new AuroraGroupCellRenderer(groups, value, cell, width);    
    }
}
/**
 *  AuroraGroupCellRenderer
 * @constructor
 */
function AuroraGroupCellRenderer(groups, value, cell, width){
    var select = document.createElement("select");
    var index;
    cell.className="TableWidgetCell";
    for(index in groups){
                var group = groups[index];
                var option=document.createElement("OPTION");
                option.appendChild(document.createTextNode(group[1]));
                option.value = group[0];
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
    this.getUpdateEvent = function(){;
        return F.extractValueE(select);
    }
}             
/**
 *  UsersManagerWidget
 * @constructor
 */                                               
function UsersManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_users", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST); //, NOT_READY, POLL_RATES.SLOW
        var renderedTableB = F.liftBI(function(data, groups){
            if(data==NOT_READY||groups==NOT_READY)
                return NOT_READY;
            for(colIndex in data["COLUMNS"]){
                if(data["COLUMNS"][colIndex]["reference"]=="group"){
                    if(data["COLUMNMETADATA"][colIndex]==undefined)
                        data["COLUMNMETADATA"][colIndex] = {};
                    data["COLUMNMETADATA"][colIndex]["renderer"] = new AuroraUserGroupColumn(groups["DATA"]);
                }
            
            }
            //showObj(data);
            return data;
        },function(value){
            return [value, null];
        }, dataR.behaviour, groupsR.behaviour);
    
    tableB = TableWidgetB(instanceId+"_table", data, renderedTableB);    
    F.insertDomB(tableB, instanceId+"_container");
    
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
WIDGETS.register("UsersManagerWidget", UsersManagerWidget);     

/**
 *  HTMLSelectWidget
 * @constructor
 */ 
function HTMLSelectWidget(instanceId, userData){
    /*var width = (data.placeholder!=undefined&&data.placeholder.style.width!=undefined)?data.placeholder.style.width:undefined;
    var height = (data.placeholder!=undefined&&data.placeholder.style.height!=undefined)?data.placeholder.style.height:undefined;
    */
    var id = instanceId+"_container";
    var container = createDomElement("div", id);
    container.className = "HTMLSelectWidget";
    container.style.overflow = 'auto';
    this.rowSelectionsB = undefined;
    this.loader=function(){
        var dataB = userData['dataB'];
        var htmlDataB = dataB.liftB(function(data){
            var cont = document.createElement("div");
            for(index in data){
                var optionValue = data[index].value;
                var optionHTML = data[index].display;
                var optionElement = createDomElement("div",undefined, "HTMLSelectWidgetOption",optionHTML);
                optionElement.id = "HTMLSelectWidgetOption_"+index;
                //cont.appendChild(optionElement);
                container.appendChild(optionElement);
            }
            return container;
        });
        F.insertDomB(htmlDataB, id);
       var optionClickedE = jQuery(container).fj('extEvtE', 'click').mapE(function(ev){
            var target = (ev.target==undefined)?ev.srcElement:ev.target;
            while(target.parentNode!=undefined){
                if(target.className=="HTMLSelectWidgetOption"||target.className=="HTMLSelectWidgetOptionSelected"){
                    var clicked = parseInt(target.id.replace("HTMLSelectWidgetOption_", ""));
                    return clicked;
                }
                target = target.parentNode; 
            }
       });
       
       
       var rowSelectionsE = optionClickedE.collectE([],function(newElement,arr) {
        if(newElement==NOT_READY)
            return []; 
           // log("Col");
           var clickedIndex = newElement;
            if(arr.length==1&&arrayContains(arr, clickedIndex)){
                arr = [];
            }
            else{
                arr = [clickedIndex];
            }
        return arr;
        });
        this.selected = F.liftB(function(optionData, rowSelections){
            if(optionData==NOT_READY||rowSelections==NOT_READY)
                return NOT_READY;
            for(index in optionData){
                document.getElementById("HTMLSelectWidgetOption_"+index).className = "HTMLSelectWidgetOption";    
            }
            if(rowSelections.length==1){
                var selectedIndex = rowSelections[0];
                document.getElementById("HTMLSelectWidgetOption_"+selectedIndex).className = "HTMLSelectWidgetOptionSelected";
                return optionData[selectedIndex].value;
            }
            return NOT_READY;
        }, dataB, rowSelectionsE.startsWith(NOT_READY));
    }
    this.destroy=function(){

    }
    this.build=function(){
        return "<div id=\""+id+"\">&nbsp;</div>";
    }
    this['selectedValue'] = function(){return this.selected.valueNow()};
}
WIDGETS.register("HTMLSelectWidget", HTMLSelectWidget);  

/**
 *  StringBuilderEx
 * @constructor
 */
StringBuilderEx = function(){
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
    
/**
 *  FirstNameWidget
 * @constructor
 */ 
function FirstNameWidget(instanceId, data){
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">"+window['SETTINGS']['user']['firstname']+"</span>"; 
    }                         
} 
/**
 *  FirstNameWidgetConfigurator
 * @constructor
 */ 
function FirstNameWidgetConfigurator(){
    this['render'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "First Name Widget";
    }
    this['getDescription'] = function(){
        return "Text showing the current users first name";
    }
    this['getImage'] = function(){}
} 
WIDGETS.register("FirstNameWidget", FirstNameWidget, FirstNameWidgetConfigurator); 

/**
 *  FullNameWidget
 * @constructor
 */ 
function FullNameWidget(instanceId, data){
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">"+window['SETTINGS']['user']['firstname']+" "+window['SETTINGS']['user']['lastname']+"</span>"; 
    }                         
}   
/**
 *  FullNameWidgetConfigurator
 * @constructor
 */ 
function FullNameWidgetConfigurator(){
    this['render'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "Last Name Widget";
    }
    this['getDescription'] = function(){
        return "Text showing the current users last name";
    }
    this['getImage'] = function(){}
} 
WIDGETS.register("FullNameWidget", FullNameWidget, FullNameWidgetConfigurator); 

/**
 *  UsernameWidget
 * @constructor
 */ 
function UsernameWidget(instanceId, data){
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">"+window['SETTINGS']['user']['username']+"</span>"; 
    }                         
}

/**
 *  UsernameWidgetConfigurator
 * @constructor
 */                                                      
function UsernameWidgetConfigurator(){
    this['render'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "User Name Widget";
    }
    this['getDescription'] = function(){
        return "Text showing the current users user name";
    }
    this['getImage'] = function(){}
} 
WIDGETS.register("UsernameWidget", UsernameWidget, UsernameWidgetConfigurator); 
//HASHffff