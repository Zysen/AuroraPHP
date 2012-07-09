goog['require']('F');
var pageRenderedE = F.receiverE();
var DATA = new BehaviourManager();
var ENUMS = {};
window['WIDGETS'] = new WidgetManager();
var POLL_RATES = {ONCE: 0, VERY_FAST: 500, FAST: 1500, NORMAL: 3000, SLOW: 5000, VERY_SLOW: 8000};
var CONSTANTS = {NOT_READY: 978000,NO_PERMISSION: 978001, RENDER_SIZE: {SMALL: 0, MEDIUM: 1, LARGE: 2}};
var NOT_READY = CONSTANTS.NOT_READY;
var NO_PERMISSION = CONSTANTS.NO_PERMISSION; 
window['UI'] = new aurora_ui();
var WIDGET = {
    getWidth: function(){return (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');},
    getHeight: function(){return (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');}
}; 
var widgets=new Array();
ready(function() {
    /**
     * @type {F.Behavior}            =
     */
    var themeB = F.receiverE().startsWith(SETTINGS['theme']);
    /**
     * @type {F.Behavior}
     */
    var pageB = F.receiverE().startsWith(SETTINGS['page']);
    var trans = function(page,theme){
        if(page==NOT_READY||theme==NOT_READY)
            return NOT_READY;
        return [page, theme];
    };
    //showObj(SETTINGS['theme']);
    
    var pageReadyB = F.liftB(trans,pageB,themeB);//.calmB();
    pageReadyB.liftB(function(pageData){
        if(pageData==NOT_READY)
            return NOT_READY;
        var page = pageData[0];
        var theme = pageData[1];
        WIDGETS.clear();
        //log("Rendering Page "+page+" "+theme);
        document.getElementById("body").innerHTML = renderPage(theme.html);   // Using the body div and not body because ckeditor doesnt like the body tag
        document.getElementById("content").innerHTML = renderPage(page.html);
        
        WIDGETS.load();
        pageRenderedE.sendEvent(true); 
        if(window['SETTINGS']['messages']!=""){
            UI.showMessage('', window['SETTINGS']['messages'], function(){}); 
        }
        document.getElementById("body").style.display = 'block';   // Page data is output in php pre JS render but the body div is hidden so its not visible. This is for SEO
    });
    DATA.startPolling();
});


//})(F);
