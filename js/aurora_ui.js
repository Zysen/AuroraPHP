/**
 *  aurora_ui
 * @constructor
 */
function aurora_ui(){
    this.active = false;
    
    this.showOnCursor = function(targetId, text, style, duration){
        if(!this.active){
            var divId = targetId+'_tooltip';
            this.active = true;
            var d = DIV({ "className": style,"id": divId,
                  style: { "position": 'absolute'}},
                text);
            var blah = F.insertDomB(d,targetId,'beginning');
            
            F.liftB(function(left, top){
                document.getElementById(divId).style.left = (left+5)+'px';
                document.getElementById(divId).style.top = (top+5)+'px';    
            }, mouseLeftB(document),mouseTopB(document));
                        
            if(duration!=null)
                setTimeout(function(){fadeOutE(d, 20, 20).mapE(function(){document.getElementById(targetId).removeChild(d);})}, duration);
            this.active = false;
            return blah
            
        }                                  
    }
    this.showMessage = function(title, message, callback, options){
        var modal = (options==undefined||options.modal==undefined)?true:options.modal;
        var draggable = (options==undefined||options.draggable==undefined)?false:options.draggable;  
        var resizable = (options==undefined||options.resizable==undefined)?false:options.resizable;
        var width = (options==undefined||options.width==undefined)?"":options.width;
        var height = (options==undefined||options.height==undefined)?"'600'":options.height; 
        if(typeof jQuery == 'undefined'){ 
            this.dialog(title, message, undefined, callback);
        }
        else{
            var oldD =  document.getElementById('aurora_dialog');
            if(oldD!=null)
                oldD.parentNode.removeChild(oldD);
            var dialog = createDomElement('div', 'aurora_dialog', '', message);
            dialog.style.width = "100%";
            dialog.title = title;
            document.body.appendChild(dialog);
            var dialogOptions = {width: width, "modal": modal,"draggable": draggable,"resizable": resizable,"buttons":[{"text": "Ok","click": function() { jQuery(this).dialog("close");if(callback!=undefined)callback();}}]}
            if(options!=undefined && options.fullscreen!=undefined&&options.fullscreen==true){
            	dialogOptions.minWidth = 1000;
            	dialogOptions.minHeight = jQuery(window).height()-100;
        	}
            if(options!=undefined&&options.height!=undefined){
                dialogOptions.height = options.height;    
            }
            jQuery("#aurora_dialog").dialog(dialogOptions);
        }
    }
    this.confirm = function(title, message, text1, callback1, text2, callback2, fullscreen, dialogOpenCallback){
        if(typeof jQuery == 'undefined'){
            this.dialog(title, message, text1, callback1, text2, callback2, fullscreen, dialogOpenCallback);
       }
       else{
          var options = {
            "modal": true,
            "draggable": false,
            "resizable": false,
            "open": function(event, ui) {
                if(dialogOpenCallback!=undefined)
                    dialogOpenCallback();
            },
            "buttons":[
            {"text": text1,"click": function(){jQuery(this).dialog("close");if(callback1!=undefined)callback1();}},
            {"text": text2,"click": function(){jQuery(this).dialog("close");if(callback2!=undefined)callback2();}}
            ]
        };
        if(fullscreen!=undefined&&fullscreen==true){
            options.minWidth = 1000;
            options.minHeight = jQuery(window).height()-100;
            options.position = ["left","top"];
          	options.width = "100%";
          	options.height = jQuery(window).height();
          	options.zIndex = 1000;
        }
    
        var oldD =  document.getElementById('aurora_dialog');
        if(oldD!=null)
            oldD.parentNode.removeChild(oldD);
        var dialog = createDomElement('div', 'aurora_dialog', '', message);
        dialog.title = title;
        document.body.appendChild(dialog);
        window.top.jQuery("#aurora_dialog").dialog(options);
       }
    }
    
    this.dialog = function(title, message, text1, callback1, text2, callback2, fullscreen, dialogOpenCallback){
    var dialog = document.createElement('div');
    dialog.style.cssText = 'position: absolute; top: 33%; left: 33%; right: 33%; width 33%; background-color: #F0F0F0; padding: 5px;' ;
    dialog.innerHTML = message;
    var buttonCont = document.createElement('div');  
    if(callback1!=undefined){
        var button1 = document.createElement('input');
        button1.type = 'submit';
        button1.value = (text1!=undefined)?text1:"Ok";
        button1.onclick = function(){dialog.style.display = 'none';callback1();};
        buttonCont.appendChild(button1);
    }
    if(text1!=undefined&&callback1!=undefined){
        var button2 = document.createElement('input');
        button2.type = 'submit';
        button2.value = text2;
        button2.onclick = function(){dialog.style.display = 'none';callback2();};
        buttonCont.appendChild(button2); 
    }
    dialog.appendChild(buttonCont);
    document.body.appendChild(dialog);
    if(dialogOpenCallback!=undefined)
        dialogOpenCallback();         
    return dialog;
}
}



//aurora_ui.showOnCursor(targetId, text, style, duration);

