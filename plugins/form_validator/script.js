function EmailConfirmer(instanceId, elementId, data){
    var id = "emailConfirmer_"+instanceId;     
    this.instanceId = instanceId;
    this.loader=function(){ 
        var formGroup = commonWidgetData.pull(data.formGroup); 
        var validationGroup = commonWidgetData.pull(data.validationGroup);
        validationGroup.push("email", false);
        var emailBlurE = extractEventE(data.target, 'blur');
        var emailValueB = extractValueB(data.target);
        var emailRequestB = emailBlurE.snapshotE(emailValueB).mapE(function(text){validationGroup.push("email", false);return {email: ""+text};});
        var emailValidE = getAjaxRequestB(emailRequestB, scriptPath+"request/form_validator_check_email/").mapE(function(data){return data.valid;});
        
        //Update Gui
        emailValueB.liftB(function(text){
            formGroup.push(data.name, text);
        });
        emailValidE.mapE(function(valid){
            validationGroup.push("email", valid);
            document.getElementById(data.target).className = (valid)?'form_validator_validInput':'form_validator_invalidInput';
            document.getElementById(id).src = (valid)?themeDir+'tick.png':themeDir+'cross.png';
        }); 
        emailBlurE.mapE(function(){document.getElementById(id).src=themeDir+'loading_s.gif';});                                                                           
    }
    this.build=function(){
        return "<img src=\"themes/trans.png\" alt=\"\" class=\"loadingSpinner\" id=\""+id+"\" />";   //"+scriptPath+"themes/"+theme+"/loading_s.gif
    }
}  
function ValidatedSubmitButton(instanceId, elementId, data){
    this.elementId = (elementId=='')?instanceId+'_submit':elementId;
    var validationMap = new BehaviourMap();
    var isValidB = validationMap.getBehaviour().liftB(function(groupValidator){var data = groupValidator.toArray();for(i in data){if(!data[i]) return false;}return true;}); 
    commonWidgetData.push(data.validationGroup, validationMap);
    this.loader=function(){
        var elementId = this.elementId;
        jQuery("#"+elementId).button();
        isValidB.liftB(function(valid){
           jQuery("#"+elementId).button((valid)?'enable':'disable');
        });
    }
    this.build=function(){
        return "<input type=\"submit\" value=\"Submit\" id=\""+this.elementId+"\" />";       
    }    
}
function ValidatedTextBox(instanceId, elementId, data){;
    this.instanceId = instanceId;
    this.loader=function(){   
        var formGroup = commonWidgetData.pull(data.formGroup);
       var txtValueB = extractValueB(elementId);
        var validationGroup = commonWidgetData.pull(data.validationGroup);
        validationGroup.push(elementId, false);
        var validB = txtValueB.liftB(function(text){
            if(data.minChars && text.length<data.minChars)
                return false;
            if(data.maxChars && text.length>data.maxChars)
                return false;
            return true;
        });
        F.liftB(function(valid, text){
            validationGroup.push(elementId, text);   
            document.getElementById(elementId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            formGroup.push(data.name, text);
        }, validB, txtValueB);    
    }      
    this.build=function(){
        return "<input type=\"text\" value=\"\" id=\""+elementId+"\"  />";                   //disabled=\"disabled\"
    }
}                                       
function ValidatedTextArea(instanceId, elementId, data){
    this.instanceId = instanceId;
    this.loader=function(){       
        var txtValueB = extractValueB(elementId);
        var validationGroup = commonWidgetData.pull(data.validationGroup);
        validationGroup.push(elementId, false);
        var formGroup = commonWidgetData.pull(data.formGroup);
        var validB = txtValueB.liftB(function(text){
            if(data.minChars && text.length<data.minChars)
                return false;
            if(data.maxChars && text.length>data.maxChars)
                return false;
            return true;
        });
        F.liftB(function(valid, text){
            validationGroup.push(elementId, valid); 
            document.getElementById(elementId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            formGroup.push(data.name, text);   
        },validB,txtValueB);     
    }      
    this.build=function(){
        var cols = 10;
        if(data.cols)
            cols = data.cols;
        var rows = 5;
        if(data.rows)
            rows = data.rows;
        return "<textarea type=\"text\" id=\""+elementId+"\" rows=\""+rows+"\" cols=\""+cols+"\"></textarea>";       
    }
}
function ValidatedCalendar(instanceId, elementId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    
    this.loader=function(){       
        var formGroup = commonWidgetData.pull(data.formGroup); 
        var validationGroup = commonWidgetData.pull(data.validationGroup);
        
        var dateE = receiverE();
        var dateB = dateE.startsWith(null);
        dateB.liftB(function(date){
            validationGroup.push(elementId, date!=null);
            formGroup.push(data.name, date);
        });
        jQuery("#"+instanceId).datepicker({onSelect: function(dateText, inst) {dateE.sendEvent(dateText);}});
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\"></span>";//"<input id=\""+this.inputId+"\" type=\"text\">";         
    }
}

        //.onSelect = function(x){alert(x);dateE.sendEvent(x);};
        //jQuery.datepicker._defaults.onSelect = function(text, inst){alert(text)};
       //jQuery("#"+instanceId).fj('jQueryBind', 'change').mapE(function(e){showObj(e);});
        //{onSelect: function(dateText, inst) {formGroup.push(data.name,dateText);}}
        //jQuery("#"+instanceId).fj('jQueryBind', 'onSelect').mapE(function(x){alert(x);});
        //jQuery("#"+instanceId).fj('jQueryBind', 'dateSelected').mapE(function(x){showObj(x);});
        //var calendarB = jQuery("#"+instanceId).fj('extEvtE', 'onSelect').mapE(function(x){alert(x);});
        //var calendarB = jQuery("#"+instanceId).fj('extValB').liftB(function(x){alert(x);});

//widgetTypes['contactFormSubmitButton']=ContactFormSubmitButton;
widgetTypes['validatedCalendar']=ValidatedCalendar;
widgetTypes['validatedTextArea']=ValidatedTextArea; 
widgetTypes['validatedTextBox']=ValidatedTextBox;
widgetTypes['emailConfirmer']=EmailConfirmer;
widgetTypes['validatedSubmitButton']=ValidatedSubmitButton;
var minChars = 1;
var maxChars = 30;
function checkCharLength(text){
    if(text.length<1)
        return false;
    if(text.length>30)
        return false;
    return true;
}     
function ValidatedContactForm(instanceId, elementId, data){
    var widgetId = instanceId+"_txtArea";
    this.instanceId = instanceId;
    this.loader=function(){ 
        var fullnameValidB = extractValueB('fullname').liftB(checkCharLength);
        var messageValidB = extractValueB('message').liftB(checkCharLength);
        
        var emailBlurE = extractEventE('email', 'blur');
        var emailTextChangedB = extractValueB('email');
        var emailRequestB = emailBlurE.snapshotE(emailTextChangedB).mapE(function(text){
            return {email: ""+text};
        });
        var emailValidB = getAjaxRequestB(emailRequestB, scriptPath+"request/form_validator_check_email/").mapE(function(data){
            return data.valid;    
        }).startsWith(false);   
          
        var allFieldsValid = F.liftB(function(fullname, message, email){
            return fullname&&message&&email;
        }, fullnameValidB, messageValidB, emailValidB);
        
         var submitClickedE = extractEventE('submit', 'click').snapshotE(allFieldsValid).mapE(function(valid){
            if(valid)
                alert("Submit clicked! All fields are valid!");
        });
                                                                                             
        //Gui Reaction
        insertValueB(ifB(fullnameValidB, '#00FF00', '#FF0000'),'fullname', 'style', 'borderColor');
        insertValueB(ifB(messageValidB, '#00FF00', '#FF0000'),'message', 'style', 'borderColor');
        insertValueB(ifB(emailValidB, '#00FF00', '#FF0000'),'email', 'style', 'borderColor');
        insertValueB(ifB(emailValidB, scriptPath+'plugins/form_validator/tick.png', scriptPath+'plugins/form_validator/cross.png'),'emailTick', 'src')
        insertValueB(notB(allFieldsValid),'submit', 'disabled');
    }
    this.build=function(){
        return "<table><tr><td>Full Name:</td><td><input type=\"text\" alt=\"\" id=\"fullname\" /></td></tr><tr><td>Email Address:</td><td><input type=\"text\" alt=\"\" id=\"email\" /><img src=\"\" id=\"emailTick\" alt=\"\" style=\"vertical-align: middle;\" /></td></tr><tr><td>Message</td><td><textarea alt=\"\" id=\"message\" rows=\"6\" cols=\"45\"></textarea></td></tr><tr><td>&nbsp;</td><td><input type=\"submit\" value=\"Submit\" alt=\"\" id=\"submit\" /></td></tr></table>";
    }
}                 
widgetTypes['validatedContactForm']=ValidatedContactForm;
//Different
//rar
//fgdgdf