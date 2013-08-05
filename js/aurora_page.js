function renderPage(data){
    var dataAttributes = ["alt", "title"];
    var widgetTypes = WIDGETS.widgetTypes;
    var widgets=Array();    
    var elm = document.createElement('div');
    elm.innerHTML=data; 

    var detectedWidgets = WIDGETS.findWidgetsInElement(elm);
    for(var index in detectedWidgets){
    	var widgetPlaceholder = detectedWidgets[index];
		var key = widgetPlaceholder.className.replace('widget_', '');
		var instanceId = key+"_"+WIDGETS.getInstanceId(key);
		var widgetDef = widgetTypes[key];
		var arguments={};
        
        for(var dtIndex in dataAttributes){
        	var attributeTag = dataAttributes[dtIndex];
        	if(widgetPlaceholder[attributeTag]!=undefined && widgetPlaceholder[attributeTag].length>0){
        		try{
        			arguments = window['JSON'].parse(widgetPlaceholder[attributeTag].replaceAll("'", '"'));
        			break;
        		}
        		catch(e){log('JSON Parse error of widget arguments for widget '+instanceId);}
        	}
        }
        arguments.placeholder = widgetPlaceholder;
		var widget = new widgetDef(instanceId, arguments); 
		WIDGETS.add(key, widget);
		
		var wBuild = widget.build();
        if(typeof(wBuild)=='undefined'){
        	widgetPlaceholder.parentNode.removeChild(widgetPlaceholder);
        }
        else if(typeof(wBuild)=='string'){
        	widgetPlaceholder.outerHTML = wBuild;
        }
        else{
        	widgetPlaceholder.parentNode.replaceChild(wBuild, widgetPlaceholder);
        }
    }
     return elm.innerHTML; 
}
    
    
    
    
    
    
/*    
    
    function renderPage(data){
	log("Render Page");
    var dataAttributes = ["alt", "title"];
    var widgetTypes = WIDGETS.widgetTypes;
    var widgets=Array();    
    var elm = document.createElement('div');
    elm.innerHTML=data; 
    
    var widgetTypes = WIDGETS.getElementsByClassName = function('widget_', 'img', elm)
    for (var key in widgetTypes) {
        //log(key);
        widgetDef = widgetTypes[key];   
        var widgetPlaceholders = DOM.getElementsByClassName("widget_"+key, "img", elm);
        //var widgetPlaceholders = DOM.getElementsByClassName("widget_"+key, "img", elm);
        for (var i=0;i<widgetPlaceholders.length;i++){
            if(index==="addEventListener"){
                break;
            }
            var widgetPlaceholder = widgetPlaceholders[i];     
            var instanceId = key+i; //(widgetPlaceholder.id!='')?widgetPlaceholder.id:key+i;
            var arguments={};
            //alert(widgetPlaceholder.alt);
            try{         
                arguments = (widgetPlaceholder.alt!=undefined&&widgetPlaceholder.alt.length>0)?window['JSON'].parse(widgetPlaceholder.alt.replaceAll("'", '"')):(widgetPlaceholder.title!=undefined&&widgetPlaceholder.title.length>0)?window['JSON'].parse(widgetPlaceholder.title.replaceAll("'", '"')):{placeholder: widgetPlaceholder};    
            }
            catch(err){
                log("Widget Argument Parse Error: "+err);
                arguments={};
            }
            
            log("Arguments");
            log(widgetPlaceholder.title);
            log(widgetPlaceholder);
            log(arguments);

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
*/
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
function readGET(){
    var params = {};
    if(window.location.search){
    var param_array = window.location.search.split('?')[1].split('&');
    for(var i in param_array){
        x = param_array[i].split('=');
        params[x[0]] = x[1];
    }
    return params;
}
    return {};
};
