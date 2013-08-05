function AuroraDom(){
    this.get = function(id){
        if(typeof id == 'string'){
            return document.getElementById(id);
        }
        return id;
    }                           
    this.createDiv = function(id, innerHTML, className){//TODO: refactor this to go id, className, innerHTML
        log("CREATE DIVV");
        return this.create('div', id, className, innerHTML);
    }
    this.createSpan = function(id, innerHTML, className){//TODO: refactor this to go id, className, innerHTML
        return this.create('span', id, className, innerHTML);
    }
    this.create = function(type, id, className, innerHTML){//TODO: refactor this to go id, className, innerHTML
        var element = document.createElement(type);
        if(id!=undefined){
            element.id = id;
        }
        if(className!=undefined){
            element.className = className;
        }
        if(innerHTML!=undefined){
            element.innerHTML = innerHTML;
        } 
        return element;
    }
    this.createOption = function(id, className, innerText, value){
        var element = this.create('option', undefined, undefined, innerText);
        element.value = value;
        element.innerText = innerText; 
        element.text = innerText;
        return element;
    }
    this.createImg = function(id, className, src){
        var element = document.createElement('img');
        if(id!=undefined){
            element.id = id;
        }
        if(className!=undefined){
            element.className = className;
        }
        if(src!=undefined){
            element.src = src;
        }
        return element;
    }
    this.stopEvent = function(event){
        event.stopPropagation();  
        event.preventDefault();
    }
    
    	this.getElementsByClassName = function(class_name, tag, elm) {
        var docList = elm.getElementsByTagName('*');
        var matchArray = [];

        var re = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
        for (var i = 0; i < docList.length; i++) {
            if (re.test(docList[i].className) ) {
                matchArray.push(docList[i]);
            }                                                  
        }
        return matchArray;
    }
}

function parseMysqlDate(mysql_string){ 
   if(typeof mysql_string === 'string')
   {
      var t = mysql_string.split(/[- :]/);
      return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
   }
   return null;   
}
function createButton(value, className){
    var button = createDomElement("input", undefined,"button");
    button.type = "submit";
    button.value = value;
    if(className!=undefined)
        button.className = className;
    return button;
}
String.prototype['contains'] = function(str){
    return (this.indexOf(str) >= 0);
}
//window.getElementsByClassName = DOM.getElementsByClassName;
if(typeof(Element)!='undefined'){
    Element.prototype.removeChildren = function(element){
        if(element==undefined)
            element = this;
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }
}
function getMilliseconds(){
var d = new Date();
return d.getTime(); 
} 
function createDomElement(type, id, className, innerHTML){
    var ele = document.createElement(type);
    if(id!=undefined&&id.length>0)
    ele.id = id;
    if(className!=undefined&&className.length>0)
    ele.className = className; 
    if(innerHTML!=undefined&&innerHTML.length>0)
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