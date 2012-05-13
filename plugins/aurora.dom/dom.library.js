
getElementsByClassName = function(class_name, tag, elm) {
    doc = elm || this;
    var docList = doc.all || doc.getElementsByTagName('*');
    var matchArray = new Array();

    /*Create a regular expression object for class*/
    var re = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
    for (var i = 0; i < docList.length; i++) {
        //showObj(docList[i]);
        if (re.test(docList[i].className) ) {
            matchArray[matchArray.length] = docList[i];
        }
    }
    return matchArray;
}
Element.prototype.removeChildren = function(element){
    if(element==undefined)
        element = this;
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
}
function getMilliseconds(){
var d = new Date();
return d.getTime(); 
} 

function createDomElement(type, id, className, innerHTML){
    var ele = document.createElement(type);
    if(id.length>0)
    ele.id = id;
    if(className.length>0)
    ele.className = className; 
    if(innerHTML.length>0)
    ele.innerHTML = innerHTML;
    return ele; 
}
function createIcon(src){
    var saveButton = document.createElement("img");
    saveButton.src=src;
    saveButton.style.cursor="pointer";
    return saveButton;
}
function findParentNodeWithTag(element, tag){
    if(element==undefined||element==null)
        return undefined; 
    else if(element.tagName.toUpperCase() == tag.toUpperCase())
        return element;
    return findParentNodeWithTag(element.parentNode, tag);    
}
function findTableRowIndex(table, row){
    for(i=0; i<table.rows.length; i++){
        if(table.rows[i]==row)
            return i;
    }
    return -1;
}

function stopEventBubble(event){
    agent = jQuery.browser;
    if(agent.msie) {
        event.cancelBubble = true;
    } else {
        event.stopPropagation();
    }
}
