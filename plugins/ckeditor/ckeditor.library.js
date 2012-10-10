window['CKEDITOR_BASEPATH'] = window['SETTINGS']['scriptPath']+'plugins/ckeditor/ckeditor/';
pageDataB.calmB().liftB(function(pageData){
    if(pageData==NOT_READY){
        return NOT_READY;
    }
 //getElementById("content")
 var element = document.createElement("span");
if(window['SETTINGS']['page']['permissions']['canEdit'] || window['SETTINGS']['page']['permissions']['canDelete']){
    var adminPanel = document.createElement("span");
    adminPanel.id = "aurora_adminPanel";
    adminPanel.style.position = 'absolute';
    adminPanel.style.top = '0px';
    adminPanel.style.right = '0px';
    
    //adminPanel.style = "position: absolute; top: 0px; right: 0px;";
    if(window['SETTINGS']['page']['permissions']['canEdit']){
        adminPanel.innerHTML += "<a href=\"javascript:editPage();\"><img style=\"width: 20px; height: 20px;\" src=\""+window['SETTINGS']['scriptPath']+"plugins/ckeditor/edit.png\" alt=\"\" /></a>";   
    }
    if(window['SETTINGS']['page']['permissions']['canDelete']){
        adminPanel.innerHTML += "<a href=\"javascript:deletePage();\"><img style=\"width: 20px; height: 20px;\" src=\""+window['SETTINGS']['scriptPath']+"plugins/ckeditor/delete.png\" alt=\"\" /></a>";   
    }
    document['body'].appendChild(adminPanel);                                                  
}
 
 });                                                                         
           
     
function findLinks(parent,callback){
    child = parent.firstChild;
    while(child){
        if(child.nodeName.toLowerCase()=="a"){
            callback(child);
        }
        if(child.hasChildNodes()){               
            //parent.replaceChild(replaceLinkPaths(child, search, replace), child);
            child = findLinks(child,callback);
        }
        if(child.nextSibling==null)  //Needed for weird old browser compatibility
            return parent;// parent;
        child = child.nextSibling;
    }
    return parent;
}   
function cleanUpHtml(html){
    var element = document.createElement("div");
    element.innerHTML = html;
    findLinks(element, function(child){
        var pageName = child.href.replaceAll(window['SETTINGS']['scriptPath'], "");
        child.href = child.href.replaceAll(window['SETTINGS']['scriptPath'], "page://");
        log('Hurr2');  
        child.onclick = function(){loadPage(pageName)};
    });
    return element.innerHTML;
}
            
            
function cleanDownHtml(html){
    var element = document.createElement("div");
    element.innerHTML = html;
    element = findLinks(element, function(child){
    var pageName = child.href.replaceAll("page://", "");
        child.href = child.href.replaceAll("page://", window['SETTINGS']['scriptPath']);
        log('Hurr');
        child.onclick = function(){loadPage(pageName);return false;};
    });
    return element.innerHTML;
}
              
 function showBodyEditor(theme, page){
    editorOpen = true; 
    
    theme = cleanUpHtml(theme);
    page = cleanUpHtml(page);
                                    
    document.getElementById("body").innerHTML = theme;
    document.getElementById("content").innerHTML = page;
    
    var editor = CKEDITOR.replace('body', {'customConfig': window['SETTINGS']['scriptPath']+'themes/'+window['SETTINGS']['theme']['name']+'/auroraPageBodyConfig.js', 'extraPlugins' : 'ajaxSave,auroraWidgets,auroraCancel' });               
    CKEDITOR.on('instanceReady',function() {editor.execCommand('maximize');});
    }
function showContentEditor(data){
    editorOpen = true;
    data = cleanUpHtml(data); 
    
    var outerContent = document.createElement("div");
    var content =  document.getElementById("content");
    content.parentNode.replaceChild(outerContent,content); 
    outerContent.appendChild(content);
    
    document.getElementById("content").innerHTML = data;
    //function() {jQuery.scrollTo(outerContent, 1000);jQuery("#aurora_adminPanel").hide();}
    CKEDITOR.replace('content', {'customConfig': window['SETTINGS']['scriptPath']+'themes/'+window['SETTINGS']['theme']['name']+'/auroraPageConfig.js', 'extraPlugins' : 'ajaxSave,auroraWidgets,auroraCancel' });               
    CKEDITOR.on('instanceReady',function() {
        if(typeof jQuery!='undefined'){
            jQuery.scrollTo(outerContent, 1000);
            jQuery("#aurora_adminPanel").hide();
        }
        else{
            var pos = getPos(outerContent);
            window.scrollTo(0, pos.y);
            document.getElementById('aurora_adminPanel').style.display = 'none';
        }
    });
} 
window['ckeditor_ajaxSave'] = function(editor){
    var data = cleanDownHtml(editor.getData());
    if(isBase()){
        var sendData;
        sendData = seperateContentFromTheme(data);
        if(sendData.content.length==0)
            alert("Error - Your template MUST contain a div with an id of 'content'");
        else{
            commitPageChanges(sendData, editor);
        }
    }
    else{
        var groupsHTML = "";
        for(index in window['SETTINGS']['groups']){
            var group = window['SETTINGS']['groups'][index];
            var checked = checkPermission(group['group_id'])?" checked=\"yes\"":"";
            groupsHTML+="<input type=\"checkbox\" name=\""+group['group_id']+"\" id=\"groupcheck_"+group['group_id']+"\" "+checked+" />&nbsp;"+group['name']+"<br />";    
        }                                  
        UI.showMessage("Who can view this page?", groupsHTML, function(){
            var groupsAllowed = new Object();
            for(index in window['SETTINGS']['groups']){
                groupsAllowed[window['SETTINGS']['groups'][index]['group_id']] = document.getElementById("groupcheck_"+window['SETTINGS']['groups'][index]['group_id']).checked;
            }
            sendData = {"content": data, "pageName": window['SETTINGS']['page']['name']+"", "permissions": groupsAllowed};
            commitPageChanges(sendData, editor);
        }); 
    }
    editorOpen = false;
};
function seperateContentFromTheme(data){
    var element = document.createElement('div');
    element.innerHTML = data;    
    divs = element.getElementsByTagName('div');
    var contentHTML = "";
    for (i=0;i<divs.length;i++){
        var div = divs[i];//.childNodes[0].nodeValue; 
        if(div.id=="content"){
            contentHTML = div.innerHTML; 
            div.innerHTML = "<PAGE_CONTENT>";
        }
        else if(div.id=="aurora_adminPanel"){
            div.parentNode.removeChild(div);
        }
    } 
    return {"content": contentHTML, "template": element.innerHTML, "pageName": window['SETTINGS']['page']['name']+""};
} 
function removeAdminPanel(data){
    var element = document.createElement('div');
    element.innerHTML = data;    
    divs = element.getElementsByTagName('div');
    var contentHTML = "";
    for (i=0;i<divs.length;i++){
        var div = divs[i];
        if(div.id=="aurora_adminPanel")
            div.parentNode.removeChild(div);
    } 
    return element.innerHTML;
}                                      
window['afterCommit'] = function(data, editor){
    (editor['destroy'])();
    window.location=window['SETTINGS']['scriptPath']+window['SETTINGS']['page']['name'];
};
window['cancelPageEdit'] = function(){
    window.location=window['SETTINGS']['scriptPath']+window['SETTINGS']['page']['name'];
};

window['editPage'] = function(){
    if(isBase())
        showBodyEditor(window['SETTINGS']['theme']['html'], window['SETTINGS']['page']['html']);
    else
        showContentEditor(window['SETTINGS']['page']['html']);
};
window['deletePage'] = function(){
    UI.confirm("Delete Page", "Are you sure you wish to delete this page?", "Yes", function(val){
            ajax({"type": "post",
                "url": window['SETTINGS']['scriptPath'] +"request/deletePage",
                "data": {"pageName": window['SETTINGS']['page']['name']+""},
                "success": function(data){window['location']=window['SETTINGS']['scriptPath']+window['SETTINGS']['defaultPage'];}
                });  
        }, "No",
        function(val){
            
        });
};   
window['commitPageChanges'] = function(dataObj, editor){
    ajax({"type": "post",
        "url": window['SETTINGS']['scriptPath'] +"request/commitPage",
        "data": dataObj,
        "success": function(data){afterCommit(data, editor);}
        });
};