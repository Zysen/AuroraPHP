function ContactFormSubmitButton(instanceId, data){
    this.instanceId = instanceId;
    var loadingImId = this.instanceId+"_loading";
    var submitButton = new ValidatedSubmitButton(instanceId,data);
    this.loader=function(){           
        
        var formDataGroupB = DATA.get(data.formGroup, undefined, []); 
        var formDataB = formDataGroupB.liftB(function(validationMap){
            return F.liftB.apply(this,[function(){
                var dataOb = {};
                for(index in arguments){
                    if(arguments[index].valid){
                        dataOb[arguments[index].name] = arguments[index].value;                            
                    }
                }
                return dataOb;
            }].concat(validationMap));
        }).switchB();
        
        submitButton.loader();    
        var submitClickedE = jQuery("#"+submitButton.elementId).fj('extEvtE', 'click').snapshotE(formDataB).mapE(function(formData){
            return formData;
        });
        var submitClickedB = submitClickedE.startsWith(NOT_READY);
         
        /*var submitClickedE = jQuery("#"+submitButton.elementId).fj('extEvtE', 'click').snapshotE(formDataB).mapE(function(formDataMap){
            alert("Submit clicked");
            return formDataB;
        });   */            
        getAjaxRequestB(submitClickedB, SETTINGS['scriptPath']+"request/contactForm_sendMessage/").mapE(function(valid){
            UI.showMessage('Contact Form', 'Your request has been sent.');
            return valid;    
        });  
        //groupValidB
        
        //var emailValidB = F.receiverE().startsWith(false);
        //F.insertValueB(emailValidB,loadingImId, 'src');
        //F.insertValueB(submitClickedE.mapE(function(){return SETTINGS['theme']['path']+'loading_s.gif';}),loadingImId, 'src');
    }
    this.build=function(){
        return ""+submitButton.build()+"<img id=\""+loadingImId+"\" class=\"loadingSpinner\" src=\"themes/trans.png\" alt=\"\" />";                 
    }
}
WIDGETS.register("ContactFormSubmitButton", ContactFormSubmitButton);