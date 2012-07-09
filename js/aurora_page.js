function renderPage(data){
    var widgetTypes = WIDGETS.widgetTypes;
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
            if(typeof(wBuild)=='string')
                element.innerHTML = wBuild;
            else
                element.appendChild(wBuild);
            widgetPlaceholder.parentNode.replaceChild(element, widgetPlaceholder);
        }
    } 
    return elm.innerHTML;            
}
 /**
 * loadPage
 * @param {string} pageName
 */
var loadPage = function(pageName){
    window.location=window['SETTINGS']['scriptPath']+pageName;
}  


 /**
 * window.loadPage
 * @param {string} pageName
 */
window.loadPage = function(pageName){
    window.location=window['SETTINGS']['scriptPath']+pageName;
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

function requestAndRenderPage(page){
    ajax({
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
    return window['SETTINGS']['page']['name']==window['SETTINGS']['defaultPage'];
}
