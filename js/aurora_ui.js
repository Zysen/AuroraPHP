
function aurora_ui(){
    this.active = false;
    
    this.showOnCursor = function(targetId, text, style, duration){
        if(!this.active){
            var divId = targetId+'_tooltip';
            this.active = true;
            var d = DIV({ className: style,id: divId,
                  style: { position: 'absolute'}},
                text);
            var blah = insertDomB(d,targetId,'beginning');
            
            liftB(function(left, top){
                document.getElementById(divId).style.left = (left+5)+'px';
                document.getElementById(divId).style.top = (top+5)+'px';    
            }, mouseLeftB(document),mouseTopB(document));
                        
            if(duration!=null)
                setTimeout(function(){fadeOutE(d, 20, 20).mapE(function(){document.getElementById(targetId).removeChild(d);})}, duration);
            this.active = false;
            return blah
            
        }
    }
    this.showMessage = function(title, message, callback){
        var oldD =  document.getElementById('aurora_dialog');
        if(oldD!=null)
            oldD.parentNode.removeChild(oldD);
        var dialog = createDomElement('div', 'aurora_dialog', '', message);
        dialog.title = title;
        document.body.appendChild(dialog);
        jQuery( "#aurora_dialog").dialog({modal: true,draggable: false,resizable: false,buttons:[{text: "Ok",click: function() { jQuery(this).dialog("close");if(callback!=undefined)callback();}}]});
    }
    this.confirm = function(title, message, text1, callback1, text2, callback2){
        var oldD =  document.getElementById('aurora_dialog');
        if(oldD!=null)
            oldD.parentNode.removeChild(oldD);
        var dialog = createDomElement('div', 'aurora_dialog', '', message);
        dialog.title = title;
        document.body.appendChild(dialog);
        jQuery( "#aurora_dialog").dialog({modal: true,draggable: false,resizable: false,buttons:[
            {text: text1,click: function() { jQuery(this).dialog("close");if(callback1!=undefined)callback1();}},
            {text: text2,click: function() { jQuery(this).dialog("close");if(callback2!=undefined)callback2();}}
        ]});
    }
}
//aurora_ui.showOnCursor(targetId, text, style, duration);

