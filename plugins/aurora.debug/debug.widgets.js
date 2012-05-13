
/*function BehaviourTree(instanceId,data){
    var domId=instanceId+"_tree";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    this.loader=function(){
        log("Behaviour Tree loaded");
        timerB(1000).liftB(function(){
            var container = document.getElementById(domId);
            var domDiv = document.createElement("div");
            for(index in DATA.localData){
                var behaviour = DATA.localData[index];
                var value = behaviour["_"].last;
                if(value==undefined||value==NOT_READY)
                    value = "NOT READY";
                var display = index+": "+value;
                domDiv.appendChild(createDomElement("div", "", "", display));
            }  
            removeChildren(container);
            container.appendChild(domDiv);
        });
    }
    this.destroy=function(){}
    this.build=function(){
        return "<div class=\"behaviourTree\" style=\"width:"+width+"px; height: "+height+"px\"><div id=\""+domId+"\"></div></div>";
    }
}
widgetTypes['BehaviourTree']=BehaviourTree;


function BehaviourTest(instanceId,data){
    var domId=instanceId+"_tree";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    this.loader=function(){
       var t1B = timerB(500);
       var t2B = timerB(350);
       
       var mergeB = liftB(function(t1, t2){
        return t1+"<>"+t2;
       }, t1B, t2B);
       DATA.register("timer1", "", t1B);
       DATA.register("timer2", "", t2B);
       DATA.register("merge", "", mergeB);
       insertDomB(mergeB, domId);
    }
    this.destroy=function(){}
    this.build=function(){
        return "<div class=\"BehaviourTest\" style=\"width:"+width+"px; height: "+height+"px\"><div id=\""+domId+"\"></div></div>";
    }
}
widgetTypes['BehaviourTest']=BehaviourTest;*/