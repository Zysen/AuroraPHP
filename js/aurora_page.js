function renderPage(data){
    var widgetTypes = WIDGETS.widgetTypes;
    widgets=Array();    
    var elm = document.createElement('div');
    elm.innerHTML=data; 
    for (var key in widgetTypes) {
        //log(key);
        widgetDef = widgetTypes[key];
        var i=0; 
        //log(key);                                                            
        var widgetPlaceholders = getElementsByClassName("widget_"+key, "img", elm);
        for (var index in widgetPlaceholders) {
            //log("T: "+index);
            i++;
            var widgetPlaceholder = widgetPlaceholders[index];     
            var instanceId = (widgetPlaceholder.id!='')?widgetPlaceholder.id:key+i;
            var arguments={};
            //alert(widgetPlaceholder.alt);
            try{         
                arguments = (widgetPlaceholder.alt==null||widgetPlaceholder.alt=="")?{placeholder: widgetPlaceholder}:window['JSON'].parse(widgetPlaceholder.alt.replaceAll("'", '"'));    
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
            if(typeof jQuery != 'undefined')
                widget = jQuery.extend(new widgetDef(instanceId, arguments), WIDGET);
            else
                widget = new widgetDef(instanceId, arguments);   
            WIDGETS.add(widget);
            
            var wBuild = widget.build();
            if(typeof(wBuild)=='undefined'){}
            else if(typeof(wBuild)=='string'){
                element.innerHTML = wBuild;
            }
            else{
                element.appendChild(wBuild);
            }
            widgetPlaceholder.parentNode.replaceChild(element, widgetPlaceholder);
        }
    } 
    return elm.innerHTML;            
}

var loadPageE = F.receiverE();
loadPageE.mapE(function(pageName){
    ajax({
        dataType: 'json',
        url: SETTINGS.scriptPath+"request/getPage/"+pageName+"/",
        success: function(data){
            pageE.sendEvent({page: data, theme: window['SETTINGS']['theme'], permissions: data.permissions});
        },
        error: connectionError
    });    
}); 
function loadPage(pageName){
    /*window.location = window['SETTINGS']['scriptPath']+pageName;
    return;*/
    log("Loadpage");
    if(history.pushState){
        history.pushState({page: pageName}, pageName, window['SETTINGS']['scriptPath']+pageName);
        loadPageE.sendEvent(pageName);
    }
    else{
        window.location = window['SETTINGS']['scriptPath']+pageName;
    }
    return false;
}   

function connection_error(error){
    log(error);
}
//te2sting testing
function checkPermission(groupId){
    for(index in window['SETTINGS']['page']['permissions']['groups']){
        if(window['SETTINGS']['page']['permissions']['groups'][index]['group_id']==groupId)
            return true;
    }
    return false;
}
function connectionError(error){
    log(error);
}
function isBase(){
    return window['SETTINGS']['page']['name']==window['SETTINGS']['defaultPage'];
}
