function pushToValidationGroupBehaviour(key, validationGroupB, val){                    
	if(val==NOT_READY)
        return;
    var validationGroup = validationGroupB.valueNow();
    validationGroup[key] = val;
    validationGroupB.sendEvent(validationGroup);
}
function PhoneNumbersWidget(instanceId, data){
    this.instanceId = instanceId;
    this.loader=function(){  
    	var valueName = (data.name==undefined)?"ContactNumbers":data.name;
    	var line = "<input type=\"text\" /><select><option>Mobile</option><option>Home</option><option>Work</option></select><span class=\"button\">Add Number</span>";
    	var columns = [{"reference": "behaviour", "display": "Number", "type": "string", "visible":true, "readOnly": false},
    	               {"reference": "behaviour", "display": "Type", "type": "string", "visible":true, "readOnly": false}];
    	var tableB = F.receiverE().startsWith({"DATA": [["",""]], "COLUMNS": columns, "TABLEMETADATA": {"permissions": {"canAdd": true, "canDelete": true, "canEdit": true}}, "ROWMETADATA": [], "CELLMETADATA": [[]], "COLUMNMETADATA": []});
    	var tableBI = F.liftBI(function(table){
             var renderer = new BasicSelectCellRendererContainer([{"display": "Mobile", value: "Mobile"}, {"display": "Home", "value": "Home"}, {"display": "Work", "value": "Work"}]);
             table.COLUMNMETADATA[1] = {"renderer": renderer};  
    		return table;
    	}, function(table){return [table];}, tableB);
    	F.insertDomB(TableWidgetB(instanceId+"_table", data, tableBI), instanceId+"_container");
    	
    	var formGroupB = DATA.get(data.formGroup, undefined, {});
        var widgetValueB = F.liftB(function(table){
            if(!good()){
            	return {value: table.DATA, valid: false, name: valueName};
            }
            var valid = table.DATA.length>0&&table.DATA[0].length>0&&table.DATA[0][0].length>0;
            return {value: table, valid: valid, name: valueName};
        },tableBI);
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB); 
    }                    
    this.build=function(){
        return "<div id=\""+instanceId+"_container\"></div>";   //"+scriptPath+"themes/"+theme+"/loading_s.gif
    }
} 
function EmailConfirmer(instanceId, data){
    var id = "emailConfirmer_"+instanceId; 
    var targetId = data.target==undefined?("emailConfirmerTarget_"+instanceId):data.target;    
    this.instanceId = instanceId;
    var minLength = data.minChars==undefined?5:data.minChars;
    var maxLength = data.maxChars==undefined?50:data.maxChars;
    this.loader=function(){  
    	var manualSetB = DATA.getB(data.name+"_man");
    	var userDefault = (data.userDefault==undefined)?false:data.userDefault;
    	var valueName = (data.name==undefined)?"emailaddress":data.name;
    	var allowBlank = (data.allowBlank==undefined)?false:data.allowBlank;
    	var checkUnique = data.checkUnique!==undefined&&data.checkUnique===true;
       	var reqURL = checkUnique?"request/form_validator_check_email_with_unique/":"request/form_validator_check_email/";
       
       
       var enterE = F.receiverE();
       
       if(data.showBubble==true){
	       var tipContent = "<div class=\"emailConfirmer_tip\"><table>"+
	       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_charLength\" alt=\"\" /></td><td>Address must contain between "+minLength+" and "+maxLength+" characters</td></tr>"+
	       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_validTest\" alt=\"\" /></td><td>Address must be a valid address with an active domain</td></tr>";
	       if(checkUnique){
	       		tipContent+="<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_uniqueTest\" alt=\"\" /></td><td>Address must be unique</td></tr>";
	       }
	       tipContent+="</table></div>";
	       jQuery("#"+targetId).tipTip({activation: 'focus', defaultPosition: 'right', fadeIn: 100, fadeOut: 100, content: tipContent,  maxWidth: "auto", edgeOffset: 5, enter: function(){enterE.sendEvent(true);}});
       }
        if(userDefault){
        	var currentUserB = DATA.getRemote("aurora_current_user").behaviour; 
        	currentUserB.liftB(function(user){
				if(!good()){
					return NOT_READY;
				}
				DOM.get(targetId).value = user.email;
				manualSetB.sendEvent({value: user.email, valid: true, name: valueName});
			});
        	
        }
        var emailValueB = F.extractValueB(targetId);
        var emailRequestE = F.mergeE(F.extractValueE(targetId).calmE(250).filterE(function(text){return text.length>0}), F.extractEventE(targetId, 'blur').mapE(function(){return DOM.get(targetId).value;})).mapE(function(text){return {email: ""+text};});
        
        var serverResponseE = emailRequestE.mapE(function(emailValue){
        	return {type:'post', data: emailValue, dataType: 'json', url: SETTINGS['scriptPath']+reqURL};
        }).ajaxRequestE();
        
        var serverResponseB = serverResponseE.startsWith(NOT_READY);

        var formGroupB = DATA.get(data.formGroup, undefined, {});
        var widgetValueB = F.liftB(function(serverResponse, emailValue){//manualSet
        	var emailValid =serverResponse.valid;
        	var emailUnique = serverResponse.unique || !checkUnique;
        	/*
			if((emailValue==NOT_READY&&manualSet!=NOT_READY)||(manualSetB.firedAfter(emailValueB))){
							return manualSet;
						}*/
			var lengthValid = false;
            var valid = false;
            if(allowBlank&&emailValue!=NOT_READY&&emailValue.length===0){
            	valid = true;
            	lengthValid = true;
            }
        	else if(emailValid!=NOT_READY){
        		if(emailValue.length<=minLength || emailValue.length>=maxLength){
	        	 	valid = false;
	        	 }
	        	 else{
	        	 	lengthValid = true;
	        	 }
        	}
        	valid = emailValid && emailUnique && lengthValid;
            return {value: emailValue, valid: valid, lengthValid: lengthValid, addressValid: emailValid, emailUnique: emailUnique, name: valueName};
        },serverResponseB, emailValueB);  //manualSetB

         F.liftB(function(widgetValue, enter, serverResponse){
         	if(serverResponse==NOT_READY){
         		document.getElementById(id).src = "/resources/trans.png";
         		return NOT_READY;	
         	}
         	
         	
         	if(DOM.get(instanceId+"_validTest")!=undefined){
	         	DOM.get(instanceId+"_charLength").src = widgetValue.lengthValid?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';	
	         	DOM.get(instanceId+"_validTest").src = widgetValue.addressValid?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png'; 
	        	if(checkUnique){
	        		DOM.get(instanceId+"_uniqueTest").src = widgetValue.emailUnique?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';	
	        	}
        	}
			document.getElementById(id).src = widgetValue.valid?(window['SETTINGS']['theme']['path']+'tick.png'):(window['SETTINGS']['theme']['path']+'cross.png');
			document.getElementById(targetId).className = widgetValue.valid?'form_validator_validInput':'form_validator_invalidInput';
         },widgetValueB, enterE.delayE(500).startsWith(NOT_READY), serverResponseB);
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);                                                                          
    }                    
    this.build=function(){
        return (data.target===undefined?"<div class=\"formValidatorInput\"><input type=\"text\" id=\""+targetId+"\" /></div>":"")+
        "<div class=\"formValidatorStatusIcon\"><img src=\"/resources/trans.png\" alt=\"\" class=\"loadingSpinner\" id=\""+id+"\" /></div>";  
    }
}        
function ValidatedSubmitButton(instanceId, data){
    this.elementId = instanceId+'_submit';  
    this.loader=function(){
        var formGroupB = DATA.get(data.formGroup, undefined, {});
        var groupValidB = formGroupB.liftB(function(validationMap){
            //seperate validation behaviour from value beahviour
            var liftedB =  F.liftB.apply(this,[function(){
            	var trueCount=0;
                for(index in arguments){
                	if(!arguments[index].valid){
                        return false;
                    }
                    trueCount++;
                }
                return true;
            }].concat(getObjectValues(validationMap)));
            return liftedB;
        }).switchB();
        //var groupValidB = F.receiverE().startsWith(NOT_READY);
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


function ValidatedWholeNumberBox(instanceId, data){
	var newData = clone(data);
	newData.pattern = "[^0-9]";
	var field = new ValidatedPatternMatchInput(instanceId+"_patternMatchInput",newData);
	this.load = function(){
		field.load();
	};
	this.build = function(){
		return field.build();
	};
}
function ValidatedTextBox(instanceId, data){
	var field = new ValidatedPatternMatchInput(instanceId+"_patternMatchInput",clone(data));
    this.load = function(){
		field.load();
	};
	this.build = function(){
		return field.build();
	};
}   
/*
function ValidatedIntegerBox(instanceId, data){
	var newData = data.clone();
	newData.pattern = "[^0-9,-]";
	var field = new ValidatedPatternMatchInput(instanceId+"_patternMatchInput",newData);
	this.load = function(){
		field.load();
	};
	this.build = function(){
		return field.build();
	};
}
function ValidatedNumberBox(instanceId, data){
	var newData = data.clone();
	newData.pattern = "[^0-9,-,.]";
	var field = new ValidatedPatternMatchInput(instanceId+"_patternMatchInput",newData);
	this.load = function(){
		field.load();
	};
	this.build = function(){
		return field.build();
	};
}
*/
function ValidatedPatternMatchInput(instanceId, data){
    this.instanceId = instanceId;
    this.load=function(){    
    	var manualSetB = DATA.getB(data.name+"_man");
    	var valueName = (data.name==undefined)?"Number":data.name; 
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var txtValueB = F.extractValueB(this.instanceId);
       	var blurB = F.extractEventE(this.instanceId, 'blur').startsWith(NOT_READY);
       	var minChars = data.minChars==undefined?0:data.minChars;
        var maxChars = data.maxChars==undefined?15:data.maxChars;
        
        var validB = txtValueB.liftB(function(text){
            return ((text.length>minChars && text.length<maxChars) && (data.pattern===undefined || text.match(data.pattern)==null));
        });
        
        
        F.liftB(function(focus, valid){
        	if(!good()){
        		return NOT_READY;
        	}	
        	document.getElementById(instanceId).className = ((valid)?'form_validator_validInput':'form_validator_invalidInput');
            document.getElementById(instanceId+"_tick").src = ((valid)?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png');
        }, blurB, validB);
        
        
        
        var widgetResponseB = F.liftB(function(valid, text, manualSet){//
        	if((text==NOT_READY&&manualSet!=NOT_READY)||(manualSetB.firedAfter(txtValueB))){
        		return manualSet;
             }
        	if(valid==NOT_READY||text==NOT_READY||text==null){
            	return NOT_READY;
            }
            return {value: text, valid: valid, name: valueName};
        }, validB, txtValueB, manualSetB);//  
        
        //pushToValidationGroupBehaviour(instanceId, validationGroupB, validB);
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetResponseB);  
    }      
    this.build=function(){
        var size = (data.size==undefined)?"":" size=\""+data.size+"\"";
        return "<div class=\"formValidatorInput\"><input type=\"text\" value=\"\" id=\""+this.instanceId+"\" "+size+" /></div><div class=\"formValidatorStatusIcon\"><img src=\"/resources/trans.png\" alt=\"\" class=\"\" id=\""+this.instanceId+"_tick\" /></div>";                   //disabled=\"disabled\"
    }
}    

function ValidatedSelectField(instanceId, data){;
    this.instanceId = instanceId;
    this.loader=function(){    
        var valueName = (data.name==undefined)?"SelectField":data.name; 
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var selectValueB = F.extractValueB(this.instanceId);
        var validB = selectValueB.liftB(function(text){
            return true;
        });
        var widgetResponseB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {value: text, valid: valid, name: valueName};
        }, validB, selectValueB);  
        
        //pushToValidationGroupBehaviour(instanceId, validationGroupB, validB);
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetResponseB);  
    }      
    this.build=function(){
        var select = DOM.create('select');
        select.id = this.instanceId;
        for(index in data.options){
            select.appendChild(DOM.createOption(this.instanceId+"_"+index, undefined, data.options[index]+"", index+""));
        }
        return select;         
    }
} 
                                  
function ValidatedTextArea(instanceId, data){
    this.instanceId = instanceId;
    var resizable = data.resize==undefined?false:data.resize;
    this.loader=function(){      
    	var valueName = (data.name==undefined)?"TextArea":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var txtValueB = F.extractValueB(this.instanceId);
        var txtBlurB = F.extractEventE(this.instanceId, 'blur').startsWith(NOT_READY);
        
        var manualSetB = DATA.getB(data.name+"_man");
        manualSetB.liftB(function(manualSet){
        });
        
        var validB = txtValueB.liftB(function(text){
            if(data.minChars && text.length<data.minChars)
                return false;
            if(data.maxChars && text.length>data.maxChars)
                return false;
            return true;
        });
        
        F.liftB(function(blur, valid, value){
        	if(!good()){
        		return NOT_READY;
        	}
        	document.getElementById(instanceId+"_tick").src = ((valid)?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png');
        	document.getElementById(instanceId).className = ((valid)?'form_validator_validInput':'form_validator_invalidInput');
        }, txtBlurB, txtValueB, txtValueB);
        
        var widgetValueB = F.liftB(function(valid, text, manualSet){
        	if(manualSetB.firedAfter(txtValueB)){
        		return manualSet;
            }
        	if(text==NOT_READY||text==null||valid==NOT_READY){
                return NOT_READY;
            }
            return {valid: valid, value: text, name: valueName};
        }, validB,txtValueB,manualSetB);  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);    
    }      
    this.build=function(){
        var cols = 10;
        if(data.cols)
            cols = data.cols;
        var rows = 5;
        if(data.rows)
            rows = data.rows;
        return "<div class=\"formValidatorInput\"><textarea style=\"resize: "+(resizable?"both":"none")+";\" type=\"text\" id=\""+this.instanceId+"\" rows=\""+rows+"\" cols=\""+cols+"\"></textarea></div><div class=\"formValidatorStatusIcon\"><div class=\"formValidatorStatusIcon\"><img src=\"/resources/trans.png\" alt=\"\" class=\"loadingSpinner\" id=\""+instanceId+"_tick\" /></div>";       
    }
}                                              
function ValidatedCheckBox(instanceId, data){   
    this.instanceId = instanceId;
    this.loader=function(){
        var valueName = (data.name==undefined)?"Checkbox":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var validB = jQuery("#"+instanceId+"_checkbox").fj('jQueryBind', 'change').mapE(function(event){
            return DOM.get(instanceId+"_checkbox").checked;
        }).startsWith(false);
        var widgetValueB = F.liftB(function(valid){
            if(!good()){
                return NOT_READY;
            }
            //DOM.get(instanceId).className = ((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: valid, name: valueName};
        },validB);  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);   
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\"><input type=\"checkbox\" id=\""+this.instanceId+"_checkbox\" /></span>";       
    }
}

function ValidatedPasswordWidget(instanceId, data){
    this.instanceId = instanceId;
    this.loader=function(){       
        var passwordRequirementsR = DATA.getRemote("aurora_passwordRequirements", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW  
        var passwordRequirementsB = passwordRequirementsR.behaviour;
        
    	var manualSetB = DATA.getB(data.name+"_man");
    	
    	var valueName = (data.name==undefined)?"Password":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var minChars = data.minChars===undefined?5:data.minChars;
        var maxChars = data.maxChars===undefined?30:data.maxChars;
        var minComplexity = data.minComplexity==undefined?50:data.minComplexity;
        
        
        
        
        var txtValue1B = F.extractValueB(this.instanceId+"_pass1");
        var txtValue2B = F.extractValueB(this.instanceId+"_pass2");
        
        
        
        var enterE = F.receiverE();
        var enter2E = F.receiverE();
        var complexityB = txtValue1B.liftB(function(password){
			return (password.match("[0-9]")==null?0:12.5)+(password.match("[a-z]")==null?0:12.5)+(password.match("[A-Z]")==null?0:12.5)+(password.match("[^A-Za-z0-9]")==null?0:12.5)+(Math.min((50/14)*password.length, 50));
        });
        
		//if(data.showBubble==true){
       var tipContent = "<div class=\"emailConfirmer_tip\"><table id=\""+instanceId+"_reqTable1\">"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_charLength\" alt=\"\" /></td><td>Password must contain between <span id=\""+instanceId+"_minChars\">"+minChars+"</span> and <span id=\""+instanceId+"_maxChars\">"+maxChars+"</span> characters</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_confirmTest\" alt=\"\" /></td><td>Passwords must match</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_lowerTest\" alt=\"\" /></td><td>Password must include a lower case character</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_upperTest\" alt=\"\" /></td><td>Password must include an upper case character</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_numberTest\" alt=\"\" /></td><td>Password must include a number</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_specialTest\" alt=\"\" /></td><td>Password must include a special character</td></tr>"+
       "</table><div id=\""+instanceId+"_complexityBarNumber\" class=\"complexityBarNumber\"></div></div>";
    	
    	
    	
    	//"</table><div style=\"position: relative;\"><div id=\""+instanceId+"_complexityBar\"></div><div id=\""+instanceId+"_complexityBarNumber\" class=\"complexityBarNumber\"></div></div></div>";
    	
    	
    	
    	
    	jQuery("#"+instanceId+"_pass1").tipTip({activation: 'focus', defaultPosition: 'right', fadeIn: 100, fadeOut: 100, content: tipContent,  maxWidth: "auto", edgeOffset: 5, enter: function(){enterE.sendEvent(true);}});
		
		var tipContent2 = "<div class=\"emailConfirmer_tip\"><table id=\""+instanceId+"_reqTable2\">"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_charLength2\" alt=\"\" /></td><td>Password must contain between <span id=\""+instanceId+"_minChars2\">"+minChars+"</span> and <span id=\""+instanceId+"_maxChars2\">"+maxChars+"</span> characters</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_confirmTest2\" alt=\"\" /></td><td>Passwords must match</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_lowerTest2\" alt=\"\" /></td><td>Password must include a lower case character</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_upperTest2\" alt=\"\" /></td><td>Password must include an upper case character</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_numberTest2\" alt=\"\" /></td><td>Password must include a number</td></tr>"+
       "<tr><td><img src=\"/resources/trans.png\" style=\"border: 0; width: 17px; height: 17px;\" id=\""+instanceId+"_specialTest2\" alt=\"\" /></td><td>Password must include a special character</td></tr>"+
       "</table><div id=\""+instanceId+"_complexityBarNumber2\" class=\"complexityBarNumber\"></div></div>";
    	
    	
    	//"</table><div style=\"position: relative;\"><div id=\""+instanceId+"_complexityBar2\" class=\"intensityBar\"></div><div id=\""+instanceId+"_complexityBarNumber2\" class=\"complexityBarNumber\"></div></div></div>";
    	
    	
    	
    	jQuery("#"+instanceId+"_pass2").tipTip({activation: 'focus', defaultPosition: 'right', fadeIn: 100, fadeOut: 100, content: tipContent2,  maxWidth: "auto", edgeOffset: 5, enter: function(){enter2E.sendEvent(true);}});
		

        var blur1B = F.extractEventE(this.instanceId+"_pass1", 'blur').startsWith(NOT_READY);
        var blur2B = F.extractEventE(this.instanceId+"_pass2", 'blur').startsWith(NOT_READY);

		var focus1B = F.extractEventE(this.instanceId+"_pass1", 'focus').startsWith(NOT_READY);
        var focus2B = F.extractEventE(this.instanceId+"_pass2", 'focus').startsWith(NOT_READY);

        var validationDataB = F.liftB(function(text1, text2, passwordRequirements, complexity, blurEvent1, blurEvent2){
            if(text1==NOT_READY){
                return NOT_READY;
            }
                        
            if(data.minChars==undefined){
            	minChars = passwordRequirements.minChars;
            }
            if(data.maxChars==undefined){
            	maxChars = passwordRequirements.maxChars;
            }
            
            var lengthValid = text1.length>=minChars&&text1.length<=maxChars;
            
           var complexityValid = complexity>=minComplexity; 
            if(!data.minComplexity){
            	var upperValid = (!passwordRequirements.requireUpper) || passwordRequirements.requireUpper&&text1.match("[A-Z]")!=null;
            	var lowerValid = (!passwordRequirements.requireLower) || passwordRequirements.requireLower&&text1.match("[a-z]")!=null;
            	var numberValid = (!passwordRequirements.requireNumber) || passwordRequirements.requireNumber&&text1.match("[0-9]")!=null;
            	var specialValid = (!passwordRequirements.requireSpecial) || passwordRequirements.requireSpecial&&text1.match("[^A-Za-z0-9]")!=null;
            	complexityValid = upperValid&&lowerValid&&numberValid&&specialValid;
            }
            var passwordsMatch = text1===text2;
			return {complexity:complexity, lengthValid:lengthValid, complexityValid:complexityValid, passwordsMatch:passwordsMatch, valid:lengthValid&&complexityValid&&passwordsMatch, password: text1}
        }, txtValue1B, txtValue2B, passwordRequirementsB, complexityB, blur1B, blur2B);
        
        F.liftB(function(validationData, passwordRequirements, enter, enter2, focus1, focus2){
        	if(validationData==NOT_READY||passwordRequirements==NOT_READY){
        		return NOT_READY;
        	}

        	if(DOM.get(instanceId+"_charLength")!=undefined){
        		if(data.minChars==undefined && passwordRequirements.minChars!=undefined){
	            	minChars = passwordRequirements.minChars;
	            	if(DOM.get(instanceId+"_minChars")!=undefined){
	            		DOM.get(instanceId+"_minChars").innerHTML = minChars;	
	            	}
	            }
	            if(data.maxChars==undefined && passwordRequirements.maxChars!=undefined){
	            	maxChars = passwordRequirements.maxChars;
	            	if(DOM.get(instanceId+"_maxChars")!=undefined){
	            		DOM.get(instanceId+"_maxChars").innerHTML = maxChars;
	            	}
	            }

				DOM.get(instanceId+"_complexityBarNumber");
	            jQuery("#"+instanceId+"_upperTest").parent().parent().css('display', passwordRequirements.requireUpper?'table-row':'none');
	            DOM.get(instanceId+"_upperTest").src = validationData.password.match("[A-Z]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
	            jQuery("#"+instanceId+"_lowerTest").parent().parent().css('display', passwordRequirements.requireLower?'table-row':'none');
	            DOM.get(instanceId+"_lowerTest").src = validationData.password.match("[a-z]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
	            jQuery("#"+instanceId+"_numberTest").parent().parent().css('display', passwordRequirements.requireNumber?'table-row':'none');
	            DOM.get(instanceId+"_numberTest").src = validationData.password.match("[0-9]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png'; 	
	        	jQuery("#"+instanceId+"_specialTest").parent().parent().css('display', passwordRequirements.requireSpecial?'table-row':'none');
	            DOM.get(instanceId+"_specialTest").src = validationData.password.match("[^A-Za-z0-9]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';

				DOM.get(instanceId+"_charLength").src = validationData.lengthValid?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
				DOM.get(instanceId+"_confirmTest").src = validationData.passwordsMatch?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
				var strengthPercentage = Math.floor(validationData.complexity);
				DOM.get(instanceId+"_complexityBarNumber").innerHTML = strengthPercentage<=30?"<span class=\"passwordWeakText\">Weak</span>":(strengthPercentage<=60?"<span class=\"passwordAverageText\">Average</span>":(strengthPercentage<=90?"<span class=\"passwordStrongText\">Strong</span>":("<span class=\"passwordExcellentText\">Excellent</span>")));
				//jQuery("#"+instanceId+"_complexityBar").progressbar({value: validationData.complexity});	
			}
			
			if(DOM.get(instanceId+"_charLength2")!=undefined){
				if(data.minChars==undefined && passwordRequirements.minChars!=undefined){
	            	minChars = passwordRequirements.minChars;
	            	if(DOM.get(instanceId+"_minChars2")!=undefined){
	            		DOM.get(instanceId+"_minChars2").innerHTML = minChars;
	            	}
	            }
	            if(data.maxChars==undefined && passwordRequirements.maxChars!=undefined){
	            	maxChars = passwordRequirements.maxChars;
	            	if(DOM.get(instanceId+"_maxChars2")!=undefined){
	            		DOM.get(instanceId+"_maxChars2").innerHTML = maxChars;
	            	}
	            }
				DOM.get(instanceId+"_complexityBarNumber2");
				
				jQuery("#"+instanceId+"_upperTest2").parent().parent().css('display', passwordRequirements.requireUpper?'table-row':'none');
	            DOM.get(instanceId+"_upperTest2").src = validationData.password.match("[A-Z]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
	            jQuery("#"+instanceId+"_lowerTest2").parent().parent().css('display', passwordRequirements.requireLower?'table-row':'none');
	            DOM.get(instanceId+"_lowerTest2").src = validationData.password.match("[a-z]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
	            jQuery("#"+instanceId+"_numberTest2").parent().parent().css('display', passwordRequirements.requireNumber?'table-row':'none');
	            DOM.get(instanceId+"_numberTest2").src = validationData.password.match("[0-9]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png'; 	
	        	jQuery("#"+instanceId+"_specialTest2").parent().parent().css('display', passwordRequirements.requireSpecial?'table-row':'none');
	            DOM.get(instanceId+"_specialTest2").src = validationData.password.match("[^A-Za-z0-9]")!=null?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
				
				DOM.get(instanceId+"_charLength2").src = validationData.lengthValid?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
				DOM.get(instanceId+"_confirmTest2").src = validationData.passwordsMatch?'/themes/konfidentkidz/tick.png':'/themes/konfidentkidz/cross.png';
				var strengthPercentage = Math.floor(validationData.complexity);
				DOM.get(instanceId+"_complexityBarNumber2").innerHTML = strengthPercentage<=30?"<span class=\"passwordWeakText\">Weak</span>":(strengthPercentage<=60?"<span class=\"passwordAverageText\">Average</span>":(strengthPercentage<=90?"<span class=\"passwordStrongText\">Strong</span>":("<span class=\"passwordExcellentText\">Excellent</span>")));
				//jQuery("#"+instanceId+"_complexityBar2").progressbar({value: validationData.complexity});	
			}
		}, validationDataB, passwordRequirementsB, enterE.startsWith(0), enter2E.startsWith(0), focus1B, focus2B);
        
        var validB = validationDataB.liftB(function(validationData){return validationData.valid;});
        
        var widgetValueB = F.liftB(function(valid, text, blur2){//manualSet
			if(blur2==NOT_READY){
				return NOT_READY;
			}
        	var data = {valid: false, value: "", name: valueName};
        	if(valid!=NOT_READY){
        		data.valid = valid;
        	}
        	if(text!=NOT_READY){
        		data.value = text;
        	}
        	if(valid!=NOT_READY&&data.value.length>0){
	            document.getElementById(instanceId+"_pass1").className = (text.length==0)?'':(valid?'form_validator_validInput':'form_validator_invalidInput');
	            document.getElementById(instanceId+"_pass2").className = (text.length==0)?'':(valid?'form_validator_validInput':'form_validator_invalidInput'); 
	            document.getElementById(instanceId+"_tick").src = valid?window['SETTINGS']['theme']['path']+'tick.png':window['SETTINGS']['theme']['path']+'cross.png';
           }

            return data;
        },validB,txtValue1B, blur2B);//manualSetB  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);    
    }             
    this.build=function(){
        return "<div class=\"formValidatorInput\"><input type=\"password\" id=\""+this.instanceId+"_pass1\" /><br /><input type=\"password\" id=\""+this.instanceId+"_pass2\" /></div><div class=\"formValidatorStatusIcon\"><img src=\"/resources/trans.png\" alt=\"\" class=\"\" id=\""+this.instanceId+"_tick\" /></div>";       
    }
}
function ValidatedCalendar(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var valueName = (data.name==undefined)?"Calendar":data.name;
        var dateE = F.receiverE();
        var dateB = dateE.startsWith(null);
        var validB = dateB.liftB(function(val){return val!=null});
        jQuery("#"+instanceId).datepicker({changeYear: true,yearRange:"-110:+0", onSelect: function(dateText, inst) {dateE.sendEvent(dateText);}});    
        
        
        var widgetValueB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
            
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: text, name: valueName};
        },validB,dateB);  
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
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
                                  
WIDGETS.register("ValidatedPasswordWidget", ValidatedPasswordWidget); 
WIDGETS.register("ValidatedSubmitButton", ValidatedSubmitButton);
WIDGETS.register("ValidatedCalendar", ValidatedCalendar);
WIDGETS.register("ValidatedTextArea", ValidatedTextArea);
WIDGETS.register("ValidatedTextBox", ValidatedTextBox);
WIDGETS.register("ValidatedWholeNumberBox", ValidatedWholeNumberBox);
WIDGETS.register("ValidatedPatternMatchInput", ValidatedPatternMatchInput);
WIDGETS.register("EmailConfirmer", EmailConfirmer);
WIDGETS.register("ValidatedSelectField", ValidatedSelectField);
WIDGETS.register("ValidatedCheckBox", ValidatedCheckBox);  
WIDGETS.register("PhoneNumbersWidget", PhoneNumbersWidget);  

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
       // F.insertValueB(ifB(emailValidB, scriptPath+'plugins/form_validator/tick.png', scriptPath+'plugins/form_validator/cross.png'),'emailTick', 'src')
        F.insertValueB(notB(allFieldsValid),'submit', 'disabled');
    }
    this.build=function(){
        return "<table><tr><td>Full Name:</td><td><input type=\"text\" alt=\"\" id=\"fullname\" /></td></tr><tr><td>Email Address:</td><td><input type=\"text\" alt=\"\" id=\"email\" /><img src=\"/resources/trans.png\" id=\"emailTick\" alt=\"\" style=\"vertical-align: middle;\" /></td></tr><tr><td>Message</td><td><textarea alt=\"\" id=\"message\" rows=\"6\" cols=\"45\"></textarea></td></tr><tr><td>&nbsp;</td><td><input type=\"submit\" value=\"Submit\" alt=\"\" id=\"submit\" /></td></tr></table>";
    }
}                 

/*function ValidatedContactFormConfigurator(){
    var id = "IntegerTableWidgetCont";
    this['load'] = function(newData){}
    this['build'] = function(newData){
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
    this['getPackage'] = function(){
        return "Table";
    }
    //this['getImage'] = function(){
    //    var img = document.createElement("img");
    //    img.src = "plugins/aviat.csrDemo/table.png";
    //    img.alt = "";
    //    return img;
    //}
}  */
WIDGETS.register("ValidatedContactForm", ValidatedContactForm/*, ValidatedContactFormConfigurator*/);




function GenderSelectionWidget(instanceId, data){   
    this.instanceId = instanceId;
    this.loader=function(){
        var valueName = (data.name==undefined)?"Checkbox":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var genderB = F.mergeE(jQuery("#"+instanceId+"_male").fj('jQueryBind', 'change'), jQuery("#"+instanceId+"_female").fj('jQueryBind', 'change')).mapE(function(event){
            return (DOM.get(instanceId+"_male").checked)?"Male":"Female";
        }).startsWith(NOT_READY);
        var validB = genderB.liftB(function(gender){
            return gender!=NOT_READY;
        });
        var widgetValueB = F.liftB(function(valid, gender){
            if(!good()){
                return NOT_READY;
            }
            //DOM.get(instanceId).className = ((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: gender, name: valueName};
        },validB, genderB);  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);   
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\">Male: <input type=\"radio\" id=\""+this.instanceId+"_male\" name=\""+this.instanceId+"_radio\" />&nbsp;Female: <input type=\"radio\" id=\""+this.instanceId+"_female\" name=\""+this.instanceId+"_radio\" /></span>";       
    }
}
WIDGETS.register("GenderSelectionWidget", GenderSelectionWidget);

function CreditCardInputWidget(instanceId, data){   
    this.instanceId = instanceId;
    this.loader=function(){
        var valueName = (data.name==undefined)?"CardData":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 

        var cc1B = F.extractValueE(instanceId+"_cc1").startsWith(NOT_READY);       
        var cc1NumericB = cc1B.liftB(function(cc1){return jQuery.isNumeric(cc1);});
        var cc2B = F.extractValueE(instanceId+"_cc2").startsWith(NOT_READY);
        var cc2NumericB = cc2B.liftB(function(cc2){return jQuery.isNumeric(cc2);});
        var cc3B = F.extractValueE(instanceId+"_cc3").startsWith(NOT_READY);
        var cc3NumericB = cc3B.liftB(function(cc3){return jQuery.isNumeric(cc3);});
        var cc4B = F.extractValueE(instanceId+"_cc4").startsWith(NOT_READY);
        var cc4NumericB = cc4B.liftB(function(cc4){return jQuery.isNumeric(cc4);});
        
        F.insertValueB(F.ifB(cc1NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc1", 'className');
        F.insertValueB(F.ifB(cc2NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc2", 'className');
        F.insertValueB(F.ifB(cc3NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc3", 'className');
        F.insertValueB(F.ifB(cc4NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc4", 'className');
        
        var visaClickedB = F.extractEventE(instanceId+"_visa", "click").startsWith(NOT_READY);
        var masterCardClickedB = F.extractEventE(instanceId+"_mastercard", "click").startsWith(NOT_READY);
        var cardTypeB = F.liftB(function(visaClicked, masterCardClicked){
        	if(visaClicked==NOT_READY && masterCardClicked==NOT_READY){
        		return NOT_READY;
        	}
        	else if(visaClicked!=NOT_READY && masterCardClickedB==NOT_READY || visaClickedB.firedBefore(masterCardClickedB)){
        		return "Visa";
        	}
        	return "MasterCard";
        }, visaClickedB, masterCardClickedB);
        
        var expiryMonthB = F.extractValueE(instanceId+"_expiry_month").startsWith(NOT_READY);
        var expiryYearB = F.extractValueE(instanceId+"_expiry_year").startsWith(NOT_READY);
        
        var cscNumberB = F.extractValueE(instanceId+"_csc").startsWith(NOT_READY);
        var cscNumberValidB = cscNumberB.liftB(function(cscNumber){return jQuery.isNumeric(cscNumber);});
        F.insertValueB(F.ifB(cscNumberValidB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_csc", 'className');
        
        var widgetValueB = F.liftB(function(cc1, cc2, cc3, cc4, cardType, expiryMonth, expiryYear, cscNumber){
        	if(!good()){
        		return NOT_READY;
        	}
        	var valid = (jQuery.isNumeric(cscNumber)) && (jQuery.isNumeric(expiryMonth)) && (jQuery.isNumeric(expiryYear)) && (jQuery.isNumeric(cc1)&&cc1.length==4) && (jQuery.isNumeric(cc2)&&cc2.length==4) && (jQuery.isNumeric(cc3)&&cc3.length==4) && (jQuery.isNumeric(cc4)&&cc4.length==4);
        	return {valid: valid, value: cardType+" "+cc1+cc2+cc3+cc4+" "+expiryMonth+"/"+expiryYear+" "+cscNumber, name: valueName};
        }, cc1B, cc2B, cc3B, cc4B, cardTypeB, expiryMonthB, expiryYearB, cscNumberB);
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);   
    }      
    var getSelectBoxRange = function(id, start, len, addFirstStr){
    	var html = "<select id=\""+id+"\">";
    	if(addFirstStr!=undefined){
    		html+="<option value=\""+addFirstStr+"\">"+addFirstStr+"</option>";
    	}
    	for(i=start;i<start+len;i++){
    		html+="<option value=\""+i+"\">"+i+"</option>";
    	}
    	html+="</select>";
    	return html;
    }
    this.build=function(){
        return "Card Type<br />" +
        		"Visa <input type=\"radio\" id=\""+instanceId+"_visa\" name=\""+instanceId+"_radio\" /><br />" +
        		"Mastercard <input type=\"radio\" id=\""+instanceId+"_mastercard\" name=\""+instanceId+"_radio\" /><br />" +
        		"<input id=\""+instanceId+"_cc1\" type=\"\" maxlength=\"4\" size=\"4\" /><input id=\""+instanceId+"_cc2\" type=\"\" maxlength=\"4\" size=\"4\" /><input id=\""+instanceId+"_cc3\" type=\"\" maxlength=\"4\" size=\"4\" /><input id=\""+instanceId+"_cc4\" type=\"\" maxlength=\"4\" size=\"4\" /><br />" +
        		"Expiry "+getSelectBoxRange(instanceId+"_expiry_month", 1, 12, "--")+"/"+getSelectBoxRange(instanceId+"_expiry_year", 2012, 5, "--")+"<br />" +
        		"CSC Number <input type=\"text\" id=\""+instanceId+"_csc\" size=\"5\" maxlength=\"5\" />";
    }
}
WIDGETS.register("CreditCardInputWidget", CreditCardInputWidget);



/*Object {username: "Zysen", firstname: "Jay", lastname: "Shepherd", group_id: "3", email: "jay@zylex.net.nz"…}
avatar: ""
email: "jay@zylex.net.nz"
firstname: "Jay"
group_id: "3"
lastname: "Shepherd"
username: "Zysen"*/



function ValidatedUserWidget(instanceId, data){
	var id = instanceId+"_container";
	var valueName = "user";
	this.loader=function(){       
		if(data.targetId!=undefined){
			display = DOM.get(data.targetId).style.display;
		}
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var widgetValueB = F.liftB(function(user){
            if(!good()){
                return NOT_READY;
            }
            if(data.targetId!=undefined){
            	DOM.get(data.targetId).style.display=(user.group_id==1)?'':'none';
            }
            return {valid: user.group_id!=1, value: "USER", name: valueName};
        },userB);  
        //pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\"></span>";      
    }
}
WIDGETS.register("ValidatedUserWidget", ValidatedUserWidget);

function UserFullNameInput(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    var visible = (data.visible==undefined)?true:data.visible;
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var valueName = (data.name==undefined)?"SchoolName":data.name;
        
        
        var currentUserB = DATA.getRemote("aurora_current_user").behaviour;        

        var widgetValueB = currentUserB.liftB(function(user){
            if(!good()){
            	DOM.get(instanceId+"_input").className = 'form_validator_invalidInput';
                return {valid: false, value: "", name: valueName};
            }
            
            DOM.get(instanceId+"_input").className = 'form_validator_validInput';
            DOM.get(instanceId+"_input").value = user.firstname+" "+user.lastname;
            return {valid: true, value: user.firstname+" "+user.lastname, name: valueName};
        });  
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<input id=\""+instanceId+"_input\" type=\""+(visible?'text':'hidden')+"\" />";//"<input id=\""+this.inputId+"\" type=\"text\">";         
    }
}
WIDGETS.register("UserFullNameInput", UserFullNameInput);

function UserEmailInput(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    var visible = (data.visible==undefined)?true:data.visible;
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var valueName = (data.name==undefined)?"SchoolName":data.name;
        
        
        var currentUserB = DATA.getRemote("aurora_current_user").behaviour;        

        var widgetValueB = currentUserB.liftB(function(user){
            if(!good()){
            	DOM.get(instanceId+"_input").className = 'form_validator_invalidInput';
                return {valid: false, value: "", name: valueName};
            }
            
            DOM.get(instanceId+"_input").className = 'form_validator_validInput';
            DOM.get(instanceId+"_input").value = user.email;
            return {valid: true, value: user.email, name: valueName};
        });  
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<input id=\""+instanceId+"_input\" type=\""+(visible?'text':'hidden')+"\" />";//"<input id=\""+this.inputId+"\" type=\"text\">";         
    }
}
WIDGETS.register("UserEmailInput", UserEmailInput);