//BLO
function pushToValidationGroupBehaviour(validationGroupB, val){                    
    if(val==NOT_READY)
        return;
    var validationGroup = validationGroupB.valueNow();
        validationGroup.push(val);
        validationGroupB.sendEvent(validationGroup);
}
function EmailConfirmer(instanceId, data){
    var id = "emailConfirmer_"+instanceId;     
    this.instanceId = instanceId;
    this.loader=function(){  
        var valueName = (data.name==undefined)?"Email":data.name;
        var emailBlurE = F.extractEventE(data.target, 'blur');
        var emailValueB = F.extractValueB(data.target);
        var emailRequestB = emailBlurE.snapshotE(emailValueB).mapE(function(text){return {email: ""+text};}).startsWith(NOT_READY);
        var emailValidE = getAjaxRequestB(emailRequestB, SETTINGS['scriptPath']+"request/form_validator_check_email/").mapE(function(data){return data.valid;});
        var emailValidB = emailValidE.startsWith(false);
        var formGroupB = DATA.get(data.formGroup, undefined, []);
        var widgetValueB = F.liftB(function(emailValid, emailValue){
            return {value: emailValue, valid: emailValid, name: valueName};
        },emailValidB, emailValueB);
        
        pushToValidationGroupBehaviour(formGroupB, widgetValueB); 
        
        emailValidE.mapE(function(valid){
            document.getElementById(data.target).className = (valid)?'form_validator_validInput':'form_validator_invalidInput';
            document.getElementById(id).src = (valid)?window['SETTINGS']['theme']['path']+'tick.png':window['SETTINGS']['theme']['path']+'cross.png';
        }); 
        emailBlurE.mapE(function(){document.getElementById(id).src=SETTINGS['themeDir']+'loading_s.gif';});                                                                           
    }
    this.build=function(){
        return "<img src=\"/resources/trans.png\" alt=\"\" class=\"loadingSpinner\" id=\""+id+"\" />";   //"+scriptPath+"themes/"+theme+"/loading_s.gif
    }
}        
function ValidatedSubmitButton(instanceId, data){
    this.elementId = instanceId+'_submit';  
    this.loader=function(){
        var formGroupB = DATA.get(data.formGroup, undefined, []);
        var groupValidB = formGroupB.liftB(function(validationMap){
            //seperate validation behaviour from value beahviour
            return F.liftB.apply(this,[function(){
                var trueCount=0;
                for(index in arguments){
                    //log("arguments[index]="+arguments[index]);
                   //log(arguments[index]);
                    if(!arguments[index].valid){
                        //log("Truecount: "+trueCount);
                        return false;
                    }
                    trueCount++;
                }
                //log("Truecount: "+trueCount);
                return true;
            }].concat(validationMap));
        }).switchB();
        var elementId = this.elementId;
        jQuery("#"+elementId).button();
        groupValidB.liftB(function(valid){
           jQuery("#"+elementId).button((valid)?'enable':'disable');
        });
    }
    this.build=function(){
        return "<input type=\"submit\" value=\"Submit\" id=\""+this.elementId+"\" />";       
    }    
}
function ValidatedTextBox(instanceId, data){;
    this.instanceId = instanceId;
    this.loader=function(){    
        var valueName = (data.name==undefined)?"Email":data.name; 
        var formGroupB = DATA.get(data.formGroup, undefined, []); 
        var txtValueB = F.extractValueB(this.instanceId);
       
        var validB = txtValueB.liftB(function(text){
            if(data.minChars && text.length<data.minChars)
                return false;
            if(data.maxChars && text.length>data.maxChars)
                return false;
            return true;
        });
        var widgetResponseB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {value: text, valid: valid, name: valueName};
        }, validB, txtValueB);  
        
        //pushToValidationGroupBehaviour(validationGroupB, validB);
        pushToValidationGroupBehaviour(formGroupB, widgetResponseB);  
    }      
    this.build=function(){
        return "<input type=\"text\" value=\"\" id=\""+this.instanceId+"\"  />";                   //disabled=\"disabled\"
    }
}                                       
function ValidatedTextArea(instanceId, data){
    this.instanceId = instanceId;
    this.loader=function(){       
        var valueName = (data.name==undefined)?"Email":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, []); 
        var txtValueB = F.extractValueB(this.instanceId);
        
        var validB = txtValueB.liftB(function(text){
            if(data.minChars && text.length<data.minChars)
                return false;
            if(data.maxChars && text.length>data.maxChars)
                return false;
            return true;
        });
        var widgetValueB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: text, name: valueName};
        },validB,txtValueB);  
        
        pushToValidationGroupBehaviour(formGroupB, widgetValueB);    
    }      
    this.build=function(){
        var cols = 10;
        if(data.cols)
            cols = data.cols;
        var rows = 5;
        if(data.rows)
            rows = data.rows;
        return "<textarea type=\"text\" id=\""+this.instanceId+"\" rows=\""+rows+"\" cols=\""+cols+"\"></textarea>";       
    }
}
function ValidatedCalendar(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, []);  
        var valueName = (data.name==undefined)?"Email":data.name;
        var dateE = F.receiverE();
        var dateB = dateE.startsWith(null);
        var validB = dateB.liftB(function(val){return val!=null});
        jQuery("#"+instanceId).datepicker({onSelect: function(dateText, inst) {dateE.sendEvent(dateText);}});    
        
        
        var widgetValueB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
            
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: text, name: valueName};
        },validB,dateB);  
        pushToValidationGroupBehaviour(formGroupB, widgetValueB);  
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

WIDGETS.register("ValidatedSubmitButton", ValidatedSubmitButton);
WIDGETS.register("ValidatedCalendar", ValidatedCalendar);
WIDGETS.register("ValidatedTextArea", ValidatedTextArea);
WIDGETS.register("ValidatedTextBox", ValidatedTextBox);
WIDGETS.register("EmailConfirmer", EmailConfirmer);


var minChars = 1;
var maxChars = 30;
function checkCharLength(text){
    if(text.length<1)
        return false;
    if(text.length>30)
        return false;
    return true;
}     
function ValidatedContactForm(instanceId, data){
    var widgetId = instanceId+"_txtArea";
    this.instanceId = instanceId;
    this.loader=function(){ 
        var fullnameValidB = F.extractValueB('fullname').liftB(checkCharLength);
        var messageValidB = F.extractValueB('message').liftB(checkCharLength);
        
        var emailBlurE = F.extractEventE('email', 'blur');
        var emailTextChangedB = F.extractValueB('email');
        var emailRequestB = emailBlurE.snapshotE(emailTextChangedB).mapE(function(text){
            return {email: ""+text};
        });
        var emailValidB = getAjaxRequestB(emailRequestB, scriptPath+"request/form_validator_check_email/").mapE(function(data){
            return data.valid;    
        }).startsWith(false);   
          
        var allFieldsValid = F.liftB(function(fullname, message, email){
            return fullname&&message&&email;
        }, fullnameValidB, messageValidB, emailValidB);
        
         var submitClickedE = F.extractEventE('submit', 'click').snapshotE(allFieldsValid).mapE(function(valid){
            if(valid)
                alert("Submit clicked! All fields are valid!");
        });                
                                                                                             
        //Gui Reaction
        F.insertValueB(ifB(fullnameValidB, '#00FF00', '#FF0000'),'fullname', 'style', 'borderColor');
        F.insertValueB(ifB(messageValidB, '#00FF00', '#FF0000'),'message', 'style', 'borderColor');
        F.insertValueB(ifB(emailValidB, '#00FF00', '#FF0000'),'email', 'style', 'borderColor');
        F.insertValueB(ifB(emailValidB, scriptPath+'plugins/form_validator/tick.png', scriptPath+'plugins/form_validator/cross.png'),'emailTick', 'src')
        F.insertValueB(notB(allFieldsValid),'submit', 'disabled');
    }
    this.build=function(){
        return "<table><tr><td>Full Name:</td><td><input type=\"text\" alt=\"\" id=\"fullname\" /></td></tr><tr><td>Email Address:</td><td><input type=\"text\" alt=\"\" id=\"email\" /><img src=\"/resources/trans.png\" id=\"emailTick\" alt=\"\" style=\"vertical-align: middle;\" /></td></tr><tr><td>Message</td><td><textarea alt=\"\" id=\"message\" rows=\"6\" cols=\"45\"></textarea></td></tr><tr><td>&nbsp;</td><td><input type=\"submit\" value=\"Submit\" alt=\"\" id=\"submit\" /></td></tr></table>";
    }
}                 

/*function ValidatedContactFormConfigurator(){
    var id = "IntegerTableWidgetCont";
    this['render'] = function(newData){
        var targetName = (newData!=undefined&&newData['targetName']!=undefined)?newData['targetName']:"";
        return "Target Name: <input type=\"text\" id=\""+id+"\" value=\""+targetName+"\" />";  
    }
    this['getData'] = function(){
        return {"targetName": document.getElementById(id).value};
    }
    this['getName'] = function(){
        return "Integer TableWidget";
    }
    this['getDescription'] = function(){
        return "A one or two-dimensional table of integers. WIth controls to add, edit or delete data.";
    }
    this['getImage'] = function(){
        var img = document.createElement("img");
        img.src = "plugins/aviat.csrDemo/table.png";
        img.alt = "";
        return img;
    }
}  */
WIDGETS.register("ValidatedContactForm", ValidatedContactForm/*, ValidatedContactFormConfigurator*/);