goog['require']('F');
var DATA = new BehaviourManager();
var DOM = new AuroraDom();
var ENUMS = {};
window['WIDGETS'] = new WidgetManager();
var POLL_RATES = {ONCE: 0, VERY_FAST: 500, FAST: 1500, NORMAL: 3000, SLOW: 5000, VERY_SLOW: 30000};
var CONSTANTS = {NOT_READY: 978000,NO_PERMISSION: 978001, RENDER_SIZE: {SMALL: 0, MEDIUM: 1, LARGE: 2}};
var NOT_READY = CONSTANTS.NOT_READY;
var NO_PERMISSION = CONSTANTS.NO_PERMISSION; 
window['UI'] = new aurora_ui();
var WIDGET = {
    getWidth: function(){return (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');},
    getHeight: function(){return (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');}
}; 
var userB = DATA.getRemote("aurora_current_user",undefined,NOT_READY, POLL_RATES.VERY_SLOW).behaviour;
//var widgets=new Array();
var getVars = readGET();


//var docReadyE = jQuery(document).fj('extEvtE', 'ready'); 

/**
* @type {F.Event}
*/
var pageE = F.receiverE();
/**
* @type {F.Behavior}
*/
var pageB = pageE.startsWith(NOT_READY);

var pageDataB = F.liftB(function(pageData){
    if(pageData==NOT_READY)
        return NOT_READY;      
    var page = pageData.page;
    var theme = pageData.theme;
    var permissions = pageData.permissions;
    WIDGETS.clear();
    //log("Rendering Page "+page+" "+theme);
    document.getElementById("body").innerHTML = renderPage(theme.html);   // Using the body div and not body because ckeditor doesnt like the body tag
    document.getElementById("content").innerHTML = renderPage(page.html);
        
    WIDGETS.load();
    document.getElementById("body").style.display = 'block';   // Page data is output in php pre JS render but the body div is hidden so its not visible. This is for SEO
},pageB);
ready(function() {
    var pageName = window['SETTINGS']['page']['name'];
    var href = window['SETTINGS']['scriptPath']+pageName;
    if(history.pushState){
        //history.pushState({page: pageName}, pageName, href);    
    }
    else{
        //window.location = href;
    }  
    pageE.delayE(1000).mapE(function(){   //TODO: Fix this dodgey bandaid which fixed the firefox dialog box issue
        if(window['SETTINGS']['messages']!=""){
            UI.showMessage('', window['SETTINGS']['messages']);
            window['SETTINGS']['messages'] = "";      
        }
    });
    pageE.sendEvent({page: window['SETTINGS']['page'], theme: SETTINGS['theme'], permissions: SETTINGS['pagePermissions']});
    DATA.startPolling();
});
window.addEventListener('popstate', function(ev) {
  if(ev.state && ev.state.page){
    loadPageE.sendEvent(ev.state.page);
  }
  else{
    
    //loadPageE.sendEvent(document.URL.replace(SETTINGS['scriptPath'], ''))
  }
});
//})(F);
