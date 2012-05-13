//var themesR = DATA.get("aurora_themes", "", true, POLL_RATES.FAST);

function ThemeSelect(instanceId, data){
    var targetId = instanceId+"_target";
    this.loader=function(){
    
    var themesR = DATA.getRemote("aurora_themes", "", true);
        themesR.behaviour.liftB(function(data){
            var html = "<select name=\""+instanceId+"\">";
            for(index in data){  
                theme = data[index];                                   
                html += "<option value=\""+theme.id+"\""+(theme.selected?" selected=\"true\"":"")+">"+theme.name+"</option>";
            }
            html += "</select>";
            if(document.getElementById(targetId))
                document.getElementById(targetId).innerHTML = html;
        }); 
    }
    this.destroy=function(){
        //DATA.deregister("aurora_themes", "");
    }
    this.build=function(){
        return "<span id=\""+targetId+"\"></span>";
    }
}                   
function WebpageSettingsStringFormatter(instanceId, data){
    var stringFormat = data.stringFormat;
    var value = data.value;
    var widgets = new Array(); 
    this.loader=function(){
            
    }
    this.build=function(){
        var controls = "";
        if(stringFormat.startsWith("textarea")){
            var attributes = stringFormat.split(":");
            controls = "<textarea name=\""+instanceId+"\" rows=\""+attributes[1]+"\" cols=\""+attributes[2]+"\">"+value+"</textarea>";
        }
        else if(stringFormat.startsWith("text")){
            var attributes = stringFormat.split(":");
            controls = "<input name=\""+instanceId+"\" type=\"text\" value=\""+value+"\""+((attributes[1]!=0)?" size=\""+attributes[1]+"\"":"")+((attributes[2]!=0)?" maxlength=\""+attributes[2]+"\"":"")+" />";    
        }
        else if(stringFormat.startsWith("check")){
            var options = stringFormat.split("|");
            for(index in options){
                var thisCheck = options[index];
                var attributes = thisCheck.split(":");
                var checked = value==attributes[2];
                controls+=attributes[1]+":<input type=\"radio\" name=\""+instanceId+"\" value=\""+attributes[2]+"\""+(value==attributes[2]?" checked=\"checked\" ":"")+" />";
            }    
        }
        else if(stringFormat.startsWith("select")){
            var attributes = stringFormat.split(":");
                if(attributes[1]=="<THEME_SELECT>"){
                    var themeSelector = new ThemeSelect(instanceId, {});
                    controls+=themeSelector.build();
                    themeSelector.loader();
                    widgets.push(themeSelector);
                    
                }
        }           
        return "<div id=\""+instanceId+"_wrapper\">"+controls+"</div>";
    }   
    this.destroy=function(){
        for(index in widgets){
            widgets[index].destroy();
        }    
    }     
}
function WebpageSettingsEditor(instanceId, data){
    //var themesR = DATA.getRemote("aurora_themes", "", true);//This is so it is requested early
    var settingsR = DATA.getRemote("aurora_settings", data.plugin, NOT_READY, POLL_RATES.NORMAL);
    var submitId = instanceId+"_submit";
    var tableDivId = instanceId+"_settings";
    var tableId = instanceId+"_table";
    var widgets = new Array();
    var parent = this;
    this.loader=function(){
        var renderHTMLTableB = liftBI(function(settings){
            if(settings==NOT_READY)     
                return createDomElement('div', "", "", "Loading ");
            log("renderHTMLTableB DOWN: "+ObjectToString(settings));
            //parent.destroyChildWidgets();
            
            widgets = new Array();
            widgets.length=0;
            var table = document.createElement('table');
            table.id = tableId;
            i=0;
            for(index in settings){    
                var setting = settings[index];  
                var tableRow = document.createElement('tr');
                var cell1 = document.createElement('td');
                cell1.appendChild(document.createTextNode(setting.description));
                tableRow.appendChild(cell1);                                   
                var formatter = new WebpageSettingsStringFormatter(instanceId+"_"+setting.name, {stringFormat: setting.formatString, value: setting.value});//"{'stringFormat':'"+settings[index].formatString+"', 'value':'"+settings[index].value+"'}"
                widgets.push(formatter);
                var cell2 = document.createElement('td');
                cell2.innerHTML = formatter.build();
                formatter.loader();
                tableRow.appendChild(cell2);
                table.appendChild(tableRow);
                i++;
            }
            console.log("OUtputting Table");
            return table;               
        }, function(settings){
            log("renderHTMLTableB UP: "+ObjectToString(settings));
          //  showObj(settings);
            //console.log("DOM - > DataStruct");
             for(index in settings){
                jQuery("input[name='"+instanceId+"_"+settings[index].name+"']").each(
                    function(i, domElement){
                        if(domElement.type=='checkbox'||domElement.type=='radio'){
                            if(domElement.checked==true)
                                settings[index].value = domElement.value;    
                        }
                        else if(domElement.type=='textarea'){
                            settings[index].value = domElement.innerHTML;
                        }     
                        else{
                            settings[index].value = domElement.value;
                        }
                    }
                );
                
            }
            return [settings];
        }, [settingsR.behaviour]);     
        var submitClickedE = extractEventE(submitId, 'click');
        
        submitClickedE.snapshotE(settingsR.behaviour).mapE(function(x){renderHTMLTableB.sendEvent(x);});
        insertDomB(renderHTMLTableB, tableDivId);
    }
    this.destroyChildWidgets = function(){
        for(index in widgets){
            widgets[index].destroy();
        }
        widgets = new Array();
    }
    this.destroy=function(){
        this.destroyChildWidgets();
        DATA.deregister("aurora_settings", data.plugin);
    }
    this.build=function(){
        return "<div id=\""+tableDivId+"\">&nbsp;</div><input id=\""+submitId+"\" type=\"submit\" />";
    }
}
widgetTypes['webpageSettingsEditor']=WebpageSettingsEditor;
widgetTypes['webpageSettingsStringFormatter']=WebpageSettingsStringFormatter;
