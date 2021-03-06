/**
 *  RemoteData
 * @constructor
 */
 

function RemoteData(key, context, initialValue, pollRate){
   
this.hash = "HASH";
    this.eventE = F.receiverE();
    this.event = this.eventE;
    this.originBehaviour = this.event.startsWith(initialValue);
    this.pollRate = (pollRate==undefined)?0:pollRate;//A pollrate of 0 means it will be requested once.
    this.lastUpdated = 0;
    this.behaviour = F.liftBI(
        function(value){
            return value;
        },
        function(value){
            //log("Upstream Event: "+key);
            parent.data = value;
            parent.hash = null;
            parent.dirty=true;
            return [undefined];
        },
        this.originBehaviour);
    this.requiresPoll = function(){
        return ((new Date().getTime())>(this.lastUpdated+this.pollRate)||this.lastUpdated==0);
    }
    this.updateFromServer = function(data, hash){
        this.dirty = false;
        this.hash = hash;
        if(data.length!=0){
            this.lastUpdated = new Date().getTime();
            this.data = data;
            this.event.sendEvent(data);
        }
    }
    this.sendEvent = function(event){
        this.behaviour.sendEvent(event);
    }
    this.key = key;
    this.dirty = false;
    this.data = initialValue;
    this.context = (context==undefined)?"":context;
    this.remote = true;
    this.newData=null;
    var parent = this;
}

/**
 *  CompositKey
 * @constructor
 */
function CompositKey(key1, key2){
    this.getKey = function(){                   
        return (key2==undefined||key2.length==0)?key1:key1+"___"+key2;
    }
    //this["getKey"] = this.buildKey;
}
/**
 *  BehaviourManager
 * @constructor
 */
function BehaviourManager(){
    this.availableRemotes = new Array();
    this.localData = new Object();
    this.data = new Object();
    this.buildKey = function(key1, key2){                   
        return (key2==undefined||key2.length==0)?key1:key1+"___"+key2;
    }
    this.getRemote = function(key, context, initialValue, pollRate){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        initialValue = (initialValue==undefined)?NOT_READY:initialValue;
        pollRate = (pollRate==undefined)?0:pollRate;
        if(this.data[key2]==undefined)
            this.data[key2] =  new RemoteData(key, context, initialValue, pollRate);
        else if(this.data[key2].pollRate<pollRate)
            this.data[key2].pollRate = pollRate;         
        return this.data[key2]; 
    }
    this.getE = function(key, context){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        if(this.localData[key2]==undefined)
            this.localData[key2] = F.receiverE();
        return this.localData[key2];
    }
    this.getB = function(key, context, initialValue){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        if(this.localData[key2]==undefined){
            this.localData[key2] = F.liftBI(function(value){
                return value;
            }, function(value){
                return [value];
            }, F.receiverE().startsWith((initialValue==undefined)?NOT_READY:initialValue));
        }
        return this.localData[key2];
    }
    /*this.getB = function(key, context){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        if(this.localData[key2]==undefined)
            this.localData[key2] = receiverE().startsWithI(NOT_READY);
        return this.localData[key2];
    }     */
    /*this.registerRemote=function(key){
        this.availableRemotes.push(key);
    }
    this.register=function(key, context, behaviour){
        context = (context==undefined||context.length==0)?"_":context;
        if(this.localData[key]!=undefined&&this.localData[key][context]!=undefined)
            return this.localData[key][context];
        if(this.localData[key]==undefined)
            this.localData[key] = new Array();
        this.localData[key][context] = behaviour;
        return this.localData[key][context]; 
    }*/
    this.deregister = function(key, context){
        context = (context=='undefined'||context==null||context.length==0)?"_":context;
        key = new CompositKey(key, context).getKey();
        this.data[key]=null;
        delete this.data[key];
    }   
    this.isEmpty = function(){
        return (this.size()==0);
    }
    this.size = function(){                 
        var size = 0, key;
        for (key in this.data) {
            if (this.data.hasOwnProperty(key)) size++;
        }
        return size;
        //return Object.keys(this.data).length; 
    }
    this.get = function(key, context, initialValue){
        var mContext = (context==undefined||context.length==0)?"_":context;
        if(this.data[key]!=undefined&&this.data[key][mContext]!=undefined){
            return this.data[key][mContext];
        }
        return this.getB(key, context, initialValue);
       /* 
        
        if(this.localData[key]!=undefined&&this.localData[key][mContext]!=undefined)
            return this.localData[key][mContext];
        if(context=="_"||(context!='undefined'&&context!=null&&context.length!=0)){
            key = new CompositKey(key, mContext).getKey();
        }
        return this.data[key].behaviour; */
    }
    this.getDataRequest = function(){
        var arr = new Array();       
        for(var index in this.data){
            var dataR = this.data[index];                            //rDatashow
            //log(dataR);
            if(dataR.requiresPoll()){
                var packet = dataR.dirty?{key: dataR.key, context: dataR.context, data: dataR.data}:{key: dataR.key, context: dataR.context, hash: dataR.hash};
                arr.push(packet);
            }
        }           
        return {"database": cleanFunctions(arr)};
    }
    this.startPolling = function(){
        var localData = this.localData;
        var data = this.data;
        var respE = F.receiverE();
        var requestEvery = window['SETTINGS']['updateWait']; // request with this delay, only if last request is already serviced
        var nowB = F.timerB(500); // current time, 500ms granularity
        var lastRespTmB = respE.snapshotE(nowB).startsWith(nowB.valueNow());
        var requestOkayB = F.liftB(function(now, lastRespTm) {
		//log("Request OK");
            return (now > (lastRespTm + requestEvery));                               
        }, nowB, lastRespTmB);
        var requestReadyE = requestOkayB.changes().filterE(function(x) { return x; }).filterE(function(x){return !DATA.isEmpty()}); 
        var dataRequestReady = requestReadyE.snapshotE(nowB).mapE(function(x){return DATA.getDataRequest();}); 
        var serverResponseE = sendServerRequestE(dataRequestReady, window['SETTINGS']['scriptPath']+'getBehaviours');
        var localSyncE = serverResponseE.mapE(function(retData){                  
        	for(key in retData){
                var dataRow = retData[key];
                for(context in dataRow){
	                var newKey = key;
	                if(context!=undefined&&context.length!=0){
	                    newKey+="___"+context;
	                }
	                var serverData = dataRow[context];
                    var localData = data[newKey]; 
                   //Pre getKey() check for json object contexts. 
                    //var newKey = new CompositKey(key, context);
                   // localData = (localData!=null)?localData:data[newKey];
                    localData.updateFromServer(serverData.data, serverData.hash);
                }                                  
            }
            respE.sendEvent(true);
            return retData;
        });
        //respE.sendEvent(true);
    }
}
function sendServerRequestE(triggerE, url, timeout){
    timeout = (timeout==undefined)?15000:timeout;
    var rec = F.receiverE();                       
    triggerE.mapE(function(requestData){
        if(requestData["database"].length>0){
        requestData.database = JSON.stringify(requestData.database);
        jQuery.ajax({
            type: "post",
            async: true,
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