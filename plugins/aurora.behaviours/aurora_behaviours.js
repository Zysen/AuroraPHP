function liftBArray(f, argsF){
    argsF.unshift(f);
    var behaviour = liftB.apply(argsF[0], argsF);
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
    var rec = receiverE();                       
    triggerE.mapE(function(requestData){
        if(requestData.database.length>0){
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
        }
    });                                          
    return rec;
}
function getAjaxRequestB(triggerB, url){
    var rec = receiverE();                       
    triggerB.liftB(function(requestData){
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
    var rec = receiverE();
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
