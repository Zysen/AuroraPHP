function good(){
    //var args = arguments.callee.caller.arguments;
    var args = Array.prototype.slice.call(arguments.callee.caller.arguments);
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

function AuroraTaskQueue(dequeueEventE){ 
    return new AuroraTaskQueueStack(dequeueEventE, "queue");
}
function AuroraTaskStack(dequeueEventE){ 
    return new AuroraTaskQueueStack(dequeueEventE, "stack");
}
function AuroraTaskQueueStack(dequeueEventE, type){
    var taskqueustack = this;
    var collectionType = (type==undefined)?"stack":"queue";
    this.enqueueE = F.receiverE();
   
   this.dequeueEventE = dequeueEventE;
   this.push = function(val){
    this.enqueueE.sendEvent(val); 
   };
   this.enqueue = function(val){
    this.enqueueE.sendEvent(val);
   };
  
  
   var dequeueEventE = F.receiverE();
   this.dequeueEventE = dequeueEventE;
   var finishedE = F.receiverE();
   this.finishedE = finishedE.filterE(function(val){return val;});
   var finishedB = finishedE.filterRepeatsE().startsWith(true);
   var startQueueE = F.receiverE();
   
   this.jobQueueE = F.mergeE(this.enqueueE, this.finishedE.mapE(function(finished){return NOT_READY;})).collectE([],function(newVal,arr) {
        if(newVal==NOT_READY){
            return [];
        }
        arr.push(newVal);
        return arr;
   });
   
   var queueE = F.mergeE(this.enqueueE).collectE([],function(newVal,arr) {
        arr.push(newVal);
        return arr;
   });
   this.queueB = queueE.startsWith([]);
    this.kickstartE = F.liftB(function(queue, finished){
        if(!good()){
            return NOT_READY;
        }
        return {queue: queue, finished: finished};
    }, this.queueB, finishedB).changes().filterE(function(queueAndFinished){
        return queueAndFinished!=NOT_READY && (queueAndFinished.finished && queueAndFinished.queue.length>0);
    }).mapE(function(queueAndFinished){
        finishedE.sendEvent(false);
        startQueueE.sendEvent(true);     
    }); 
    
    var loopedQueueE = startQueueE.snapshotE(this.queueB);
    var emptyQueueE = loopedQueueE.filterE(function(queue){return queue!=NOT_READY&&queue.length==0;});
    var notEmptyQueueE = loopedQueueE.filterE(function(queue){return queue!=NOT_READY&&queue.length!=0;});
    emptyQueueE.mapE(function(){
        finishedE.sendEvent(true);
    });
    notEmptyQueueE.mapE(function(queue){
        var val = (collectionType=="stack")?queue.pop():queue.shift();
        dequeueEventE.sendEvent(val);
    });
    this.next = function(){
         startQueueE.sendEvent(true);      
    };                   
}



//{type, data, dataType, url, timeout}
F.EventStream.prototype.ajaxRequestE = function(){
    return this.mapE(function(request){
    	var timeout = (request.timeout==undefined)?15000:request.timeout;
    	var dataType = (request.dataType==undefined)?'text':request.dataType;
    	var rec = F.receiverE(); 
        jQuery.ajax({				
            type: request.type,
            data: request.data,
            dataType: dataType,
            url: request.url,
            timeout: timeout,
            success: function(data){
            	rec.sendEvent(data);
            },
            error: function(data){log("getAjaxRequestE ERROR on URL: "+request.url);}
        });
        return rec;
    }).switchE();                                          
}
F.EventStream.prototype.ajaxRequestB = function(){
    return this.startsWith(NOT_READY).ajaxRequestB();                                          
}
F.Behavior.prototype.ajaxRequestB = function(){
    return this.liftB(function(request){
    	if(!good()){
    		 return NOT_READY;
    	}
    	var timeout = (request.timeout==undefined)?15000:request.timeout;
    	var dataType = (request.dataType==undefined)?'text':request.dataType;
    	var rec = F.receiverE(); 
        jQuery.ajax({				
            type: request.type,
            data: request.data,
            dataType: dataType,
            url: request.url,
            timeout: timeout,
            success: function(data){
            	rec.sendEvent(data);
            },
            error: function(data){log("getAjaxRequestB ERROR on URL: "+request.url);}
        });
        return rec.startsWith(NOT_READY);
    }).switchB();                                          
}
F.Behavior.prototype.ajaxRequestE = function(){
    return this.changes().ajaxRequestE();                                          
}

F.EventStream.prototype.cancelDOMBubbleE = function(){
	return this.mapE(function(event){DOM.stopEvent(event);return event;});
}



