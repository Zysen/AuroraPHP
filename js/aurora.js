//(function ($) {      

var pageRenderedE = receiverE();
var DATA = new BehaviourManager();
var ENUMS = {};
var WIDGETS = new WidgetManager();
var POLL_RATES = {ONCE: 0, VERY_FAST: 500, FAST: 1500, NORMAL: 3000, SLOW: 5000, VERY_SLOW: 8000};
var CONSTANTS = {NOT_READY: 978000, RENDER_SIZE: {SMALL: 0, MEDIUM: 1, LARGE: 2}};
var NOT_READY = CONSTANTS.NOT_READY;
var UI = new aurora_ui();
var widgetTypes=new Array();
var WIDGET = {
    getWidth: function(){return (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');},
    getHeight: function(){return (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');}
}; 

var widgets=new Array();
jQuery(document).ready(function() {
    var pageB = receiverE().startsWith(SETTINGS.page);
    var themeB = receiverE().startsWith(SETTINGS.theme);
    var pageReadyB = pageB.liftB(function(page, theme){
        return [page, theme];
    }, pageB, themeB).calmB();
    pageReadyB.liftB(function(pageData){
        page = pageData[0];
        theme = pageData[1];
        WIDGETS.clear();
        //log("Rendering Page "+page+" "+theme);
        jQuery("#body").html(renderPage(theme.html));   // Using the body div and not body because ckeditor doesnt like the body tag
        jQuery("#content").html(renderPage(page.html));
        
        WIDGETS.load();
        pageRenderedE.sendEvent(true); 
        if(SETTINGS.messages!=""){
            UI.showMessage('', SETTINGS.messages, function(){}); 
        }
        document.getElementById("body").style.display = 'block';   // Page data is output in php pre JS render but the body div is hidden so its not visible. This is for SEO
    });
    DATA.startPolling();
});


//})(jQuery);
