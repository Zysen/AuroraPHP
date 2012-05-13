pageRenderedE.calmE().mapE(function(){
 //getElementById("content")
 var element = document.createElement("span");
if(SETTINGS.page.permissions.canEdit || SETTINGS.page.permissions.canDelete){
    var adminPanel = document.createElement("span");
    adminPanel.style.position = 'absolute';
    adminPanel.style.top = '0px';
    adminPanel.style.right = '0px';
    
    //adminPanel.style = "position: absolute; top: 0px; right: 0px;";
    if(SETTINGS.page.permissions.canEdit){
        adminPanel.innerHTML += "<a href=\"javascript:editPage();\"><img style=\"width: 20px; height: 20px;\" src=\""+SETTINGS.scriptPath+"plugins/ckeditor/edit.png\" alt=\"\" /></a>";   
    }
    if(SETTINGS.page.permissions.canDelete){
        adminPanel.innerHTML += "<a href=\"javascript:deletePage();\"><img style=\"width: 20px; height: 20px;\" src=\""+SETTINGS.scriptPath+"plugins/ckeditor/delete.png\" alt=\"\" /></a>";   
    }
    document.body.appendChild(adminPanel);                                                  
}
 
 });
           
 
function replaceLinkPaths(parent, search, replace){
    child = parent.firstChild;
    while(child){
        if(child.nodeName.toLowerCase()=="a"){
            child.href = child.href.replaceAll(search, replace);
        }
        if(child.hasChildNodes()){               
            //parent.replaceChild(replaceLinkPaths(child, search, replace), child);
            child = replaceLinkPaths(child, search, replace);
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
    element = replaceLinkPaths(element, SETTINGS.scriptPath+"", "page://");
    //replaceLinkPaths(element, "&quot;", "'"); 
    return element.innerHTML;
}

function cleanDownHtml(html){
    var element = document.createElement("div");
    element.innerHTML = html;
    element = replaceLinkPaths(element, "page://", SETTINGS.scriptPath+"");
    return element.innerHTML;
}
              
 function showBodyEditor(theme, page){
    editorOpen = true; 
    
    theme = cleanUpHtml(theme);
    page = cleanUpHtml(page);
                                    
    //jQuery('#body').html("<div id=\"aurora_ckeditor_page_body\">"+SETTINGS.theme.html+"</div>");
    jQuery('#body').html(theme);
    jQuery('#content').html(page);
    jQuery('#body').ckeditor(function() {jQuery('#body').ckeditorGet().execCommand('maximize');},{customConfig: SETTINGS.scriptPath+'themes/'+SETTINGS.theme.name+'/auroraPageBodyConfig.js', extraPlugins : 'ajaxSave' });               
    }
function showContentEditor(data){
    editorOpen = true;
    data = cleanUpHtml(data); 
    
    jQuery("#content").html(data);
    jQuery('#content').ckeditor(function() {}, { customConfig: SETTINGS.scriptPath+'themes/'+SETTINGS.theme.name+'/auroraPageConfig.js', extraPlugins : 'ajaxSave' });               
} 
function ckeditor_ajaxSave(editor){
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
        for(index in SETTINGS.groups){
            var group = SETTINGS.groups[index];
            var checked = checkPermission(group.group_id)?" checked=\"yes\"":"";
            groupsHTML+="<input type=\"checkbox\" name=\""+group.group_id+"\" id=\"groupcheck_"+group.group_id+"\" "+checked+" />&nbsp;"+group.name+"<br />";    
        }                                  
        UI.showMessage("Who can view this page?", groupsHTML, function(){
            var groupsAllowed = new Object();
            for(index in SETTINGS.groups){
                groupsAllowed[SETTINGS.groups[index].group_id] = document.getElementById("groupcheck_"+SETTINGS.groups[index].group_id).checked;
            }
            sendData = {content: data, pageName: SETTINGS.page.name+"", permissions: groupsAllowed};
            commitPageChanges(sendData, editor);
        }); 
    }
    editorOpen = false;
}
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
    return {content: contentHTML, template: element.innerHTML, pageName: SETTINGS.page.name+""};
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
function afterCommit(data, editor){
    editor.destroy();
    window.location=SETTINGS.scriptPath+SETTINGS.page.name;
}

function editPage(){
    if(isBase())
        showBodyEditor(SETTINGS.theme.html, SETTINGS.page.html);
    else
        showContentEditor(SETTINGS.page.html);
}
function deletePage(){
    UI.confirm("Delete Page", "Are you sure you wish to delete this page?", "Yes", function(val){
            jQuery.ajax({type: "post",
                url: SETTINGS.scriptPath +"request/deletePage",
                data: {pageName: SETTINGS.page.name+""},
                success: function(data){window.location=SETTINGS.scriptPath+SETTINGS.defaultPage;}
                });  
        }, "No",
        function(val){
            
        });
}
function commitPageChanges(dataObj, editor){
    jQuery.ajax({type: "post",
        url: SETTINGS.scriptPath +"request/commitPage",
        data: dataObj,
        success: function(data){afterCommit(data, editor);}
        });
}