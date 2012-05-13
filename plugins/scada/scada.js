function AnalogRegisterDisplay(instanceId, data){
    this.device = data.device;
    this.targetType = data.targetType;
    this.targetRegister = data.targetRegister; 
    this.units = data.units;
    this.loader=function(){  
	var pollRate = data.pollRate; 
	var dataR = DATA.getRemote("scada_integer_register", this.device+"|"+this.targetType+"|"+this.targetRegister, NOT_READY, pollRate);  //, NOT_READY, POLL_RATES.SLOW       
	var dataB = dataR.behaviour;        
	insertDomB(dataB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("scada_integer_register", this.targetRegister);
    }
    this.build=function(){
        return "<span class=\"scada_analogDisplay\"><span id=\""+instanceId+"_container\">&nbsp;</span>"+this.units+"</span>";
    }
}     
widgetTypes['AnalogRegisterDisplay']=AnalogRegisterDisplay;
