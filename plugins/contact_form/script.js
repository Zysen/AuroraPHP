function ContactFormSubmitButton(instanceId, elementId, data){
    this.instanceId = instanceId;
    var loadingImId = this.instanceId+"_loading";
    var wysiwygData = data;
    var form = document.getElementById(data.form);
    var submitButton = new ValidatedSubmitButton(instanceId,elementId, "{\"validationGroup\":\""+data.validationGroup+"\"}");
    commonWidgetData.push(data.formGroup, new BehaviourMap());
    this.loader=function(){    
        var validationGroup = commonWidgetData.pull(data.validationGroup);
        var formDataB = commonWidgetData.pull(data.formGroup).getBehaviour();
        submitButton.loader();    
        var submitClickedE = jQuery("#"+submitButton.elementId).fj('extEvtE', 'click').snapshotE(formDataB).mapE(function(formDataMap){
            validationGroup.push("contactFormSubmit", false);
            
            var ret = new Object();
            var formData = formDataMap.toArray();
            ret.target = wysiwygData.target;
            ret.subject = wysiwygData.subject; 
            for(index in formData){ 
                var data = formData[index];
                eval("ret."+index+"='"+data+"';");
            }                                                                  
            return ret;
        });
        var emailValidB = getAjaxRequestB(submitClickedE, scriptPath+"request/contactForm_sendMessage/").mapE(function(valid){
            validationGroup.push("contactFormSubmit", true);
            aurora_ui.showMessage('Contact Form', 'Your request has been sent.');
            return valid;    
        });  
        insertValueE(emailValidB.mapE(function(){return '';}),loadingImId, 'src');
        insertValueE(submitClickedE.mapE(function(){return themeDir+'loading_s.gif';}),loadingImId, 'src');
    }
    this.build=function(){
        return ""+submitButton.build()+"<img id=\""+loadingImId+"\" class=\"loadingSpinner\" src=\"themes/trans.png\" alt=\"\" />";                 
    }
}
WIDGETS.register("contactFormSubmitButton", ContactFormSubmitButton);