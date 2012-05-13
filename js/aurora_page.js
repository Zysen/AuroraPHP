function renderPage(data){
    widgets=Array();    
    var elm = document.createElement('div');
    elm.innerHTML=data; 
    for (var key in widgetTypes) {
        //log(key);
        widgetDef = widgetTypes[key];
        var i=0; 
                                                                    
        var widgetPlaceholders = getElementsByClassName("widget_"+key, "img", elm);
        for (var index in widgetPlaceholders) {
            i++;
            var widgetPlaceholder = widgetPlaceholders[index];     
            var instanceId = (widgetPlaceholder.id!='')?widgetPlaceholder.id:key+i;
            var arguments={};
            try{         
            arguments = (widgetPlaceholder.alt==null||widgetPlaceholder.alt=="")?{placeholder: widgetPlaceholder}:jQuery.parseJSON(widgetPlaceholder.alt.replaceAll("'", '"'));    
            }
            catch(err){
            log("Widget Argument Parse Error: "+err);
            arguments={};
            }

            var element = document.createElement('span');
            if(typeof(arguments)!='string'&&widgetPlaceholder.width!=null&&widgetPlaceholder.width!=null){
                element.width = widgetPlaceholder.width;
                element.height = widgetPlaceholder.height; 
            }
            arguments.placeholder = widgetPlaceholder;
            widget = jQuery.extend(new widgetDef(instanceId, arguments), WIDGET);   
            WIDGETS.add(widget);
            
            var wBuild = widget.build();
            if(typeof(wBuild)=='string')
                element.innerHTML = wBuild;
            else
                element.appendChild(wBuild);
            widgetPlaceholder.parentNode.replaceChild(element, widgetPlaceholder);
        }
    } 
    return elm.innerHTML;            
}
function loadPage(pageName){
    window.location=SETTINGS.scriptPath+pageName;
}

function connection_error(error){
    log(error);
}
function checkPermission(groupId){
    for(index in SETTINGS.page.permissions.groups){
        if(SETTINGS.page.permissions.groups[index].group_id==groupId)
            return true;
    }
    return false;
}

function requestAndRenderPage(page){
    jQuery.ajax({
        dataType: 'json',
        url: SETTINGS.scriptPath+"request/getPage/"+page+"/",
        success: function(data){
            pagePermissions  = data.permissions;
            page = data;
            currentPage=page;      
            jQuery("#content").html(renderPage(data.pageData));
            for (var instanceId in topLevelWidgets){
                topLevelWidgets[instanceId].loader();
            }
        },
        error: connectionError
    }); 
}
function connectionError(error){
    log(error);
}
function isBase(){
    return SETTINGS.page.name==SETTINGS.defaultPage;
}
