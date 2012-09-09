function AuroraDom(){
    this.get = function(id){
        if(typeof id == 'string'){
            return document.getElementById(id);
        }
        return id;
    }
    this.createDiv = function(id, innerHTML){
        var element = document.createElement('div');
        if(id!=undefined){
            element.id = id;
        }
        if(innerHTML!=undefined){
            element.innerHTML = innerHTML;
        } 
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
    this.create = function(type, id){
        var element = document.createElement(type);
        if(id!=undefined){
            element.id = id;
        }
        return element;
    }
}