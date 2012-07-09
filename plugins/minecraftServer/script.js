/*   Data   */
//var playerListR = new RemoteData("minecraftServer_getPlayers", "", NOT_READY);  
//var playerListB = playerListR.behaviour;
var playerListE = receiverE();
var playerListB = playerListE.startsWith(NOT_READY);
var playerListOnlineB = playerListB.liftB(function(playerList){
    
    if(playerList==NOT_READY)
        return playerList;
    var onlinePlayers = new Array();
    for(index in playerList)
        if(playerList[index].online=='Y')
            onlinePlayers.push(playerList[index]);
    alert("ONLINE READY!");
    return onlinePlayers;
});
var playerListOfflineB = playerListB.liftB(function(playerList){
    if(playerList==NOT_READY)
        return NOT_READY;
    var offlinePlayers = new Array();
    for(index in playerList)
        if(playerList[index].online=='N')
            offlinePlayers.push(playerList[index]);
    return offlinePlayers;                                                                         
});
function send(){
    playerListE.sendEvent("G");
    playerListE.sendEvent("[]");
}    

/*   Widgets & UI   */    
function MinecraftServerPlayerListWidget(instanceId,data){
    var domId=instanceId+"container";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    
    this.loader=function(){ 
        DATA.registerRemote(playerListR);
        DATA.register("minecraftServer_getPlayersOnline", "", playerListOnlineB);
        DATA.register("minecraftServer_getPlayersOffline", "",playerListOfflineB);  
        var playerListDivB = F.liftB(function(onlinePlayers, offlinePlayers){
            /*alert("LIFT");
            if(onlinePlayers==NOT_READY)
                alert("Online Players NOT READy");
            else
                alert("Online Players Ready");
            
            if(offlinePlayers==NOT_READY)
                alert("Offline Players NOT READy");
            else
                alert("offline Players Ready"); */
                
           // alert(onlinePlayers.length+" <> "+offlinePlayers.length);
            if(onlinePlayers==NOT_READY||offlinePlayers==NOT_READY)
                return createDomElement('div', '', "", "Loading..."); //<br /><img src=\"themes/"+window['SETTINGS']['theme'].name+"/loading_s.gif\" alt=\"\" />
            switch(data.size){
                case 0:{
                    var el = createDomElement('div', "", "", "<u>Players Online: "+onlinePlayers.length    +"</u><br />");
                    for(index in onlinePlayers)
                        el.appendChild(createDomElement('div', 'mcPlayer_'+onlinePlayers[index].player_name, "mcServer_playerListSmallPlayerName", onlinePlayers[index].player_name));
                    return el;
                }
                case 1:{
                        
                }
                case 2:{
                    //alert("LARGE SIZE");
                    var el = createDomElement('div', "", "", "<h2>Online</h2>");
                    for(index in onlinePlayers)
                        el.appendChild(createDomElement('div', 'mcPlayer_'+onlinePlayers[index].player_name, "mcPlayer_player", onlinePlayers[index].player_name));
                    var offlineText = document.createElement('h2');
                    offlineText.innerHTML = "Offline";
                    el.appendChild(offlineText);
                    for(index in offlinePlayers)
                        el.appendChild(createDomElement('div', 'mcPlayer_'+offlinePlayers[index].player_name, "mcPlayer_player", offlinePlayers[index].player_name));
                    return el;
                }
            } 
            
            
            
        }, playerListOnlineB, playerListOfflineB);
        
        playerListDivB.liftB(function(x){document.getElementById(domId).appendChild(x);}); 
        //insertDomB(playerListDivB, domId);     
    }
    this.destroy=function(){
            DATA.deregister("minecraftServer_getPlayers");
            DATA.deregister("minecraftServer_getPlayersOnline");
            DATA.deregister("minecraftServer_getPlayersOffline");
    }
    this.build=function(){
        var element = document.createElement('div');
        element.className="minecraftServerPlayerList";
        element.style.width=width+"px";
        element.style.height=height+"px";
        element.appendChild(createDomElement('div', domId, "", ""));
        element.appendChild(createDomElement('div', "sendEvent", "", "<a style='cursor: pointer' href=\"javascript:send();\">SendEvent</a>'")); 
        return element;
    }
}
function MinecraftServerPlayerCountWidget(instanceId,data){  
    var domId=instanceId+"_counter";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    this.loader=function(){
        DATA.registerRemote(playerListR);
        DATA.register("minecraftServer_getPlayersOnline", "", playerListOnlineB);
        var playersOnlineDivB = playerListOnlineB.liftB(function(onlinePlayers){
            if(onlinePlayers==NOT_READY)
                return createDomElement('div', "", "", "Players Online: Loading...");
            return createDomElement('div', "", "", "Players Online: "+((onlinePlayers!=null)?onlinePlayers.length+"":"Loading"));
        }); 
        F.insertDomB(playersOnlineDivB, domId);     
    }
    this.destroy=function(){
        DATA.deregister("minecraftServer_getPlayersOnline");
    }
    this.build=function(){  
        return "<div class=\"minecraftServerPlayerCount\" style=\"width:"+width+"px; height: "+height+"px\"><div id=\""+domId+"\"></div></div>";
    }
}
WIDGETS.register("minecraftServerPlayerList", MinecraftServerPlayerListWidget);
WIDGETS.register("minecraftServerPlayerCount", MinecraftServerPlayerCountWidget);


 
