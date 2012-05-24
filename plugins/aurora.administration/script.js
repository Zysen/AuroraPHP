/* BASE WIDGETS */        
function WebpageSettingsWidget(instanceId, data){
    this.loader=function(){
        
        var targetPlugin = (data!=undefined&&data.plugin!=undefined)?data.plugin:"aurora";
        var themesR = DATA.getRemote("aurora_theme_list", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW 
        var dataR = DATA.getRemote("aurora_settings", targetPlugin, NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW    
        var dataBI = dataR.behaviour;
        var rendererTypedB = liftBI(
        function(settingTable, themes){
            if(settingTable==NOT_READY||themes==NOT_READY)
                return NOT_READY;
            if(settingTable==NO_PERMISSION||themes==NO_PERMISSION)
                return NO_PERMISSION;
                
            var settingTable = clone(settingTable);
            var cellMetaData = [];
            for(rowIndex in settingTable.DATA){
                var cellMetaDataRow = [];
                var name = getTableValue(settingTable, rowIndex, "name"); 
                var type = getTableValue(settingTable, rowIndex, "type");
                var description = getTableValue(settingTable, rowIndex, "description");
                var value = getTableValue(settingTable, rowIndex, "value");
                var valueColIndex = getColumnIndex(settingTable, "value");
                
                                                                              
                if(CELL_RENDERERS[type]!=undefined){
                    var renderer = new BasicCellRenderer(type, name);
                    cellMetaDataRow[valueColIndex] = {renderer: renderer};    
                }
                else if(type=="userDisplay"){
                    var options = [{display: "Username", value: 1}, {display: "Firstname", value: 2}, {display: "Full Name", value: 3}];
                    var renderer = new BasicRadioCellRendererContainer(name, options);
                    cellMetaDataRow[valueColIndex] = {renderer: renderer};  
                }
                else if(type=="themeSelect"){
                    var options = [];
                    for(rowId in themes.DATA){
                        var themeId = getTableValue(themes, rowId, "theme_id");
                        var themeName = getTableValue(themes, rowId, "theme_name");
                        options.push({display: themeName, value: themeId});
                    }
                    var renderer = new BasicSelectCellRendererContainer(options);
                    cellMetaDataRow[valueColIndex] = {renderer: renderer};            
                }
                cellMetaData.push(cellMetaDataRow);
            }
            settingTable.CELLMETADATA = cellMetaData;
            return settingTable;
        },
        function(settingTable, themes){
           // var settingTable = clone(settingTable);
            return [settingTable, undefined];
        },
        dataBI, themesR.behaviour);   
        tableBI = TableWidgetB(instanceId+"_table", data, rendererTypedB);    
        insertDomB(tableBI, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("aurora_settings", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
widgetTypes['WebpageSettingsWidget']=WebpageSettingsWidget;   
function GroupsManagerWidget(instanceId, data){
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW    
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
widgetTypes['GroupsManagerWidget']=GroupsManagerWidget;

function PluginManagerWidget(instanceId, data){
    
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
widgetTypes['PluginManagerWidget']=PluginManagerWidget;   
function BehaviourPermissionsWidget(instanceId, data){      
    this.loader=function(){
    	var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);
    	var behavioursR = DATA.getRemote("aurora_permissions", "", NOT_READY, POLL_RATES.VERY_FAST);
        var behaviourPermissionsR = DATA.getRemote("aurora_permissions_set", "", NOT_READY, POLL_RATES.VERY_FAST);  
        
	    var groupsB = groupsR.behaviour;
        var behavioursB = behavioursR.behaviour;
        var newTableB = liftBI(function(behaviourPermissions, groups, behaviours){   	
	        if(groups==NOT_READY||behaviours==NOT_READY||behaviourPermissions==NOT_READY)
                return NOT_READY;
            if(groups==NO_PERMISSION||behaviours==NO_PERMISSION||behaviourPermissions==NO_PERMISSION)
                return NO_PERMISSION;
            var columns = [{reference: "behaviour", display: "", type: "string", visible:true, readOnly: false}];
            var groupColMap = new Array();
            var count = 1;
            for(groupIndex in groups.DATA){
        	    var group = groups.DATA[groupIndex];
        	    columns.push({reference: group[0], display: group[1],visible:true, readOnly: false});
        	    groupColMap[group[0]+""] = count++;
            }
            var data = [];
            var rowMetaData = [];
            var cellMetaData = [];
            var columnMetaData = [];
            columnMetaData[0] = {permissions: "R"};
            for(behaviourIndex in behaviours.DATA){
        	    var behaviour = behaviours.DATA[behaviourIndex];
        	    var behaviourId = getTableValue(behaviours, behaviourIndex, "behaviourId");
                var permissionRegType = getTableValue(behaviours, behaviourIndex, "type");
                var typeRenderer = new BasicCellRenderer(permissionRegType);
                var behaviourDescription = getTableValue(behaviours, behaviourIndex, "description");
           		var dataRow = [behaviourDescription];
           		var cellMetaDataRow = [];
                for(groupIndex in groups.DATA){ 
                    cellMetaDataRow[parseInt(groupIndex)+1] = {renderer: typeRenderer}; 
                }
        	    for(permissionIndex in behaviourPermissions.DATA){
        		    var bPermissionsBehaviourId = getTableValue(behaviourPermissions, permissionIndex, "behaviourId");
        		    
                    if(behaviourId==bPermissionsBehaviourId){
        			    var bPermission = behaviourPermissions.DATA[permissionIndex];
				        var bPermissionId = getTableValue(behaviourPermissions, permissionIndex, "bPermissionId");
           				var bPermissionGroupId = getTableValue(behaviourPermissions, permissionIndex, "groupId");
           				var bPermissionPermission = getTableValue(behaviourPermissions, permissionIndex, "permissions");
        			    var colIndex = groupColMap[bPermissionGroupId+""];
                        if(bPermissionPermission=="true"||bPermissionPermission=="false"){
                            bPermissionPermission = auroraParseBoolean(bPermissionPermission);
                        }
        			    dataRow[colIndex] = bPermissionPermission;
                        cellMetaDataRow[colIndex].permissionId = bPermissionId;
                        if(bPermissionGroupId==3&&(bPermissionsBehaviourId==2||bPermissionsBehaviourId==4||bPermissionsBehaviourId==5))
                            cellMetaDataRow[colIndex].permissions = {canEdit: false};
        		    }
        	    }
        	    cellMetaData.push(cellMetaDataRow);
        	    data.push(dataRow);
        	    rowMetaData.push(behaviourId);
            }
	        var table = {DATA: data, COLUMNS: columns, TABLEMETADATA: {originalColumns: behaviourPermissions.COLUMNS, permissions: {canAdd: false, canDelete: false, canEdit: true}}, ROWMETADATA: rowMetaData, CELLMETADATA: cellMetaData, COLUMNMETADATA: columnMetaData, SOURCETABLES: {groups: groups, behaviours: behaviours,  behaviourPermissions: behaviourPermissions}};
            return table;
        },
        function(value){
        	var permissionsData = value.DATA;
        	var newData = [];
        	for(rowIndex in permissionsData){
        		newRow = [];
        		var row = permissionsData[rowIndex];
        		var behaviourName = row[0];
        		var behaviourId = value.ROWMETADATA[rowIndex];
        		for(colIndex in value.COLUMNS){
        			if(colIndex==0)
        				continue;
        			var dataIndex = parseInt(colIndex)+1;
        			var column = value.COLUMNS[colIndex];
        			var groupId = column.reference;
        			var dataCell = row[colIndex];
        			if(dataCell!=undefined){
        				var id=(value.CELLMETADATA[rowIndex][colIndex]!=undefined)?value.CELLMETADATA[rowIndex][colIndex].permissionId:"NULL";
        				newData.push([id, behaviourId, groupId, , dataCell]);
        			}
        		}		
        	}
        	var newTable = {DATA: newData, COLUMNS: value.TABLEMETADATA.originalColumns, TABLEMETADATA: {permissions: {canAdd: false, canDelete: false, canEdit: true}}, ROWMETADATA: [], CELLMETADATA: [], COLUMNMETADATA: []};
		return [newTable, undefined,undefined];		
        },
        behaviourPermissionsR.behaviour, groupsB, behavioursB);        
        tableB = TableWidgetB(instanceId+"_table", data, newTableB);    
        insertDomB(tableB, instanceId+"_container");
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
widgetTypes['BehaviourPermissionsWidget']=BehaviourPermissionsWidget; 

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
    this.getUpdateEvent = function(){
        return extractValueE(select);
    }
}                                                            
function UsersManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_users", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST); //, NOT_READY, POLL_RATES.SLOW
        var renderedTableB = liftBI(function(data, groups){
            if(data==NOT_READY||groups==NOT_READY)
                return NOT_READY;
            for(colIndex in data.COLUMNS){
                if(data.COLUMNS[colIndex].reference=="group"){
                    if(data.COLUMNMETADATA[colIndex]==undefined)
                        data.COLUMNMETADATA[colIndex] = {};
                    data.COLUMNMETADATA[colIndex].renderer = new AuroraUserGroupColumn(groups.DATA);
                }
            
            }
            //showObj(data);
            return data;
        },function(value){
            return [value, null];
        }, dataR.behaviour, groupsR.behaviour);
    
    tableB = TableWidgetB(instanceId+"_table", data, renderedTableB);    
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
    
    
