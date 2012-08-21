function AnalogRegisterDisplay(instanceId, data){
    this.device = data.device;
    this.targetType = data.targetType;
    this.targetRegister = data.targetRegister; 
    this.units = data.units;
    this.loader=function(){  
	    var pollRate = data.pollRate; 
	    var dataR = DATA.getRemote("scada_integer_register", this.device+"|"+this.targetType+"|"+this.targetRegister, NOT_READY, pollRate);  //, NOT_READY, POLL_RATES.SLOW       
	    var dataB = dataR.behaviour;        
	    F.insertDomB(dataB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("scada_integer_register", this.targetRegister);
    }
    this.build=function(){
        return "<span class=\"scada_analogDisplay\"><span id=\""+instanceId+"_container\">&nbsp;</span>"+this.units+"</span>";
    }
} 

/**
 *  AnalogRegisterDisplayConfigurator
 * @constructor
 */
function AnalogRegisterDisplayConfigurator(){
    var id = "AnalogRegisterDisplay";
    this['render'] = function(newData){
        var targetName = (newData!=undefined&&newData['targetName']!=undefined)?newData['targetName']:"";
        return "Target Name: <input type=\"text\" id=\""+id+"\" value=\""+targetName+"\" />";  
    }
    this['getData'] = function(){
        return {"targetName": document.getElementById(id).value};
    }
    this['getName'] = function(){
        return "Analog Register Display";
    }
    this['getDescription'] = function(){
        return "An Analog Register Display";
    }
    this['getImage'] = function(){
        var img = document.createElement("img");
        img.src = "plugins/aviat.csrDemo/table.png";
        img.alt = "";
        return img;
    }
}
    
WIDGETS.register("AnalogRegisterDisplay", AnalogRegisterDisplay, AnalogRegisterDisplayConfigurator);


