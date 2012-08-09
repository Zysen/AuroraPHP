function good(){
    var args = arguments.callee.caller.arguments;
    for(index in args){
        if(args[index]==NOT_READY)
            return false;
    }
    return true;
}
function liftBArray(f, argsF){
    argsF.unshift(f);
    var behaviour = F.liftB.apply(argsF[0], argsF);
    return behaviour;
}
function funcCallArray(f, argsF){
    var behaviour = f.apply(this, argsF);
} 
function jFadeInE(triggerE, elementId, time){
    var rec = receiverE();
    triggerE.mapE(function(event){
        jQuery(document.getElementById(elementId)).fadeIn(time, function(){rec.sendEvent(event);});
    });
    return rec;
}
function FileReaderLoadedE(fr){
    var rec = receiverE();
    fr.onload = function(event){
        rec.sendEvent(event);    
    }
    return rec;
}
function fileDragDropE(element){
    var rec = receiverE();
    element.addEventListener('drop', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;
    //return extractEventE(element, 'drop');    
}
function fileDropEnterE(element){
    var rec = receiverE();
    element.addEventListener('dragenter', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;    
}
function fileDragOverE(element){
    var rec = receiverE();
    element.addEventListener('dragover', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;    
}
function getAjaxRequestE(triggerE, url, timeout){
    timeout = (timeout==undefined)?15000:timeout;
    var rec = F.receiverE();      
                       
    triggerE.mapE(function(requestData){
        
        jQuery.ajax({
            type: "post",
            data: requestData,
            dataType: 'json',
            url: url,
            timeout: timeout,
            success: function(data){
                rec.sendEvent(data);
            },
            error: function(data){/*rec.sendEvent(data);*/}
        });
    });                                          
    return rec;
}
function getAjaxRequestB(triggerB, url){
    var rec = F.receiverE();                     
    triggerB.liftB(function(requestData){
        if(requestData!=NOT_READY){
        jQuery.ajax({
            type: "post",
            data: requestData,
            dataType: 'json',
            url: url.replace("<VAL>", requestData),
            success: function(data){
                rec.sendEvent(data);
            },
            error: function(data){rec.sendEvent(data);}
        });
        }
    });                                          
    return rec;
}
function FileReaderReadyE(fr){
    var rec = receiverE();
    fr.onload = function(event){
        rec.sendEvent(event.target.result);
    }
    return rec;
}     
function getAjaxFileRequest(triggerE, url, contentType){
    var rec = F.receiverE();
    triggerE.mapE(function(builder){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', contentType);
        //xhr.send(builder);
        xhr.sendAsBinary(builder);        
        xhr.onload = function(event) { 
            if (xhr.responseText)
                rec.sendEvent(JSON.parse(xhr.responseText));
        };
    });
    return rec;
}
