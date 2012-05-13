/*!
 * jQuery UI 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a,b){var d=a.nodeName.toLowerCase();if("area"===d){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&l(a)}return(/input|select|textarea|button|object/.test(d)?!a.disabled:"a"==d?a.href||b:b)&&l(a)}function l(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.16",
keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({propAttr:c.fn.prop||c.fn.attr,_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=
this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,
"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":
"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,m,n){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(m)g-=parseFloat(c.curCSS(f,"border"+this+"Width",true))||0;if(n)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,
outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){return k(a,!isNaN(c.attr(a,"tabindex")))},tabbable:function(a){var b=c.attr(a,
"tabindex"),d=isNaN(b);return(d||b>=0)&&k(a,!d)}});c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&
a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&
c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)try{b(d).triggerHandler("remove")}catch(e){}k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){try{b(this).triggerHandler("remove")}catch(d){}});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=
function(h){return!!b.data(h,a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):
d;if(e&&d.charAt(0)==="_")return h;e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=
b.extend(true,{},this.options,this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+
"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",
c);return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*!
 * jQuery UI Mouse 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(b){var d=false;b(document).mouseup(function(){d=false});b.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(c){return a._mouseDown(c)}).bind("click."+this.widgetName,function(c){if(true===b.data(c.target,a.widgetName+".preventClickEvent")){b.removeData(c.target,a.widgetName+".preventClickEvent");c.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+
this.widgetName)},_mouseDown:function(a){if(!d){this._mouseStarted&&this._mouseUp(a);this._mouseDownEvent=a;var c=this,f=a.which==1,g=typeof this.options.cancel=="string"&&a.target.nodeName?b(a.target).closest(this.options.cancel).length:false;if(!f||g||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){c.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=
this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();return true}}true===b.data(a.target,this.widgetName+".preventClickEvent")&&b.removeData(a.target,this.widgetName+".preventClickEvent");this._mouseMoveDelegate=function(e){return c._mouseMove(e)};this._mouseUpDelegate=function(e){return c._mouseUp(e)};b(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return d=true}},_mouseMove:function(a){if(b.browser.msie&&
!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);return a.preventDefault()}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){b(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=
false;a.target==this._mouseDownEvent.target&&b.data(a.target,this.widgetName+".preventClickEvent",true);this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
;/*
 * jQuery UI Position 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+(parseInt(c.curCSS(this,"marginRight",true))||0),w=m+q+(parseInt(c.curCSS(this,"marginBottom",true))||0),i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=
m/2;i.left=Math.round(i.left);i.top=Math.round(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=
d>0?b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(jQuery);
;/*
 * jQuery UI Draggable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper==
"original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position="relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(a){var b=
this.options;if(this.helper||b.disabled||d(a.target).is(".ui-resizable-handle"))return false;this.handle=this._getHandle(a);if(!this.handle)return false;if(b.iframeFix)d(b.iframeFix===true?"iframe":b.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(d(this).offset()).appendTo("body")});return true},_mouseStart:function(a){var b=this.options;
this.helper=this._createHelper(a);this._cacheHelperProportions();if(d.ui.ddmanager)d.ui.ddmanager.current=this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
this.originalPosition=this.position=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);b.containment&&this._setContainment();if(this._trigger("start",a)===false){this._clear();return false}this._cacheHelperProportions();d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(a,true);d.ui.ddmanager&&d.ui.ddmanager.dragStart(this,a);return true},
_mouseDrag:function(a,b){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");if(!b){b=this._uiHash();if(this._trigger("drag",a,b)===false){this._mouseUp({});return false}this.position=b.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);return false},_mouseStop:function(a){var b=
false;if(d.ui.ddmanager&&!this.options.dropBehaviour)b=d.ui.ddmanager.drop(this,a);if(this.dropped){b=this.dropped;this.dropped=false}if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original")return false;if(this.options.revert=="invalid"&&!b||this.options.revert=="valid"&&b||this.options.revert===true||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,b)){var c=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,
10),function(){c._trigger("stop",a)!==false&&c._clear()})}else this._trigger("stop",a)!==false&&this._clear();return false},_mouseUp:function(a){this.options.iframeFix===true&&d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)});d.ui.ddmanager&&d.ui.ddmanager.dragStop(this,a);return d.ui.mouse.prototype._mouseUp.call(this,a)},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(a){var b=!this.options.handle||
!d(this.options.handle,this.element).length?true:false;d(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==a.target)b=true});return b},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a])):b.helper=="clone"?this.element.clone().removeAttr("id"):this.element;a.parents("body").length||a.appendTo(b.appendTo=="parent"?this.element[0].parentNode:b.appendTo);a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&
a.css("position","absolute");return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=
this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),
10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),
10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[a.containment=="document"?0:d(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,a.containment=="document"?0:d(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,
(a.containment=="document"?0:d(window).scrollLeft())+d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){a=d(a.containment);var b=a[0];if(b){a.offset();var c=d(b).css("overflow")!=
"hidden";this.containment=[(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0),(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0),(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),
10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];this.relative_container=a}}else if(a.containment.constructor==Array)this.containment=a.containment},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName);return{top:b.top+
this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&
!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName),e=a.pageX,h=a.pageY;if(this.originalPosition){var g;if(this.containment){if(this.relative_container){g=this.relative_container.offset();g=[this.containment[0]+g.left,this.containment[1]+g.top,this.containment[2]+g.left,this.containment[3]+g.top]}else g=this.containment;if(a.pageX-this.offset.click.left<g[0])e=g[0]+this.offset.click.left;
if(a.pageY-this.offset.click.top<g[1])h=g[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>g[2])e=g[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>g[3])h=g[3]+this.offset.click.top}if(b.grid){h=b.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/b.grid[1])*b.grid[1]:this.originalPageY;h=g?!(h-this.offset.click.top<g[1]||h-this.offset.click.top>g[3])?h:!(h-this.offset.click.top<g[1])?h-b.grid[1]:h+b.grid[1]:h;e=b.grid[0]?this.originalPageX+Math.round((e-this.originalPageX)/
b.grid[0])*b.grid[0]:this.originalPageX;e=g?!(e-this.offset.click.left<g[0]||e-this.offset.click.left>g[2])?e:!(e-this.offset.click.left<g[0])?e-b.grid[0]:e+b.grid[0]:e}}return{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop()),left:e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<
526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(a,b,c){c=c||this._uiHash();d.ui.plugin.call(this,a,[b,c]);if(a=="drag")this.positionAbs=this._convertPositionTo("absolute");return d.Widget.prototype._trigger.call(this,a,b,
c)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});d.extend(d.ui.draggable,{version:"1.8.16"});d.ui.plugin.add("draggable","connectToSortable",{start:function(a,b){var c=d(this).data("draggable"),f=c.options,e=d.extend({},b,{item:c.element});c.sortables=[];d(f.connectToSortable).each(function(){var h=d.data(this,"sortable");if(h&&!h.options.disabled){c.sortables.push({instance:h,shouldRevert:h.options.revert});
h.refreshPositions();h._trigger("activate",a,e)}})},stop:function(a,b){var c=d(this).data("draggable"),f=d.extend({},b,{item:c.element});d.each(c.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;c.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert)this.instance.options.revert=true;this.instance._mouseStop(a);this.instance.options.helper=this.instance.options._helper;c.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=
false;this.instance._trigger("deactivate",a,f)}})},drag:function(a,b){var c=d(this).data("draggable"),f=this;d.each(c.sortables,function(){this.instance.positionAbs=c.positionAbs;this.instance.helperProportions=c.helperProportions;this.instance.offset.click=c.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=d(f).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",true);
this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return b.helper[0]};a.target=this.instance.currentItem[0];this.instance._mouseCapture(a,true);this.instance._mouseStart(a,true,true);this.instance.offset.click.top=c.offset.click.top;this.instance.offset.click.left=c.offset.click.left;this.instance.offset.parent.left-=c.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=c.offset.parent.top-this.instance.offset.parent.top;
c._trigger("toSortable",a);c.dropped=this.instance.element;c.currentItem=c.element;this.instance.fromOutside=c}this.instance.currentItem&&this.instance._mouseDrag(a)}else if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",a,this.instance._uiHash(this.instance));this.instance._mouseStop(a,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&
this.instance.placeholder.remove();c._trigger("fromSortable",a);c.dropped=false}})}});d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),b=d(this).data("draggable").options;if(a.css("cursor"))b._cursor=a.css("cursor");a.css("cursor",b.cursor)},stop:function(){var a=d(this).data("draggable").options;a._cursor&&d("body").css("cursor",a._cursor)}});d.ui.plugin.add("draggable","opacity",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("opacity"))b._opacity=
a.css("opacity");a.css("opacity",b.opacity)},stop:function(a,b){a=d(this).data("draggable").options;a._opacity&&d(b.helper).css("opacity",a._opacity)}});d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");if(a.scrollParent[0]!=document&&a.scrollParent[0].tagName!="HTML")a.overflowOffset=a.scrollParent.offset()},drag:function(a){var b=d(this).data("draggable"),c=b.options,f=false;if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!="HTML"){if(!c.axis||c.axis!=
"x")if(b.overflowOffset.top+b.scrollParent[0].offsetHeight-a.pageY<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop+c.scrollSpeed;else if(a.pageY-b.overflowOffset.top<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop-c.scrollSpeed;if(!c.axis||c.axis!="y")if(b.overflowOffset.left+b.scrollParent[0].offsetWidth-a.pageX<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft+c.scrollSpeed;else if(a.pageX-b.overflowOffset.left<
c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft-c.scrollSpeed}else{if(!c.axis||c.axis!="x")if(a.pageY-d(document).scrollTop()<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()-c.scrollSpeed);else if(d(window).height()-(a.pageY-d(document).scrollTop())<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()+c.scrollSpeed);if(!c.axis||c.axis!="y")if(a.pageX-d(document).scrollLeft()<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()-
c.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()+c.scrollSpeed)}f!==false&&d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(b,a)}});d.ui.plugin.add("draggable","snap",{start:function(){var a=d(this).data("draggable"),b=a.options;a.snapElements=[];d(b.snap.constructor!=String?b.snap.items||":data(draggable)":b.snap).each(function(){var c=d(this),f=c.offset();this!=a.element[0]&&a.snapElements.push({item:this,
width:c.outerWidth(),height:c.outerHeight(),top:f.top,left:f.left})})},drag:function(a,b){for(var c=d(this).data("draggable"),f=c.options,e=f.snapTolerance,h=b.offset.left,g=h+c.helperProportions.width,n=b.offset.top,o=n+c.helperProportions.height,i=c.snapElements.length-1;i>=0;i--){var j=c.snapElements[i].left,l=j+c.snapElements[i].width,k=c.snapElements[i].top,m=k+c.snapElements[i].height;if(j-e<h&&h<l+e&&k-e<n&&n<m+e||j-e<h&&h<l+e&&k-e<o&&o<m+e||j-e<g&&g<l+e&&k-e<n&&n<m+e||j-e<g&&g<l+e&&k-e<o&&
o<m+e){if(f.snapMode!="inner"){var p=Math.abs(k-o)<=e,q=Math.abs(m-n)<=e,r=Math.abs(j-g)<=e,s=Math.abs(l-h)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:k-c.helperProportions.height,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",{top:m,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:j-c.helperProportions.width}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:l}).left-c.margins.left}var t=
p||q||r||s;if(f.snapMode!="outer"){p=Math.abs(k-n)<=e;q=Math.abs(m-o)<=e;r=Math.abs(j-h)<=e;s=Math.abs(l-g)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:k,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",{top:m-c.helperProportions.height,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:j}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:l-c.helperProportions.width}).left-c.margins.left}if(!c.snapElements[i].snapping&&
(p||q||r||s||t))c.options.snap.snap&&c.options.snap.snap.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[i].item}));c.snapElements[i].snapping=p||q||r||s||t}else{c.snapElements[i].snapping&&c.options.snap.release&&c.options.snap.release.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[i].item}));c.snapElements[i].snapping=false}}}});d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options;a=d.makeArray(d(a.stack)).sort(function(c,f){return(parseInt(d(c).css("zIndex"),
10)||0)-(parseInt(d(f).css("zIndex"),10)||0)});if(a.length){var b=parseInt(a[0].style.zIndex)||0;d(a).each(function(c){this.style.zIndex=b+c});this[0].style.zIndex=b+a.length}}});d.ui.plugin.add("draggable","zIndex",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("zIndex"))b._zIndex=a.css("zIndex");a.css("zIndex",b.zIndex)},stop:function(a,b){a=d(this).data("draggable").options;a._zIndex&&d(b.helper).css("zIndex",a._zIndex)}})})(jQuery);
;/*
 * jQuery UI Droppable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */
(function(d){d.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function(){var a=this.options,b=a.accept;this.isover=0;this.isout=1;this.accept=d.isFunction(b)?b:function(c){return c.is(b)};this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};d.ui.ddmanager.droppables[a.scope]=d.ui.ddmanager.droppables[a.scope]||[];d.ui.ddmanager.droppables[a.scope].push(this);
a.addClasses&&this.element.addClass("ui-droppable")},destroy:function(){for(var a=d.ui.ddmanager.droppables[this.options.scope],b=0;b<a.length;b++)a[b]==this&&a.splice(b,1);this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");return this},_setOption:function(a,b){if(a=="accept")this.accept=d.isFunction(b)?b:function(c){return c.is(b)};d.Widget.prototype._setOption.apply(this,arguments)},_activate:function(a){var b=d.ui.ddmanager.current;this.options.activeClass&&
this.element.addClass(this.options.activeClass);b&&this._trigger("activate",a,this.ui(b))},_deactivate:function(a){var b=d.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass);b&&this._trigger("deactivate",a,this.ui(b))},_over:function(a){var b=d.ui.ddmanager.current;if(!(!b||(b.currentItem||b.element)[0]==this.element[0]))if(this.accept.call(this.element[0],b.currentItem||b.element)){this.options.hoverClass&&this.element.addClass(this.options.hoverClass);
this._trigger("over",a,this.ui(b))}},_out:function(a){var b=d.ui.ddmanager.current;if(!(!b||(b.currentItem||b.element)[0]==this.element[0]))if(this.accept.call(this.element[0],b.currentItem||b.element)){this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("out",a,this.ui(b))}},_drop:function(a,b){var c=b||d.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0])return false;var e=false;this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var g=
d.data(this,"droppable");if(g.options.greedy&&!g.options.disabled&&g.options.scope==c.options.scope&&g.accept.call(g.element[0],c.currentItem||c.element)&&d.ui.intersect(c,d.extend(g,{offset:g.element.offset()}),g.options.tolerance)){e=true;return false}});if(e)return false;if(this.accept.call(this.element[0],c.currentItem||c.element)){this.options.activeClass&&this.element.removeClass(this.options.activeClass);this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("drop",
a,this.ui(c));return this.element}return false},ui:function(a){return{draggable:a.currentItem||a.element,helper:a.helper,position:a.position,offset:a.positionAbs}}});d.extend(d.ui.droppable,{version:"1.8.16"});d.ui.intersect=function(a,b,c){if(!b.offset)return false;var e=(a.positionAbs||a.position.absolute).left,g=e+a.helperProportions.width,f=(a.positionAbs||a.position.absolute).top,h=f+a.helperProportions.height,i=b.offset.left,k=i+b.proportions.width,j=b.offset.top,l=j+b.proportions.height;
switch(c){case "fit":return i<=e&&g<=k&&j<=f&&h<=l;case "intersect":return i<e+a.helperProportions.width/2&&g-a.helperProportions.width/2<k&&j<f+a.helperProportions.height/2&&h-a.helperProportions.height/2<l;case "pointer":return d.ui.isOver((a.positionAbs||a.position.absolute).top+(a.clickOffset||a.offset.click).top,(a.positionAbs||a.position.absolute).left+(a.clickOffset||a.offset.click).left,j,i,b.proportions.height,b.proportions.width);case "touch":return(f>=j&&f<=l||h>=j&&h<=l||f<j&&h>l)&&(e>=
i&&e<=k||g>=i&&g<=k||e<i&&g>k);default:return false}};d.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(a,b){var c=d.ui.ddmanager.droppables[a.options.scope]||[],e=b?b.type:null,g=(a.currentItem||a.element).find(":data(droppable)").andSelf(),f=0;a:for(;f<c.length;f++)if(!(c[f].options.disabled||a&&!c[f].accept.call(c[f].element[0],a.currentItem||a.element))){for(var h=0;h<g.length;h++)if(g[h]==c[f].element[0]){c[f].proportions.height=0;continue a}c[f].visible=c[f].element.css("display")!=
"none";if(c[f].visible){e=="mousedown"&&c[f]._activate.call(c[f],b);c[f].offset=c[f].element.offset();c[f].proportions={width:c[f].element[0].offsetWidth,height:c[f].element[0].offsetHeight}}}},drop:function(a,b){var c=false;d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(this.options){if(!this.options.disabled&&this.visible&&d.ui.intersect(a,this,this.options.tolerance))c=c||this._drop.call(this,b);if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],a.currentItem||
a.element)){this.isout=1;this.isover=0;this._deactivate.call(this,b)}}});return c},dragStart:function(a,b){a.element.parents(":not(body,html)").bind("scroll.droppable",function(){a.options.refreshPositions||d.ui.ddmanager.prepareOffsets(a,b)})},drag:function(a,b){a.options.refreshPositions&&d.ui.ddmanager.prepareOffsets(a,b);d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(!(this.options.disabled||this.greedyChild||!this.visible)){var c=d.ui.intersect(a,this,this.options.tolerance);
if(c=!c&&this.isover==1?"isout":c&&this.isover==0?"isover":null){var e;if(this.options.greedy){var g=this.element.parents(":data(droppable):eq(0)");if(g.length){e=d.data(g[0],"droppable");e.greedyChild=c=="isover"?1:0}}if(e&&c=="isover"){e.isover=0;e.isout=1;e._out.call(e,b)}this[c]=1;this[c=="isout"?"isover":"isout"]=0;this[c=="isover"?"_over":"_out"].call(this,b);if(e&&c=="isout"){e.isout=0;e.isover=1;e._over.call(e,b)}}}})},dragStop:function(a,b){a.element.parents(":not(body,html)").unbind("scroll.droppable");
a.options.refreshPositions||d.ui.ddmanager.prepareOffsets(a,b)}}})(jQuery);
;/*
 * jQuery UI Resizable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(e){e.widget("ui.resizable",e.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1E3},_create:function(){var b=this,a=this.options;this.element.addClass("ui-resizable");e.extend(this,{_aspectRatio:!!a.aspectRatio,aspectRatio:a.aspectRatio,originalElement:this.element,
_proportionallyResizeElements:[],_helper:a.helper||a.ghost||a.animate?a.helper||"ui-resizable-helper":null});if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)){/relative/.test(this.element.css("position"))&&e.browser.opera&&this.element.css({position:"relative",top:"auto",left:"auto"});this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),
top:this.element.css("top"),left:this.element.css("left")}));this.element=this.element.parent().data("resizable",this.element.data("resizable"));this.elementIsWrapper=true;this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});this.originalResizeStyle=
this.originalElement.css("resize");this.originalElement.css("resize","none");this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));this.originalElement.css({margin:this.originalElement.css("margin")});this._proportionallyResize()}this.handles=a.handles||(!e(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",
nw:".ui-resizable-nw"});if(this.handles.constructor==String){if(this.handles=="all")this.handles="n,e,s,w,se,sw,ne,nw";var c=this.handles.split(",");this.handles={};for(var d=0;d<c.length;d++){var f=e.trim(c[d]),g=e('<div class="ui-resizable-handle '+("ui-resizable-"+f)+'"></div>');/sw|se|ne|nw/.test(f)&&g.css({zIndex:++a.zIndex});"se"==f&&g.addClass("ui-icon ui-icon-gripsmall-diagonal-se");this.handles[f]=".ui-resizable-"+f;this.element.append(g)}}this._renderAxis=function(h){h=h||this.element;for(var i in this.handles){if(this.handles[i].constructor==
String)this.handles[i]=e(this.handles[i],this.element).show();if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var j=e(this.handles[i],this.element),l=0;l=/sw|ne|nw|se|n|s/.test(i)?j.outerHeight():j.outerWidth();j=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join("");h.css(j,l);this._proportionallyResize()}e(this.handles[i])}};this._renderAxis(this.element);this._handles=e(".ui-resizable-handle",this.element).disableSelection();
this._handles.mouseover(function(){if(!b.resizing){if(this.className)var h=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=h&&h[1]?h[1]:"se"}});if(a.autoHide){this._handles.hide();e(this.element).addClass("ui-resizable-autohide").hover(function(){if(!a.disabled){e(this).removeClass("ui-resizable-autohide");b._handles.show()}},function(){if(!a.disabled)if(!b.resizing){e(this).addClass("ui-resizable-autohide");b._handles.hide()}})}this._mouseInit()},destroy:function(){this._mouseDestroy();
var b=function(c){e(c).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){b(this.element);var a=this.element;a.after(this.originalElement.css({position:a.css("position"),width:a.outerWidth(),height:a.outerHeight(),top:a.css("top"),left:a.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle);b(this.originalElement);return this},_mouseCapture:function(b){var a=
false;for(var c in this.handles)if(e(this.handles[c])[0]==b.target)a=true;return!this.options.disabled&&a},_mouseStart:function(b){var a=this.options,c=this.element.position(),d=this.element;this.resizing=true;this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()};if(d.is(".ui-draggable")||/absolute/.test(d.css("position")))d.css({position:"absolute",top:c.top,left:c.left});e.browser.opera&&/relative/.test(d.css("position"))&&d.css({position:"relative",top:"auto",left:"auto"});
this._renderProxy();c=m(this.helper.css("left"));var f=m(this.helper.css("top"));if(a.containment){c+=e(a.containment).scrollLeft()||0;f+=e(a.containment).scrollTop()||0}this.offset=this.helper.offset();this.position={left:c,top:f};this.size=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalSize=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalPosition={left:c,top:f};this.sizeDiff=
{width:d.outerWidth()-d.width(),height:d.outerHeight()-d.height()};this.originalMousePosition={left:b.pageX,top:b.pageY};this.aspectRatio=typeof a.aspectRatio=="number"?a.aspectRatio:this.originalSize.width/this.originalSize.height||1;a=e(".ui-resizable-"+this.axis).css("cursor");e("body").css("cursor",a=="auto"?this.axis+"-resize":a);d.addClass("ui-resizable-resizing");this._propagate("start",b);return true},_mouseDrag:function(b){var a=this.helper,c=this.originalMousePosition,d=this._change[this.axis];
if(!d)return false;c=d.apply(this,[b,b.pageX-c.left||0,b.pageY-c.top||0]);this._updateVirtualBoundaries(b.shiftKey);if(this._aspectRatio||b.shiftKey)c=this._updateRatio(c,b);c=this._respectSize(c,b);this._propagate("resize",b);a.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize();this._updateCache(c);this._trigger("resize",b,this.ui());return false},
_mouseStop:function(b){this.resizing=false;var a=this.options,c=this;if(this._helper){var d=this._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName);d=f&&e.ui.hasScroll(d[0],"left")?0:c.sizeDiff.height;f=f?0:c.sizeDiff.width;f={width:c.helper.width()-f,height:c.helper.height()-d};d=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null;var g=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null;a.animate||this.element.css(e.extend(f,
{top:g,left:d}));c.helper.height(c.size.height);c.helper.width(c.size.width);this._helper&&!a.animate&&this._proportionallyResize()}e("body").css("cursor","auto");this.element.removeClass("ui-resizable-resizing");this._propagate("stop",b);this._helper&&this.helper.remove();return false},_updateVirtualBoundaries:function(b){var a=this.options,c,d,f;a={minWidth:k(a.minWidth)?a.minWidth:0,maxWidth:k(a.maxWidth)?a.maxWidth:Infinity,minHeight:k(a.minHeight)?a.minHeight:0,maxHeight:k(a.maxHeight)?a.maxHeight:
Infinity};if(this._aspectRatio||b){b=a.minHeight*this.aspectRatio;d=a.minWidth/this.aspectRatio;c=a.maxHeight*this.aspectRatio;f=a.maxWidth/this.aspectRatio;if(b>a.minWidth)a.minWidth=b;if(d>a.minHeight)a.minHeight=d;if(c<a.maxWidth)a.maxWidth=c;if(f<a.maxHeight)a.maxHeight=f}this._vBoundaries=a},_updateCache:function(b){this.offset=this.helper.offset();if(k(b.left))this.position.left=b.left;if(k(b.top))this.position.top=b.top;if(k(b.height))this.size.height=b.height;if(k(b.width))this.size.width=
b.width},_updateRatio:function(b){var a=this.position,c=this.size,d=this.axis;if(k(b.height))b.width=b.height*this.aspectRatio;else if(k(b.width))b.height=b.width/this.aspectRatio;if(d=="sw"){b.left=a.left+(c.width-b.width);b.top=null}if(d=="nw"){b.top=a.top+(c.height-b.height);b.left=a.left+(c.width-b.width)}return b},_respectSize:function(b){var a=this._vBoundaries,c=this.axis,d=k(b.width)&&a.maxWidth&&a.maxWidth<b.width,f=k(b.height)&&a.maxHeight&&a.maxHeight<b.height,g=k(b.width)&&a.minWidth&&
a.minWidth>b.width,h=k(b.height)&&a.minHeight&&a.minHeight>b.height;if(g)b.width=a.minWidth;if(h)b.height=a.minHeight;if(d)b.width=a.maxWidth;if(f)b.height=a.maxHeight;var i=this.originalPosition.left+this.originalSize.width,j=this.position.top+this.size.height,l=/sw|nw|w/.test(c);c=/nw|ne|n/.test(c);if(g&&l)b.left=i-a.minWidth;if(d&&l)b.left=i-a.maxWidth;if(h&&c)b.top=j-a.minHeight;if(f&&c)b.top=j-a.maxHeight;if((a=!b.width&&!b.height)&&!b.left&&b.top)b.top=null;else if(a&&!b.top&&b.left)b.left=
null;return b},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var b=this.helper||this.element,a=0;a<this._proportionallyResizeElements.length;a++){var c=this._proportionallyResizeElements[a];if(!this.borderDif){var d=[c.css("borderTopWidth"),c.css("borderRightWidth"),c.css("borderBottomWidth"),c.css("borderLeftWidth")],f=[c.css("paddingTop"),c.css("paddingRight"),c.css("paddingBottom"),c.css("paddingLeft")];this.borderDif=e.map(d,function(g,h){g=parseInt(g,10)||
0;h=parseInt(f[h],10)||0;return g+h})}e.browser.msie&&(e(b).is(":hidden")||e(b).parents(":hidden").length)||c.css({height:b.height()-this.borderDif[0]-this.borderDif[2]||0,width:b.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var b=this.options;this.elementOffset=this.element.offset();if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');var a=e.browser.msie&&e.browser.version<7,c=a?1:0;a=a?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+
a,height:this.element.outerHeight()+a,position:"absolute",left:this.elementOffset.left-c+"px",top:this.elementOffset.top-c+"px",zIndex:++b.zIndex});this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(b,a){return{width:this.originalSize.width+a}},w:function(b,a){return{left:this.originalPosition.left+a,width:this.originalSize.width-a}},n:function(b,a,c){return{top:this.originalPosition.top+c,height:this.originalSize.height-c}},s:function(b,a,c){return{height:this.originalSize.height+
c}},se:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,a,c]))},sw:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,a,c]))},ne:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,a,c]))},nw:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,a,c]))}},_propagate:function(b,a){e.ui.plugin.call(this,b,[a,this.ui()]);
b!="resize"&&this._trigger(b,a,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}});e.extend(e.ui.resizable,{version:"1.8.16"});e.ui.plugin.add("resizable","alsoResize",{start:function(){var b=e(this).data("resizable").options,a=function(c){e(c).each(function(){var d=e(this);d.data("resizable-alsoresize",{width:parseInt(d.width(),
10),height:parseInt(d.height(),10),left:parseInt(d.css("left"),10),top:parseInt(d.css("top"),10),position:d.css("position")})})};if(typeof b.alsoResize=="object"&&!b.alsoResize.parentNode)if(b.alsoResize.length){b.alsoResize=b.alsoResize[0];a(b.alsoResize)}else e.each(b.alsoResize,function(c){a(c)});else a(b.alsoResize)},resize:function(b,a){var c=e(this).data("resizable");b=c.options;var d=c.originalSize,f=c.originalPosition,g={height:c.size.height-d.height||0,width:c.size.width-d.width||0,top:c.position.top-
f.top||0,left:c.position.left-f.left||0},h=function(i,j){e(i).each(function(){var l=e(this),q=e(this).data("resizable-alsoresize"),p={},r=j&&j.length?j:l.parents(a.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(r,function(n,o){if((n=(q[o]||0)+(g[o]||0))&&n>=0)p[o]=n||null});if(e.browser.opera&&/relative/.test(l.css("position"))){c._revertToRelativePosition=true;l.css({position:"absolute",top:"auto",left:"auto"})}l.css(p)})};typeof b.alsoResize=="object"&&!b.alsoResize.nodeType?
e.each(b.alsoResize,function(i,j){h(i,j)}):h(b.alsoResize)},stop:function(){var b=e(this).data("resizable"),a=b.options,c=function(d){e(d).each(function(){var f=e(this);f.css({position:f.data("resizable-alsoresize").position})})};if(b._revertToRelativePosition){b._revertToRelativePosition=false;typeof a.alsoResize=="object"&&!a.alsoResize.nodeType?e.each(a.alsoResize,function(d){c(d)}):c(a.alsoResize)}e(this).removeData("resizable-alsoresize")}});e.ui.plugin.add("resizable","animate",{stop:function(b){var a=
e(this).data("resizable"),c=a.options,d=a._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName),g=f&&e.ui.hasScroll(d[0],"left")?0:a.sizeDiff.height;f={width:a.size.width-(f?0:a.sizeDiff.width),height:a.size.height-g};g=parseInt(a.element.css("left"),10)+(a.position.left-a.originalPosition.left)||null;var h=parseInt(a.element.css("top"),10)+(a.position.top-a.originalPosition.top)||null;a.element.animate(e.extend(f,h&&g?{top:h,left:g}:{}),{duration:c.animateDuration,easing:c.animateEasing,
step:function(){var i={width:parseInt(a.element.css("width"),10),height:parseInt(a.element.css("height"),10),top:parseInt(a.element.css("top"),10),left:parseInt(a.element.css("left"),10)};d&&d.length&&e(d[0]).css({width:i.width,height:i.height});a._updateCache(i);a._propagate("resize",b)}})}});e.ui.plugin.add("resizable","containment",{start:function(){var b=e(this).data("resizable"),a=b.element,c=b.options.containment;if(a=c instanceof e?c.get(0):/parent/.test(c)?a.parent().get(0):c){b.containerElement=
e(a);if(/document/.test(c)||c==document){b.containerOffset={left:0,top:0};b.containerPosition={left:0,top:0};b.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}}else{var d=e(a),f=[];e(["Top","Right","Left","Bottom"]).each(function(i,j){f[i]=m(d.css("padding"+j))});b.containerOffset=d.offset();b.containerPosition=d.position();b.containerSize={height:d.innerHeight()-f[3],width:d.innerWidth()-f[1]};c=b.containerOffset;
var g=b.containerSize.height,h=b.containerSize.width;h=e.ui.hasScroll(a,"left")?a.scrollWidth:h;g=e.ui.hasScroll(a)?a.scrollHeight:g;b.parentData={element:a,left:c.left,top:c.top,width:h,height:g}}}},resize:function(b){var a=e(this).data("resizable"),c=a.options,d=a.containerOffset,f=a.position;b=a._aspectRatio||b.shiftKey;var g={top:0,left:0},h=a.containerElement;if(h[0]!=document&&/static/.test(h.css("position")))g=d;if(f.left<(a._helper?d.left:0)){a.size.width+=a._helper?a.position.left-d.left:
a.position.left-g.left;if(b)a.size.height=a.size.width/c.aspectRatio;a.position.left=c.helper?d.left:0}if(f.top<(a._helper?d.top:0)){a.size.height+=a._helper?a.position.top-d.top:a.position.top;if(b)a.size.width=a.size.height*c.aspectRatio;a.position.top=a._helper?d.top:0}a.offset.left=a.parentData.left+a.position.left;a.offset.top=a.parentData.top+a.position.top;c=Math.abs((a._helper?a.offset.left-g.left:a.offset.left-g.left)+a.sizeDiff.width);d=Math.abs((a._helper?a.offset.top-g.top:a.offset.top-
d.top)+a.sizeDiff.height);f=a.containerElement.get(0)==a.element.parent().get(0);g=/relative|absolute/.test(a.containerElement.css("position"));if(f&&g)c-=a.parentData.left;if(c+a.size.width>=a.parentData.width){a.size.width=a.parentData.width-c;if(b)a.size.height=a.size.width/a.aspectRatio}if(d+a.size.height>=a.parentData.height){a.size.height=a.parentData.height-d;if(b)a.size.width=a.size.height*a.aspectRatio}},stop:function(){var b=e(this).data("resizable"),a=b.options,c=b.containerOffset,d=b.containerPosition,
f=b.containerElement,g=e(b.helper),h=g.offset(),i=g.outerWidth()-b.sizeDiff.width;g=g.outerHeight()-b.sizeDiff.height;b._helper&&!a.animate&&/relative/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g});b._helper&&!a.animate&&/static/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g})}});e.ui.plugin.add("resizable","ghost",{start:function(){var b=e(this).data("resizable"),a=b.options,c=b.size;b.ghost=b.originalElement.clone();b.ghost.css({opacity:0.25,
display:"block",position:"relative",height:c.height,width:c.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof a.ghost=="string"?a.ghost:"");b.ghost.appendTo(b.helper)},resize:function(){var b=e(this).data("resizable");b.ghost&&b.ghost.css({position:"relative",height:b.size.height,width:b.size.width})},stop:function(){var b=e(this).data("resizable");b.ghost&&b.helper&&b.helper.get(0).removeChild(b.ghost.get(0))}});e.ui.plugin.add("resizable","grid",{resize:function(){var b=
e(this).data("resizable"),a=b.options,c=b.size,d=b.originalSize,f=b.originalPosition,g=b.axis;a.grid=typeof a.grid=="number"?[a.grid,a.grid]:a.grid;var h=Math.round((c.width-d.width)/(a.grid[0]||1))*(a.grid[0]||1);a=Math.round((c.height-d.height)/(a.grid[1]||1))*(a.grid[1]||1);if(/^(se|s|e)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a}else if(/^(ne)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}else{if(/^(sw)$/.test(g)){b.size.width=d.width+h;b.size.height=
d.height+a}else{b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}b.position.left=f.left-h}}});var m=function(b){return parseInt(b,10)||0},k=function(b){return!isNaN(parseInt(b,10))}})(jQuery);
;/*
 * jQuery UI Selectable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(e){e.widget("ui.selectable",e.ui.mouse,{options:{appendTo:"body",autoRefresh:true,distance:0,filter:"*",tolerance:"touch"},_create:function(){var c=this;this.element.addClass("ui-selectable");this.dragged=false;var f;this.refresh=function(){f=e(c.options.filter,c.element[0]);f.each(function(){var d=e(this),b=d.offset();e.data(this,"selectable-item",{element:this,$element:d,left:b.left,top:b.top,right:b.left+d.outerWidth(),bottom:b.top+d.outerHeight(),startselected:false,selected:d.hasClass("ui-selected"),
selecting:d.hasClass("ui-selecting"),unselecting:d.hasClass("ui-unselecting")})})};this.refresh();this.selectees=f.addClass("ui-selectee");this._mouseInit();this.helper=e("<div class='ui-selectable-helper'></div>")},destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item");this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");this._mouseDestroy();return this},_mouseStart:function(c){var f=this;this.opos=[c.pageX,
c.pageY];if(!this.options.disabled){var d=this.options;this.selectees=e(d.filter,this.element[0]);this._trigger("start",c);e(d.appendTo).append(this.helper);this.helper.css({left:c.clientX,top:c.clientY,width:0,height:0});d.autoRefresh&&this.refresh();this.selectees.filter(".ui-selected").each(function(){var b=e.data(this,"selectable-item");b.startselected=true;if(!c.metaKey){b.$element.removeClass("ui-selected");b.selected=false;b.$element.addClass("ui-unselecting");b.unselecting=true;f._trigger("unselecting",
c,{unselecting:b.element})}});e(c.target).parents().andSelf().each(function(){var b=e.data(this,"selectable-item");if(b){var g=!c.metaKey||!b.$element.hasClass("ui-selected");b.$element.removeClass(g?"ui-unselecting":"ui-selected").addClass(g?"ui-selecting":"ui-unselecting");b.unselecting=!g;b.selecting=g;(b.selected=g)?f._trigger("selecting",c,{selecting:b.element}):f._trigger("unselecting",c,{unselecting:b.element});return false}})}},_mouseDrag:function(c){var f=this;this.dragged=true;if(!this.options.disabled){var d=
this.options,b=this.opos[0],g=this.opos[1],h=c.pageX,i=c.pageY;if(b>h){var j=h;h=b;b=j}if(g>i){j=i;i=g;g=j}this.helper.css({left:b,top:g,width:h-b,height:i-g});this.selectees.each(function(){var a=e.data(this,"selectable-item");if(!(!a||a.element==f.element[0])){var k=false;if(d.tolerance=="touch")k=!(a.left>h||a.right<b||a.top>i||a.bottom<g);else if(d.tolerance=="fit")k=a.left>b&&a.right<h&&a.top>g&&a.bottom<i;if(k){if(a.selected){a.$element.removeClass("ui-selected");a.selected=false}if(a.unselecting){a.$element.removeClass("ui-unselecting");
a.unselecting=false}if(!a.selecting){a.$element.addClass("ui-selecting");a.selecting=true;f._trigger("selecting",c,{selecting:a.element})}}else{if(a.selecting)if(c.metaKey&&a.startselected){a.$element.removeClass("ui-selecting");a.selecting=false;a.$element.addClass("ui-selected");a.selected=true}else{a.$element.removeClass("ui-selecting");a.selecting=false;if(a.startselected){a.$element.addClass("ui-unselecting");a.unselecting=true}f._trigger("unselecting",c,{unselecting:a.element})}if(a.selected)if(!c.metaKey&&
!a.startselected){a.$element.removeClass("ui-selected");a.selected=false;a.$element.addClass("ui-unselecting");a.unselecting=true;f._trigger("unselecting",c,{unselecting:a.element})}}}});return false}},_mouseStop:function(c){var f=this;this.dragged=false;e(".ui-unselecting",this.element[0]).each(function(){var d=e.data(this,"selectable-item");d.$element.removeClass("ui-unselecting");d.unselecting=false;d.startselected=false;f._trigger("unselected",c,{unselected:d.element})});e(".ui-selecting",this.element[0]).each(function(){var d=
e.data(this,"selectable-item");d.$element.removeClass("ui-selecting").addClass("ui-selected");d.selecting=false;d.selected=true;d.startselected=true;f._trigger("selected",c,{selected:d.element})});this._trigger("stop",c);this.helper.remove();return false}});e.extend(e.ui.selectable,{version:"1.8.16"})})(jQuery);
;/*
 * jQuery UI Sortable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.sortable",d.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1E3},_create:function(){var a=this.options;this.containerCache={};this.element.addClass("ui-sortable");
this.refresh();this.floating=this.items.length?a.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var a=this.items.length-1;a>=0;a--)this.items[a].item.removeData("sortable-item");return this},_setOption:function(a,b){if(a===
"disabled"){this.options[a]=b;this.widget()[b?"addClass":"removeClass"]("ui-sortable-disabled")}else d.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(a,b){if(this.reverting)return false;if(this.options.disabled||this.options.type=="static")return false;this._refreshItems(a);var c=null,e=this;d(a.target).parents().each(function(){if(d.data(this,"sortable-item")==e){c=d(this);return false}});if(d.data(a.target,"sortable-item")==e)c=d(a.target);if(!c)return false;if(this.options.handle&&
!b){var f=false;d(this.options.handle,c).find("*").andSelf().each(function(){if(this==a.target)f=true});if(!f)return false}this.currentItem=c;this._removeCurrentsFromItems();return true},_mouseStart:function(a,b,c){b=this.options;var e=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(a);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,
left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};
this.helper[0]!=this.currentItem[0]&&this.currentItem.hide();this._createPlaceholder();b.containment&&this._setContainment();if(b.cursor){if(d("body").css("cursor"))this._storedCursor=d("body").css("cursor");d("body").css("cursor",b.cursor)}if(b.opacity){if(this.helper.css("opacity"))this._storedOpacity=this.helper.css("opacity");this.helper.css("opacity",b.opacity)}if(b.zIndex){if(this.helper.css("zIndex"))this._storedZIndex=this.helper.css("zIndex");this.helper.css("zIndex",b.zIndex)}if(this.scrollParent[0]!=
document&&this.scrollParent[0].tagName!="HTML")this.overflowOffset=this.scrollParent.offset();this._trigger("start",a,this._uiHash());this._preserveHelperProportions||this._cacheHelperProportions();if(!c)for(c=this.containers.length-1;c>=0;c--)this.containers[c]._trigger("activate",a,e._uiHash(this));if(d.ui.ddmanager)d.ui.ddmanager.current=this;d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(a);
return true},_mouseDrag:function(a){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");if(!this.lastPositionAbs)this.lastPositionAbs=this.positionAbs;if(this.options.scroll){var b=this.options,c=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-a.pageY<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+b.scrollSpeed;else if(a.pageY-this.overflowOffset.top<
b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-b.scrollSpeed;if(this.overflowOffset.left+this.scrollParent[0].offsetWidth-a.pageX<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+b.scrollSpeed;else if(a.pageX-this.overflowOffset.left<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-b.scrollSpeed}else{if(a.pageY-d(document).scrollTop()<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()-
b.scrollSpeed);else if(d(window).height()-(a.pageY-d(document).scrollTop())<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()+b.scrollSpeed);if(a.pageX-d(document).scrollLeft()<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()-b.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()+b.scrollSpeed)}c!==false&&d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,
a)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(b=this.items.length-1;b>=0;b--){c=this.items[b];var e=c.item[0],f=this._intersectsWithPointer(c);if(f)if(e!=this.currentItem[0]&&this.placeholder[f==1?"next":"prev"]()[0]!=e&&!d.ui.contains(this.placeholder[0],e)&&(this.options.type=="semi-dynamic"?!d.ui.contains(this.element[0],
e):true)){this.direction=f==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(c))this._rearrange(a,c);else break;this._trigger("change",a,this._uiHash());break}}this._contactContainers(a);d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);this._trigger("sort",a,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(a,b){if(a){d.ui.ddmanager&&!this.options.dropBehaviour&&d.ui.ddmanager.drop(this,a);if(this.options.revert){var c=this;b=c.placeholder.offset();
c.reverting=true;d(this.helper).animate({left:b.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:b.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(a)})}else this._clear(a,b);return false}},cancel:function(){var a=this;if(this.dragging){this._mouseUp({target:null});this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):
this.currentItem.show();for(var b=this.containers.length-1;b>=0;b--){this.containers[b]._trigger("deactivate",null,a._uiHash(this));if(this.containers[b].containerCache.over){this.containers[b]._trigger("out",null,a._uiHash(this));this.containers[b].containerCache.over=0}}}if(this.placeholder){this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove();d.extend(this,{helper:null,
dragging:false,reverting:false,_noFinalSort:null});this.domPosition.prev?d(this.domPosition.prev).after(this.currentItem):d(this.domPosition.parent).prepend(this.currentItem)}return this},serialize:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};d(b).each(function(){var e=(d(a.item||this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);if(e)c.push((a.key||e[1]+"[]")+"="+(a.key&&a.expression?e[1]:e[2]))});!c.length&&a.key&&c.push(a.key+"=");return c.join("&")},
toArray:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};b.each(function(){c.push(d(a.item||this).attr(a.attribute||"id")||"")});return c},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,e=this.positionAbs.top,f=e+this.helperProportions.height,g=a.left,h=g+a.width,i=a.top,k=i+a.height,j=this.offset.click.top,l=this.offset.click.left;j=e+j>i&&e+j<k&&b+l>g&&b+l<h;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||
this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?j:g<b+this.helperProportions.width/2&&c-this.helperProportions.width/2<h&&i<e+this.helperProportions.height/2&&f-this.helperProportions.height/2<k},_intersectsWithPointer:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left,a.width);b=b&&a;a=this._getDragVerticalDirection();
var c=this._getDragHorizontalDirection();if(!b)return false;return this.floating?c&&c=="right"||a=="down"?2:1:a&&(a=="down"?2:1)},_intersectsWithSides:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top+a.height/2,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left+a.width/2,a.width);var c=this._getDragVerticalDirection(),e=this._getDragHorizontalDirection();return this.floating&&e?e=="right"&&a||e=="left"&&!a:c&&(c=="down"&&b||c=="up"&&!b)},
_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;return a!=0&&(a>0?"down":"up")},_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;return a!=0&&(a>0?"right":"left")},refresh:function(a){this._refreshItems(a);this.refreshPositions();return this},_connectWith:function(){var a=this.options;return a.connectWith.constructor==String?[a.connectWith]:a.connectWith},_getItemsAsjQuery:function(a){var b=[],c=[],e=this._connectWith();
if(e&&a)for(a=e.length-1;a>=0;a--)for(var f=d(e[a]),g=f.length-1;g>=0;g--){var h=d.data(f[g],"sortable");if(h&&h!=this&&!h.options.disabled)c.push([d.isFunction(h.options.items)?h.options.items.call(h.element):d(h.options.items,h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h])}c.push([d.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):d(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),
this]);for(a=c.length-1;a>=0;a--)c[a][0].each(function(){b.push(this)});return d(b)},_removeCurrentsFromItems:function(){for(var a=this.currentItem.find(":data(sortable-item)"),b=0;b<this.items.length;b++)for(var c=0;c<a.length;c++)a[c]==this.items[b].item[0]&&this.items.splice(b,1)},_refreshItems:function(a){this.items=[];this.containers=[this];var b=this.items,c=[[d.isFunction(this.options.items)?this.options.items.call(this.element[0],a,{item:this.currentItem}):d(this.options.items,this.element),
this]],e=this._connectWith();if(e)for(var f=e.length-1;f>=0;f--)for(var g=d(e[f]),h=g.length-1;h>=0;h--){var i=d.data(g[h],"sortable");if(i&&i!=this&&!i.options.disabled){c.push([d.isFunction(i.options.items)?i.options.items.call(i.element[0],a,{item:this.currentItem}):d(i.options.items,i.element),i]);this.containers.push(i)}}for(f=c.length-1;f>=0;f--){a=c[f][1];e=c[f][0];h=0;for(g=e.length;h<g;h++){i=d(e[h]);i.data("sortable-item",a);b.push({item:i,instance:a,width:0,height:0,left:0,top:0})}}},refreshPositions:function(a){if(this.offsetParent&&
this.helper)this.offset.parent=this._getParentOffset();for(var b=this.items.length-1;b>=0;b--){var c=this.items[b];if(!(c.instance!=this.currentContainer&&this.currentContainer&&c.item[0]!=this.currentItem[0])){var e=this.options.toleranceElement?d(this.options.toleranceElement,c.item):c.item;if(!a){c.width=e.outerWidth();c.height=e.outerHeight()}e=e.offset();c.left=e.left;c.top=e.top}}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(b=
this.containers.length-1;b>=0;b--){e=this.containers[b].element.offset();this.containers[b].containerCache.left=e.left;this.containers[b].containerCache.top=e.top;this.containers[b].containerCache.width=this.containers[b].element.outerWidth();this.containers[b].containerCache.height=this.containers[b].element.outerHeight()}return this},_createPlaceholder:function(a){var b=a||this,c=b.options;if(!c.placeholder||c.placeholder.constructor==String){var e=c.placeholder;c.placeholder={element:function(){var f=
d(document.createElement(b.currentItem[0].nodeName)).addClass(e||b.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!e)f.style.visibility="hidden";return f},update:function(f,g){if(!(e&&!c.forcePlaceholderSize)){g.height()||g.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));g.width()||g.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||
0,10))}}}}b.placeholder=d(c.placeholder.element.call(b.element,b.currentItem));b.currentItem.after(b.placeholder);c.placeholder.update(b,b.placeholder)},_contactContainers:function(a){for(var b=null,c=null,e=this.containers.length-1;e>=0;e--)if(!d.ui.contains(this.currentItem[0],this.containers[e].element[0]))if(this._intersectsWith(this.containers[e].containerCache)){if(!(b&&d.ui.contains(this.containers[e].element[0],b.element[0]))){b=this.containers[e];c=e}}else if(this.containers[e].containerCache.over){this.containers[e]._trigger("out",
a,this._uiHash(this));this.containers[e].containerCache.over=0}if(b)if(this.containers.length===1){this.containers[c]._trigger("over",a,this._uiHash(this));this.containers[c].containerCache.over=1}else if(this.currentContainer!=this.containers[c]){b=1E4;e=null;for(var f=this.positionAbs[this.containers[c].floating?"left":"top"],g=this.items.length-1;g>=0;g--)if(d.ui.contains(this.containers[c].element[0],this.items[g].item[0])){var h=this.items[g][this.containers[c].floating?"left":"top"];if(Math.abs(h-
f)<b){b=Math.abs(h-f);e=this.items[g]}}if(e||this.options.dropOnEmpty){this.currentContainer=this.containers[c];e?this._rearrange(a,e,null,true):this._rearrange(a,null,this.containers[c].element,true);this._trigger("change",a,this._uiHash());this.containers[c]._trigger("change",a,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[c]._trigger("over",a,this._uiHash(this));this.containers[c].containerCache.over=1}}},_createHelper:function(a){var b=
this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a,this.currentItem])):b.helper=="clone"?this.currentItem.clone():this.currentItem;a.parents("body").length||d(b.appendTo!="parent"?b.appendTo:this.currentItem[0].parentNode)[0].appendChild(a[0]);if(a[0]==this.currentItem[0])this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};if(a[0].style.width==
""||b.forceHelperSize)a.width(this.currentItem.width());if(a[0].style.height==""||b.forceHelperSize)a.height(this.currentItem.height());return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=
this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a=
{top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.currentItem.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),
10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?
document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)){var b=d(a.containment)[0];a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),
10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(a,b){if(!b)b=
this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&
this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0]))this.offset.relative=this._getRelativeOffset();
var f=a.pageX,g=a.pageY;if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])f=this.containment[0]+this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])f=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-
this.originalPageY)/b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;f=this.originalPageX+Math.round((f-this.originalPageX)/b.grid[0])*b.grid[0];f=this.containment?!(f-this.offset.click.left<this.containment[0]||f-this.offset.click.left>this.containment[2])?f:!(f-this.offset.click.left<this.containment[0])?f-b.grid[0]:f+b.grid[0]:f}}return{top:g-
this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())}},_rearrange:function(a,b,c,e){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],
this.direction=="down"?b.item[0]:b.item[0].nextSibling);this.counter=this.counter?++this.counter:1;var f=this,g=this.counter;window.setTimeout(function(){g==f.counter&&f.refreshPositions(!e)},0)},_clear:function(a,b){this.reverting=false;var c=[];!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem);this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var e in this._storedCSS)if(this._storedCSS[e]=="auto"||this._storedCSS[e]=="static")this._storedCSS[e]=
"";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!b&&c.push(function(f){this._trigger("receive",f,this._uiHash(this.fromOutside))});if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!b)c.push(function(f){this._trigger("update",f,this._uiHash())});if(!d.ui.contains(this.element[0],this.currentItem[0])){b||c.push(function(f){this._trigger("remove",
f,this._uiHash())});for(e=this.containers.length-1;e>=0;e--)if(d.ui.contains(this.containers[e].element[0],this.currentItem[0])&&!b){c.push(function(f){return function(g){f._trigger("receive",g,this._uiHash(this))}}.call(this,this.containers[e]));c.push(function(f){return function(g){f._trigger("update",g,this._uiHash(this))}}.call(this,this.containers[e]))}}for(e=this.containers.length-1;e>=0;e--){b||c.push(function(f){return function(g){f._trigger("deactivate",g,this._uiHash(this))}}.call(this,
this.containers[e]));if(this.containers[e].containerCache.over){c.push(function(f){return function(g){f._trigger("out",g,this._uiHash(this))}}.call(this,this.containers[e]));this.containers[e].containerCache.over=0}}this._storedCursor&&d("body").css("cursor",this._storedCursor);this._storedOpacity&&this.helper.css("opacity",this._storedOpacity);if(this._storedZIndex)this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);this.dragging=false;if(this.cancelHelperRemoval){if(!b){this._trigger("beforeStop",
a,this._uiHash());for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}return false}b||this._trigger("beforeStop",a,this._uiHash());this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.helper[0]!=this.currentItem[0]&&this.helper.remove();this.helper=null;if(!b){for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){d.Widget.prototype._trigger.apply(this,arguments)===false&&this.cancel()},
_uiHash:function(a){var b=a||this;return{helper:b.helper,placeholder:b.placeholder||d([]),position:b.position,originalPosition:b.originalPosition,offset:b.positionAbs,item:b.currentItem,sender:a?a.element:null}}});d.extend(d.ui.sortable,{version:"1.8.16"})})(jQuery);
;/*
 * jQuery UI Accordion 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(c){c.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:true,clearStyle:false,collapsible:false,event:"click",fillSpace:false,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:false,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}},_create:function(){var a=this,b=a.options;a.running=0;a.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix");
a.headers=a.element.find(b.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){b.disabled||c(this).addClass("ui-state-hover")}).bind("mouseleave.accordion",function(){b.disabled||c(this).removeClass("ui-state-hover")}).bind("focus.accordion",function(){b.disabled||c(this).addClass("ui-state-focus")}).bind("blur.accordion",function(){b.disabled||c(this).removeClass("ui-state-focus")});a.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
if(b.navigation){var d=a.element.find("a").filter(b.navigationFilter).eq(0);if(d.length){var h=d.closest(".ui-accordion-header");a.active=h.length?h:d.closest(".ui-accordion-content").prev()}}a.active=a._findActive(a.active||b.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");a.active.next().addClass("ui-accordion-content-active");a._createIcons();a.resize();a.element.attr("role","tablist");a.headers.attr("role","tab").bind("keydown.accordion",
function(f){return a._keydown(f)}).next().attr("role","tabpanel");a.headers.not(a.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide();a.active.length?a.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}):a.headers.eq(0).attr("tabIndex",0);c.browser.safari||a.headers.find("a").attr("tabIndex",-1);b.event&&a.headers.bind(b.event.split(" ").join(".accordion ")+".accordion",function(f){a._clickHandler.call(a,f,this);f.preventDefault()})},_createIcons:function(){var a=
this.options;if(a.icons){c("<span></span>").addClass("ui-icon "+a.icons.header).prependTo(this.headers);this.active.children(".ui-icon").toggleClass(a.icons.header).toggleClass(a.icons.headerSelected);this.element.addClass("ui-accordion-icons")}},_destroyIcons:function(){this.headers.children(".ui-icon").remove();this.element.removeClass("ui-accordion-icons")},destroy:function(){var a=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex");
this.headers.find("a").removeAttr("tabIndex");this._destroyIcons();var b=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");if(a.autoHeight||a.fillHeight)b.css("height","");return c.Widget.prototype.destroy.call(this)},_setOption:function(a,b){c.Widget.prototype._setOption.apply(this,arguments);a=="active"&&this.activate(b);if(a=="icons"){this._destroyIcons();
b&&this._createIcons()}if(a=="disabled")this.headers.add(this.headers.next())[b?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled")},_keydown:function(a){if(!(this.options.disabled||a.altKey||a.ctrlKey)){var b=c.ui.keyCode,d=this.headers.length,h=this.headers.index(a.target),f=false;switch(a.keyCode){case b.RIGHT:case b.DOWN:f=this.headers[(h+1)%d];break;case b.LEFT:case b.UP:f=this.headers[(h-1+d)%d];break;case b.SPACE:case b.ENTER:this._clickHandler({target:a.target},a.target);
a.preventDefault()}if(f){c(a.target).attr("tabIndex",-1);c(f).attr("tabIndex",0);f.focus();return false}return true}},resize:function(){var a=this.options,b;if(a.fillSpace){if(c.browser.msie){var d=this.element.parent().css("overflow");this.element.parent().css("overflow","hidden")}b=this.element.parent().height();c.browser.msie&&this.element.parent().css("overflow",d);this.headers.each(function(){b-=c(this).outerHeight(true)});this.headers.next().each(function(){c(this).height(Math.max(0,b-c(this).innerHeight()+
c(this).height()))}).css("overflow","auto")}else if(a.autoHeight){b=0;this.headers.next().each(function(){b=Math.max(b,c(this).height("").height())}).height(b)}return this},activate:function(a){this.options.active=a;a=this._findActive(a)[0];this._clickHandler({target:a},a);return this},_findActive:function(a){return a?typeof a==="number"?this.headers.filter(":eq("+a+")"):this.headers.not(this.headers.not(a)):a===false?c([]):this.headers.filter(":eq(0)")},_clickHandler:function(a,b){var d=this.options;
if(!d.disabled)if(a.target){a=c(a.currentTarget||b);b=a[0]===this.active[0];d.active=d.collapsible&&b?false:this.headers.index(a);if(!(this.running||!d.collapsible&&b)){var h=this.active;j=a.next();g=this.active.next();e={options:d,newHeader:b&&d.collapsible?c([]):a,oldHeader:this.active,newContent:b&&d.collapsible?c([]):j,oldContent:g};var f=this.headers.index(this.active[0])>this.headers.index(a[0]);this.active=b?c([]):a;this._toggle(j,g,e,b,f);h.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);
if(!b){a.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(d.icons.header).addClass(d.icons.headerSelected);a.next().addClass("ui-accordion-content-active")}}}else if(d.collapsible){this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);this.active.next().addClass("ui-accordion-content-active");var g=this.active.next(),
e={options:d,newHeader:c([]),oldHeader:d.active,newContent:c([]),oldContent:g},j=this.active=c([]);this._toggle(j,g,e)}},_toggle:function(a,b,d,h,f){var g=this,e=g.options;g.toShow=a;g.toHide=b;g.data=d;var j=function(){if(g)return g._completed.apply(g,arguments)};g._trigger("changestart",null,g.data);g.running=b.size()===0?a.size():b.size();if(e.animated){d={};d=e.collapsible&&h?{toShow:c([]),toHide:b,complete:j,down:f,autoHeight:e.autoHeight||e.fillSpace}:{toShow:a,toHide:b,complete:j,down:f,autoHeight:e.autoHeight||
e.fillSpace};if(!e.proxied)e.proxied=e.animated;if(!e.proxiedDuration)e.proxiedDuration=e.duration;e.animated=c.isFunction(e.proxied)?e.proxied(d):e.proxied;e.duration=c.isFunction(e.proxiedDuration)?e.proxiedDuration(d):e.proxiedDuration;h=c.ui.accordion.animations;var i=e.duration,k=e.animated;if(k&&!h[k]&&!c.easing[k])k="slide";h[k]||(h[k]=function(l){this.slide(l,{easing:k,duration:i||700})});h[k](d)}else{if(e.collapsible&&h)a.toggle();else{b.hide();a.show()}j(true)}b.prev().attr({"aria-expanded":"false",
"aria-selected":"false",tabIndex:-1}).blur();a.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus()},_completed:function(a){this.running=a?0:--this.running;if(!this.running){this.options.clearStyle&&this.toShow.add(this.toHide).css({height:"",overflow:""});this.toHide.removeClass("ui-accordion-content-active");if(this.toHide.length)this.toHide.parent()[0].className=this.toHide.parent()[0].className;this._trigger("change",null,this.data)}}});c.extend(c.ui.accordion,{version:"1.8.16",
animations:{slide:function(a,b){a=c.extend({easing:"swing",duration:300},a,b);if(a.toHide.size())if(a.toShow.size()){var d=a.toShow.css("overflow"),h=0,f={},g={},e;b=a.toShow;e=b[0].style.width;b.width(parseInt(b.parent().width(),10)-parseInt(b.css("paddingLeft"),10)-parseInt(b.css("paddingRight"),10)-(parseInt(b.css("borderLeftWidth"),10)||0)-(parseInt(b.css("borderRightWidth"),10)||0));c.each(["height","paddingTop","paddingBottom"],function(j,i){g[i]="hide";j=(""+c.css(a.toShow[0],i)).match(/^([\d+-.]+)(.*)$/);
f[i]={value:j[1],unit:j[2]||"px"}});a.toShow.css({height:0,overflow:"hidden"}).show();a.toHide.filter(":hidden").each(a.complete).end().filter(":visible").animate(g,{step:function(j,i){if(i.prop=="height")h=i.end-i.start===0?0:(i.now-i.start)/(i.end-i.start);a.toShow[0].style[i.prop]=h*f[i.prop].value+f[i.prop].unit},duration:a.duration,easing:a.easing,complete:function(){a.autoHeight||a.toShow.css("height","");a.toShow.css({width:e,overflow:d});a.complete()}})}else a.toHide.animate({height:"hide",
paddingTop:"hide",paddingBottom:"hide"},a);else a.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},a)},bounceslide:function(a){this.slide(a,{easing:a.down?"easeOutBounce":"swing",duration:a.down?1E3:200})}}})})(jQuery);
;/*
 * jQuery UI Autocomplete 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function(d){var e=0;d.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:false,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var a=this,b=this.element[0].ownerDocument,g;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(c){if(!(a.options.disabled||a.element.propAttr("readOnly"))){g=
false;var f=d.ui.keyCode;switch(c.keyCode){case f.PAGE_UP:a._move("previousPage",c);break;case f.PAGE_DOWN:a._move("nextPage",c);break;case f.UP:a._move("previous",c);c.preventDefault();break;case f.DOWN:a._move("next",c);c.preventDefault();break;case f.ENTER:case f.NUMPAD_ENTER:if(a.menu.active){g=true;c.preventDefault()}case f.TAB:if(!a.menu.active)return;a.menu.select(c);break;case f.ESCAPE:a.element.val(a.term);a.close(c);break;default:clearTimeout(a.searching);a.searching=setTimeout(function(){if(a.term!=
a.element.val()){a.selectedItem=null;a.search(null,c)}},a.options.delay);break}}}).bind("keypress.autocomplete",function(c){if(g){g=false;c.preventDefault()}}).bind("focus.autocomplete",function(){if(!a.options.disabled){a.selectedItem=null;a.previous=a.element.val()}}).bind("blur.autocomplete",function(c){if(!a.options.disabled){clearTimeout(a.searching);a.closing=setTimeout(function(){a.close(c);a._change(c)},150)}});this._initSource();this.response=function(){return a._response.apply(a,arguments)};
this.menu=d("<ul></ul>").addClass("ui-autocomplete").appendTo(d(this.options.appendTo||"body",b)[0]).mousedown(function(c){var f=a.menu.element[0];d(c.target).closest(".ui-menu-item").length||setTimeout(function(){d(document).one("mousedown",function(h){h.target!==a.element[0]&&h.target!==f&&!d.ui.contains(f,h.target)&&a.close()})},1);setTimeout(function(){clearTimeout(a.closing)},13)}).menu({focus:function(c,f){f=f.item.data("item.autocomplete");false!==a._trigger("focus",c,{item:f})&&/^key/.test(c.originalEvent.type)&&
a.element.val(f.value)},selected:function(c,f){var h=f.item.data("item.autocomplete"),i=a.previous;if(a.element[0]!==b.activeElement){a.element.focus();a.previous=i;setTimeout(function(){a.previous=i;a.selectedItem=h},1)}false!==a._trigger("select",c,{item:h})&&a.element.val(h.value);a.term=a.element.val();a.close(c);a.selectedItem=h},blur:function(){a.menu.element.is(":visible")&&a.element.val()!==a.term&&a.element.val(a.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");
d.fn.bgiframe&&this.menu.element.bgiframe()},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");this.menu.element.remove();d.Widget.prototype.destroy.call(this)},_setOption:function(a,b){d.Widget.prototype._setOption.apply(this,arguments);a==="source"&&this._initSource();if(a==="appendTo")this.menu.element.appendTo(d(b||"body",this.element[0].ownerDocument)[0]);a==="disabled"&&
b&&this.xhr&&this.xhr.abort()},_initSource:function(){var a=this,b,g;if(d.isArray(this.options.source)){b=this.options.source;this.source=function(c,f){f(d.ui.autocomplete.filter(b,c.term))}}else if(typeof this.options.source==="string"){g=this.options.source;this.source=function(c,f){a.xhr&&a.xhr.abort();a.xhr=d.ajax({url:g,data:c,dataType:"json",autocompleteRequest:++e,success:function(h){this.autocompleteRequest===e&&f(h)},error:function(){this.autocompleteRequest===e&&f([])}})}}else this.source=
this.options.source},search:function(a,b){a=a!=null?a:this.element.val();this.term=this.element.val();if(a.length<this.options.minLength)return this.close(b);clearTimeout(this.closing);if(this._trigger("search",b)!==false)return this._search(a)},_search:function(a){this.pending++;this.element.addClass("ui-autocomplete-loading");this.source({term:a},this.response)},_response:function(a){if(!this.options.disabled&&a&&a.length){a=this._normalize(a);this._suggest(a);this._trigger("open")}else this.close();
this.pending--;this.pending||this.element.removeClass("ui-autocomplete-loading")},close:function(a){clearTimeout(this.closing);if(this.menu.element.is(":visible")){this.menu.element.hide();this.menu.deactivate();this._trigger("close",a)}},_change:function(a){this.previous!==this.element.val()&&this._trigger("change",a,{item:this.selectedItem})},_normalize:function(a){if(a.length&&a[0].label&&a[0].value)return a;return d.map(a,function(b){if(typeof b==="string")return{label:b,value:b};return d.extend({label:b.label||
b.value,value:b.value||b.label},b)})},_suggest:function(a){var b=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(b,a);this.menu.deactivate();this.menu.refresh();b.show();this._resizeMenu();b.position(d.extend({of:this.element},this.options.position));this.options.autoFocus&&this.menu.next(new d.Event("mouseover"))},_resizeMenu:function(){var a=this.menu.element;a.outerWidth(Math.max(a.width("").outerWidth(),this.element.outerWidth()))},_renderMenu:function(a,b){var g=this;
d.each(b,function(c,f){g._renderItem(a,f)})},_renderItem:function(a,b){return d("<li></li>").data("item.autocomplete",b).append(d("<a></a>").text(b.label)).appendTo(a)},_move:function(a,b){if(this.menu.element.is(":visible"))if(this.menu.first()&&/^previous/.test(a)||this.menu.last()&&/^next/.test(a)){this.element.val(this.term);this.menu.deactivate()}else this.menu[a](b);else this.search(null,b)},widget:function(){return this.menu.element}});d.extend(d.ui.autocomplete,{escapeRegex:function(a){return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
"\\$&")},filter:function(a,b){var g=new RegExp(d.ui.autocomplete.escapeRegex(b),"i");return d.grep(a,function(c){return g.test(c.label||c.value||c)})}})})(jQuery);
(function(d){d.widget("ui.menu",{_create:function(){var e=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(a){if(d(a.target).closest(".ui-menu-item a").length){a.preventDefault();e.select(a)}});this.refresh()},refresh:function(){var e=this;this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
-1).mouseenter(function(a){e.activate(a,d(this).parent())}).mouseleave(function(){e.deactivate()})},activate:function(e,a){this.deactivate();if(this.hasScroll()){var b=a.offset().top-this.element.offset().top,g=this.element.scrollTop(),c=this.element.height();if(b<0)this.element.scrollTop(g+b);else b>=c&&this.element.scrollTop(g+b-c+a.height())}this.active=a.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();this._trigger("focus",e,{item:a})},deactivate:function(){if(this.active){this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
this._trigger("blur");this.active=null}},next:function(e){this.move("next",".ui-menu-item:first",e)},previous:function(e){this.move("prev",".ui-menu-item:last",e)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(e,a,b){if(this.active){e=this.active[e+"All"](".ui-menu-item").eq(0);e.length?this.activate(b,e):this.activate(b,this.element.children(a))}else this.activate(b,
this.element.children(a))},nextPage:function(e){if(this.hasScroll())if(!this.active||this.last())this.activate(e,this.element.children(".ui-menu-item:first"));else{var a=this.active.offset().top,b=this.element.height(),g=this.element.children(".ui-menu-item").filter(function(){var c=d(this).offset().top-a-b+d(this).height();return c<10&&c>-10});g.length||(g=this.element.children(".ui-menu-item:last"));this.activate(e,g)}else this.activate(e,this.element.children(".ui-menu-item").filter(!this.active||
this.last()?":first":":last"))},previousPage:function(e){if(this.hasScroll())if(!this.active||this.first())this.activate(e,this.element.children(".ui-menu-item:last"));else{var a=this.active.offset().top,b=this.element.height();result=this.element.children(".ui-menu-item").filter(function(){var g=d(this).offset().top-a+b-d(this).height();return g<10&&g>-10});result.length||(result=this.element.children(".ui-menu-item:first"));this.activate(e,result)}else this.activate(e,this.element.children(".ui-menu-item").filter(!this.active||
this.first()?":last":":first"))},hasScroll:function(){return this.element.height()<this.element[d.fn.prop?"prop":"attr"]("scrollHeight")},select:function(e){this._trigger("selected",e,{item:this.active})}})})(jQuery);
;/*
 * jQuery UI Button 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(b){var h,i,j,g,l=function(){var a=b(this).find(":ui-button");setTimeout(function(){a.button("refresh")},1)},k=function(a){var c=a.name,e=a.form,f=b([]);if(c)f=e?b(e).find("[name='"+c+"']"):b("[name='"+c+"']",a.ownerDocument).filter(function(){return!this.form});return f};b.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",l);if(typeof this.options.disabled!==
"boolean")this.options.disabled=this.element.propAttr("disabled");this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var a=this,c=this.options,e=this.type==="checkbox"||this.type==="radio",f="ui-state-hover"+(!e?" ui-state-active":"");if(c.label===null)c.label=this.buttonElement.html();if(this.element.is(":disabled"))c.disabled=true;this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",function(){if(!c.disabled){b(this).addClass("ui-state-hover");
this===h&&b(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){c.disabled||b(this).removeClass(f)}).bind("click.button",function(d){if(c.disabled){d.preventDefault();d.stopImmediatePropagation()}});this.element.bind("focus.button",function(){a.buttonElement.addClass("ui-state-focus")}).bind("blur.button",function(){a.buttonElement.removeClass("ui-state-focus")});if(e){this.element.bind("change.button",function(){g||a.refresh()});this.buttonElement.bind("mousedown.button",function(d){if(!c.disabled){g=
false;i=d.pageX;j=d.pageY}}).bind("mouseup.button",function(d){if(!c.disabled)if(i!==d.pageX||j!==d.pageY)g=true})}if(this.type==="checkbox")this.buttonElement.bind("click.button",function(){if(c.disabled||g)return false;b(this).toggleClass("ui-state-active");a.buttonElement.attr("aria-pressed",a.element[0].checked)});else if(this.type==="radio")this.buttonElement.bind("click.button",function(){if(c.disabled||g)return false;b(this).addClass("ui-state-active");a.buttonElement.attr("aria-pressed","true");
var d=a.element[0];k(d).not(d).map(function(){return b(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")});else{this.buttonElement.bind("mousedown.button",function(){if(c.disabled)return false;b(this).addClass("ui-state-active");h=this;b(document).one("mouseup",function(){h=null})}).bind("mouseup.button",function(){if(c.disabled)return false;b(this).removeClass("ui-state-active")}).bind("keydown.button",function(d){if(c.disabled)return false;if(d.keyCode==b.ui.keyCode.SPACE||
d.keyCode==b.ui.keyCode.ENTER)b(this).addClass("ui-state-active")}).bind("keyup.button",function(){b(this).removeClass("ui-state-active")});this.buttonElement.is("a")&&this.buttonElement.keyup(function(d){d.keyCode===b.ui.keyCode.SPACE&&b(this).click()})}this._setOption("disabled",c.disabled);this._resetButton()},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";if(this.type==="checkbox"||this.type===
"radio"){var a=this.element.parents().filter(":last"),c="label[for='"+this.element.attr("id")+"']";this.buttonElement=a.find(c);if(!this.buttonElement.length){a=a.length?a.siblings():this.element.siblings();this.buttonElement=a.filter(c);if(!this.buttonElement.length)this.buttonElement=a.find(c)}this.element.addClass("ui-helper-hidden-accessible");(a=this.element.is(":checked"))&&this.buttonElement.addClass("ui-state-active");this.buttonElement.attr("aria-pressed",a)}else this.buttonElement=this.element},
widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());this.hasTitle||this.buttonElement.removeAttr("title");
b.Widget.prototype.destroy.call(this)},_setOption:function(a,c){b.Widget.prototype._setOption.apply(this,arguments);if(a==="disabled")c?this.element.propAttr("disabled",true):this.element.propAttr("disabled",false);else this._resetButton()},refresh:function(){var a=this.element.is(":disabled");a!==this.options.disabled&&this._setOption("disabled",a);if(this.type==="radio")k(this.element[0]).each(function(){b(this).is(":checked")?b(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
"true"):b(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")});else if(this.type==="checkbox")this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false")},_resetButton:function(){if(this.type==="input")this.options.label&&this.element.val(this.options.label);else{var a=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
c=b("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(a.empty()).text(),e=this.options.icons,f=e.primary&&e.secondary,d=[];if(e.primary||e.secondary){if(this.options.text)d.push("ui-button-text-icon"+(f?"s":e.primary?"-primary":"-secondary"));e.primary&&a.prepend("<span class='ui-button-icon-primary ui-icon "+e.primary+"'></span>");e.secondary&&a.append("<span class='ui-button-icon-secondary ui-icon "+e.secondary+"'></span>");if(!this.options.text){d.push(f?"ui-button-icons-only":
"ui-button-icon-only");this.hasTitle||a.attr("title",c)}}else d.push("ui-button-text-only");a.addClass(d.join(" "))}}});b.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(a,c){a==="disabled"&&this.buttons.button("option",a,c);b.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){var a=this.element.css("direction")===
"ltr";this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return b(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(a?"ui-corner-left":"ui-corner-right").end().filter(":last").addClass(a?"ui-corner-right":"ui-corner-left").end().end()},destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return b(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
b.Widget.prototype.destroy.call(this)}})})(jQuery);
;/*
 * jQuery UI Dialog 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function(c,l){var m={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},n={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true},o=c.attrFn||{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true,click:true};c.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,
position:{my:"center",at:"center",collision:"fit",using:function(a){var b=c(this).css(a).offset().top;b<0&&c(this).css("top",a.top-b)}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1E3},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string")this.originalTitle="";this.options.title=this.options.title||this.originalTitle;var a=this,b=a.options,d=b.title||"&#160;",e=c.ui.dialog.getTitleId(a.element),g=(a.uiDialog=c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+
b.dialogClass).css({zIndex:b.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(i){if(b.closeOnEscape&&!i.isDefaultPrevented()&&i.keyCode&&i.keyCode===c.ui.keyCode.ESCAPE){a.close(i);i.preventDefault()}}).attr({role:"dialog","aria-labelledby":e}).mousedown(function(i){a.moveToTop(false,i)});a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);var f=(a.uiDialogTitlebar=c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),
h=c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role","button").hover(function(){h.addClass("ui-state-hover")},function(){h.removeClass("ui-state-hover")}).focus(function(){h.addClass("ui-state-focus")}).blur(function(){h.removeClass("ui-state-focus")}).click(function(i){a.close(i);return false}).appendTo(f);(a.uiDialogTitlebarCloseText=c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);c("<span></span>").addClass("ui-dialog-title").attr("id",
e).html(d).prependTo(f);if(c.isFunction(b.beforeclose)&&!c.isFunction(b.beforeClose))b.beforeClose=b.beforeclose;f.find("*").add(f).disableSelection();b.draggable&&c.fn.draggable&&a._makeDraggable();b.resizable&&c.fn.resizable&&a._makeResizable();a._createButtons(b.buttons);a._isOpen=false;c.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;a.overlay&&a.overlay.destroy();a.uiDialog.hide();a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");
a.uiDialog.remove();a.originalTitle&&a.element.attr("title",a.originalTitle);return a},widget:function(){return this.uiDialog},close:function(a){var b=this,d,e;if(false!==b._trigger("beforeClose",a)){b.overlay&&b.overlay.destroy();b.uiDialog.unbind("keypress.ui-dialog");b._isOpen=false;if(b.options.hide)b.uiDialog.hide(b.options.hide,function(){b._trigger("close",a)});else{b.uiDialog.hide();b._trigger("close",a)}c.ui.dialog.overlay.resize();if(b.options.modal){d=0;c(".ui-dialog").each(function(){if(this!==
b.uiDialog[0]){e=c(this).css("z-index");isNaN(e)||(d=Math.max(d,e))}});c.ui.dialog.maxZ=d}return b}},isOpen:function(){return this._isOpen},moveToTop:function(a,b){var d=this,e=d.options;if(e.modal&&!a||!e.stack&&!e.modal)return d._trigger("focus",b);if(e.zIndex>c.ui.dialog.maxZ)c.ui.dialog.maxZ=e.zIndex;if(d.overlay){c.ui.dialog.maxZ+=1;d.overlay.$el.css("z-index",c.ui.dialog.overlay.maxZ=c.ui.dialog.maxZ)}a={scrollTop:d.element.scrollTop(),scrollLeft:d.element.scrollLeft()};c.ui.dialog.maxZ+=1;
d.uiDialog.css("z-index",c.ui.dialog.maxZ);d.element.attr(a);d._trigger("focus",b);return d},open:function(){if(!this._isOpen){var a=this,b=a.options,d=a.uiDialog;a.overlay=b.modal?new c.ui.dialog.overlay(a):null;a._size();a._position(b.position);d.show(b.show);a.moveToTop(true);b.modal&&d.bind("keypress.ui-dialog",function(e){if(e.keyCode===c.ui.keyCode.TAB){var g=c(":tabbable",this),f=g.filter(":first");g=g.filter(":last");if(e.target===g[0]&&!e.shiftKey){f.focus(1);return false}else if(e.target===
f[0]&&e.shiftKey){g.focus(1);return false}}});c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();a._isOpen=true;a._trigger("open");return a}},_createButtons:function(a){var b=this,d=false,e=c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);b.uiDialog.find(".ui-dialog-buttonpane").remove();typeof a==="object"&&a!==null&&c.each(a,
function(){return!(d=true)});if(d){c.each(a,function(f,h){h=c.isFunction(h)?{click:h,text:f}:h;var i=c('<button type="button"></button>').click(function(){h.click.apply(b.element[0],arguments)}).appendTo(g);c.each(h,function(j,k){if(j!=="click")j in o?i[j](k):i.attr(j,k)});c.fn.button&&i.button()});e.appendTo(b.uiDialog)}},_makeDraggable:function(){function a(f){return{position:f.position,offset:f.offset}}var b=this,d=b.options,e=c(document),g;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",
handle:".ui-dialog-titlebar",containment:"document",start:function(f,h){g=d.height==="auto"?"auto":c(this).height();c(this).height(c(this).height()).addClass("ui-dialog-dragging");b._trigger("dragStart",f,a(h))},drag:function(f,h){b._trigger("drag",f,a(h))},stop:function(f,h){d.position=[h.position.left-e.scrollLeft(),h.position.top-e.scrollTop()];c(this).removeClass("ui-dialog-dragging").height(g);b._trigger("dragStop",f,a(h));c.ui.dialog.overlay.resize()}})},_makeResizable:function(a){function b(f){return{originalPosition:f.originalPosition,
originalSize:f.originalSize,position:f.position,size:f.size}}a=a===l?this.options.resizable:a;var d=this,e=d.options,g=d.uiDialog.css("position");a=typeof a==="string"?a:"n,e,s,w,se,sw,ne,nw";d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:a,start:function(f,h){c(this).addClass("ui-dialog-resizing");d._trigger("resizeStart",f,b(h))},resize:function(f,h){d._trigger("resize",
f,b(h))},stop:function(f,h){c(this).removeClass("ui-dialog-resizing");e.height=c(this).height();e.width=c(this).width();d._trigger("resizeStop",f,b(h));c.ui.dialog.overlay.resize()}}).css("position",g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(a){var b=[],d=[0,0],e;if(a){if(typeof a==="string"||typeof a==="object"&&"0"in a){b=a.split?a.split(" "):
[a[0],a[1]];if(b.length===1)b[1]=b[0];c.each(["left","top"],function(g,f){if(+b[g]===b[g]){d[g]=b[g];b[g]=f}});a={my:b.join(" "),at:b.join(" "),offset:d.join(" ")}}a=c.extend({},c.ui.dialog.prototype.options.position,a)}else a=c.ui.dialog.prototype.options.position;(e=this.uiDialog.is(":visible"))||this.uiDialog.show();this.uiDialog.css({top:0,left:0}).position(c.extend({of:window},a));e||this.uiDialog.hide()},_setOptions:function(a){var b=this,d={},e=false;c.each(a,function(g,f){b._setOption(g,f);
if(g in m)e=true;if(g in n)d[g]=f});e&&this._size();this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",d)},_setOption:function(a,b){var d=this,e=d.uiDialog;switch(a){case "beforeclose":a="beforeClose";break;case "buttons":d._createButtons(b);break;case "closeText":d.uiDialogTitlebarCloseText.text(""+b);break;case "dialogClass":e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b);break;case "disabled":b?e.addClass("ui-dialog-disabled"):
e.removeClass("ui-dialog-disabled");break;case "draggable":var g=e.is(":data(draggable)");g&&!b&&e.draggable("destroy");!g&&b&&d._makeDraggable();break;case "position":d._position(b);break;case "resizable":(g=e.is(":data(resizable)"))&&!b&&e.resizable("destroy");g&&typeof b==="string"&&e.resizable("option","handles",b);!g&&b!==false&&d._makeResizable(b);break;case "title":c(".ui-dialog-title",d.uiDialogTitlebar).html(""+(b||"&#160;"));break}c.Widget.prototype._setOption.apply(d,arguments)},_size:function(){var a=
this.options,b,d,e=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0});if(a.minWidth>a.width)a.width=a.minWidth;b=this.uiDialog.css({height:"auto",width:a.width}).height();d=Math.max(0,a.minHeight-b);if(a.height==="auto")if(c.support.minHeight)this.element.css({minHeight:d,height:"auto"});else{this.uiDialog.show();a=this.element.css("height","auto").height();e||this.uiDialog.hide();this.element.height(Math.max(a,d))}else this.element.height(Math.max(a.height-
b,0));this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}});c.extend(c.ui.dialog,{version:"1.8.16",uuid:0,maxZ:0,getTitleId:function(a){a=a.attr("id");if(!a){this.uuid+=1;a=this.uuid}return"ui-dialog-title-"+a},overlay:function(a){this.$el=c.ui.dialog.overlay.create(a)}});c.extend(c.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),
create:function(a){if(this.instances.length===0){setTimeout(function(){c.ui.dialog.overlay.instances.length&&c(document).bind(c.ui.dialog.overlay.events,function(d){if(c(d.target).zIndex()<c.ui.dialog.overlay.maxZ)return false})},1);c(document).bind("keydown.dialog-overlay",function(d){if(a.options.closeOnEscape&&!d.isDefaultPrevented()&&d.keyCode&&d.keyCode===c.ui.keyCode.ESCAPE){a.close(d);d.preventDefault()}});c(window).bind("resize.dialog-overlay",c.ui.dialog.overlay.resize)}var b=(this.oldInstances.pop()||
c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});c.fn.bgiframe&&b.bgiframe();this.instances.push(b);return b},destroy:function(a){var b=c.inArray(a,this.instances);b!=-1&&this.oldInstances.push(this.instances.splice(b,1)[0]);this.instances.length===0&&c([document,window]).unbind(".dialog-overlay");a.remove();var d=0;c.each(this.instances,function(){d=Math.max(d,this.css("z-index"))});this.maxZ=d},height:function(){var a,b;if(c.browser.msie&&
c.browser.version<7){a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);b=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return a<b?c(window).height()+"px":a+"px"}else return c(document).height()+"px"},width:function(){var a,b;if(c.browser.msie){a=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);b=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return a<b?c(window).width()+"px":a+"px"}else return c(document).width()+
"px"},resize:function(){var a=c([]);c.each(c.ui.dialog.overlay.instances,function(){a=a.add(this)});a.css({width:0,height:0}).css({width:c.ui.dialog.overlay.width(),height:c.ui.dialog.overlay.height()})}});c.extend(c.ui.dialog.overlay.prototype,{destroy:function(){c.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);
;/*
 * jQuery UI Slider 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.slider",d.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var a=this,b=this.options,c=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),f=b.values&&b.values.length||1,e=[];this._mouseSliding=this._keySliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+
this.orientation+" ui-widget ui-widget-content ui-corner-all"+(b.disabled?" ui-slider-disabled ui-disabled":""));this.range=d([]);if(b.range){if(b.range===true){if(!b.values)b.values=[this._valueMin(),this._valueMin()];if(b.values.length&&b.values.length!==2)b.values=[b.values[0],b.values[0]]}this.range=d("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(b.range==="min"||b.range==="max"?" ui-slider-range-"+b.range:""))}for(var j=c.length;j<f;j+=1)e.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
this.handles=c.add(d(e.join("")).appendTo(a.element));this.handle=this.handles.eq(0);this.handles.add(this.range).filter("a").click(function(g){g.preventDefault()}).hover(function(){b.disabled||d(this).addClass("ui-state-hover")},function(){d(this).removeClass("ui-state-hover")}).focus(function(){if(b.disabled)d(this).blur();else{d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");d(this).addClass("ui-state-focus")}}).blur(function(){d(this).removeClass("ui-state-focus")});this.handles.each(function(g){d(this).data("index.ui-slider-handle",
g)});this.handles.keydown(function(g){var k=true,l=d(this).data("index.ui-slider-handle"),i,h,m;if(!a.options.disabled){switch(g.keyCode){case d.ui.keyCode.HOME:case d.ui.keyCode.END:case d.ui.keyCode.PAGE_UP:case d.ui.keyCode.PAGE_DOWN:case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:k=false;if(!a._keySliding){a._keySliding=true;d(this).addClass("ui-state-active");i=a._start(g,l);if(i===false)return}break}m=a.options.step;i=a.options.values&&a.options.values.length?
(h=a.values(l)):(h=a.value());switch(g.keyCode){case d.ui.keyCode.HOME:h=a._valueMin();break;case d.ui.keyCode.END:h=a._valueMax();break;case d.ui.keyCode.PAGE_UP:h=a._trimAlignValue(i+(a._valueMax()-a._valueMin())/5);break;case d.ui.keyCode.PAGE_DOWN:h=a._trimAlignValue(i-(a._valueMax()-a._valueMin())/5);break;case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:if(i===a._valueMax())return;h=a._trimAlignValue(i+m);break;case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:if(i===a._valueMin())return;h=a._trimAlignValue(i-
m);break}a._slide(g,l,h);return k}}).keyup(function(g){var k=d(this).data("index.ui-slider-handle");if(a._keySliding){a._keySliding=false;a._stop(g,k);a._change(g,k);d(this).removeClass("ui-state-active")}});this._refreshValue();this._animateOff=false},destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");this._mouseDestroy();
return this},_mouseCapture:function(a){var b=this.options,c,f,e,j,g;if(b.disabled)return false;this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();c=this._normValueFromMouse({x:a.pageX,y:a.pageY});f=this._valueMax()-this._valueMin()+1;j=this;this.handles.each(function(k){var l=Math.abs(c-j.values(k));if(f>l){f=l;e=d(this);g=k}});if(b.range===true&&this.values(1)===b.min){g+=1;e=d(this.handles[g])}if(this._start(a,g)===false)return false;
this._mouseSliding=true;j._handleIndex=g;e.addClass("ui-state-active").focus();b=e.offset();this._clickOffset=!d(a.target).parents().andSelf().is(".ui-slider-handle")?{left:0,top:0}:{left:a.pageX-b.left-e.width()/2,top:a.pageY-b.top-e.height()/2-(parseInt(e.css("borderTopWidth"),10)||0)-(parseInt(e.css("borderBottomWidth"),10)||0)+(parseInt(e.css("marginTop"),10)||0)};this.handles.hasClass("ui-state-hover")||this._slide(a,g,c);return this._animateOff=true},_mouseStart:function(){return true},_mouseDrag:function(a){var b=
this._normValueFromMouse({x:a.pageX,y:a.pageY});this._slide(a,this._handleIndex,b);return false},_mouseStop:function(a){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(a,this._handleIndex);this._change(a,this._handleIndex);this._clickOffset=this._handleIndex=null;return this._animateOff=false},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(a){var b;if(this.orientation==="horizontal"){b=
this.elementSize.width;a=a.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{b=this.elementSize.height;a=a.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}b=a/b;if(b>1)b=1;if(b<0)b=0;if(this.orientation==="vertical")b=1-b;a=this._valueMax()-this._valueMin();return this._trimAlignValue(this._valueMin()+b*a)},_start:function(a,b){var c={handle:this.handles[b],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(b);
c.values=this.values()}return this._trigger("start",a,c)},_slide:function(a,b,c){var f;if(this.options.values&&this.options.values.length){f=this.values(b?0:1);if(this.options.values.length===2&&this.options.range===true&&(b===0&&c>f||b===1&&c<f))c=f;if(c!==this.values(b)){f=this.values();f[b]=c;a=this._trigger("slide",a,{handle:this.handles[b],value:c,values:f});this.values(b?0:1);a!==false&&this.values(b,c,true)}}else if(c!==this.value()){a=this._trigger("slide",a,{handle:this.handles[b],value:c});
a!==false&&this.value(c)}},_stop:function(a,b){var c={handle:this.handles[b],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(b);c.values=this.values()}this._trigger("stop",a,c)},_change:function(a,b){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[b],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(b);c.values=this.values()}this._trigger("change",a,c)}},value:function(a){if(arguments.length){this.options.value=
this._trimAlignValue(a);this._refreshValue();this._change(null,0)}else return this._value()},values:function(a,b){var c,f,e;if(arguments.length>1){this.options.values[a]=this._trimAlignValue(b);this._refreshValue();this._change(null,a)}else if(arguments.length)if(d.isArray(arguments[0])){c=this.options.values;f=arguments[0];for(e=0;e<c.length;e+=1){c[e]=this._trimAlignValue(f[e]);this._change(null,e)}this._refreshValue()}else return this.options.values&&this.options.values.length?this._values(a):
this.value();else return this._values()},_setOption:function(a,b){var c,f=0;if(d.isArray(this.options.values))f=this.options.values.length;d.Widget.prototype._setOption.apply(this,arguments);switch(a){case "disabled":if(b){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.propAttr("disabled",true);this.element.addClass("ui-disabled")}else{this.handles.propAttr("disabled",false);this.element.removeClass("ui-disabled")}break;case "orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case "value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case "values":this._animateOff=true;this._refreshValue();for(c=0;c<f;c+=1)this._change(null,c);this._animateOff=false;break}},_value:function(){var a=this.options.value;return a=this._trimAlignValue(a)},_values:function(a){var b,c;if(arguments.length){b=this.options.values[a];
return b=this._trimAlignValue(b)}else{b=this.options.values.slice();for(c=0;c<b.length;c+=1)b[c]=this._trimAlignValue(b[c]);return b}},_trimAlignValue:function(a){if(a<=this._valueMin())return this._valueMin();if(a>=this._valueMax())return this._valueMax();var b=this.options.step>0?this.options.step:1,c=(a-this._valueMin())%b;a=a-c;if(Math.abs(c)*2>=b)a+=c>0?b:-b;return parseFloat(a.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var a=
this.options.range,b=this.options,c=this,f=!this._animateOff?b.animate:false,e,j={},g,k,l,i;if(this.options.values&&this.options.values.length)this.handles.each(function(h){e=(c.values(h)-c._valueMin())/(c._valueMax()-c._valueMin())*100;j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";d(this).stop(1,1)[f?"animate":"css"](j,b.animate);if(c.options.range===true)if(c.orientation==="horizontal"){if(h===0)c.range.stop(1,1)[f?"animate":"css"]({left:e+"%"},b.animate);if(h===1)c.range[f?"animate":"css"]({width:e-
g+"%"},{queue:false,duration:b.animate})}else{if(h===0)c.range.stop(1,1)[f?"animate":"css"]({bottom:e+"%"},b.animate);if(h===1)c.range[f?"animate":"css"]({height:e-g+"%"},{queue:false,duration:b.animate})}g=e});else{k=this.value();l=this._valueMin();i=this._valueMax();e=i!==l?(k-l)/(i-l)*100:0;j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";this.handle.stop(1,1)[f?"animate":"css"](j,b.animate);if(a==="min"&&this.orientation==="horizontal")this.range.stop(1,1)[f?"animate":"css"]({width:e+"%"},
b.animate);if(a==="max"&&this.orientation==="horizontal")this.range[f?"animate":"css"]({width:100-e+"%"},{queue:false,duration:b.animate});if(a==="min"&&this.orientation==="vertical")this.range.stop(1,1)[f?"animate":"css"]({height:e+"%"},b.animate);if(a==="max"&&this.orientation==="vertical")this.range[f?"animate":"css"]({height:100-e+"%"},{queue:false,duration:b.animate})}}});d.extend(d.ui.slider,{version:"1.8.16"})})(jQuery);
;/*
 * jQuery UI Tabs 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(d,p){function u(){return++v}function w(){return++x}var v=0,x=0;d.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:false,cookie:null,collapsible:false,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(true)},_setOption:function(b,e){if(b=="selected")this.options.collapsible&&
e==this.options.selected||this.select(e);else{this.options[b]=e;this._tabify()}},_tabId:function(b){return b.title&&b.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+u()},_sanitizeSelector:function(b){return b.replace(/:/g,"\\:")},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+w());return d.cookie.apply(null,[b].concat(d.makeArray(arguments)))},_ui:function(b,e){return{tab:b,panel:e,index:this.anchors.index(b)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=
d(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_tabify:function(b){function e(g,f){g.css("display","");!d.support.opacity&&f.opacity&&g[0].style.removeAttribute("filter")}var a=this,c=this.options,h=/^#.+/;this.list=this.element.find("ol,ul").eq(0);this.lis=d(" > li:has(a[href])",this.list);this.anchors=this.lis.map(function(){return d("a",this)[0]});this.panels=d([]);this.anchors.each(function(g,f){var i=d(f).attr("href"),l=i.split("#")[0],q;if(l&&(l===location.toString().split("#")[0]||
(q=d("base")[0])&&l===q.href)){i=f.hash;f.href=i}if(h.test(i))a.panels=a.panels.add(a.element.find(a._sanitizeSelector(i)));else if(i&&i!=="#"){d.data(f,"href.tabs",i);d.data(f,"load.tabs",i.replace(/#.*$/,""));i=a._tabId(f);f.href="#"+i;f=a.element.find("#"+i);if(!f.length){f=d(c.panelTemplate).attr("id",i).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(a.panels[g-1]||a.list);f.data("destroy.tabs",true)}a.panels=a.panels.add(f)}else c.disabled.push(g)});if(b){this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.lis.addClass("ui-state-default ui-corner-top");this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");if(c.selected===p){location.hash&&this.anchors.each(function(g,f){if(f.hash==location.hash){c.selected=g;return false}});if(typeof c.selected!=="number"&&c.cookie)c.selected=parseInt(a._cookie(),10);if(typeof c.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length)c.selected=
this.lis.index(this.lis.filter(".ui-tabs-selected"));c.selected=c.selected||(this.lis.length?0:-1)}else if(c.selected===null)c.selected=-1;c.selected=c.selected>=0&&this.anchors[c.selected]||c.selected<0?c.selected:0;c.disabled=d.unique(c.disabled.concat(d.map(this.lis.filter(".ui-state-disabled"),function(g){return a.lis.index(g)}))).sort();d.inArray(c.selected,c.disabled)!=-1&&c.disabled.splice(d.inArray(c.selected,c.disabled),1);this.panels.addClass("ui-tabs-hide");this.lis.removeClass("ui-tabs-selected ui-state-active");
if(c.selected>=0&&this.anchors.length){a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash)).removeClass("ui-tabs-hide");this.lis.eq(c.selected).addClass("ui-tabs-selected ui-state-active");a.element.queue("tabs",function(){a._trigger("show",null,a._ui(a.anchors[c.selected],a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash))[0]))});this.load(c.selected)}d(window).bind("unload",function(){a.lis.add(a.anchors).unbind(".tabs");a.lis=a.anchors=a.panels=null})}else c.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));
this.element[c.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");c.cookie&&this._cookie(c.selected,c.cookie);b=0;for(var j;j=this.lis[b];b++)d(j)[d.inArray(b,c.disabled)!=-1&&!d(j).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");c.cache===false&&this.anchors.removeData("cache.tabs");this.lis.add(this.anchors).unbind(".tabs");if(c.event!=="mouseover"){var k=function(g,f){f.is(":not(.ui-state-disabled)")&&f.addClass("ui-state-"+g)},n=function(g,f){f.removeClass("ui-state-"+
g)};this.lis.bind("mouseover.tabs",function(){k("hover",d(this))});this.lis.bind("mouseout.tabs",function(){n("hover",d(this))});this.anchors.bind("focus.tabs",function(){k("focus",d(this).closest("li"))});this.anchors.bind("blur.tabs",function(){n("focus",d(this).closest("li"))})}var m,o;if(c.fx)if(d.isArray(c.fx)){m=c.fx[0];o=c.fx[1]}else m=o=c.fx;var r=o?function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.hide().removeClass("ui-tabs-hide").animate(o,o.duration||"normal",
function(){e(f,o);a._trigger("show",null,a._ui(g,f[0]))})}:function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.removeClass("ui-tabs-hide");a._trigger("show",null,a._ui(g,f[0]))},s=m?function(g,f){f.animate(m,m.duration||"normal",function(){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");e(f,m);a.element.dequeue("tabs")})}:function(g,f){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");a.element.dequeue("tabs")};
this.anchors.bind(c.event+".tabs",function(){var g=this,f=d(g).closest("li"),i=a.panels.filter(":not(.ui-tabs-hide)"),l=a.element.find(a._sanitizeSelector(g.hash));if(f.hasClass("ui-tabs-selected")&&!c.collapsible||f.hasClass("ui-state-disabled")||f.hasClass("ui-state-processing")||a.panels.filter(":animated").length||a._trigger("select",null,a._ui(this,l[0]))===false){this.blur();return false}c.selected=a.anchors.index(this);a.abort();if(c.collapsible)if(f.hasClass("ui-tabs-selected")){c.selected=
-1;c.cookie&&a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){s(g,i)}).dequeue("tabs");this.blur();return false}else if(!i.length){c.cookie&&a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this));this.blur();return false}c.cookie&&a._cookie(c.selected,c.cookie);if(l.length){i.length&&a.element.queue("tabs",function(){s(g,i)});a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this))}else throw"jQuery UI Tabs: Mismatching fragment identifier.";
d.browser.msie&&this.blur()});this.anchors.bind("click.tabs",function(){return false})},_getIndex:function(b){if(typeof b=="string")b=this.anchors.index(this.anchors.filter("[href$="+b+"]"));return b},destroy:function(){var b=this.options;this.abort();this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.anchors.each(function(){var e=
d.data(this,"href.tabs");if(e)this.href=e;var a=d(this).unbind(".tabs");d.each(["href","load","cache"],function(c,h){a.removeData(h+".tabs")})});this.lis.unbind(".tabs").add(this.panels).each(function(){d.data(this,"destroy.tabs")?d(this).remove():d(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide")});b.cookie&&this._cookie(null,b.cookie);return this},add:function(b,
e,a){if(a===p)a=this.anchors.length;var c=this,h=this.options;e=d(h.tabTemplate.replace(/#\{href\}/g,b).replace(/#\{label\}/g,e));b=!b.indexOf("#")?b.replace("#",""):this._tabId(d("a",e)[0]);e.addClass("ui-state-default ui-corner-top").data("destroy.tabs",true);var j=c.element.find("#"+b);j.length||(j=d(h.panelTemplate).attr("id",b).data("destroy.tabs",true));j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");if(a>=this.lis.length){e.appendTo(this.list);j.appendTo(this.list[0].parentNode)}else{e.insertBefore(this.lis[a]);
j.insertBefore(this.panels[a])}h.disabled=d.map(h.disabled,function(k){return k>=a?++k:k});this._tabify();if(this.anchors.length==1){h.selected=0;e.addClass("ui-tabs-selected ui-state-active");j.removeClass("ui-tabs-hide");this.element.queue("tabs",function(){c._trigger("show",null,c._ui(c.anchors[0],c.panels[0]))});this.load(0)}this._trigger("add",null,this._ui(this.anchors[a],this.panels[a]));return this},remove:function(b){b=this._getIndex(b);var e=this.options,a=this.lis.eq(b).remove(),c=this.panels.eq(b).remove();
if(a.hasClass("ui-tabs-selected")&&this.anchors.length>1)this.select(b+(b+1<this.anchors.length?1:-1));e.disabled=d.map(d.grep(e.disabled,function(h){return h!=b}),function(h){return h>=b?--h:h});this._tabify();this._trigger("remove",null,this._ui(a.find("a")[0],c[0]));return this},enable:function(b){b=this._getIndex(b);var e=this.options;if(d.inArray(b,e.disabled)!=-1){this.lis.eq(b).removeClass("ui-state-disabled");e.disabled=d.grep(e.disabled,function(a){return a!=b});this._trigger("enable",null,
this._ui(this.anchors[b],this.panels[b]));return this}},disable:function(b){b=this._getIndex(b);var e=this.options;if(b!=e.selected){this.lis.eq(b).addClass("ui-state-disabled");e.disabled.push(b);e.disabled.sort();this._trigger("disable",null,this._ui(this.anchors[b],this.panels[b]))}return this},select:function(b){b=this._getIndex(b);if(b==-1)if(this.options.collapsible&&this.options.selected!=-1)b=this.options.selected;else return this;this.anchors.eq(b).trigger(this.options.event+".tabs");return this},
load:function(b){b=this._getIndex(b);var e=this,a=this.options,c=this.anchors.eq(b)[0],h=d.data(c,"load.tabs");this.abort();if(!h||this.element.queue("tabs").length!==0&&d.data(c,"cache.tabs"))this.element.dequeue("tabs");else{this.lis.eq(b).addClass("ui-state-processing");if(a.spinner){var j=d("span",c);j.data("label.tabs",j.html()).html(a.spinner)}this.xhr=d.ajax(d.extend({},a.ajaxOptions,{url:h,success:function(k,n){e.element.find(e._sanitizeSelector(c.hash)).html(k);e._cleanup();a.cache&&d.data(c,
"cache.tabs",true);e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.success(k,n)}catch(m){}},error:function(k,n){e._cleanup();e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.error(k,n,b,c)}catch(m){}}}));e.element.dequeue("tabs");return this}},abort:function(){this.element.queue([]);this.panels.stop(false,true);this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));if(this.xhr){this.xhr.abort();delete this.xhr}this._cleanup();return this},
url:function(b,e){this.anchors.eq(b).removeData("cache.tabs").data("load.tabs",e);return this},length:function(){return this.anchors.length}});d.extend(d.ui.tabs,{version:"1.8.16"});d.extend(d.ui.tabs.prototype,{rotation:null,rotate:function(b,e){var a=this,c=this.options,h=a._rotate||(a._rotate=function(j){clearTimeout(a.rotation);a.rotation=setTimeout(function(){var k=c.selected;a.select(++k<a.anchors.length?k:0)},b);j&&j.stopPropagation()});e=a._unrotate||(a._unrotate=!e?function(j){j.clientX&&
a.rotate(null)}:function(){t=c.selected;h()});if(b){this.element.bind("tabsshow",h);this.anchors.bind(c.event+".tabs",e);h()}else{clearTimeout(a.rotation);this.element.unbind("tabsshow",h);this.anchors.unbind(c.event+".tabs",e);delete this._rotate;delete this._unrotate}return this}})})(jQuery);
;/*
 * jQuery UI Datepicker 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	jquery.ui.core.js
 */
(function(d,C){function M(){this.debug=false;this._curInst=null;this._keyEvent=false;this._disabledInputs=[];this._inDialog=this._datepickerShowing=false;this._mainDivId="ui-datepicker-div";this._inlineClass="ui-datepicker-inline";this._appendClass="ui-datepicker-append";this._triggerClass="ui-datepicker-trigger";this._dialogClass="ui-datepicker-dialog";this._disableClass="ui-datepicker-disabled";this._unselectableClass="ui-datepicker-unselectable";this._currentClass="ui-datepicker-current-day";this._dayOverClass=
"ui-datepicker-days-cell-over";this.regional=[];this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su",
"Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:""};this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,hideIfNoPrevNext:false,navigationAsDateFormat:false,gotoCurrent:false,changeMonth:false,changeYear:false,yearRange:"c-10:c+10",showOtherMonths:false,selectOtherMonths:false,showWeek:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",
minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:true,showButtonPanel:false,autoSize:false,disabled:false};d.extend(this._defaults,this.regional[""]);this.dpDiv=N(d('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}function N(a){return a.bind("mouseout",
function(b){b=d(b.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");b.length&&b.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")}).bind("mouseover",function(b){b=d(b.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");if(!(d.datepicker._isDisabledDatepicker(J.inline?a.parent()[0]:J.input[0])||!b.length)){b.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
b.addClass("ui-state-hover");b.hasClass("ui-datepicker-prev")&&b.addClass("ui-datepicker-prev-hover");b.hasClass("ui-datepicker-next")&&b.addClass("ui-datepicker-next-hover")}})}function H(a,b){d.extend(a,b);for(var c in b)if(b[c]==null||b[c]==C)a[c]=b[c];return a}d.extend(d.ui,{datepicker:{version:"1.8.16"}});var B=(new Date).getTime(),J;d.extend(M.prototype,{markerClassName:"hasDatepicker",maxRows:4,log:function(){this.debug&&console.log.apply("",arguments)},_widgetDatepicker:function(){return this.dpDiv},
setDefaults:function(a){H(this._defaults,a||{});return this},_attachDatepicker:function(a,b){var c=null;for(var e in this._defaults){var f=a.getAttribute("date:"+e);if(f){c=c||{};try{c[e]=eval(f)}catch(h){c[e]=f}}}e=a.nodeName.toLowerCase();f=e=="div"||e=="span";if(!a.id){this.uuid+=1;a.id="dp"+this.uuid}var i=this._newInst(d(a),f);i.settings=d.extend({},b||{},c||{});if(e=="input")this._connectDatepicker(a,i);else f&&this._inlineDatepicker(a,i)},_newInst:function(a,b){return{id:a[0].id.replace(/([^A-Za-z0-9_-])/g,
"\\\\$1"),input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:b,dpDiv:!b?this.dpDiv:N(d('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}},_connectDatepicker:function(a,b){var c=d(a);b.append=d([]);b.trigger=d([]);if(!c.hasClass(this.markerClassName)){this._attachments(c,b);c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",
function(e,f,h){b.settings[f]=h}).bind("getData.datepicker",function(e,f){return this._get(b,f)});this._autoSize(b);d.data(a,"datepicker",b);b.settings.disabled&&this._disableDatepicker(a)}},_attachments:function(a,b){var c=this._get(b,"appendText"),e=this._get(b,"isRTL");b.append&&b.append.remove();if(c){b.append=d('<span class="'+this._appendClass+'">'+c+"</span>");a[e?"before":"after"](b.append)}a.unbind("focus",this._showDatepicker);b.trigger&&b.trigger.remove();c=this._get(b,"showOn");if(c==
"focus"||c=="both")a.focus(this._showDatepicker);if(c=="button"||c=="both"){c=this._get(b,"buttonText");var f=this._get(b,"buttonImage");b.trigger=d(this._get(b,"buttonImageOnly")?d("<img/>").addClass(this._triggerClass).attr({src:f,alt:c,title:c}):d('<button type="button"></button>').addClass(this._triggerClass).html(f==""?c:d("<img/>").attr({src:f,alt:c,title:c})));a[e?"before":"after"](b.trigger);b.trigger.click(function(){d.datepicker._datepickerShowing&&d.datepicker._lastInput==a[0]?d.datepicker._hideDatepicker():
d.datepicker._showDatepicker(a[0]);return false})}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var b=new Date(2009,11,20),c=this._get(a,"dateFormat");if(c.match(/[DM]/)){var e=function(f){for(var h=0,i=0,g=0;g<f.length;g++)if(f[g].length>h){h=f[g].length;i=g}return i};b.setMonth(e(this._get(a,c.match(/MM/)?"monthNames":"monthNamesShort")));b.setDate(e(this._get(a,c.match(/DD/)?"dayNames":"dayNamesShort"))+20-b.getDay())}a.input.attr("size",this._formatDate(a,b).length)}},_inlineDatepicker:function(a,
b){var c=d(a);if(!c.hasClass(this.markerClassName)){c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",function(e,f,h){b.settings[f]=h}).bind("getData.datepicker",function(e,f){return this._get(b,f)});d.data(a,"datepicker",b);this._setDate(b,this._getDefaultDate(b),true);this._updateDatepicker(b);this._updateAlternate(b);b.settings.disabled&&this._disableDatepicker(a);b.dpDiv.css("display","block")}},_dialogDatepicker:function(a,b,c,e,f){a=this._dialogInst;if(!a){this.uuid+=
1;this._dialogInput=d('<input type="text" id="'+("dp"+this.uuid)+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');this._dialogInput.keydown(this._doKeyDown);d("body").append(this._dialogInput);a=this._dialogInst=this._newInst(this._dialogInput,false);a.settings={};d.data(this._dialogInput[0],"datepicker",a)}H(a.settings,e||{});b=b&&b.constructor==Date?this._formatDate(a,b):b;this._dialogInput.val(b);this._pos=f?f.length?f:[f.pageX,f.pageY]:null;if(!this._pos)this._pos=[document.documentElement.clientWidth/
2-100+(document.documentElement.scrollLeft||document.body.scrollLeft),document.documentElement.clientHeight/2-150+(document.documentElement.scrollTop||document.body.scrollTop)];this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px");a.settings.onSelect=c;this._inDialog=true;this.dpDiv.addClass(this._dialogClass);this._showDatepicker(this._dialogInput[0]);d.blockUI&&d.blockUI(this.dpDiv);d.data(this._dialogInput[0],"datepicker",a);return this},_destroyDatepicker:function(a){var b=
d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();d.removeData(a,"datepicker");if(e=="input"){c.append.remove();c.trigger.remove();b.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)}else if(e=="div"||e=="span")b.removeClass(this.markerClassName).empty()}},_enableDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=
a.nodeName.toLowerCase();if(e=="input"){a.disabled=false;c.trigger.filter("button").each(function(){this.disabled=false}).end().filter("img").css({opacity:"1.0",cursor:""})}else if(e=="div"||e=="span"){b=b.children("."+this._inlineClass);b.children().removeClass("ui-state-disabled");b.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")}this._disabledInputs=d.map(this._disabledInputs,function(f){return f==a?null:f})}},_disableDatepicker:function(a){var b=d(a),c=d.data(a,
"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();if(e=="input"){a.disabled=true;c.trigger.filter("button").each(function(){this.disabled=true}).end().filter("img").css({opacity:"0.5",cursor:"default"})}else if(e=="div"||e=="span"){b=b.children("."+this._inlineClass);b.children().addClass("ui-state-disabled");b.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled","disabled")}this._disabledInputs=d.map(this._disabledInputs,function(f){return f==
a?null:f});this._disabledInputs[this._disabledInputs.length]=a}},_isDisabledDatepicker:function(a){if(!a)return false;for(var b=0;b<this._disabledInputs.length;b++)if(this._disabledInputs[b]==a)return true;return false},_getInst:function(a){try{return d.data(a,"datepicker")}catch(b){throw"Missing instance data for this datepicker";}},_optionDatepicker:function(a,b,c){var e=this._getInst(a);if(arguments.length==2&&typeof b=="string")return b=="defaults"?d.extend({},d.datepicker._defaults):e?b=="all"?
d.extend({},e.settings):this._get(e,b):null;var f=b||{};if(typeof b=="string"){f={};f[b]=c}if(e){this._curInst==e&&this._hideDatepicker();var h=this._getDateDatepicker(a,true),i=this._getMinMaxDate(e,"min"),g=this._getMinMaxDate(e,"max");H(e.settings,f);if(i!==null&&f.dateFormat!==C&&f.minDate===C)e.settings.minDate=this._formatDate(e,i);if(g!==null&&f.dateFormat!==C&&f.maxDate===C)e.settings.maxDate=this._formatDate(e,g);this._attachments(d(a),e);this._autoSize(e);this._setDate(e,h);this._updateAlternate(e);
this._updateDatepicker(e)}},_changeDatepicker:function(a,b,c){this._optionDatepicker(a,b,c)},_refreshDatepicker:function(a){(a=this._getInst(a))&&this._updateDatepicker(a)},_setDateDatepicker:function(a,b){if(a=this._getInst(a)){this._setDate(a,b);this._updateDatepicker(a);this._updateAlternate(a)}},_getDateDatepicker:function(a,b){(a=this._getInst(a))&&!a.inline&&this._setDateFromField(a,b);return a?this._getDate(a):null},_doKeyDown:function(a){var b=d.datepicker._getInst(a.target),c=true,e=b.dpDiv.is(".ui-datepicker-rtl");
b._keyEvent=true;if(d.datepicker._datepickerShowing)switch(a.keyCode){case 9:d.datepicker._hideDatepicker();c=false;break;case 13:c=d("td."+d.datepicker._dayOverClass+":not(."+d.datepicker._currentClass+")",b.dpDiv);c[0]&&d.datepicker._selectDay(a.target,b.selectedMonth,b.selectedYear,c[0]);if(a=d.datepicker._get(b,"onSelect")){c=d.datepicker._formatDate(b);a.apply(b.input?b.input[0]:null,[c,b])}else d.datepicker._hideDatepicker();return false;case 27:d.datepicker._hideDatepicker();break;case 33:d.datepicker._adjustDate(a.target,
a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");break;case 34:d.datepicker._adjustDate(a.target,a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,"stepMonths"),"M");break;case 35:if(a.ctrlKey||a.metaKey)d.datepicker._clearDate(a.target);c=a.ctrlKey||a.metaKey;break;case 36:if(a.ctrlKey||a.metaKey)d.datepicker._gotoToday(a.target);c=a.ctrlKey||a.metaKey;break;case 37:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,e?+1:-1,"D");c=
a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)d.datepicker._adjustDate(a.target,a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");break;case 38:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,-7,"D");c=a.ctrlKey||a.metaKey;break;case 39:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,e?-1:+1,"D");c=a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)d.datepicker._adjustDate(a.target,a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,
"stepMonths"),"M");break;case 40:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,+7,"D");c=a.ctrlKey||a.metaKey;break;default:c=false}else if(a.keyCode==36&&a.ctrlKey)d.datepicker._showDatepicker(this);else c=false;if(c){a.preventDefault();a.stopPropagation()}},_doKeyPress:function(a){var b=d.datepicker._getInst(a.target);if(d.datepicker._get(b,"constrainInput")){b=d.datepicker._possibleChars(d.datepicker._get(b,"dateFormat"));var c=String.fromCharCode(a.charCode==C?a.keyCode:a.charCode);
return a.ctrlKey||a.metaKey||c<" "||!b||b.indexOf(c)>-1}},_doKeyUp:function(a){a=d.datepicker._getInst(a.target);if(a.input.val()!=a.lastVal)try{if(d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,d.datepicker._getFormatConfig(a))){d.datepicker._setDateFromField(a);d.datepicker._updateAlternate(a);d.datepicker._updateDatepicker(a)}}catch(b){d.datepicker.log(b)}return true},_showDatepicker:function(a){a=a.target||a;if(a.nodeName.toLowerCase()!="input")a=d("input",
a.parentNode)[0];if(!(d.datepicker._isDisabledDatepicker(a)||d.datepicker._lastInput==a)){var b=d.datepicker._getInst(a);if(d.datepicker._curInst&&d.datepicker._curInst!=b){d.datepicker._datepickerShowing&&d.datepicker._triggerOnClose(d.datepicker._curInst);d.datepicker._curInst.dpDiv.stop(true,true)}var c=d.datepicker._get(b,"beforeShow");c=c?c.apply(a,[a,b]):{};if(c!==false){H(b.settings,c);b.lastVal=null;d.datepicker._lastInput=a;d.datepicker._setDateFromField(b);if(d.datepicker._inDialog)a.value=
"";if(!d.datepicker._pos){d.datepicker._pos=d.datepicker._findPos(a);d.datepicker._pos[1]+=a.offsetHeight}var e=false;d(a).parents().each(function(){e|=d(this).css("position")=="fixed";return!e});if(e&&d.browser.opera){d.datepicker._pos[0]-=document.documentElement.scrollLeft;d.datepicker._pos[1]-=document.documentElement.scrollTop}c={left:d.datepicker._pos[0],top:d.datepicker._pos[1]};d.datepicker._pos=null;b.dpDiv.empty();b.dpDiv.css({position:"absolute",display:"block",top:"-1000px"});d.datepicker._updateDatepicker(b);
c=d.datepicker._checkOffset(b,c,e);b.dpDiv.css({position:d.datepicker._inDialog&&d.blockUI?"static":e?"fixed":"absolute",display:"none",left:c.left+"px",top:c.top+"px"});if(!b.inline){c=d.datepicker._get(b,"showAnim");var f=d.datepicker._get(b,"duration"),h=function(){var i=b.dpDiv.find("iframe.ui-datepicker-cover");if(i.length){var g=d.datepicker._getBorders(b.dpDiv);i.css({left:-g[0],top:-g[1],width:b.dpDiv.outerWidth(),height:b.dpDiv.outerHeight()})}};b.dpDiv.zIndex(d(a).zIndex()+1);d.datepicker._datepickerShowing=
true;d.effects&&d.effects[c]?b.dpDiv.show(c,d.datepicker._get(b,"showOptions"),f,h):b.dpDiv[c||"show"](c?f:null,h);if(!c||!f)h();b.input.is(":visible")&&!b.input.is(":disabled")&&b.input.focus();d.datepicker._curInst=b}}}},_updateDatepicker:function(a){this.maxRows=4;var b=d.datepicker._getBorders(a.dpDiv);J=a;a.dpDiv.empty().append(this._generateHTML(a));var c=a.dpDiv.find("iframe.ui-datepicker-cover");c.length&&c.css({left:-b[0],top:-b[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()});
a.dpDiv.find("."+this._dayOverClass+" a").mouseover();b=this._getNumberOfMonths(a);c=b[1];a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");c>1&&a.dpDiv.addClass("ui-datepicker-multi-"+c).css("width",17*c+"em");a.dpDiv[(b[0]!=1||b[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi");a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl");a==d.datepicker._curInst&&d.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&
!a.input.is(":disabled")&&a.input[0]!=document.activeElement&&a.input.focus();if(a.yearshtml){var e=a.yearshtml;setTimeout(function(){e===a.yearshtml&&a.yearshtml&&a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml);e=a.yearshtml=null},0)}},_getBorders:function(a){var b=function(c){return{thin:1,medium:2,thick:3}[c]||c};return[parseFloat(b(a.css("border-left-width"))),parseFloat(b(a.css("border-top-width")))]},_checkOffset:function(a,b,c){var e=a.dpDiv.outerWidth(),f=a.dpDiv.outerHeight(),
h=a.input?a.input.outerWidth():0,i=a.input?a.input.outerHeight():0,g=document.documentElement.clientWidth+d(document).scrollLeft(),j=document.documentElement.clientHeight+d(document).scrollTop();b.left-=this._get(a,"isRTL")?e-h:0;b.left-=c&&b.left==a.input.offset().left?d(document).scrollLeft():0;b.top-=c&&b.top==a.input.offset().top+i?d(document).scrollTop():0;b.left-=Math.min(b.left,b.left+e>g&&g>e?Math.abs(b.left+e-g):0);b.top-=Math.min(b.top,b.top+f>j&&j>f?Math.abs(f+i):0);return b},_findPos:function(a){for(var b=
this._get(this._getInst(a),"isRTL");a&&(a.type=="hidden"||a.nodeType!=1||d.expr.filters.hidden(a));)a=a[b?"previousSibling":"nextSibling"];a=d(a).offset();return[a.left,a.top]},_triggerOnClose:function(a){var b=this._get(a,"onClose");if(b)b.apply(a.input?a.input[0]:null,[a.input?a.input.val():"",a])},_hideDatepicker:function(a){var b=this._curInst;if(!(!b||a&&b!=d.data(a,"datepicker")))if(this._datepickerShowing){a=this._get(b,"showAnim");var c=this._get(b,"duration"),e=function(){d.datepicker._tidyDialog(b);
this._curInst=null};d.effects&&d.effects[a]?b.dpDiv.hide(a,d.datepicker._get(b,"showOptions"),c,e):b.dpDiv[a=="slideDown"?"slideUp":a=="fadeIn"?"fadeOut":"hide"](a?c:null,e);a||e();d.datepicker._triggerOnClose(b);this._datepickerShowing=false;this._lastInput=null;if(this._inDialog){this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});if(d.blockUI){d.unblockUI();d("body").append(this.dpDiv)}}this._inDialog=false}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},
_checkExternalClick:function(a){if(d.datepicker._curInst){a=d(a.target);a[0].id!=d.datepicker._mainDivId&&a.parents("#"+d.datepicker._mainDivId).length==0&&!a.hasClass(d.datepicker.markerClassName)&&!a.hasClass(d.datepicker._triggerClass)&&d.datepicker._datepickerShowing&&!(d.datepicker._inDialog&&d.blockUI)&&d.datepicker._hideDatepicker()}},_adjustDate:function(a,b,c){a=d(a);var e=this._getInst(a[0]);if(!this._isDisabledDatepicker(a[0])){this._adjustInstDate(e,b+(c=="M"?this._get(e,"showCurrentAtPos"):
0),c);this._updateDatepicker(e)}},_gotoToday:function(a){a=d(a);var b=this._getInst(a[0]);if(this._get(b,"gotoCurrent")&&b.currentDay){b.selectedDay=b.currentDay;b.drawMonth=b.selectedMonth=b.currentMonth;b.drawYear=b.selectedYear=b.currentYear}else{var c=new Date;b.selectedDay=c.getDate();b.drawMonth=b.selectedMonth=c.getMonth();b.drawYear=b.selectedYear=c.getFullYear()}this._notifyChange(b);this._adjustDate(a)},_selectMonthYear:function(a,b,c){a=d(a);var e=this._getInst(a[0]);e["selected"+(c=="M"?
"Month":"Year")]=e["draw"+(c=="M"?"Month":"Year")]=parseInt(b.options[b.selectedIndex].value,10);this._notifyChange(e);this._adjustDate(a)},_selectDay:function(a,b,c,e){var f=d(a);if(!(d(e).hasClass(this._unselectableClass)||this._isDisabledDatepicker(f[0]))){f=this._getInst(f[0]);f.selectedDay=f.currentDay=d("a",e).html();f.selectedMonth=f.currentMonth=b;f.selectedYear=f.currentYear=c;this._selectDate(a,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear))}},_clearDate:function(a){a=d(a);
this._getInst(a[0]);this._selectDate(a,"")},_selectDate:function(a,b){a=this._getInst(d(a)[0]);b=b!=null?b:this._formatDate(a);a.input&&a.input.val(b);this._updateAlternate(a);var c=this._get(a,"onSelect");if(c)c.apply(a.input?a.input[0]:null,[b,a]);else a.input&&a.input.trigger("change");if(a.inline)this._updateDatepicker(a);else{this._hideDatepicker();this._lastInput=a.input[0];typeof a.input[0]!="object"&&a.input.focus();this._lastInput=null}},_updateAlternate:function(a){var b=this._get(a,"altField");
if(b){var c=this._get(a,"altFormat")||this._get(a,"dateFormat"),e=this._getDate(a),f=this.formatDate(c,e,this._getFormatConfig(a));d(b).each(function(){d(this).val(f)})}},noWeekends:function(a){a=a.getDay();return[a>0&&a<6,""]},iso8601Week:function(a){a=new Date(a.getTime());a.setDate(a.getDate()+4-(a.getDay()||7));var b=a.getTime();a.setMonth(0);a.setDate(1);return Math.floor(Math.round((b-a)/864E5)/7)+1},parseDate:function(a,b,c){if(a==null||b==null)throw"Invalid arguments";b=typeof b=="object"?
b.toString():b+"";if(b=="")return null;var e=(c?c.shortYearCutoff:null)||this._defaults.shortYearCutoff;e=typeof e!="string"?e:(new Date).getFullYear()%100+parseInt(e,10);for(var f=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,h=(c?c.dayNames:null)||this._defaults.dayNames,i=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,g=(c?c.monthNames:null)||this._defaults.monthNames,j=c=-1,l=-1,u=-1,k=false,o=function(p){(p=A+1<a.length&&a.charAt(A+1)==p)&&A++;return p},m=function(p){var D=
o(p);p=new RegExp("^\\d{1,"+(p=="@"?14:p=="!"?20:p=="y"&&D?4:p=="o"?3:2)+"}");p=b.substring(q).match(p);if(!p)throw"Missing number at position "+q;q+=p[0].length;return parseInt(p[0],10)},n=function(p,D,K){p=d.map(o(p)?K:D,function(w,x){return[[x,w]]}).sort(function(w,x){return-(w[1].length-x[1].length)});var E=-1;d.each(p,function(w,x){w=x[1];if(b.substr(q,w.length).toLowerCase()==w.toLowerCase()){E=x[0];q+=w.length;return false}});if(E!=-1)return E+1;else throw"Unknown name at position "+q;},s=
function(){if(b.charAt(q)!=a.charAt(A))throw"Unexpected literal at position "+q;q++},q=0,A=0;A<a.length;A++)if(k)if(a.charAt(A)=="'"&&!o("'"))k=false;else s();else switch(a.charAt(A)){case "d":l=m("d");break;case "D":n("D",f,h);break;case "o":u=m("o");break;case "m":j=m("m");break;case "M":j=n("M",i,g);break;case "y":c=m("y");break;case "@":var v=new Date(m("@"));c=v.getFullYear();j=v.getMonth()+1;l=v.getDate();break;case "!":v=new Date((m("!")-this._ticksTo1970)/1E4);c=v.getFullYear();j=v.getMonth()+
1;l=v.getDate();break;case "'":if(o("'"))s();else k=true;break;default:s()}if(q<b.length)throw"Extra/unparsed characters found in date: "+b.substring(q);if(c==-1)c=(new Date).getFullYear();else if(c<100)c+=(new Date).getFullYear()-(new Date).getFullYear()%100+(c<=e?0:-100);if(u>-1){j=1;l=u;do{e=this._getDaysInMonth(c,j-1);if(l<=e)break;j++;l-=e}while(1)}v=this._daylightSavingAdjust(new Date(c,j-1,l));if(v.getFullYear()!=c||v.getMonth()+1!=j||v.getDate()!=l)throw"Invalid date";return v},ATOM:"yy-mm-dd",
COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*1E7,formatDate:function(a,b,c){if(!b)return"";var e=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,f=(c?c.dayNames:null)||this._defaults.dayNames,h=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort;c=(c?c.monthNames:
null)||this._defaults.monthNames;var i=function(o){(o=k+1<a.length&&a.charAt(k+1)==o)&&k++;return o},g=function(o,m,n){m=""+m;if(i(o))for(;m.length<n;)m="0"+m;return m},j=function(o,m,n,s){return i(o)?s[m]:n[m]},l="",u=false;if(b)for(var k=0;k<a.length;k++)if(u)if(a.charAt(k)=="'"&&!i("'"))u=false;else l+=a.charAt(k);else switch(a.charAt(k)){case "d":l+=g("d",b.getDate(),2);break;case "D":l+=j("D",b.getDay(),e,f);break;case "o":l+=g("o",Math.round(((new Date(b.getFullYear(),b.getMonth(),b.getDate())).getTime()-
(new Date(b.getFullYear(),0,0)).getTime())/864E5),3);break;case "m":l+=g("m",b.getMonth()+1,2);break;case "M":l+=j("M",b.getMonth(),h,c);break;case "y":l+=i("y")?b.getFullYear():(b.getYear()%100<10?"0":"")+b.getYear()%100;break;case "@":l+=b.getTime();break;case "!":l+=b.getTime()*1E4+this._ticksTo1970;break;case "'":if(i("'"))l+="'";else u=true;break;default:l+=a.charAt(k)}return l},_possibleChars:function(a){for(var b="",c=false,e=function(h){(h=f+1<a.length&&a.charAt(f+1)==h)&&f++;return h},f=
0;f<a.length;f++)if(c)if(a.charAt(f)=="'"&&!e("'"))c=false;else b+=a.charAt(f);else switch(a.charAt(f)){case "d":case "m":case "y":case "@":b+="0123456789";break;case "D":case "M":return null;case "'":if(e("'"))b+="'";else c=true;break;default:b+=a.charAt(f)}return b},_get:function(a,b){return a.settings[b]!==C?a.settings[b]:this._defaults[b]},_setDateFromField:function(a,b){if(a.input.val()!=a.lastVal){var c=this._get(a,"dateFormat"),e=a.lastVal=a.input?a.input.val():null,f,h;f=h=this._getDefaultDate(a);
var i=this._getFormatConfig(a);try{f=this.parseDate(c,e,i)||h}catch(g){this.log(g);e=b?"":e}a.selectedDay=f.getDate();a.drawMonth=a.selectedMonth=f.getMonth();a.drawYear=a.selectedYear=f.getFullYear();a.currentDay=e?f.getDate():0;a.currentMonth=e?f.getMonth():0;a.currentYear=e?f.getFullYear():0;this._adjustInstDate(a)}},_getDefaultDate:function(a){return this._restrictMinMax(a,this._determineDate(a,this._get(a,"defaultDate"),new Date))},_determineDate:function(a,b,c){var e=function(h){var i=new Date;
i.setDate(i.getDate()+h);return i},f=function(h){try{return d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),h,d.datepicker._getFormatConfig(a))}catch(i){}var g=(h.toLowerCase().match(/^c/)?d.datepicker._getDate(a):null)||new Date,j=g.getFullYear(),l=g.getMonth();g=g.getDate();for(var u=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,k=u.exec(h);k;){switch(k[2]||"d"){case "d":case "D":g+=parseInt(k[1],10);break;case "w":case "W":g+=parseInt(k[1],10)*7;break;case "m":case "M":l+=parseInt(k[1],10);g=
Math.min(g,d.datepicker._getDaysInMonth(j,l));break;case "y":case "Y":j+=parseInt(k[1],10);g=Math.min(g,d.datepicker._getDaysInMonth(j,l));break}k=u.exec(h)}return new Date(j,l,g)};if(b=(b=b==null||b===""?c:typeof b=="string"?f(b):typeof b=="number"?isNaN(b)?c:e(b):new Date(b.getTime()))&&b.toString()=="Invalid Date"?c:b){b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0)}return this._daylightSavingAdjust(b)},_daylightSavingAdjust:function(a){if(!a)return null;a.setHours(a.getHours()>
12?a.getHours()+2:0);return a},_setDate:function(a,b,c){var e=!b,f=a.selectedMonth,h=a.selectedYear;b=this._restrictMinMax(a,this._determineDate(a,b,new Date));a.selectedDay=a.currentDay=b.getDate();a.drawMonth=a.selectedMonth=a.currentMonth=b.getMonth();a.drawYear=a.selectedYear=a.currentYear=b.getFullYear();if((f!=a.selectedMonth||h!=a.selectedYear)&&!c)this._notifyChange(a);this._adjustInstDate(a);if(a.input)a.input.val(e?"":this._formatDate(a))},_getDate:function(a){return!a.currentYear||a.input&&
a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay))},_generateHTML:function(a){var b=new Date;b=this._daylightSavingAdjust(new Date(b.getFullYear(),b.getMonth(),b.getDate()));var c=this._get(a,"isRTL"),e=this._get(a,"showButtonPanel"),f=this._get(a,"hideIfNoPrevNext"),h=this._get(a,"navigationAsDateFormat"),i=this._getNumberOfMonths(a),g=this._get(a,"showCurrentAtPos"),j=this._get(a,"stepMonths"),l=i[0]!=1||i[1]!=1,u=this._daylightSavingAdjust(!a.currentDay?
new Date(9999,9,9):new Date(a.currentYear,a.currentMonth,a.currentDay)),k=this._getMinMaxDate(a,"min"),o=this._getMinMaxDate(a,"max");g=a.drawMonth-g;var m=a.drawYear;if(g<0){g+=12;m--}if(o){var n=this._daylightSavingAdjust(new Date(o.getFullYear(),o.getMonth()-i[0]*i[1]+1,o.getDate()));for(n=k&&n<k?k:n;this._daylightSavingAdjust(new Date(m,g,1))>n;){g--;if(g<0){g=11;m--}}}a.drawMonth=g;a.drawYear=m;n=this._get(a,"prevText");n=!h?n:this.formatDate(n,this._daylightSavingAdjust(new Date(m,g-j,1)),this._getFormatConfig(a));
n=this._canAdjustMonth(a,-1,m,g)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+B+".datepicker._adjustDate('#"+a.id+"', -"+j+", 'M');\" title=\""+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+n+"</span></a>":f?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+n+"</span></a>";var s=this._get(a,"nextText");s=!h?s:this.formatDate(s,this._daylightSavingAdjust(new Date(m,
g+j,1)),this._getFormatConfig(a));f=this._canAdjustMonth(a,+1,m,g)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+B+".datepicker._adjustDate('#"+a.id+"', +"+j+", 'M');\" title=\""+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>":f?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>";j=this._get(a,"currentText");s=this._get(a,"gotoCurrent")&&
a.currentDay?u:b;j=!h?j:this.formatDate(j,s,this._getFormatConfig(a));h=!a.inline?'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+B+'.datepicker._hideDatepicker();">'+this._get(a,"closeText")+"</button>":"";e=e?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(c?h:"")+(this._isInRange(a,s)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+
B+".datepicker._gotoToday('#"+a.id+"');\">"+j+"</button>":"")+(c?"":h)+"</div>":"";h=parseInt(this._get(a,"firstDay"),10);h=isNaN(h)?0:h;j=this._get(a,"showWeek");s=this._get(a,"dayNames");this._get(a,"dayNamesShort");var q=this._get(a,"dayNamesMin"),A=this._get(a,"monthNames"),v=this._get(a,"monthNamesShort"),p=this._get(a,"beforeShowDay"),D=this._get(a,"showOtherMonths"),K=this._get(a,"selectOtherMonths");this._get(a,"calculateWeek");for(var E=this._getDefaultDate(a),w="",x=0;x<i[0];x++){var O=
"";this.maxRows=4;for(var G=0;G<i[1];G++){var P=this._daylightSavingAdjust(new Date(m,g,a.selectedDay)),t=" ui-corner-all",y="";if(l){y+='<div class="ui-datepicker-group';if(i[1]>1)switch(G){case 0:y+=" ui-datepicker-group-first";t=" ui-corner-"+(c?"right":"left");break;case i[1]-1:y+=" ui-datepicker-group-last";t=" ui-corner-"+(c?"left":"right");break;default:y+=" ui-datepicker-group-middle";t="";break}y+='">'}y+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+t+'">'+(/all|left/.test(t)&&
x==0?c?f:n:"")+(/all|right/.test(t)&&x==0?c?n:f:"")+this._generateMonthYearHeader(a,g,m,k,o,x>0||G>0,A,v)+'</div><table class="ui-datepicker-calendar"><thead><tr>';var z=j?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";for(t=0;t<7;t++){var r=(t+h)%7;z+="<th"+((t+h+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+s[r]+'">'+q[r]+"</span></th>"}y+=z+"</tr></thead><tbody>";z=this._getDaysInMonth(m,g);if(m==a.selectedYear&&g==a.selectedMonth)a.selectedDay=Math.min(a.selectedDay,
z);t=(this._getFirstDayOfMonth(m,g)-h+7)%7;z=Math.ceil((t+z)/7);this.maxRows=z=l?this.maxRows>z?this.maxRows:z:z;r=this._daylightSavingAdjust(new Date(m,g,1-t));for(var Q=0;Q<z;Q++){y+="<tr>";var R=!j?"":'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(r)+"</td>";for(t=0;t<7;t++){var I=p?p.apply(a.input?a.input[0]:null,[r]):[true,""],F=r.getMonth()!=g,L=F&&!K||!I[0]||k&&r<k||o&&r>o;R+='<td class="'+((t+h+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(r.getTime()==
P.getTime()&&g==a.selectedMonth&&a._keyEvent||E.getTime()==r.getTime()&&E.getTime()==P.getTime()?" "+this._dayOverClass:"")+(L?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!D?"":" "+I[1]+(r.getTime()==u.getTime()?" "+this._currentClass:"")+(r.getTime()==b.getTime()?" ui-datepicker-today":""))+'"'+((!F||D)&&I[2]?' title="'+I[2]+'"':"")+(L?"":' onclick="DP_jQuery_'+B+".datepicker._selectDay('#"+a.id+"',"+r.getMonth()+","+r.getFullYear()+', this);return false;"')+">"+(F&&!D?"&#xa0;":L?'<span class="ui-state-default">'+
r.getDate()+"</span>":'<a class="ui-state-default'+(r.getTime()==b.getTime()?" ui-state-highlight":"")+(r.getTime()==u.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+'" href="#">'+r.getDate()+"</a>")+"</td>";r.setDate(r.getDate()+1);r=this._daylightSavingAdjust(r)}y+=R+"</tr>"}g++;if(g>11){g=0;m++}y+="</tbody></table>"+(l?"</div>"+(i[0]>0&&G==i[1]-1?'<div class="ui-datepicker-row-break"></div>':""):"");O+=y}w+=O}w+=e+(d.browser.msie&&parseInt(d.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':
"");a._keyEvent=false;return w},_generateMonthYearHeader:function(a,b,c,e,f,h,i,g){var j=this._get(a,"changeMonth"),l=this._get(a,"changeYear"),u=this._get(a,"showMonthAfterYear"),k='<div class="ui-datepicker-title">',o="";if(h||!j)o+='<span class="ui-datepicker-month">'+i[b]+"</span>";else{i=e&&e.getFullYear()==c;var m=f&&f.getFullYear()==c;o+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+B+".datepicker._selectMonthYear('#"+a.id+"', this, 'M');\" >";for(var n=0;n<12;n++)if((!i||n>=e.getMonth())&&
(!m||n<=f.getMonth()))o+='<option value="'+n+'"'+(n==b?' selected="selected"':"")+">"+g[n]+"</option>";o+="</select>"}u||(k+=o+(h||!(j&&l)?"&#xa0;":""));if(!a.yearshtml){a.yearshtml="";if(h||!l)k+='<span class="ui-datepicker-year">'+c+"</span>";else{g=this._get(a,"yearRange").split(":");var s=(new Date).getFullYear();i=function(q){q=q.match(/c[+-].*/)?c+parseInt(q.substring(1),10):q.match(/[+-].*/)?s+parseInt(q,10):parseInt(q,10);return isNaN(q)?s:q};b=i(g[0]);g=Math.max(b,i(g[1]||""));b=e?Math.max(b,
e.getFullYear()):b;g=f?Math.min(g,f.getFullYear()):g;for(a.yearshtml+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+B+".datepicker._selectMonthYear('#"+a.id+"', this, 'Y');\" >";b<=g;b++)a.yearshtml+='<option value="'+b+'"'+(b==c?' selected="selected"':"")+">"+b+"</option>";a.yearshtml+="</select>";k+=a.yearshtml;a.yearshtml=null}}k+=this._get(a,"yearSuffix");if(u)k+=(h||!(j&&l)?"&#xa0;":"")+o;k+="</div>";return k},_adjustInstDate:function(a,b,c){var e=a.drawYear+(c=="Y"?b:0),f=a.drawMonth+
(c=="M"?b:0);b=Math.min(a.selectedDay,this._getDaysInMonth(e,f))+(c=="D"?b:0);e=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(e,f,b)));a.selectedDay=e.getDate();a.drawMonth=a.selectedMonth=e.getMonth();a.drawYear=a.selectedYear=e.getFullYear();if(c=="M"||c=="Y")this._notifyChange(a)},_restrictMinMax:function(a,b){var c=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,"max");b=c&&b<c?c:b;return b=a&&b>a?a:b},_notifyChange:function(a){var b=this._get(a,"onChangeMonthYear");if(b)b.apply(a.input?
a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a])},_getNumberOfMonths:function(a){a=this._get(a,"numberOfMonths");return a==null?[1,1]:typeof a=="number"?[1,a]:a},_getMinMaxDate:function(a,b){return this._determineDate(a,this._get(a,b+"Date"),null)},_getDaysInMonth:function(a,b){return 32-this._daylightSavingAdjust(new Date(a,b,32)).getDate()},_getFirstDayOfMonth:function(a,b){return(new Date(a,b,1)).getDay()},_canAdjustMonth:function(a,b,c,e){var f=this._getNumberOfMonths(a);c=this._daylightSavingAdjust(new Date(c,
e+(b<0?b:f[0]*f[1]),1));b<0&&c.setDate(this._getDaysInMonth(c.getFullYear(),c.getMonth()));return this._isInRange(a,c)},_isInRange:function(a,b){var c=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,"max");return(!c||b.getTime()>=c.getTime())&&(!a||b.getTime()<=a.getTime())},_getFormatConfig:function(a){var b=this._get(a,"shortYearCutoff");b=typeof b!="string"?b:(new Date).getFullYear()%100+parseInt(b,10);return{shortYearCutoff:b,dayNamesShort:this._get(a,"dayNamesShort"),dayNames:this._get(a,
"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")}},_formatDate:function(a,b,c,e){if(!b){a.currentDay=a.selectedDay;a.currentMonth=a.selectedMonth;a.currentYear=a.selectedYear}b=b?typeof b=="object"?b:this._daylightSavingAdjust(new Date(e,c,b)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return this.formatDate(this._get(a,"dateFormat"),b,this._getFormatConfig(a))}});d.fn.datepicker=function(a){if(!this.length)return this;
if(!d.datepicker.initialized){d(document).mousedown(d.datepicker._checkExternalClick).find("body").append(d.datepicker.dpDiv);d.datepicker.initialized=true}var b=Array.prototype.slice.call(arguments,1);if(typeof a=="string"&&(a=="isDisabled"||a=="getDate"||a=="widget"))return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));if(a=="option"&&arguments.length==2&&typeof arguments[1]=="string")return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));return this.each(function(){typeof a==
"string"?d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this].concat(b)):d.datepicker._attachDatepicker(this,a)})};d.datepicker=new M;d.datepicker.initialized=false;d.datepicker.uuid=(new Date).getTime();d.datepicker.version="1.8.16";window["DP_jQuery_"+B]=d})(jQuery);
;/*
 * jQuery UI Progressbar 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function(b,d){b.widget("ui.progressbar",{options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()});this.valueDiv=b("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);this.oldValue=this._value();this._refreshValue()},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
this.valueDiv.remove();b.Widget.prototype.destroy.apply(this,arguments)},value:function(a){if(a===d)return this._value();this._setOption("value",a);return this},_setOption:function(a,c){if(a==="value"){this.options.value=c;this._refreshValue();this._value()===this.options.max&&this._trigger("complete")}b.Widget.prototype._setOption.apply(this,arguments)},_value:function(){var a=this.options.value;if(typeof a!=="number")a=0;return Math.min(this.options.max,Math.max(this.min,a))},_percentage:function(){return 100*
this._value()/this.options.max},_refreshValue:function(){var a=this.value(),c=this._percentage();if(this.oldValue!==a){this.oldValue=a;this._trigger("change")}this.valueDiv.toggle(a>this.min).toggleClass("ui-corner-right",a===this.options.max).width(c.toFixed(0)+"%");this.element.attr("aria-valuenow",a)}});b.extend(b.ui.progressbar,{version:"1.8.16"})})(jQuery);
;/*
 * jQuery UI Effects 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */
jQuery.effects||function(f,j){function m(c){var a;if(c&&c.constructor==Array&&c.length==3)return c;if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c))return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10)];if(a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c))return[parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];if(a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c))return[parseInt(a[1],
16),parseInt(a[2],16),parseInt(a[3],16)];if(a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c))return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];if(/rgba\(0, 0, 0, 0\)/.exec(c))return n.transparent;return n[f.trim(c).toLowerCase()]}function s(c,a){var b;do{b=f.curCSS(c,a);if(b!=""&&b!="transparent"||f.nodeName(c,"body"))break;a="backgroundColor"}while(c=c.parentNode);return m(b)}function o(){var c=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,
a={},b,d;if(c&&c.length&&c[0]&&c[c[0]])for(var e=c.length;e--;){b=c[e];if(typeof c[b]=="string"){d=b.replace(/\-(\w)/g,function(g,h){return h.toUpperCase()});a[d]=c[b]}}else for(b in c)if(typeof c[b]==="string")a[b]=c[b];return a}function p(c){var a,b;for(a in c){b=c[a];if(b==null||f.isFunction(b)||a in t||/scrollbar/.test(a)||!/color/i.test(a)&&isNaN(parseFloat(b)))delete c[a]}return c}function u(c,a){var b={_:0},d;for(d in a)if(c[d]!=a[d])b[d]=a[d];return b}function k(c,a,b,d){if(typeof c=="object"){d=
a;b=null;a=c;c=a.effect}if(f.isFunction(a)){d=a;b=null;a={}}if(typeof a=="number"||f.fx.speeds[a]){d=b;b=a;a={}}if(f.isFunction(b)){d=b;b=null}a=a||{};b=b||a.duration;b=f.fx.off?0:typeof b=="number"?b:b in f.fx.speeds?f.fx.speeds[b]:f.fx.speeds._default;d=d||a.complete;return[c,a,b,d]}function l(c){if(!c||typeof c==="number"||f.fx.speeds[c])return true;if(typeof c==="string"&&!f.effects[c])return true;return false}f.effects={};f.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor",
"borderTopColor","borderColor","color","outlineColor"],function(c,a){f.fx.step[a]=function(b){if(!b.colorInit){b.start=s(b.elem,a);b.end=m(b.end);b.colorInit=true}b.elem.style[a]="rgb("+Math.max(Math.min(parseInt(b.pos*(b.end[0]-b.start[0])+b.start[0],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[1]-b.start[1])+b.start[1],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[2]-b.start[2])+b.start[2],10),255),0)+")"}});var n={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,
0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,
211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},q=["add","remove","toggle"],t={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};f.effects.animateClass=function(c,a,b,
d){if(f.isFunction(b)){d=b;b=null}return this.queue(function(){var e=f(this),g=e.attr("style")||" ",h=p(o.call(this)),r,v=e.attr("class");f.each(q,function(w,i){c[i]&&e[i+"Class"](c[i])});r=p(o.call(this));e.attr("class",v);e.animate(u(h,r),{queue:false,duration:a,easing:b,complete:function(){f.each(q,function(w,i){c[i]&&e[i+"Class"](c[i])});if(typeof e.attr("style")=="object"){e.attr("style").cssText="";e.attr("style").cssText=g}else e.attr("style",g);d&&d.apply(this,arguments);f.dequeue(this)}})})};
f.fn.extend({_addClass:f.fn.addClass,addClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{add:c},a,b,d]):this._addClass(c)},_removeClass:f.fn.removeClass,removeClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{remove:c},a,b,d]):this._removeClass(c)},_toggleClass:f.fn.toggleClass,toggleClass:function(c,a,b,d,e){return typeof a=="boolean"||a===j?b?f.effects.animateClass.apply(this,[a?{add:c}:{remove:c},b,d,e]):this._toggleClass(c,a):f.effects.animateClass.apply(this,
[{toggle:c},a,b,d])},switchClass:function(c,a,b,d,e){return f.effects.animateClass.apply(this,[{add:a,remove:c},b,d,e])}});f.extend(f.effects,{version:"1.8.16",save:function(c,a){for(var b=0;b<a.length;b++)a[b]!==null&&c.data("ec.storage."+a[b],c[0].style[a[b]])},restore:function(c,a){for(var b=0;b<a.length;b++)a[b]!==null&&c.css(a[b],c.data("ec.storage."+a[b]))},setMode:function(c,a){if(a=="toggle")a=c.is(":hidden")?"show":"hide";return a},getBaseline:function(c,a){var b;switch(c[0]){case "top":b=
0;break;case "middle":b=0.5;break;case "bottom":b=1;break;default:b=c[0]/a.height}switch(c[1]){case "left":c=0;break;case "center":c=0.5;break;case "right":c=1;break;default:c=c[1]/a.width}return{x:c,y:b}},createWrapper:function(c){if(c.parent().is(".ui-effects-wrapper"))return c.parent();var a={width:c.outerWidth(true),height:c.outerHeight(true),"float":c.css("float")},b=f("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),
d=document.activeElement;c.wrap(b);if(c[0]===d||f.contains(c[0],d))f(d).focus();b=c.parent();if(c.css("position")=="static"){b.css({position:"relative"});c.css({position:"relative"})}else{f.extend(a,{position:c.css("position"),zIndex:c.css("z-index")});f.each(["top","left","bottom","right"],function(e,g){a[g]=c.css(g);if(isNaN(parseInt(a[g],10)))a[g]="auto"});c.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})}return b.css(a).show()},removeWrapper:function(c){var a,b=document.activeElement;
if(c.parent().is(".ui-effects-wrapper")){a=c.parent().replaceWith(c);if(c[0]===b||f.contains(c[0],b))f(b).focus();return a}return c},setTransition:function(c,a,b,d){d=d||{};f.each(a,function(e,g){unit=c.cssUnit(g);if(unit[0]>0)d[g]=unit[0]*b+unit[1]});return d}});f.fn.extend({effect:function(c){var a=k.apply(this,arguments),b={options:a[1],duration:a[2],callback:a[3]};a=b.options.mode;var d=f.effects[c];if(f.fx.off||!d)return a?this[a](b.duration,b.callback):this.each(function(){b.callback&&b.callback.call(this)});
return d.call(this,b)},_show:f.fn.show,show:function(c){if(l(c))return this._show.apply(this,arguments);else{var a=k.apply(this,arguments);a[1].mode="show";return this.effect.apply(this,a)}},_hide:f.fn.hide,hide:function(c){if(l(c))return this._hide.apply(this,arguments);else{var a=k.apply(this,arguments);a[1].mode="hide";return this.effect.apply(this,a)}},__toggle:f.fn.toggle,toggle:function(c){if(l(c)||typeof c==="boolean"||f.isFunction(c))return this.__toggle.apply(this,arguments);else{var a=k.apply(this,
arguments);a[1].mode="toggle";return this.effect.apply(this,a)}},cssUnit:function(c){var a=this.css(c),b=[];f.each(["em","px","%","pt"],function(d,e){if(a.indexOf(e)>0)b=[parseFloat(a),e]});return b}});f.easing.jswing=f.easing.swing;f.extend(f.easing,{def:"easeOutQuad",swing:function(c,a,b,d,e){return f.easing[f.easing.def](c,a,b,d,e)},easeInQuad:function(c,a,b,d,e){return d*(a/=e)*a+b},easeOutQuad:function(c,a,b,d,e){return-d*(a/=e)*(a-2)+b},easeInOutQuad:function(c,a,b,d,e){if((a/=e/2)<1)return d/
2*a*a+b;return-d/2*(--a*(a-2)-1)+b},easeInCubic:function(c,a,b,d,e){return d*(a/=e)*a*a+b},easeOutCubic:function(c,a,b,d,e){return d*((a=a/e-1)*a*a+1)+b},easeInOutCubic:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a+b;return d/2*((a-=2)*a*a+2)+b},easeInQuart:function(c,a,b,d,e){return d*(a/=e)*a*a*a+b},easeOutQuart:function(c,a,b,d,e){return-d*((a=a/e-1)*a*a*a-1)+b},easeInOutQuart:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a*a+b;return-d/2*((a-=2)*a*a*a-2)+b},easeInQuint:function(c,a,b,
d,e){return d*(a/=e)*a*a*a*a+b},easeOutQuint:function(c,a,b,d,e){return d*((a=a/e-1)*a*a*a*a+1)+b},easeInOutQuint:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a*a*a+b;return d/2*((a-=2)*a*a*a*a+2)+b},easeInSine:function(c,a,b,d,e){return-d*Math.cos(a/e*(Math.PI/2))+d+b},easeOutSine:function(c,a,b,d,e){return d*Math.sin(a/e*(Math.PI/2))+b},easeInOutSine:function(c,a,b,d,e){return-d/2*(Math.cos(Math.PI*a/e)-1)+b},easeInExpo:function(c,a,b,d,e){return a==0?b:d*Math.pow(2,10*(a/e-1))+b},easeOutExpo:function(c,
a,b,d,e){return a==e?b+d:d*(-Math.pow(2,-10*a/e)+1)+b},easeInOutExpo:function(c,a,b,d,e){if(a==0)return b;if(a==e)return b+d;if((a/=e/2)<1)return d/2*Math.pow(2,10*(a-1))+b;return d/2*(-Math.pow(2,-10*--a)+2)+b},easeInCirc:function(c,a,b,d,e){return-d*(Math.sqrt(1-(a/=e)*a)-1)+b},easeOutCirc:function(c,a,b,d,e){return d*Math.sqrt(1-(a=a/e-1)*a)+b},easeInOutCirc:function(c,a,b,d,e){if((a/=e/2)<1)return-d/2*(Math.sqrt(1-a*a)-1)+b;return d/2*(Math.sqrt(1-(a-=2)*a)+1)+b},easeInElastic:function(c,a,b,
d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e)==1)return b+d;g||(g=e*0.3);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g))+b},easeOutElastic:function(c,a,b,d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e)==1)return b+d;g||(g=e*0.3);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*a)*Math.sin((a*e-c)*2*Math.PI/g)+d+b},easeInOutElastic:function(c,a,b,d,e){c=1.70158;var g=
0,h=d;if(a==0)return b;if((a/=e/2)==2)return b+d;g||(g=e*0.3*1.5);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/h);if(a<1)return-0.5*h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)+b;return h*Math.pow(2,-10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)*0.5+d+b},easeInBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;return d*(a/=e)*a*((g+1)*a-g)+b},easeOutBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;return d*((a=a/e-1)*a*((g+1)*a+g)+1)+b},easeInOutBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;
if((a/=e/2)<1)return d/2*a*a*(((g*=1.525)+1)*a-g)+b;return d/2*((a-=2)*a*(((g*=1.525)+1)*a+g)+2)+b},easeInBounce:function(c,a,b,d,e){return d-f.easing.easeOutBounce(c,e-a,0,d,e)+b},easeOutBounce:function(c,a,b,d,e){return(a/=e)<1/2.75?d*7.5625*a*a+b:a<2/2.75?d*(7.5625*(a-=1.5/2.75)*a+0.75)+b:a<2.5/2.75?d*(7.5625*(a-=2.25/2.75)*a+0.9375)+b:d*(7.5625*(a-=2.625/2.75)*a+0.984375)+b},easeInOutBounce:function(c,a,b,d,e){if(a<e/2)return f.easing.easeInBounce(c,a*2,0,d,e)*0.5+b;return f.easing.easeOutBounce(c,
a*2-e,0,d,e)*0.5+d*0.5+b}})}(jQuery);
;/*
 * jQuery UI Effects Blind 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Blind
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.blind=function(c){return this.queue(function(){var a=b(this),g=["position","top","bottom","left","right"],f=b.effects.setMode(a,c.options.mode||"hide"),d=c.options.direction||"vertical";b.effects.save(a,g);a.show();var e=b.effects.createWrapper(a).css({overflow:"hidden"}),h=d=="vertical"?"height":"width";d=d=="vertical"?e.height():e.width();f=="show"&&e.css(h,0);var i={};i[h]=f=="show"?d:0;e.animate(i,c.duration,c.options.easing,function(){f=="hide"&&a.hide();b.effects.restore(a,
g);b.effects.removeWrapper(a);c.callback&&c.callback.apply(a[0],arguments);a.dequeue()})})}})(jQuery);
;/*
 * jQuery UI Effects Bounce 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(e){e.effects.bounce=function(b){return this.queue(function(){var a=e(this),l=["position","top","bottom","left","right"],h=e.effects.setMode(a,b.options.mode||"effect"),d=b.options.direction||"up",c=b.options.distance||20,m=b.options.times||5,i=b.duration||250;/show|hide/.test(h)&&l.push("opacity");e.effects.save(a,l);a.show();e.effects.createWrapper(a);var f=d=="up"||d=="down"?"top":"left";d=d=="up"||d=="left"?"pos":"neg";c=b.options.distance||(f=="top"?a.outerHeight({margin:true})/3:a.outerWidth({margin:true})/
3);if(h=="show")a.css("opacity",0).css(f,d=="pos"?-c:c);if(h=="hide")c/=m*2;h!="hide"&&m--;if(h=="show"){var g={opacity:1};g[f]=(d=="pos"?"+=":"-=")+c;a.animate(g,i/2,b.options.easing);c/=2;m--}for(g=0;g<m;g++){var j={},k={};j[f]=(d=="pos"?"-=":"+=")+c;k[f]=(d=="pos"?"+=":"-=")+c;a.animate(j,i/2,b.options.easing).animate(k,i/2,b.options.easing);c=h=="hide"?c*2:c/2}if(h=="hide"){g={opacity:0};g[f]=(d=="pos"?"-=":"+=")+c;a.animate(g,i/2,b.options.easing,function(){a.hide();e.effects.restore(a,l);e.effects.removeWrapper(a);
b.callback&&b.callback.apply(this,arguments)})}else{j={};k={};j[f]=(d=="pos"?"-=":"+=")+c;k[f]=(d=="pos"?"+=":"-=")+c;a.animate(j,i/2,b.options.easing).animate(k,i/2,b.options.easing,function(){e.effects.restore(a,l);e.effects.removeWrapper(a);b.callback&&b.callback.apply(this,arguments)})}a.queue("fx",function(){a.dequeue()});a.dequeue()})}})(jQuery);
;/*
 * jQuery UI Effects Clip 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Clip
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.clip=function(e){return this.queue(function(){var a=b(this),i=["position","top","bottom","left","right","height","width"],f=b.effects.setMode(a,e.options.mode||"hide"),c=e.options.direction||"vertical";b.effects.save(a,i);a.show();var d=b.effects.createWrapper(a).css({overflow:"hidden"});d=a[0].tagName=="IMG"?d:a;var g={size:c=="vertical"?"height":"width",position:c=="vertical"?"top":"left"};c=c=="vertical"?d.height():d.width();if(f=="show"){d.css(g.size,0);d.css(g.position,
c/2)}var h={};h[g.size]=f=="show"?c:0;h[g.position]=f=="show"?0:c/2;d.animate(h,{queue:false,duration:e.duration,easing:e.options.easing,complete:function(){f=="hide"&&a.hide();b.effects.restore(a,i);b.effects.removeWrapper(a);e.callback&&e.callback.apply(a[0],arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Drop 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Drop
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.drop=function(d){return this.queue(function(){var a=c(this),h=["position","top","bottom","left","right","opacity"],e=c.effects.setMode(a,d.options.mode||"hide"),b=d.options.direction||"left";c.effects.save(a,h);a.show();c.effects.createWrapper(a);var f=b=="up"||b=="down"?"top":"left";b=b=="up"||b=="left"?"pos":"neg";var g=d.options.distance||(f=="top"?a.outerHeight({margin:true})/2:a.outerWidth({margin:true})/2);if(e=="show")a.css("opacity",0).css(f,b=="pos"?-g:g);var i={opacity:e==
"show"?1:0};i[f]=(e=="show"?b=="pos"?"+=":"-=":b=="pos"?"-=":"+=")+g;a.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){e=="hide"&&a.hide();c.effects.restore(a,h);c.effects.removeWrapper(a);d.callback&&d.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Explode 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(j){j.effects.explode=function(a){return this.queue(function(){var c=a.options.pieces?Math.round(Math.sqrt(a.options.pieces)):3,d=a.options.pieces?Math.round(Math.sqrt(a.options.pieces)):3;a.options.mode=a.options.mode=="toggle"?j(this).is(":visible")?"hide":"show":a.options.mode;var b=j(this).show().css("visibility","hidden"),g=b.offset();g.top-=parseInt(b.css("marginTop"),10)||0;g.left-=parseInt(b.css("marginLeft"),10)||0;for(var h=b.outerWidth(true),i=b.outerHeight(true),e=0;e<c;e++)for(var f=
0;f<d;f++)b.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-f*(h/d),top:-e*(i/c)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:h/d,height:i/c,left:g.left+f*(h/d)+(a.options.mode=="show"?(f-Math.floor(d/2))*(h/d):0),top:g.top+e*(i/c)+(a.options.mode=="show"?(e-Math.floor(c/2))*(i/c):0),opacity:a.options.mode=="show"?0:1}).animate({left:g.left+f*(h/d)+(a.options.mode=="show"?0:(f-Math.floor(d/2))*(h/d)),top:g.top+
e*(i/c)+(a.options.mode=="show"?0:(e-Math.floor(c/2))*(i/c)),opacity:a.options.mode=="show"?1:0},a.duration||500);setTimeout(function(){a.options.mode=="show"?b.css({visibility:"visible"}):b.css({visibility:"visible"}).hide();a.callback&&a.callback.apply(b[0]);b.dequeue();j("div.ui-effects-explode").remove()},a.duration||500)})}})(jQuery);
;/*
 * jQuery UI Effects Fade 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fade
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.fade=function(a){return this.queue(function(){var c=b(this),d=b.effects.setMode(c,a.options.mode||"hide");c.animate({opacity:d},{queue:false,duration:a.duration,easing:a.options.easing,complete:function(){a.callback&&a.callback.apply(this,arguments);c.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Fold 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fold
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.fold=function(a){return this.queue(function(){var b=c(this),j=["position","top","bottom","left","right"],d=c.effects.setMode(b,a.options.mode||"hide"),g=a.options.size||15,h=!!a.options.horizFirst,k=a.duration?a.duration/2:c.fx.speeds._default/2;c.effects.save(b,j);b.show();var e=c.effects.createWrapper(b).css({overflow:"hidden"}),f=d=="show"!=h,l=f?["width","height"]:["height","width"];f=f?[e.width(),e.height()]:[e.height(),e.width()];var i=/([0-9]+)%/.exec(g);if(i)g=parseInt(i[1],
10)/100*f[d=="hide"?0:1];if(d=="show")e.css(h?{height:0,width:g}:{height:g,width:0});h={};i={};h[l[0]]=d=="show"?f[0]:g;i[l[1]]=d=="show"?f[1]:0;e.animate(h,k,a.options.easing).animate(i,k,a.options.easing,function(){d=="hide"&&b.hide();c.effects.restore(b,j);c.effects.removeWrapper(b);a.callback&&a.callback.apply(b[0],arguments);b.dequeue()})})}})(jQuery);
;/*
 * jQuery UI Effects Highlight 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Highlight
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.highlight=function(c){return this.queue(function(){var a=b(this),e=["backgroundImage","backgroundColor","opacity"],d=b.effects.setMode(a,c.options.mode||"show"),f={backgroundColor:a.css("backgroundColor")};if(d=="hide")f.opacity=0;b.effects.save(a,e);a.show().css({backgroundImage:"none",backgroundColor:c.options.color||"#ffff99"}).animate(f,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){d=="hide"&&a.hide();b.effects.restore(a,e);d=="show"&&!b.support.opacity&&
this.style.removeAttribute("filter");c.callback&&c.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Pulsate 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(d){d.effects.pulsate=function(a){return this.queue(function(){var b=d(this),c=d.effects.setMode(b,a.options.mode||"show");times=(a.options.times||5)*2-1;duration=a.duration?a.duration/2:d.fx.speeds._default/2;isVisible=b.is(":visible");animateTo=0;if(!isVisible){b.css("opacity",0).show();animateTo=1}if(c=="hide"&&isVisible||c=="show"&&!isVisible)times--;for(c=0;c<times;c++){b.animate({opacity:animateTo},duration,a.options.easing);animateTo=(animateTo+1)%2}b.animate({opacity:animateTo},duration,
a.options.easing,function(){animateTo==0&&b.hide();a.callback&&a.callback.apply(this,arguments)});b.queue("fx",function(){b.dequeue()}).dequeue()})}})(jQuery);
;/*
 * jQuery UI Effects Scale 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Scale
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.puff=function(b){return this.queue(function(){var a=c(this),e=c.effects.setMode(a,b.options.mode||"hide"),g=parseInt(b.options.percent,10)||150,h=g/100,i={height:a.height(),width:a.width()};c.extend(b.options,{fade:true,mode:e,percent:e=="hide"?g:100,from:e=="hide"?i:{height:i.height*h,width:i.width*h}});a.effect("scale",b.options,b.duration,b.callback);a.dequeue()})};c.effects.scale=function(b){return this.queue(function(){var a=c(this),e=c.extend(true,{},b.options),g=c.effects.setMode(a,
b.options.mode||"effect"),h=parseInt(b.options.percent,10)||(parseInt(b.options.percent,10)==0?0:g=="hide"?0:100),i=b.options.direction||"both",f=b.options.origin;if(g!="effect"){e.origin=f||["middle","center"];e.restore=true}f={height:a.height(),width:a.width()};a.from=b.options.from||(g=="show"?{height:0,width:0}:f);h={y:i!="horizontal"?h/100:1,x:i!="vertical"?h/100:1};a.to={height:f.height*h.y,width:f.width*h.x};if(b.options.fade){if(g=="show"){a.from.opacity=0;a.to.opacity=1}if(g=="hide"){a.from.opacity=
1;a.to.opacity=0}}e.from=a.from;e.to=a.to;e.mode=g;a.effect("size",e,b.duration,b.callback);a.dequeue()})};c.effects.size=function(b){return this.queue(function(){var a=c(this),e=["position","top","bottom","left","right","width","height","overflow","opacity"],g=["position","top","bottom","left","right","overflow","opacity"],h=["width","height","overflow"],i=["fontSize"],f=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],k=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],
p=c.effects.setMode(a,b.options.mode||"effect"),n=b.options.restore||false,m=b.options.scale||"both",l=b.options.origin,j={height:a.height(),width:a.width()};a.from=b.options.from||j;a.to=b.options.to||j;if(l){l=c.effects.getBaseline(l,j);a.from.top=(j.height-a.from.height)*l.y;a.from.left=(j.width-a.from.width)*l.x;a.to.top=(j.height-a.to.height)*l.y;a.to.left=(j.width-a.to.width)*l.x}var d={from:{y:a.from.height/j.height,x:a.from.width/j.width},to:{y:a.to.height/j.height,x:a.to.width/j.width}};
if(m=="box"||m=="both"){if(d.from.y!=d.to.y){e=e.concat(f);a.from=c.effects.setTransition(a,f,d.from.y,a.from);a.to=c.effects.setTransition(a,f,d.to.y,a.to)}if(d.from.x!=d.to.x){e=e.concat(k);a.from=c.effects.setTransition(a,k,d.from.x,a.from);a.to=c.effects.setTransition(a,k,d.to.x,a.to)}}if(m=="content"||m=="both")if(d.from.y!=d.to.y){e=e.concat(i);a.from=c.effects.setTransition(a,i,d.from.y,a.from);a.to=c.effects.setTransition(a,i,d.to.y,a.to)}c.effects.save(a,n?e:g);a.show();c.effects.createWrapper(a);
a.css("overflow","hidden").css(a.from);if(m=="content"||m=="both"){f=f.concat(["marginTop","marginBottom"]).concat(i);k=k.concat(["marginLeft","marginRight"]);h=e.concat(f).concat(k);a.find("*[width]").each(function(){child=c(this);n&&c.effects.save(child,h);var o={height:child.height(),width:child.width()};child.from={height:o.height*d.from.y,width:o.width*d.from.x};child.to={height:o.height*d.to.y,width:o.width*d.to.x};if(d.from.y!=d.to.y){child.from=c.effects.setTransition(child,f,d.from.y,child.from);
child.to=c.effects.setTransition(child,f,d.to.y,child.to)}if(d.from.x!=d.to.x){child.from=c.effects.setTransition(child,k,d.from.x,child.from);child.to=c.effects.setTransition(child,k,d.to.x,child.to)}child.css(child.from);child.animate(child.to,b.duration,b.options.easing,function(){n&&c.effects.restore(child,h)})})}a.animate(a.to,{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){a.to.opacity===0&&a.css("opacity",a.from.opacity);p=="hide"&&a.hide();c.effects.restore(a,
n?e:g);c.effects.removeWrapper(a);b.callback&&b.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Shake 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(d){d.effects.shake=function(a){return this.queue(function(){var b=d(this),j=["position","top","bottom","left","right"];d.effects.setMode(b,a.options.mode||"effect");var c=a.options.direction||"left",e=a.options.distance||20,l=a.options.times||3,f=a.duration||a.options.duration||140;d.effects.save(b,j);b.show();d.effects.createWrapper(b);var g=c=="up"||c=="down"?"top":"left",h=c=="up"||c=="left"?"pos":"neg";c={};var i={},k={};c[g]=(h=="pos"?"-=":"+=")+e;i[g]=(h=="pos"?"+=":"-=")+e*2;k[g]=
(h=="pos"?"-=":"+=")+e*2;b.animate(c,f,a.options.easing);for(e=1;e<l;e++)b.animate(i,f,a.options.easing).animate(k,f,a.options.easing);b.animate(i,f,a.options.easing).animate(c,f/2,a.options.easing,function(){d.effects.restore(b,j);d.effects.removeWrapper(b);a.callback&&a.callback.apply(this,arguments)});b.queue("fx",function(){b.dequeue()});b.dequeue()})}})(jQuery);
;/*
 * jQuery UI Effects Slide 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.slide=function(d){return this.queue(function(){var a=c(this),h=["position","top","bottom","left","right"],f=c.effects.setMode(a,d.options.mode||"show"),b=d.options.direction||"left";c.effects.save(a,h);a.show();c.effects.createWrapper(a).css({overflow:"hidden"});var g=b=="up"||b=="down"?"top":"left";b=b=="up"||b=="left"?"pos":"neg";var e=d.options.distance||(g=="top"?a.outerHeight({margin:true}):a.outerWidth({margin:true}));if(f=="show")a.css(g,b=="pos"?isNaN(e)?"-"+e:-e:e);
var i={};i[g]=(f=="show"?b=="pos"?"+=":"-=":b=="pos"?"-=":"+=")+e;a.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&a.hide();c.effects.restore(a,h);c.effects.removeWrapper(a);d.callback&&d.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Transfer 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(e){e.effects.transfer=function(a){return this.queue(function(){var b=e(this),c=e(a.options.to),d=c.offset();c={top:d.top,left:d.left,height:c.innerHeight(),width:c.innerWidth()};d=b.offset();var f=e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(a.options.className).css({top:d.top,left:d.left,height:b.innerHeight(),width:b.innerWidth(),position:"absolute"}).animate(c,a.duration,a.options.easing,function(){f.remove();a.callback&&a.callback.apply(b[0],arguments);
b.dequeue()})})}})(jQuery);
;

(function () {
    var impl = { };
    (function() {
var TEXTB;
var deepDynamicUpdate;
var deepStaticUpdate;
var extractDomFieldOnEventE;
var extractEventsE;
var extractValueOnEventE;
var extractValueStaticB;
var i;
var insertDom;
var insertDomB;
var insertDomE;
var insertDomInternal;
var insertValue;
var insertValueB;
var insertValueE;
var isListening;/*
 * Copyright (c) 2006-2009, The Flapjax Team.  All Rights Reserved.
 *  
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * 
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of the Brown University, the Flapjax Team, nor the names
 *   of its contributors may be used to endorse or promote products derived
 *   from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */
 
 
 /*
 Inverse Modifications By Jay Shepherd
 
 */
  
///////////////////////////////////////////////////////////////////////////////
// Miscellaneous functions

var module = this;

//credit 4umi
//slice: Array a * Integer * Integer -> Array a
var slice = function (arr, start, stop) {
  var i, len = arr.length, r = [];
  if( !stop ) { stop = len; }
  if( stop < 0 ) { stop = len + stop; }
  if( start < 0 ) { start = len - start; }
  if( stop < start ) { i = start; start = stop; stop = i; }
  for( i = 0; i < stop - start; i++ ) { r[i] = arr[start+i]; }
  return r;
}

var isEqual = function (a,b) {
  return (a == b) ||
    ( (((typeof(a) == 'number') && isNaN(a)) || a == 'NaN') &&
      (((typeof(b) == 'number') && isNaN(b)) || b == 'NaN') );
};

var forEach = function(fn,arr) {
  for (var i = 0 ; i < arr.length; i++) {
    fn(arr[i]);
  }
};

//member: a * Array b -> Boolean
var member = function(elt, lst) {
  for (var i = 0; i < lst.length; i++) { 
    if (isEqual(lst[i], elt)) {return true;} 
  }
  return false;
};

var zip = function(arrays) {
  if (arrays.length == 0) return [];
  var ret = [];
  for(var i=0; i<arrays[0].length;i++) {
    ret.push([]);
    for(var j=0; j<arrays.length;j++) 
      ret[i].push(arrays[j][i]);
  }
  return ret;
}

//map: (a * ... -> z) * [a] * ... -> [z]
var map = function (fn) {
  var arrays = slice(arguments, 1);
  if (arrays.length === 0) { return []; }
  else if (arrays.length === 1) {
    var ret = [];
    for(var i=0; i<arrays[0].length; i++) {ret.push(fn(arrays[0][i]));}
    return ret;
  }
  else {
    var ret = zip(arrays);
    var o = new Object();
    for(var i=0; i<ret.length; i++) {ret[i] = fn.apply(o,ret[i]);}
    return ret;
  }
};
  
//filter: (a -> Boolean) * Array a -> Array a
var filter = function (predFn, arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) { 
    if (predFn(arr[i])) { res.push(arr[i]); }
  }
  return res;
};
  
//fold: (a * .... * accum -> accum) * accum * [a] * ... -> accum
//fold over list(s), left to right
var fold = function(fn, init /* arrays */) {
  var lists = slice(arguments, 2);
  if (lists.length === 0) { return init; }
  else if(lists.length === 1) {
    var acc = init;
    for(var i = 0; i < lists[0].length; i++) {
      acc = fn(lists[0][i],acc);
    }
    return acc;
  }
  else {
    var acc = init;
    for (var i = 0; i < lists[0].length; i++) {
      var args = map( function (lst) { return lst[i];}, 
            lists);
      args.push(acc);
      acc = fn.apply({}, args);
    }
    return acc;
  }
};
  
//foldR: (a * .... * accum -> accum) * accum * [a] * ... -> accum
//fold over list(s), right to left, fold more memory efficient (left to right)
var foldR = function (fn, init /* arrays */) {
  var lists = slice(arguments, 2);
  if (lists.length === 0) { return init; }
  else if(lists.length === 1) {
    var acc = init;
    for(var i=lists[0].length - 1; i > -1; i--)
      acc = fn(lists[0][i],acc);
    return acc;
  }
  else {
    var acc = init;
    for (var i = lists[0].length - 1; i > -1; i--) {
      var args = map( function (lst) { return lst[i];}, 
            lists);
      args.push(acc);
      acc = fn.apply({}, args);
    }
    return acc;     
  }
};

//////////////////////////////////////////////////////////////////////////////
// Flapjax core

// Sentinel value returned by updaters to stop propagation.
var doNotPropagate = { };

//Pulse: Stamp * Path * Obj
var Pulse = function (stamp, value) {
  // Timestamps are used by liftB (and ifE).  Since liftB may receive multiple
  // update signals in the same run of the evaluator, it only propagates the 
  // signal if it has a new stamp.
  this.stamp = stamp;
  this.value = value;
};


//Probably can optimize as we expect increasing insert runs etc
var PQ = function () {
  var ctx = this;
  ctx.val = [];
  this.insert = function (kv) {
    ctx.val.push(kv);
    var kvpos = ctx.val.length-1;
    while(kvpos > 0 && kv.k < ctx.val[Math.floor((kvpos-1)/2)].k) {
      var oldpos = kvpos;
      kvpos = Math.floor((kvpos-1)/2);
      ctx.val[oldpos] = ctx.val[kvpos];
      ctx.val[kvpos] = kv;
    }
  };
  this.isEmpty = function () { 
    return ctx.val.length === 0; 
  };
  this.pop = function () {
    if(ctx.val.length == 1) {
      return ctx.val.pop();
    }
    var ret = ctx.val.shift();
    ctx.val.unshift(ctx.val.pop());
    var kvpos = 0;
    var kv = ctx.val[0];
    while(1) { 
      var leftChild = (kvpos*2+1 < ctx.val.length ? ctx.val[kvpos*2+1].k : kv.k+1);
      var rightChild = (kvpos*2+2 < ctx.val.length ? ctx.val[kvpos*2+2].k : kv.k+1);
      if(leftChild > kv.k && rightChild > kv.k)
          break;

      if(leftChild < rightChild) {
        ctx.val[kvpos] = ctx.val[kvpos*2+1];
        ctx.val[kvpos*2+1] = kv;
        kvpos = kvpos*2+1;
      }
      else {
        ctx.val[kvpos] = ctx.val[kvpos*2+2];
        ctx.val[kvpos*2+2] = kv;
        kvpos = kvpos*2+2;
      }
    }
    return ret;
  };
};

var lastRank = 0;
var stamp = 1;
var nextStamp = function () { return ++stamp; };

//propagatePulse: Pulse * Array Node -> 
//Send the pulse to each node 
var propagatePulse = function (pulse, node) {
  var queue = new PQ(); //topological queue for current timestep

  queue.insert({k:node.rank,n:node,v:pulse});
  var len = 1;
  
  while (len) {
    var qv = queue.pop();
    len--;
    if(qv.v.value=="AWESOME"){
        //log("FJ inverse: "+qv.v.value);
        //showObj(qv.n.updater);
    }
        
    //log("<updated>");
    var nextPulse = qv.n.updater(new Pulse(qv.v.stamp, qv.v.value));
    //log("</updated>");
    var weaklyHeld = true;

    if (nextPulse != doNotPropagate) {
      for (i = 0; i < qv.n.sendsTo.length; i++) {
        weaklyHeld = weaklyHeld && qv.n.sendsTo[i].weaklyHeld;
        len++;
	queue.insert({k:qv.n.sendsTo[i].rank,n:qv.n.sendsTo[i],v:nextPulse});
      }
      if (qv.n.sendsTo.length > 0 && weaklyHeld) {
          qv.n.weaklyHeld = true;
      }
    }
  }
};

//Event: Array Node b * ( (Pulse a -> Void) * Pulse b -> Void)
var EventStream = function (nodes,updater) {
  this.updater = updater;
  this.nodes = nodes; 
  this.sendsTo = []; //forward link
  this.weaklyHeld = false;
  
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].attachListener(this);
  }
  
  this.rank = ++lastRank;
};
EventStream.prototype = new Object();

//createNode: Array Node a * ( (Pulse b ->) * (Pulse a) -> Void) -> Node b
var createNode = function (nodes, updater) {
  return new EventStream(nodes,updater);
};

var genericAttachListener = function(node, dependent) {
  node.sendsTo.push(dependent);
  
  if(node.rank > dependent.rank) {
    var lowest = lastRank+1;
    var q = [dependent];
    while(q.length) {
      var cur = q.splice(0,1)[0];
      cur.rank = ++lastRank;
      q = q.concat(cur.sendsTo);
    }
  }
};

var genericRemoveListener = function (node, dependent, isWeakReference) {
  var foundSending = false;
  for (var i = 0; i < node.sendsTo.length && !foundSending; i++) {
    if (node.sendsTo[i] == dependent) {
      node.sendsTo.splice(i, 1);
      foundSending = true;
    }
  }

  if (isWeakReference === true && node.sendsTo.length == 0) {
    node.weaklyHeld = true;
  }
  
  return foundSending;
};

//attachListener: Node * Node -> Void
//flow from node to dependent
//note: does not add flow as counting for rank nor updates parent ranks
EventStream.prototype.attachListener = function(dependent) {
  if (!(dependent instanceof EventStream)) {
    throw 'attachListener: expected an EventStream';
  }
  genericAttachListener(this, dependent);
};


//note: does not remove flow as counting for rank nor updates parent ranks
EventStream.prototype.removeListener = function (dependent, isWeak) {
  if (!(dependent instanceof EventStream)) {
    throw 'removeListener: expected an EventStream';
  }

  genericRemoveListener(this, dependent, isWeak);
};


// An internalE is a node that simply propagates all pulses it receives.  It's used internally by various 
// combinators.
var internalE = function(dependsOn) {
  return createNode(dependsOn || [ ],function(pulse) { return pulse; });
}

var zeroE = function() {
  return createNode([],function(pulse) {
      throw ('zeroE : received a value; zeroE should not receive a value; the value was ' + pulse.value);
  });
};


var oneE = function(val) {
  var sent = false;
  var evt = createNode([],function(pulse) {
    if (sent) {
      throw ('oneE : received an extra value');
    }
    sent = true;
    return pulse;
  });
  window.setTimeout(function() { sendEvent(evt,val); },0);
  return evt;
};


// a.k.a. mplus; mergeE(e1,e2) == mergeE(e2,e1)
var mergeE = function() {
  if (arguments.length == 0) {
    return zeroE();
  }
  else {
    var deps = slice(arguments,0);
    return internalE(deps);
  }
};


EventStream.prototype.mergeE = function() {
  var deps = slice(arguments,0);
  deps.push(this);
  return internalE(deps);
};


EventStream.prototype.constantE = function(constantValue) {
  return createNode([this],function(pulse) {
    pulse.value = constantValue;
    return pulse;
  });
};


var constantE = function(e,v) { return e.constantE(v); };


//This is up here so we can add things to its prototype that are in flapjax.combinators
/*var Behavior = function (event, init, updater) {
  if (!(event instanceof EventStream)) { 
    throw 'Behavior: expected event as second arg'; 
  }
  
  var behave = this;
  this.last = init;
  
  //sendEvent to this might impact other nodes that depend on this event
  //sendBehavior defaults to this one
  this.underlyingRaw = event;
  
  //unexposed, sendEvent to this will only impact dependents of this Behavior
  this.underlying = createNode([event], updater 
    ? function (p) {
        behave.last = updater(p.value); 
        p.value = behave.last; return p;
      } 
    : function (p) {
        behave.last = p.value;
        return p
      });
  
  this.upstreamChildren = new Array();
	var upstreamEvent = receiverE(); 
	upstreamEvent.mapE(function(value){
		if(upstreamTransformation==undefined){
			this.last = upstreamTransformation(value);
			this.underlying.sendEvent(this.last);
			for(index in upstreamChildren){
				if(upstreamChildren[index] instanceof Behavior)
					upstreamChildren[index].sendEvent(this.last);
			}
		}
		else{
			this.last = value;
		}
	});
	
	this.sendEvent = function(message){
		upstreamEvent.sendEvent(message);
	}
	this.attach = function(child){
		this.upstreamChildren.push(child);
		//var indices = slice(arguments, 2);
	}
  
};*/
var Behavior = function(eventStream, initialValue, downstreamTransformation, upstreamTransformation, parents){
	if (!(eventStream instanceof EventStream)) { 
	    throw 'Behavior: expected event as second arg'; 
	  }
	  
	  var behave = this;
	  this.last = initialValue;
      this.stamp = 0;


    this.firedBefore = function(b2){
        return behave.stamp<b2.stamp;
    }
    this.firedAfter = function(b2){
        return behave.stamp>b2.stamp;
    }
 
	this.underlyingRaw = eventStream;
	this.underlying = createNode([eventStream], downstreamTransformation 
    ? function (p) {
        behave.stamp = p.stamp;
        //log("<updater1> "+p.value);
        behave.last = downstreamTransformation(p.value); 
//log("</updater1> "+behave.last);
        p.value = behave.last; return p;
      } 
    : function (p) {
        //log("<updater2> "+p.value);
        behave.stamp = p.stamp;
        behave.last = p.value;
        //log("</updater2> "+p.value);
        return p
      });
      
	var upstreamEvent = receiverE(); 
	upstreamEvent.mapE(function(value){
	behave.last = value;
	if(upstreamTransformation!=undefined){
		var upstreamValues = upstreamTransformation(value);
		if(upstreamValues!=undefined){
			//log("upstreamValues Length: "+upstreamValues.length);
			//log(upstreamValues);
			if(upstreamValues.length==parents.length){
				//log("Matching Return count");
				for(index in parents){
					//log("Loop for index "+index + " "+ upstreamValues + value);
					var parent = parents[index];
					if(parent instanceof Behavior){
						if(upstreamValues[index]!=undefined){
 							//log("Sending Event "+upstreamValues[index]);
							parent.sendEvent(upstreamValues[index]);
							//log("Finished Sending Event");
						}				
						else{
							//log("upstream value "+index+" is undefined"); 
						}	
					}
					else{
						log("Parent "+index+" is not a behaviour");
					}
				}
			}
			else{
				log("Upstream transform returned wrong number of arguments was "+upstreamValues.length+" should be "+parents.length);		
			}
		}
		else{
			log("Upstream transformation returned undefined");		
		}
		behave.sendBehavior(value);			
	}
	else{
        	eventStream.sendEvent(value);
        }
        
        	
	});
	
	this.sendEvent = function(message){
		upstreamEvent.sendEvent(message);
	}
	this.valueNow = function(){
		return this.last;
	}
}
Behavior.prototype = new Object();



var receiverE = function() {
  var evt = internalE();
  evt.sendEvent = function(value) {
    propagatePulse(new Pulse(nextStamp(), value),evt);
  };
  return evt;
};


//note that this creates a new timestamp and new event queue
var sendEvent = function (node, value) {
    
  if (!(node instanceof EventStream)) { throw 'sendEvent: expected Event as first arg'; } //SAFETY
    //log("FLAPJAX INVERSE:517: "+value+" "+node);
  propagatePulse(new Pulse(nextStamp(), value),node);
};

// bindE :: EventStream a * (a -> EventStream b) -> EventStream b
EventStream.prototype.bindE = function(k) {
  /* m.sendsTo resultE
   * resultE.sendsTo prevE
   * prevE.sendsTo returnE
   */
  var m = this;
  var prevE = false;
  
  var outE = createNode([],function(pulse) { return pulse; });
  outE.name = "bind outE";
  
  var inE = createNode([m], function (pulse) {
    if (prevE) {
      prevE.removeListener(outE, true);
      
    }
    prevE = k(pulse.value);
    if (prevE instanceof EventStream) {
      prevE.attachListener(outE);
    }
    else {
      throw "bindE : expected EventStream";
    }

    return doNotPropagate;
  });
  inE.name = "bind inE";
  
  return outE;
};

EventStream.prototype.mapE = function(f) {
  if (!(f instanceof Function)) {
    throw ('mapE : expected a function as the first argument; received ' + f);
  };
  
  return createNode([this],function(pulse) {
    pulse.value = f(pulse.value);
    return pulse;
  });
};


EventStream.prototype.notE = function() { return this.mapE(function(v) { return !v; }); };


var notE = function(e) { return e.notE(); };


EventStream.prototype.filterE = function(pred) {
  if (!(pred instanceof Function)) {
    throw ('filterE : expected predicate; received ' + pred);
  };
  
  // Can be a bindE
  return createNode([this], function(pulse) {
    return pred(pulse.value) ? pulse : doNotPropagate;
  });
};


var filterE = function(e,p) { return e.filterE(p); };


// Fires just once.
EventStream.prototype.onceE = function() {
  var done = false;
  // Alternately: this.collectE(0,\n v -> (n+1,v)).filterE(\(n,v) -> n == 1).mapE(fst)
  return createNode([this],function(pulse) {
    if (!done) { done = true; return pulse; }
    else { return doNotPropagate; }
  });
};


var onceE = function(e) { return e.onceE(); };


EventStream.prototype.skipFirstE = function() {
  var skipped = false;
  return createNode([this],function(pulse) {
    if (skipped)
      { return pulse; }
    else
      { skipped = true; return doNotPropagate; }
  });
};


var skipFirstE = function(e) { return e.skipFirstE(); };


EventStream.prototype.collectE = function(init,fold) {
  var acc = init;
  return this.mapE(
    function (n) {
      var next = fold(n, acc);
      acc = next;
      return next;
    });
};


var collectE = function(e,i,f) { return e.collectE(i,f); };


// a.k.a. join
EventStream.prototype.switchE = function() {
  return this.bindE(function(v) { return v; });
};


var recE = function(fn) {
  var inE = receiverE(); 
  var outE = fn(inE); 
  outE.mapE(function(x) { 
    inE.sendEvent(x) }); 
  return outE; 
}


var switchE = function(e) { return e.switchE(); };


EventStream.prototype.ifE = function(thenE,elseE) {
  var testStamp = -1;
  var testValue = false;
  
  createNode([this],function(pulse) { testStamp = pulse.stamp; testValue = pulse.value; return doNotPropagate; });
  
  return mergeE(createNode([thenE],function(pulse) { if (testValue && (testStamp == pulse.stamp)) { send(pulse); } }),
    createNode([elseE],function(pulse) { if (!testValue && (testStamp == pulse.stamp)) { send(pulse); } }));
};


var ifE = function(test,thenE,elseE) {
  if (test instanceof EventStream)
    { return test.ifE(thenE,elseE); }
  else
    { return test ? thenE : elseE; }
};

    
var andE = function (/* . nodes */) {
  var nodes = slice(arguments, 0);
  
  var acc = (nodes.length > 0)? 
  nodes[nodes.length - 1] : oneE(true);
  
  for (var i = nodes.length - 2; i > -1; i--) {
    acc = ifE(
      nodes[i], 
      acc, 
      nodes[i].constantE(false));
  }
  return acc;
};


EventStream.prototype.andE = function( /* others */ ) {
  var deps = [this].concat(slice(arguments,0));
  return andE.apply(this,deps);
};


var orE = function () {
  var nodes = slice(arguments, 0);
  var acc = (nodes.length > 2)? 
  nodes[nodes.length - 1] : oneE(false); 
  for (var i = nodes.length - 2; i > -1; i--) {
    acc = ifE(
      nodes[i],
      nodes[i],
      acc);
  }
  return acc;
};


EventStream.prototype.orE = function(/*others*/) {
  var deps = [this].concat(slice(arguments,0));
  return orE.apply(this,deps);
};


var delayStaticE = function (event, time) {
  
  var resE = internalE();
  
  createNode([event], function (p) { 
    setTimeout(function () { sendEvent(resE, p.value);},  time ); 
    return doNotPropagate;
  });
  
  return resE;
};

//delayE: Event a * [Behavior] Number ->  Event a
EventStream.prototype.delayE = function (time) {
  var event = this;
  
  if (time instanceof Behavior) {
    
    var receiverEE = internalE();
    var link = 
    {
      from: event, 
      towards: delayStaticE(event, valueNow(time))
    };
    
    //TODO: Change semantics such that we are always guaranteed to get an event going out?
    var switcherE = 
    createNode(
      [changes(time)],
      function (p) {
        link.from.removeListener(link.towards); 
        link =
        {
          from: event, 
          towards: delayStaticE(event, p.value)
        };
        sendEvent(receiverEE, link.towards);
        return doNotPropagate;
      });
    
    var resE = receiverEE.switchE();
    
    sendEvent(switcherE, valueNow(time));
    return resE;
    
      } else { return delayStaticE(event, time); }
};


var delayE = function(sourceE,interval) {
  return sourceE.delayE(interval);
};


//mapE: ([Event] (. Array a -> b)) . Array [Event] a -> [Event] b
var mapE = function (fn /*, [node0 | val0], ...*/) {
  //      if (!(fn instanceof Function)) { throw 'mapE: expected fn as second arg'; } //SAFETY
  
  var valsOrNodes = slice(arguments, 0);
  //selectors[i]() returns either the node or real val, optimize real vals
  var selectors = [];
  var selectI = 0;
  var nodes = [];
  for (var i = 0; i < valsOrNodes.length; i++) {
    if (valsOrNodes[i] instanceof EventStream) {
      nodes.push(valsOrNodes[i]);
      selectors.push( 
        (function(ii) {
            return function(realArgs) { 
              return realArgs[ii];
            };
        })(selectI));
      selectI++;
    } else {
      selectors.push( 
        (function(aa) { 
            return function () {
              return aa;
            }; 
        })(valsOrNodes[i]));
    } 
  }
  
  var context = this;
  var nofnodes = slice(selectors,1);
  
  if (nodes.length === 0) {
    return oneE(fn.apply(context, valsOrNodes));
  } else if ((nodes.length === 1) && (fn instanceof Function)) {
    return nodes[0].mapE(
      function () {
        var args = arguments;
        return fn.apply(
          context, 
          map(function (s) {return s(args);}, nofnodes));
      });
  } else if (nodes.length === 1) {
    return fn.mapE(
      function (v) {
        var args = arguments;
        return v.apply(
          context, 
          map(function (s) {return s(args);}, nofnodes));
      });                
  } else if (fn instanceof Function) {
    return createTimeSyncNode(nodes).mapE(
      function (arr) {
        return fn.apply(
          this,
          map(function (s) { return s(arr); }, nofnodes));
      });
  } else if (fn instanceof EventStream) {
    return createTimeSyncNode(nodes).mapE(
      function (arr) {
        return arr[0].apply(
          this, 
          map(function (s) {return s(arr); }, nofnodes));
      });
      } else {throw 'unknown mapE case';}
};


EventStream.prototype.snapshotE = function (valueB) {
  return createNode([this], function (pulse) {
    pulse.value = valueNow(valueB);
    return pulse;
  });
};


var snapshotE = function(triggerE,valueB) {
  return triggerE.snapshotE(valueB);
};


EventStream.prototype.filterRepeatsE = function(optStart) {
  var hadFirst = optStart === undefined ? false : true;
  var prev = optStart;

  return this.filterE(function (v) {
    if (!hadFirst || !(isEqual(prev,v))) {
      hadFirst = true;
      prev = v;
      return true;
    }
    else {
      return false;
    }
  });
};


var filterRepeatsE = function(sourceE,optStart) {
  return sourceE.filterRepeatsE(optStart);
};


//credit Pete Hopkins
var calmStaticE = function (triggerE, time) {
  var out = internalE();
  createNode(
    [triggerE],
    function() {
      var towards = null;
      return function (p) {
        if (towards !== null) { clearTimeout(towards); }
        towards = setTimeout( function () { towards = null; sendEvent(out,p.value) }, time );
        return doNotPropagate;
      };
    }());
  return out;
};

//calmE: Event a * [Behavior] Number -> Event a
EventStream.prototype.calmE = function(time) {
  if (time instanceof Behavior) {
    var out = internalE();
    createNode(
      [this],
      function() {
        var towards = null;
        return function (p) {
          if (towards !== null) { clearTimeout(towards); }
          towards = setTimeout( function () { towards = null; sendEvent(out,p.value) }, valueNow(time));
          return doNotPropagate;
        };
      }());
    return out;
  } else {
    return calmStaticE(this,time);       
  }
};


var calmE = function(sourceE,interval) {
  return sourceE.calmE(interval);
};


EventStream.prototype.blindE = function (time) {
  return createNode(
    [this],
    function () {
      var intervalFn = 
      time instanceof Behavior?
      function () { return valueNow(time); }
      : function () { return time; };
      var lastSent = (new Date()).getTime() - intervalFn() - 1;
      return function (p) {
        var curTime = (new Date()).getTime();
        if (curTime - lastSent > intervalFn()) {
          lastSent = curTime;
          return p;
        }
        else { return doNotPropagate; }
      };
    }());
};


var blindE = function(sourceE,interval) {
  return sourceE.blindE(interval);
};


EventStream.prototype.startsWith = function(init) {
  return new Behavior(this,init);
};


var startsWith = function(e,init) {
  if (!(e instanceof EventStream)) {
    throw 'startsWith: expected EventStream; received ' + e;
  }
  return e.startsWith(init); 
};


Behavior.prototype.valueNow = function() {
  return this.last;
};
var valueNow = function(behavior) { return behavior.valueNow(); };


Behavior.prototype.changes = function() {
  return this.underlying;
};


var changes = function (behave) { return behave.changes(); }


Behavior.prototype.switchB = function() {
  var BehaviorCreatorsB = this;
  var init = valueNow(BehaviorCreatorsB);
  
  var prevSourceE = null;
  
  var receiverE = new internalE();
  
  //XXX could result in out-of-order propagation! Fix!
  var makerE = 
  createNode(
    [changes(BehaviorCreatorsB)],
    function (p) {
      if (!(p.value instanceof Behavior)) { throw 'switchB: expected Behavior as value of Behavior of first argument'; } //SAFETY
      if (prevSourceE != null) {
        prevSourceE.removeListener(receiverE);
      }
      
      prevSourceE = changes(p.value);
      prevSourceE.attachListener(receiverE);
      
      sendEvent(receiverE, valueNow(p.value));
      return doNotPropagate;
    });
  
  if (init instanceof Behavior) {
    sendEvent(makerE, init);
  }
  
  return startsWith(
    receiverE,
    init instanceof Behavior? valueNow(init) : init);
};


var switchB = function (b) { return b.switchB(); };


//TODO test, signature
var timerB = function(interval) {
  return startsWith(timerE(interval), (new Date()).getTime());
};


//TODO test, signature
var delayStaticB = function (triggerB, time, init) {
  return startsWith(delayStaticE(changes(triggerB), time), init);
};

//TODO test, signature
Behavior.prototype.delayB = function (time, init) {
  var triggerB = this;
  if (time instanceof Behavior) {
    return startsWith(
      delayE(
        changes(triggerB), 
        time),
      arguments.length > 3 ? init : valueNow(triggerB));
  } else {
    return delayStaticB(
      triggerB, 
      time,
      arguments.length > 3 ? init : valueNow(triggerB));
  }
};


var delayB = function(srcB, timeB, init) { 
  return srcB.delayB(timeB,init); 
};


//artificially send a pulse to underlying event node of a Behavior
//note: in use, might want to use a receiver node as a proxy or an identity map
Behavior.prototype.sendBehavior = function(val) {
  sendEvent(this.underlyingRaw,val);
};
Behavior.prototype.sendBehavior = Behavior.prototype.sendBehavior;

var sendBehavior = function (b,v) { b.sendBehavior(v); };



Behavior.prototype.ifB = function(trueB,falseB) {
  var testB = this;
  //TODO auto conversion for Behavior funcs
  if (!(trueB instanceof Behavior)) { trueB = constantB(trueB); }
  if (!(falseB instanceof Behavior)) { falseB = constantB(falseB); }
  return liftB(function(te,t,f) { return te ? t : f; },testB,trueB,falseB);
};


var ifB = function(test,cons,altr) {
  if (!(test instanceof Behavior)) { test = constantB(test); };
  
  return test.ifB(cons,altr);
};



//condB: . [Behavior boolean, Behavior a] -> Behavior a
var condB = function (/* . pairs */ ) {
  var pairs = slice(arguments, 0);
return liftB.apply({},[function() {
    for(var i=0;i<pairs.length;i++) {
      if(arguments[i]) return arguments[pairs.length+i];
    }
    return undefined;
  }].concat(map(function(pair) {return pair[0];},pairs).concat(map(function(pair) {return pair[1];},pairs))));
};


//TODO optionally append to objects
//createConstantB: a -> Behavior a
var constantB = function (val) {
  return new Behavior(internalE(), val);
};

var liftBI = function (functionDown, functionUp, parents) {
	  var parents = slice(arguments, 2);
	args = parents; 
	//dependencies
	  var constituentsE =
	    map(changes,
	    filter(function (v) { return v instanceof Behavior; },
	    		parents));
	  
	  //calculate new vals
	  var getCur = function (v) {
	    return v instanceof Behavior ? v.last : v;
	  };
	  
	  var ctx = this;
	  var getRes = function () {
	    return getCur(functionDown).apply(ctx, map(getCur, parents));
	  };

	  if(constituentsE.length == 1) {
	    return new Behavior(constituentsE[0],getRes(),getRes, functionUp, parents);
	  }
	    
	  //gen/send vals @ appropriate time
	  var prevStamp = -1;
	  var mid = createNode(constituentsE, function (p) {
	    if (p.stamp != prevStamp) {
	      prevStamp = p.stamp;
	      return p; 
	    }
	    else {
	      return doNotPropagate;
	    }
	  });
	  //log("Behaviour with multiple parents detected");
	  return new Behavior(mid,getRes(),getRes, functionUp, parents);
	};

	Behavior.prototype.liftBI = function(functionDown, functionUp, parents) {		
		return liftBI.apply(this,[functionDown, functionUp].concat([this]).concat(parents));
	};
	
var liftB = function (fn  /*behaves*/ ) {

  var args = slice(arguments, 1);
  
  //dependencies
  var constituentsE =
    map(changes,
    filter(function (v) { return v instanceof Behavior; },
      arguments));
  
  //calculate new vals
  var getCur = function (v) {
    return v instanceof Behavior ? v.last : v;
  };
  
  var ctx = this;
  var getRes = function () {
    return getCur(fn).apply(ctx, map(getCur, args));
  };
  var res = getRes();
  if(constituentsE.length == 1) {
    return new Behavior(constituentsE[0],res,getRes);
  }
   
  //gen/send vals @ appropriate time
  var prevStamp = -1;
  var mid = createNode(constituentsE, function (p) {
    if (p.stamp != prevStamp) {
      prevStamp = p.stamp;
      return p; 
    }
    else {
      return doNotPropagate;
    }
  });
  
  return new Behavior(mid,getRes(),getRes); 
};


Behavior.prototype.liftB = function(/* args */) {
  var args= slice(arguments,0).concat([this]);
  return liftB.apply(this,args);
};


var andB = function (/* . behaves */) {
return liftB.apply({},[function() {
    for(var i=0; i<arguments.length; i++) {if(!arguments[i]) return false;}
    return true;
}].concat(slice(arguments,0)));
};


Behavior.prototype.andB = function() {
  return andB([this].concat(arguments));
};


var orB = function (/* . behaves */ ) {
return liftB.apply({},[function() {
    for(var i=0; i<arguments.length; i++) {if(arguments[i]) return true;}
    return false;
}].concat(slice(arguments,0)));
};


Behavior.prototype.orB = function () {
  return orB([this].concat(arguments));
};


Behavior.prototype.notB = function() {
  return this.liftB(function(v) { return !v; });
};


var notB = function(b) { return b.notB(); };


Behavior.prototype.blindB = function (intervalB) {
  return changes(this).blindE(intervalB).startsWith(this.valueNow());
};


var blindB = function(srcB,intervalB) {
  return srcB.blindB(intervalB);
};


Behavior.prototype.calmB = function (intervalB) {
  return this.changes().calmE(intervalB).startsWith(this.valueNow());
};


var calmB = function (srcB,intervalB) { 
  return srcB.calmB(intervalB);
};

  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM Utilities

//credit Scott Andrew
var addEvent = function (obj, evType, fn) {
  //TODO encode mouseleave evt, formalize new evt interface
  
  if (obj.addEventListener) {
    obj.addEventListener(evType, fn, false); //TODO true fails on Opera
    return true;
  } else if (obj.attachEvent) {
    //some reason original had code bloat here
    return obj.attachEvent("on"+evType, fn); 
  } else {
    return false; 
  }
};


// The Flapjax library does not use this function  
//credit Dustin Diaz 
//note: node/tag optional
//getElementsByClass: Regexp CSSSelector * Dom * String DomNodeEnum -> Array Dom
var getElementsByClass = function (searchClass, node, tag) {
  var classElements = [];
  if ( (node === null) || (node === undefined) ) { node = document; }
  if ( (tag === null) || (tag === undefined) ) { tag = '*'; }
  var els = node.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
  for (var i = 0, j = 0; i < elsLen; i++) {
    if ( pattern.test(els[i].className) ) {
      classElements.push(els[i]);
    }
  }
  return classElements;
};


//assumes IDs already preserved
//swapDom: (Dom a U String) [* (Dom b U String)] -> Dom a
var swapDom = function(replaceMe, withMe) {
  if ((replaceMe === null) || (replaceMe === undefined)) { throw ('swapDom: expected dom node or id, received: ' + replaceMe); } //SAFETY
  
  var replaceMeD = getObj(replaceMe);
  if (!(replaceMeD.nodeType > 0)) { throw ('swapDom expected a Dom node as first arg, received ' + replaceMeD); } //SAFETY
  
  if (withMe) {
    var withMeD = getObj(withMe);
    if (!(withMeD.nodeType > 0)) { throw 'swapDom: can only swap with a DOM object'; } //SAFETY
    try {
      if (replaceMeD.parentNode == null) { return withMeD; }
      if(withMeD != replaceMeD) replaceMeD.parentNode.replaceChild(withMeD, replaceMeD);
    } catch (e) {
      throw('swapDom error in replace call: withMeD: ' + withMeD + ', replaceMe Parent: ' + replaceMeD + ', ' + e + ', parent: ' + replaceMeD.parentNode);                    
    }
  } else {
    replaceMeD.parentNode.removeChild(replaceMeD); //TODO isolate child and set innerHTML to "" to avoid psuedo-leaks?
  }
  return replaceMeD;
};


//getObj: String U Dom -> Dom
//throws 
//  'getObj: expects a Dom obj or Dom id as first arg'
//  'getObj: flapjax: cannot access object'
//  'getObj: no obj to get
//also known as '$'
//TODO Maybe alternative?
var getObj = function (name) {
  if (typeof(name) == 'object') { return name; }
  else if ((typeof(name) == 'null') || (typeof(name) == 'undefined')) {
    throw 'getObj: expects a Dom obj or Dom id as first arg';
  } else {
    
    var res = 
    document.getElementById ? document.getElementById(name) :
    document.all ? document.all[name] :
    document.layers ? document.layers[name] :
    (function(){ throw 'getObj: flapjax: cannot access object';})();
    if ((res === null) || (res === undefined)) { 
      throw ('getObj: no obj to get: ' + name); 
    }
    return res;
  }
};

var $ = getObj;



//helper to reduce obj look ups
//getDynObj: domNode . Array (id) -> domObj
//obj * [] ->  obj
//obj * ['position'] ->  obj
//obj * ['style', 'color'] ->  obj.style
var getMostDom = function (domObj, indices) {
  var acc = getObj(domObj);
  if ( (indices === null) || (indices === undefined) || (indices.length < 1)) {
    return acc;
  } else {
    for (var i = 0; i < indices.length - 1; i++) {
      acc = acc[indices[i]];
    }
    return acc;
  }       
};

var getDomVal = function (domObj, indices) {
  var val = getMostDom(domObj, indices);
  if (indices && indices.length > 0) {
    val = val[indices[indices.length - 1]];
  }
  return val;
};

//TODO: manual timer management stinks.
// TODO: Name turn off or somethin
var ___timerID = 0;
var __getTimerId = function () { return ++___timerID; };    
var timerDisablers = [];

var disableTimerNode = function (node) { timerDisablers[node.__timerId](); };

var disableTimer = function (v) {
  if (v instanceof Behavior) { 
    disableTimerNode(v.underlyingRaw); 
  } else if (v instanceof EventStream) {
    disableTimerNode(v);
  }
};

var createTimerNodeStatic = function (interval) {
  var primEventE = internalE();
  primEventE.__timerId = __getTimerId();

  var listener = function(evt) {
    if (!primEventE.weaklyHeld) {
      sendEvent(primEventE, (new Date()).getTime());
    }
    else {
      clearInterval(timer);
      isListening = false;
    }
    return true;
  };

  var timer = setInterval(listener, interval);
  timerDisablers[primEventE.__timerId] = function () {clearInterval(timer); };
  return primEventE;
};

var timerE = function (interval) {
  if (interval instanceof Behavior) {
    var receiverE = internalE();
    
    //the return
    var res = receiverE.switchE();
    
    //keep track of previous timer to disable it
    var prevE = createTimerNodeStatic(valueNow(interval));
    
    //init
    sendEvent(receiverE, prevE);
    
    //interval changes: collect old timer
    createNode(
      [changes(interval)],
      function (p) {
        disableTimerNode(prevE); 
        prevE = createTimerNodeStatic(p.value);
        sendEvent(receiverE, prevE);
        return doNotPropagate;
      });
    
    res.__timerId = __getTimerId();
    timerDisablers[res.__timerId] = function () {
      disableTimerNode[prevE]();
      return;
    };
    
    return res;
  } else {
    return createTimerNodeStatic(interval);
  }
};


// Applies f to each element of a nested array.
var deepEach = function(arr, f) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      deepEach(arr[i], f);
    }
    else {
      f(arr[i]);
    }
  }
};


var mapWithKeys = function(obj, f) {
  for (var ix in obj) {
    if (!(Object.prototype && Object.prototype[ix] == obj[ix])) {
      f(ix, obj[ix]);
    }
  }
}


var insertAfter = function(parent, newChild, refChild) {
  if (typeof refChild != "undefined" && refChild.nextSibling) {
    parent.insertBefore(newChild, refChild.nextSibling);
  }
  else {
    // refChild == parent.lastChild
    parent.appendChild(newChild);
  }
};


var swapChildren = function(parent, existingChildren, newChildren) {
  var end = Math.min(existingChildren.length, newChildren.length);
  var i;

  for (i = 0; i < end; i++) {
    parent.replaceChild(newChildren[i], existingChildren[i]);
  }

  var lastInsertedChild = existingChildren[i - 1];

  if (end < existingChildren.length) {
    for (i = end; i < existingChildren.length; i++) {
      parent.removeChild(existingChildren[i]);
    }
  }
  else if (end < newChildren.length) {
    for (i = end; i < newChildren.length; i++) {
      insertAfter(parent, newChildren[i], newChildren[i - 1]);
    }
  }
};


// elementize :: any -> node
var elementize /* not a word */ = function(maybeElement) {
  return (maybeElement.nodeType > 0) 
           ? maybeElement
           : document.createTextNode(maybeElement.toString());
};


var staticEnstyle = function(obj, prop, val) {
  if (val instanceof Object) {
    mapWithKeys(val, function(k, v) { enstyle(obj[prop], k, v); });
  }
  else {
    obj[prop] = val;
  }
};


var dynamicEnstyle = function(obj, prop, val) {
  if (val instanceof Behavior) {
    staticEnstyle(obj, prop, val.valueNow());
    val.liftB(function(v) {
      staticEnstyle(obj, prop, v);
    });
  }
  else if (val instanceof Object) {
    mapWithKeys(val, function(k, v) {
      dynamicEnstyle(obj[prop], k, v);
    });
  }
  else {
    obj[prop] = val;
  }
};
  

// makeTagB :: tagName -> elementB, ... -> element
var makeTagB = function(tagName) { return function() {
  var attribs, children;

  if (typeof(arguments[0]) == "object" && 
      !(arguments[0].nodeType > 0 || arguments[0] instanceof Behavior || 
        arguments[0] instanceof Array)) {
    attribs = arguments[0];
    children = slice(arguments, 1);
  }
  else {
    attribs = { };
    children = slice(arguments, 0);
  }
 
  var elt = document.createElement(tagName);

  mapWithKeys(attribs, function(name, val) {
    if (val instanceof Behavior) {
      elt[name] = val.valueNow();
      val.liftB(function(v) { 
        staticEnstyle(elt, name, v); });
    }
    else {
      dynamicEnstyle(elt, name, val);
    }
  });

  deepEach(children, function(child) {
    if (child instanceof Behavior) {
      var lastVal = child.valueNow();
      if (lastVal instanceof Array) {
        lastVal = map(elementize, lastVal);
        forEach(function(dynChild) { elt.appendChild(dynChild); }, lastVal);
        child.liftB(function(currentVal) {
          currentVal = map(elementize, currentVal);
          swapChildren(elt, lastVal, currentVal);
          lastVal = currentVal;
        });
      }
      else {
        lastVal = elementize(lastVal);
        elt.appendChild(lastVal);
        var lastValIx = elt.childNodes.length - 1; 
        child.liftB(function(currentVal) {
          currentVal = elementize(currentVal);
          if (lastVal.parentNode != elt) {
            elt.appendChild(currentVal) }
          else {
            elt.replaceChild(currentVal, lastVal) }
          lastVal = currentVal;
        });
      }
    }
    else {
      elt.appendChild(elementize(child));
    }
  });

  return elt;
} };




var generatedTags = 
[ "a", "b", "blockquote", "br", "button", "canvas", "div", "fieldset", 
"form", "font", "h1", "h2", "h3", "h4", "hr", "img", "iframe", "input", 
"label", "legend", "li", "ol", "optgroup", "option", 
"p", "pre", "select", "span", "strong", "table", "tbody", 
"td", "textarea", "tfoot", "th", "thead", "tr", "tt", "ul" ];

forEach(function(tagName) {
  this[tagName.toUpperCase()] = makeTagB(tagName);
}, generatedTags);


//TEXTB: Behavior a -> Behavior Dom TextNode    
TEXTB = function (strB) {
  //      if (!(strB instanceof Behavior || typeof(strB) == 'string')) { throw 'TEXTB: expected Behavior as second arg'; } //SAFETY
  if (!(strB instanceof Behavior)) { strB = constantB(strB); }
  
  return startsWith(
    changes(strB).mapE(
      function (txt) { return document.createTextNode(txt); }),
    document.createTextNode(valueNow(strB)));
};

var TEXT = function (str) {
  return document.createTextNode(str);
};

///////////////////////////////////////////////////////////////////////////////
// Reactive DOM

//tagRec: Array (EventName a) * 
//      ( .Array (Event a) * Array (Event a) -> Behavior Dom) -> Behavior Dom

// tagRec :: [EventName] * (EventStream DOMEvent, ... -> Element) -> Element
var tagRec = function (eventNames, maker) {
  if (!(eventNames instanceof Array)) { throw 'tagRec: expected array of event names as first arg'; } //SAFETY
  if (!(maker instanceof Function)) { throw 'tagRec: expected function as second arg'; } //SAFETY
  
  var numEvents = eventNames.length;

  var receivers = [ ];
  var i;
  for (i = 0; i < numEvents; i++) {
    receivers.push(internalE());
  }

  var elt = maker.apply(this, receivers);

  for (i = 0; i < numEvents; i++) {
    extractEventE(elt, eventNames[i]).attachListener(receivers[i]);
  }

  return elt;
};


//extractEventStaticE: Dom * String -> Event
var extractEventStaticE = function (domObj, eventName) {
  if (!eventName) { throw 'extractEventE : no event name specified'; }
  if (!domObj) { throw 'extractEventE : no DOM element specified'; }
  
  domObj = getObj(domObj);
  
  var primEventE = internalE();
  
  var isListening = false;

  var listener = function(evt) {
    if (!primEventE.weaklyHeld) {
      sendEvent(primEventE, evt || window.event);
    }
    else {
      domObj.removeEventListener(eventName, listener, false);
      isListening = false;
    }
    // Important for IE; false would prevent things like a checkbox actually
    // checking.
    return true;
  };
  

  primEventE.attachListener = function(dependent) {
    if (!isListening) {
      addEvent(domObj, eventName, listener);
      isListening = true;
    }
  
    genericAttachListener(primEventE, dependent);
  };

  primEventE.removeListener = function(dependent) {
    genericAttachListener(primEventE, dependent);

    if (isListening && (primEventE.sendsTo.length == 0)) {
      domObj.removeEventListener(eventName, listener, false);
      isListening = false;
    }
  };
  
  return primEventE;
};

//extractEventE: [Behavior] Dom * String -> Event
var extractEventE = function (domB, eventName) {
  if (!(domB instanceof Behavior)) {
    return extractEventStaticE(domB,eventName);
  }
  else {
    var domE = domB.changes();
    
    var eventEE = domE.mapE(function(dom) {
      return extractEventStaticE(dom,eventName);
    });
    
    var resultE = eventEE.switchE();
    
    sendEvent(domE,domB.valueNow());
    
    return resultE;
  };
};

var $E = extractEventE;


//extractEventsE: 
//      [Behavior] Dom  
//      . Array String
//      -> Event
// ex: extractEventsE(m, 'body', 'mouseover', 'mouseout')
extractEventsE = function (domObj /* . eventNames */) {
  var eventNames = slice(arguments, 1);
  
  var events = map(
    function (eventName) {
      return extractEventE(domObj, eventName); 
    },
    eventNames.length === 0 ? [] : eventNames);
  
  return mergeE.apply(this, events);
};

//value of dom form object during trigger
extractValueOnEventE = function (triggerE, domObj) {
  if (!(triggerE instanceof EventStream)) { throw 'extractValueOnEventE: expected Event as first arg'; } //SAFETY
  
  return changes(extractValueOnEventB.apply(this, arguments));
  
};

//extractDomFieldOnEventE: Event * Dom U String . Array String -> Event a
extractDomFieldOnEventE = function (triggerE, domObj /* . indices */) {
  if (!(triggerE instanceof EventStream)) { throw 'extractDomFieldOnEventE: expected Event as first arg'; } //SAFETY
  var indices = slice(arguments, 2);
  var res =
  triggerE.mapE(
    function () { return getDomVal(domObj, indices); });
  return res;
};

var extractValueE = function (domObj) {
  return changes(extractValueB.apply(this, arguments));
};

//extractValueOnEventB: Event * DOM -> Behavior
// value of a dom form object, polled during trigger
var extractValueOnEventB = function (triggerE, domObj) {
  return extractValueStaticB(domObj, triggerE);
};

//extractValueStaticB: DOM [ * Event ] -> Behavior a
//If no trigger for extraction is specified, guess one
extractValueStaticB = function (domObj, triggerE) {
  
  var objD;
  try {
    objD = getObj(domObj);
    //This is for IE
    if(typeof(domObj) == 'string' && objD.id != domObj) {
      throw 'Make a radio group';
    }
  } catch (e) {
    objD = {type: 'radio-group', name: domObj};
  }
  
  var getter; // get value at any current point in time
  
  var result;

  switch (objD.type)  {
    //TODO: checkbox.value instead of status?
  case 'checkbox': 
    result = startsWith(
      filterRepeatsE(
        extractDomFieldOnEventE(
          triggerE ? triggerE : 
          extractEventsE(
            objD, 
            'click', 'keyup', 'change'),
          objD,
          'checked'),objD.checked),
      objD.checked);
    break; 
  case 'select-one':
      getter = function (_) {                         
        return objD.selectedIndex > -1 ? 
        (objD.options[objD.selectedIndex].value ?
          objD.options[objD.selectedIndex].value :
          objD.options[objD.selectedIndex].innerText)
        : undefined;
      };
      result = startsWith(
        filterRepeatsE(
            (triggerE ? triggerE :
            extractEventsE(
              objD,
              'click', 'keyup', 'change')).mapE(getter)),getter(),
        getter());
      break;
  case 'select-multiple':
    //TODO ryan's cfilter adapted for equality check
    getter = function (_) {
      var res = [];
      for (var i = 0; i < objD.options.length; i++) {
        if (objD.options[i].selected) {
          res.push(objD.options[i].value ? objD.options[i].value : objD.options[i].innerText);
        }
      }
      return res;
    };
    result = startsWith(
        (triggerE ? triggerE : 
        extractEventsE(
          objD,
          'click', 'keyup', 'change')).mapE(getter),
      getter());
    break;
    
  case 'text':
  case 'textarea':
  case 'hidden':
  case 'password':
    result = startsWith(
      filterRepeatsE(
        extractDomFieldOnEventE(
          triggerE ? triggerE :
          extractEventsE(
            objD, 
            'click', 'keyup', 'change'),
          objD,
          'value'),objD.value),
      objD.value);
    break;
    
  case 'button': //same as above, but don't filter repeats
    result = startsWith(
      extractDomFieldOnEventE(
        triggerE ? triggerE :
        extractEventsE(
          objD, 
          'click', 'keyup', 'change'),
        objD,
        'value'),
      objD.value);
    break;
    
  case 'radio': 
  case 'radio-group':
    
    //TODO returns value of selected button, but if none specified,
    //      returns 'on', which is ambiguous. could return index,
    //      but that is probably more annoying
    
    var radiosAD = filter(
      function (elt) { 
        return (elt.type == 'radio') &&
        (elt.getAttribute('name') == objD.name); 
      },
      document.getElementsByTagName('input'));
    
    getter = 
    objD.type == 'radio' ?
    
    function (_) {
      return objD.checked;
    } :
    
    function (_) {
      for (var i = 0; i < radiosAD.length; i++) {
        if (radiosAD[i].checked) {
          return radiosAD[i].value; 
        }
      }
      return undefined; //TODO throw exn? 
    };
    
    var actualTriggerE = triggerE ? triggerE :
    mergeE.apply(
      this,
      map(
        function (radio) { 
          return extractEventsE(
            radio, 
        'click', 'keyup', 'change'); },
          radiosAD));
    
    result = startsWith(
      filterRepeatsE(
          actualTriggerE.mapE(getter),getter()),
      getter());
    break;
  default:
    throw ('extractValueStaticB: unknown value type "' + objD.type + '"');
  }

  return result;
};

var extractValueB = function (domObj) {
  if (domObj instanceof Behavior) {
    return liftB(function (dom) { return extractValueStaticB(dom); },
                  domObj)
           .switchB();
  } else {
    return extractValueStaticB(domObj);
  }
};
var $B = extractValueB;


//into[index] = deepValueNow(from) via descending from object and mutating each field
deepStaticUpdate = function (into, from, index) {
  var fV = (from instanceof Behavior)? valueNow(from) : from;
  if (typeof(fV) == 'object') {
    for (var i in fV) {
      if (!(Object.prototype) || !(Object.prototype[i])) {
        deepStaticUpdate(index? into[index] : into, fV[i], i);
      }
    }
  } else {
    var old = into[index];
    into[index] = fV;
  }
};

//note: no object may be time varying, just the fields
//into[index] = from
//only updates on changes
deepDynamicUpdate = function (into, from, index) {
  var fV = (from instanceof Behavior)? valueNow(from) : from;
  if (typeof(fV) == 'object') {
    if (from instanceof Behavior) {
      throw 'deepDynamicUpdate: dynamic collections not supported';
    }
    for (var i in fV) {
      if (!(Object.prototype) || !(Object.prototype[i])) {
        deepDynamicUpdate(index? into[index] : into, fV[i], i);
      }
    }
  } else {
    if (from instanceof Behavior) {
      createNode(
        [changes(from)],
        function (p) {
          if (index) { 
            var old = into[index];
            into[index] = p.value;
          }
          else { into = p.value; } //TODO notify topE?
          return doNotPropagate;
        });
    }
  }
};


insertValue = function (val, domObj /* . indices */) {
  var indices = slice(arguments, 2);
  var parent = getMostDom(domObj, indices);
  deepStaticUpdate(parent, val, indices ? indices[indices.length - 1] : undefined);      
};

//TODO convenience method (default to firstChild nodeValue) 
insertValueE = function (triggerE, domObj /* . indices */) {
  if (!(triggerE instanceof EventStream)) { throw 'insertValueE: expected Event as first arg'; } //SAFETY
  
  var indices = slice(arguments, 2);
  var parent = getMostDom(domObj, indices);
  
    triggerE.mapE(function (v) {
      deepStaticUpdate(parent, v, indices? indices[indices.length - 1] : undefined);
    });
};

//insertValueB: Behavior * domeNode . Array (id) -> void
//TODO notify adapter of initial state change?
insertValueB = function (triggerB, domObj /* . indices */) { 
  
  var indices = slice(arguments, 2);
  var parent = getMostDom(domObj, indices);
  
  
  //NOW
  deepStaticUpdate(parent, triggerB, indices ? indices[indices.length - 1] : undefined);
  
  //LATER
  deepDynamicUpdate(parent, triggerB, indices? indices[indices.length -1] : undefined);
  
};

//TODO copy dom event call backs of original to new? i don't thinks so
//  complication though: registration of call backs should be scoped
insertDomE = function (triggerE, domObj) {
  
  if (!(triggerE instanceof EventStream)) { throw 'insertDomE: expected Event as first arg'; } //SAFETY
  
  var objD = getObj(domObj);
  
  var res = triggerE.mapE(
    function (newObj) {
      //TODO safer check
      if (!((typeof(newObj) == 'object') && (newObj.nodeType == 1))) { 
        newObj = module.SPAN({}, newObj);
      }
      swapDom(objD, newObj);
      objD = newObj;
      return newObj; // newObj;
    });
  
  return res;
};

//insertDom: dom 
//          * dom 
//          [* (null | undefined | 'over' | 'before' | 'after' | 'leftMost' | 'rightMost' | 'beginning' | 'end']
//          -> void
// TODO: for consistency, switch replaceWithD, hookD argument order
insertDomInternal = function (hookD, replaceWithD, optPosition) {
  switch (optPosition)
  {
  case undefined:
  case null:
  case 'over':
    swapDom(hookD,replaceWithD);
    break;
  case 'before':  
    hookD.parentNode.insertBefore(replaceWithD, hookD);
    break;
  case 'after':
    if (hookD.nextSibling) {
      hookD.parentNode.insertBefore(replaceWithD, hookD.nextSibling);
    } else {
      hookD.parentNode.appendChild(replaceWithD);
    }
    break;
  case 'leftMost':
    if (hookD.parentNode.firstChild) { 
      hookD.parentNode.insertBefore(
        replaceWithD, 
        hookD.parentNode.firstChild);
              } else { hookD.parentNode.appendChild(replaceWithD); }
              break;
            case 'rightMost':
              hookD.parentNode.appendChild(replaceWithD);
              break;
            case 'beginning':
              if (hookD.firstChild) { 
                hookD.insertBefore(
                  replaceWithD, 
                  hookD.firstChild);
              } else { hookD.appendChild(replaceWithD); }
              break;
            case 'end':
              hookD.appendChild(replaceWithD);
              break;
            default:
              throw ('domInsert: unknown position: ' + optPosition);
  }
};

//insertDom: dom 
//          * dom U String domID 
//          [* (null | undefined | 'over' | 'before' | 'after' | 'leftMost' | 'rightMost' | 'beginning' | 'end']
//          -> void
insertDom = function (replaceWithD, hook, optPosition) {
  //TODO span of textnode instead of textnode?
  insertDomInternal(
    getObj(hook), 
    ((typeof(replaceWithD) == 'object') && (replaceWithD.nodeType > 0)) ? replaceWithD :
    document.createTextNode(replaceWithD),      
    optPosition);           
};

//TODO test
//insertDomB: 
//      [Behavior] String U Dom 
//      [* ( id U null U undefined ) 
//          [* ('before' U 'after' U 'leftMost' U 'rightMost' U 'over' U 'beginning' U 'end')]]
//      -> Behavior a
//if optID not specified, id must be set in init val of trigger
//if position is not specified, default to 'over'
//performs initial swap onload    
insertDomB = function (initTriggerB, optID, optPosition, unsafe) {
  
  if (!(initTriggerB instanceof Behavior)) { 
    initTriggerB = constantB(initTriggerB);
  }
  /*else if(initTriggerB instanceof Behavior)
	  return insertDomBI(initTriggerB, optID, optPosition, unsafe); */
  var triggerB = 
  liftB(
    function (d) { 
      if (unsafe === true) {
        var res = document.createElement('span');
        res.innerHTML = d;
        return res;
      }
      else if ((typeof(d) == 'object') && (d.nodeType >  0)) {
        return d;
      } else {
        var res = document.createElement('span'); //TODO createText instead
        res.appendChild(document.createTextNode(d));
        return res;
      }
    },
    initTriggerB);
  
  var initD = valueNow(triggerB);
  if (!((typeof(initD) == 'object') && (initD.nodeType == 1))) { throw ('insertDomB: initial value conversion failed: ' + initD); } //SAFETY  
  
  insertDomInternal(
    optID === null || optID === undefined ? getObj(initD.getAttribute('id')) : getObj(optID), 
    initD, 
    optPosition);
  
  var resB = startsWith(
    insertDomE(
      changes(triggerB),
      initD), 
    initD);
  
  return resB;
};
/*insertDomBI = function (initTriggerB, optID, optPosition, unsafe) {
	  if(!(initTriggerB instanceof Behavior))
		  initTriggerB = constantB(initTriggerB);
	  var triggerB = 
	  liftB(
	    function (d) {
	    	if(d instanceof Behavior)
	    		console.log("Inverse Behavior");
	    	else if(d instanceof Behavior)
	    		console.log("Behavior");
	    	console.log(typeof(d));
	    	if (unsafe === true) {
	        var res = document.createElement('span');
	        res.innerHTML = d;
	        return res;
	      }
	      else if ((typeof(d) == 'object') && (d.nodeType >  0)) {
	        return d;
	      } else {
	        var res = document.createElement('span'); //TODO createText instead
	        res.appendChild(document.createTextNode(d));
	        return res;
	      }
	    },
	    initTriggerB);
	  
	  var initD = valueNow(triggerB);
	  if (!((typeof(initD) == 'object') && (initD.nodeType == 1))) { throw ('insertDomB: initial value conversion failed: ' + initD); } //SAFETY  
	  
	  insertDomInternal(
	    optID === null || optID === undefined ? getObj(initD.getAttribute('id')) : getObj(optID), 
	    initD, 
	    optPosition);
	  
	  var resB =  new Behavior(this,insertDomE(
		      changes(triggerB),
		      initD));
	  return resB;
	};*/

var extractIdB = function (id, start)
{
  return startsWith(
    createNode( start instanceof Behavior? [changes(start)] :
      [],
      function (p) {
        p.value = getObj(id);
        return p;
      }),
    getObj(id));
};

var mouseE = function(elem) {
  return extractEventE(elem,'mousemove')
  .mapE(function(evt) {
      if (evt.pageX | evt.pageY) {
        return { left: evt.pageX, top: evt.pageY };
      }
      else if (evt.clientX || evt.clientY) {
        return { left : evt.clientX + document.body.scrollLeft,
                 top: evt.clientY + document.body.scrollTop };
      }
      else {
        return { left: 0, top: 0 };
      }
  });
};

var mouseB = function(elem) {
  return mouseE(elem).startsWith({ left: 0, top: 0 });
}


var mouseLeftB = function(elem) {
  return liftB(function(v) { return v.left; },mouseB(elem));
};


var mouseTopB = function(elem) {
  return mouseB(elem).liftB(function(v) { return v.top; });
};



var clicksE = function(elem) {
  return extractEventE(elem,'click');
};


//////////////////////////////////////////////////////////////////////////////
// Combinators for web services


//credit Matt White
var getURLParam = function (param) {
  var lparam = param.toLowerCase();
  var aReturn = [];
  var strHref = window.location.href;
  var endstr = (strHref.indexOf('#') > -1) ? strHref.indexOf('#') : strHref.length;
  if ( strHref.indexOf("?") > -1 ) {
    var strQueryString = strHref.substring(strHref.indexOf("?")+1,endstr);
    map(function(qp) {
        var eq = qp.indexOf('=');
        var qname = qp.substr(0,eq+1).toLowerCase();
        if(qname == lparam+"=") aReturn.push(decodeURIComponent(qp.substr(eq+1)));
    },strQueryString.split("&"));
  }
  if (aReturn.length == 0) return undefined;
  else if(aReturn.length == 1) return aReturn[0];
  else return aReturn;
};


//credit Quirksmode
//readCookie: String -> String U Undefined
var readCookie = function (name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i=0; i < ca.length; i++) {
    var co = ca[i];
    while (co.charAt(0) == ' ') { co = co.substring(1, co.length); }
    if (co.indexOf(nameEQ) === 0) { 
      return co.substring(nameEQ.length, co.length);
    }
  }
  return undefined;       
};


//========== dynamic scripts ==========
var scriptCounter = 0;
var deleteScript = function (scriptID) {
  var scriptD = getObj(scriptID);
  scriptD.parentNode.removeChild(scriptD); //TODO isolate child and set innerHTML to "" to avoid psuedo-leaks?
};

// optional fn/param that gets polled until parm is defined
var runScript = function (url, fn, param) {
  var script = document.createElement("script");
  script.src = url;
  var scriptID = 'scriptFnRPC' + scriptCounter++;
  script.setAttribute('id', scriptID);
  document.getElementsByTagName("head").item(0).appendChild(script);
  var timer = {};
  var check = 
  function () {
    eval("try { if (" + param + "!== undefined) {var stat = " + param + ";}} catch (e) {}");
    if (stat !== undefined) {
      eval(param + " = undefined;");
      clearInterval(timer.timer);
      clearInterval(timer.timeout);
      if (fn instanceof Function) {
        fn(stat); 
      }
      deleteScript(scriptID);
    }
  };
  timer.timer = setInterval(check, 3500);
  timer.timeout = 
  setTimeout( 
    function () { 
      try { clearInterval(timer.timer); }
      catch (e) {}
    },
    5000); //TODO make parameter?
};

// Node {url, globalArg} -> Node a
//load script @ url and poll until param is set, then pass it along
var evalForeignScriptValE = function(urlArgE) {
  var result = receiverE();
  urlArgE.mapE(function(urlArg) {
      runScript(urlArg.url,
        function(val) { result.sendEvent(val); }, 
        urlArg.globalArg);
  });
  
  return result;
};


var ajaxRequest = function(method,url,body,async,useFlash,callback) {
  var xhr;
  if (useFlash) {
    xhr = new FlashXMLHttpRequest();
    xhr.onload = function() { callback(xhr); };
  }
  else if (window.XMLHttpRequest && !(window.ActiveXObject)) {
    xhr = new window.XMLHttpRequest();
    xhr.onload = function() { callback(xhr); };
  }
  else if (window.ActiveXObject) {
    try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); }
    catch(e) { xhr = new ActiveXObject("Microsoft.XMLHTTP"); }
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) { callback(xhr); }
    };
  };
  
  xhr.open(method,url,async);
  
  if (method == 'POST') {
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  }
  
  xhr.send(body);
  return xhr;
};

var encodeREST = function(obj) {
  var str = "";
  for (var field in obj) {
    if (typeof(obj[field]) !== 'function') { // skips functions in the object
      if (str != '') { str += '&'; }
      str += field + '=' + encodeURIComponent(obj[field]);
    }
  }
  return str;
};

// From json.org
var parseJSON = function(str) {
  try {
      return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
              str.replace(/"(\\.|[^"\\])*"/g, ''))) &&
          eval('(' + str + ')');
  } catch (e) {
      throw 'cannot parse JSON string: ' + e;
  }
};

var toJSONString = (function() {
  var m = {
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"' : '\\"',
          '\\': '\\\\'
      };
  var s = {
    array: function (x) {
      var a = ['['], b, f, i, l = x.length, v;
      for (i = 0; i < l; i += 1) {
        v = x[i];
        f = s[typeof v];
        if (f) {
          v = f(v);
          if (typeof v == 'string') {
            if (b) {
              a[a.length] = ',';
            }
            a[a.length] = v;
            b = true;
          }
        }
      }
      a[a.length] = ']';
      return a.join('');
    },
    'boolean': function (x) {
      return String(x);
    },
    'null': function (x) {
      return "null";
    },
    number: function (x) {
      return isFinite(x) ? String(x) : 'null';
    },
    object: function (x) {
      if (x) {
        if (x instanceof Array) {
          return s.array(x);
        }
        var a = ['{'], b, f, i, v;
        for (i in x) {
          v = x[i];
          f = s[typeof v];
          if (f) {
            v = f(v);
            if (typeof v == 'string') {
              if (b) {
                a[a.length] = ',';
              }
              a.push(s.string(i), ':', v);
              b = true;
            }
          }
        }
        a[a.length] = '}';
        return a.join('');
      }
      return 'null';
    },
    string: function (x) {
      if (/["\\\x00-\x1f]/.test(x)) {
        x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
            var c = m[b];
            if (c) {
              return c;
            }
            c = b.charCodeAt();
            return '\\u00' +
            Math.floor(c / 16).toString(16) +
            (c % 16).toString(16);
        });
      }
      return '"' + x + '"';
    }
  };
  return function(val) {
    var f = s[typeof val];
    if (f) { return f(val); }
    else { return undefined }
  };
})();
 
var serverRequestE = function(useFlash,requestE) {
  var responseE = receiverE();

  requestE.mapE(function (obj) {
      var body = '';
      var method = 'GET';
      var url = obj.url;
      
      var reqType = obj.request ? obj.request : (obj.fields ? 'post' : 'get');
      if (obj.request == 'get') {
        url += "?" + encodeREST(obj.fields);
        body = '';
        method = 'GET';
      } else if (obj.request == 'post') {
        body = toJSONString(obj.fields); 
        method = 'POST';
      } else if (obj.request == 'rawPost') {
        body = obj.body;
        method = 'POST';
      }
      else if (obj.request == 'rest') {
        body = encodeREST(obj.fields);
        method = 'POST';
      }
      else {
        throw("Invalid request type: " + obj.request);
      }
      
      var async = obj.async;
      
      var xhr;
      
      // Branch on the response type to determine how to parse it
      if (obj.response == 'json') {
        xhr = ajaxRequest(method,url,body,async,useFlash,
          function(xhr) {
            responseE.sendEvent(parseJSON(xhr.responseText)); 
          });
      }
      else if (obj.response == 'xml') {
        ajaxRequest(method,url,body,async,useFlash,
          function(xhr) {
            responseE.sendEvent(xhr.responseXML);
          });
      }
      else if (obj.response == 'plain' || !obj.response) {
        ajaxRequest(method,url,body,async,useFlash,
          function(xhr) {
            responseE.sendEvent(xhr.responseText);
        });
      }
      else {
        throw('Unknown response format: ' + obj.response);
      }
    return doNotPropagate;
  });
  
  return responseE;
};

var getWebServiceObjectE = function(requestE) {
  return serverRequestE(false,requestE);
};


var getForeignWebServiceObjectE = function(requestE) {
  return serverRequestE(true,requestE);
};


var cumulativeOffset = function(element) {
  var valueT = 0, valueL = 0;
  do {
    valueT += element.offsetTop  || 0;
    valueL += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);
  return { left: valueL, top: valueT };
};

///////////////////////////////////////////////////////////////////////////////
// Flapjax compiler support

var mixedSwitchB = function(behaviorCreatorsB) {
  var init = behaviorCreatorsB.valueNow();
  
  var prevSourceE = null;

  var resultE = internalE();
  var listenerE = createNode([changes(behaviorCreatorsB)], function(pulse) {
    if (prevSourceE != null) {
      prevSourceE.removeListener(resultE);
      prevSourceE = null;
    }

    if (pulse.value instanceof Behavior) {
      prevSourceE = changes(pulse.value);
      prevSourceE.attachListener(resultE); 
      return { stamp: pulse.stamp, value: pulse.value.valueNow() };
    }
    else {
      return pulse;
    }
  });

  listenerE.attachListener(resultE);

  return resultE.startsWith(init instanceof Behavior ? valueNow(init) : init);
};

var compilerInsertDomB = function(mixedB, target) {
  if (mixedB instanceof Behavior) {
    insertDomB(mixedSwitchB(mixedB), target, "over"); 
  }
  else {
    insertDomB(mixedB, target, "over");
  }
};

var compilerInsertValueB = function(mixedB,target,attrib) {
  if (typeof(mixedB) == "object") {
    for (var ix in mixedB) {
      if (Object.prototype && Object.prototype[ix]) {
        continue; }
      if (mixedB[ix] instanceof Behavior) {
        insertValueB(mixedSwitchB(mixedB[ix]),target,attrib,ix); }
      else {
        insertValueB(constantB(mixedB[ix]),target,attrib,ix); }};
  }
  else {
    insertValueB(mixedSwitchB(mixedB),target,attrib); }};


var compilerLift = function(f /* , args ... */) {
  checkBehavior: {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] instanceof Behavior) {
        break checkBehavior; } }
    return f.apply(this,slice(arguments,1));
  }

  // Assume some argument is a behavior.  This should always work.  We can
  // optimize later.
  var resultE = internalE();
  var r = liftB.apply(this,arguments);
  if (!(r instanceof Behavior)) {
    return r;
  }
  if (r.valueNow() instanceof EventStream) {
    return r.valueNow();
  }
  else {
    return mixedSwitchB(r);
  }
};

var compilerCall = function(f /* , args ... */) {
  return compilerLift.apply(this,arguments);
};
   

var compilerIf = function(test,cons,alt) {
  if (test instanceof Behavior) {
    return test.liftB(function(v) { return v ? cons : alt; }).switchB();
  }
  else {
    return test ? cons : alt;
  }
};
  

var unBehavior = function(recompute) { return function(v) {
  if (v instanceof Behavior) {
    if (v.valueNow() instanceof Behavior) {
      return unBehavior(recompute)(v.valueNow());
    }
    else {
      v.changes().attachListener(recompute(v.changes()));
      return unBehavior()(v.valueNow());
    }
  }
  else if (typeof v == 'function') {
    return function() {
      var r = v.apply(this,arguments);
      return unBehavior(recompute)(r);
    }
  }
  else {
    return v;
  };
}};

// compilerEventStreamArg :: Behavior a -> a
var compilerEventStreamArg = function(x) {
  if (x instanceof Behavior) {
    return compilerEventStreamArg(x.valueNow()); }
  else if (typeof(x) == "function") {
    return function() {
      return compilerEventStreamArg(x.apply(this,arguments)); }}
  else {
    return x; }};

var map1 = function(f,src) { 
  var dest = [ ];
  for (var i = 0; i < src.length; i++) { dest.push(f(src[i])); }
  return dest;
};

var compilerUnbehavior = function(v) {
  if (typeof v == 'undefined' || v.nodeType > 0 || 
      v == Date || v == Math || v == window) {
    return v
  }
  else if (typeof v == 'function') {
    var f =  function() {
      // These values may contain behaviors.
      var originalArgs = slice(arguments,0);

      var srcs = [ ];

      var recompute = function(src) {
        srcs.push(src);
        return recomputeE;
      };

      var resultE = internalE();
      
      var recomputeE = createNode([],function(send,_) {
        // Some argument changed.  We will recompute new values for all
        // arguments.
        map1(function(src) { src.removeListener(recomputeE); },srcs);
        srcs = [ ];
        var args = map1(unBehavior(recompute),originalArgs);
        var r = v.apply(this,args);
        sendEvent(resultE,r);
      });

      return resultE.startsWith(v.apply(this,map1(unBehavior(recompute),
                                              originalArgs)));
    }
    return f;
  }
  else {
    return v;
  }
};
try
{
  if (constantB !== undefined)
  this.constantB = constantB
}
catch (_) {
            ;
          };
try
{
  if (delayB !== undefined)
  this.delayB = delayB
}
catch (_) {
            ;
          };
try
{
  if (calmB !== undefined)
  this.calmB = calmB
}
catch (_) {
            ;
          };
try
{
  if (blindB !== undefined)
  this.blindB = blindB
}
catch (_) {
            ;
          };
try
{
  if (valueNow !== undefined)
  this.valueNow = valueNow
}
catch (_) {
            ;
          };
try
{
  if (switchB !== undefined)
  this.switchB = switchB
}
catch (_) {
            ;
          };
try
{
  if (andB !== undefined)
  this.andB = andB
}
catch (_) {
            ;
          };
try
{
  if (orB !== undefined)
  this.orB = orB
}
catch (_) {
            ;
          };
try
{
  if (notB !== undefined)
  this.notB = notB
}
catch (_) {
            ;
          };
try
{
  if (liftB !== undefined)
  this.liftB = liftB
}
catch (_) {
            ;
          };
          
          try
          {
            if (liftBI !== undefined)
            this.liftBI = liftBI
          }
          catch (_) {;};

try
{
  if (condB !== undefined)
  this.condB = condB
}
catch (_) {
            ;
          };
try
{
  if (ifB !== undefined)
  this.ifB = ifB
}
catch (_) {
            ;
          };
try
{
  if (timerB !== undefined)
  this.timerB = timerB
}
catch (_) {
            ;
          };
try
{
  if (disableTimer !== undefined)
  this.disableTimer = disableTimer
}
catch (_) {
            ;
          };
try
{
  if (insertDomB !== undefined)
  this.insertDomB = insertDomB
}
catch (_) {
            ;
          };
try
{
  if (insertDom !== undefined)
  this.insertDom = insertDom
}
catch (_) {
            ;
          };
try
{
  if (mouseTopB !== undefined)
  this.mouseTopB = mouseTopB
}
catch (_) {
            ;
          };
try
{
  if (mouseLeftB !== undefined)
  this.mouseLeftB = mouseLeftB
}
catch (_) {
            ;
          };
try
{
  if (mouseB !== undefined)
  this.mouseB = mouseB
}
catch (_) {
            ;
          };
try
{
  if (extractValueB !== undefined)
  this.extractValueB = extractValueB
}
catch (_) {
            ;
          };
try
{
  if ($B !== undefined)
  this.$B = $B
}
catch (_) {
            ;
          };
try
{
  if (extractValueE !== undefined)
  this.extractValueE = extractValueE
}
catch (_) {
            ;
          };
try
{
  if (extractEventE !== undefined)
  this.extractEventE = extractEventE
}
catch (_) {
            ;
          };
try
{
  if ($E !== undefined)
  this.$E = $E
}
catch (_) {
            ;
          };
try
{
  if (clicksE !== undefined)
  this.clicksE = clicksE
}
catch (_) {
            ;
          };
try
{
  if (timerE !== undefined)
  this.timerE = timerE
}
catch (_) {
            ;
          };
try
{
  if (extractValueOnEventE !== undefined)
  this.extractValueOnEventE = extractValueOnEventE
}
catch (_) {
            ;
          };
try
{
  if (extractIdB !== undefined)
  this.extractIdB = extractIdB
}
catch (_) {
            ;
          };
try
{
  if (insertDomE !== undefined)
  this.insertDomE = insertDomE
}
catch (_) {
            ;
          };
try
{
  if (insertValueE !== undefined)
  this.insertValueE = insertValueE
}
catch (_) {
            ;
          };
try
{
  if (insertValueB !== undefined)
  this.insertValueB = insertValueB
}
catch (_) {
            ;
          };
try
{
  if (tagRec !== undefined)
  this.tagRec = tagRec
}
catch (_) {
            ;
          };
try
{
  if (getWebServiceObjectE !== undefined)
  this.getWebServiceObjectE = getWebServiceObjectE
}
catch (_) {
            ;
          };
try
{
  if (getForeignWebServiceObjectE !== undefined)
  this.getForeignWebServiceObjectE = getForeignWebServiceObjectE
}
catch (_) {
            ;
          };
try
{
  if (evalForeignScriptValE !== undefined)
  this.evalForeignScriptValE = evalForeignScriptValE
}
catch (_) {
            ;
          };
try
{
  if (oneE !== undefined)
  this.oneE = oneE
}
catch (_) {
            ;
          };
try
{
  if (zeroE !== undefined)
  this.zeroE = zeroE
}
catch (_) {
            ;
          };
try
{
  if (mapE !== undefined)
  this.mapE = mapE
}
catch (_) {
            ;
          };
try
{
  if (mergeE !== undefined)
  this.mergeE = mergeE
}
catch (_) {
            ;
          };
try
{
  if (switchE !== undefined)
  this.switchE = switchE
}
catch (_) {
            ;
          };
try
{
  if (filterE !== undefined)
  this.filterE = filterE
}
catch (_) {
            ;
          };
try
{
  if (ifE !== undefined)
  this.ifE = ifE
}
catch (_) {
            ;
          };
try
{
  if (recE !== undefined)
  this.recE = recE
}
catch (_) {
            ;
          };
try
{
  if (constantE !== undefined)
  this.constantE = constantE
}
catch (_) {
            ;
          };
try
{
  if (collectE !== undefined)
  this.collectE = collectE
}
catch (_) {
            ;
          };
try
{
  if (andE !== undefined)
  this.andE = andE
}
catch (_) {
            ;
          };
try
{
  if (orE !== undefined)
  this.orE = orE
}
catch (_) {
            ;
          };
try
{
  if (notE !== undefined)
  this.notE = notE
}
catch (_) {
            ;
          };
try
{
  if (filterRepeatsE !== undefined)
  this.filterRepeatsE = filterRepeatsE
}
catch (_) {
            ;
          };
try
{
  if (receiverE !== undefined)
  this.receiverE = receiverE
}
catch (_) {
            ;
          };
try
{
  if (sendEvent !== undefined)
  this.sendEvent = sendEvent
}
catch (_) {
            ;
          };
try
{
  if (snapshotE !== undefined)
  this.snapshotE = snapshotE
}
catch (_) {
            ;
          };
try
{
  if (onceE !== undefined)
  this.onceE = onceE
}
catch (_) {
            ;
          };
try
{
  if (skipFirstE !== undefined)
  this.skipFirstE = skipFirstE
}
catch (_) {
            ;
          };
try
{
  if (delayE !== undefined)
  this.delayE = delayE
}
catch (_) {
            ;
          };
try
{
  if (blindE !== undefined)
  this.blindE = blindE
}
catch (_) {
            ;
          };
try
{
  if (calmE !== undefined)
  this.calmE = calmE
}
catch (_) {
            ;
          };
try
{
  if (startsWith !== undefined)
  this.startsWith = startsWith
}
catch (_) {
            ;
          };
try
{
  if (changes !== undefined)
  this.changes = changes
}
catch (_) {
            ;
          };
try
{
  if (getElementsByClass !== undefined)
  this.getElementsByClass = getElementsByClass
}
catch (_) {
            ;
          };
try
{
  if (getObj !== undefined)
  this.getObj = getObj
}
catch (_) {
            ;
          };
try
{
  if ($ !== undefined)
  this.$ = $
}
catch (_) {
            ;
          };
try
{
  if (readCookie !== undefined)
  this.readCookie = readCookie
}
catch (_) {
            ;
          };
try
{
  if (swapDom !== undefined)
  this.swapDom = swapDom
}
catch (_) {
            ;
          };
try
{
  if (getURLParam !== undefined)
  this.getURLParam = getURLParam
}
catch (_) {
            ;
          };
try
{
  if (cumulativeOffset !== undefined)
  this.cumulativeOffset = cumulativeOffset
}
catch (_) {
            ;
          };
try
{
  if (map !== undefined)
  this.map = map
}
catch (_) {
            ;
          };
try
{
  if (A !== undefined)
  this.A = A
}
catch (_) {
            ;
          };
try
{
  if (B !== undefined)
  this.B = B
}
catch (_) {
            ;
          };
try
{
  if (BLOCKQUOTE !== undefined)
  this.BLOCKQUOTE = BLOCKQUOTE
}
catch (_) {
            ;
          };
try
{
  if (BR !== undefined)
  this.BR = BR
}
catch (_) {
            ;
          };
try
{
  if (BUTTON !== undefined)
  this.BUTTON = BUTTON
}
catch (_) {
            ;
          };
try
{
  if (CANVAS !== undefined)
  this.CANVAS = CANVAS
}
catch (_) {
            ;
          };
try
{
  if (DIV !== undefined)
  this.DIV = DIV
}
catch (_) {
            ;
          };
try
{
  if (FIELDSET !== undefined)
  this.FIELDSET = FIELDSET
}
catch (_) {
            ;
          };
try
{
  if (FORM !== undefined)
  this.FORM = FORM
}
catch (_) {
            ;
          };
try
{
  if (FONT !== undefined)
  this.FONT = FONT
}
catch (_) {
            ;
          };
try
{
  if (H1 !== undefined)
  this.H1 = H1
}
catch (_) {
            ;
          };
try
{
  if (H2 !== undefined)
  this.H2 = H2
}
catch (_) {
            ;
          };
try
{
  if (H3 !== undefined)
  this.H3 = H3
}
catch (_) {
            ;
          };
try
{
  if (H4 !== undefined)
  this.H4 = H4
}
catch (_) {
            ;
          };
try
{
  if (HR !== undefined)
  this.HR = HR
}
catch (_) {
            ;
          };
try
{
  if (IMG !== undefined)
  this.IMG = IMG
}
catch (_) {
            ;
          };
try
{
  if (IFRAME !== undefined)
  this.IFRAME = IFRAME
}
catch (_) {
            ;
          };
try
{
  if (INPUT !== undefined)
  this.INPUT = INPUT
}
catch (_) {
            ;
          };
try
{
  if (LABEL !== undefined)
  this.LABEL = LABEL
}
catch (_) {
            ;
          };
try
{
  if (LEGEND !== undefined)
  this.LEGEND = LEGEND
}
catch (_) {
            ;
          };
try
{
  if (LI !== undefined)
  this.LI = LI
}
catch (_) {
            ;
          };
try
{
  if (OL !== undefined)
  this.OL = OL
}
catch (_) {
            ;
          };
try
{
  if (OPTGROUP !== undefined)
  this.OPTGROUP = OPTGROUP
}
catch (_) {
            ;
          };
try
{
  if (OPTION !== undefined)
  this.OPTION = OPTION
}
catch (_) {
            ;
          };
try
{
  if (P !== undefined)
  this.P = P
}
catch (_) {
            ;
          };
try
{
  if (PRE !== undefined)
  this.PRE = PRE
}
catch (_) {
            ;
          };
try
{
  if (SELECT !== undefined)
  this.SELECT = SELECT
}
catch (_) {
            ;
          };
try
{
  if (SPAN !== undefined)
  this.SPAN = SPAN
}
catch (_) {
            ;
          };
try
{
  if (STRONG !== undefined)
  this.STRONG = STRONG
}
catch (_) {
            ;
          };
try
{
  if (TABLE !== undefined)
  this.TABLE = TABLE
}
catch (_) {
            ;
          };
try
{
  if (TBODY !== undefined)
  this.TBODY = TBODY
}
catch (_) {
            ;
          };
try
{
  if (TD !== undefined)
  this.TD = TD
}
catch (_) {
            ;
          };
try
{
  if (TEXTAREA !== undefined)
  this.TEXTAREA = TEXTAREA
}
catch (_) {
            ;
          };
try
{
  if (TFOOT !== undefined)
  this.TFOOT = TFOOT
}
catch (_) {
            ;
          };
try
{
  if (TH !== undefined)
  this.TH = TH
}
catch (_) {
            ;
          };
try
{
  if (THEAD !== undefined)
  this.THEAD = THEAD
}
catch (_) {
            ;
          };
try
{
  if (TR !== undefined)
  this.TR = TR
}
catch (_) {
            ;
          };
try
{
  if (TT !== undefined)
  this.TT = TT
}
catch (_) {
            ;
          };
try
{
  if (UL !== undefined)
  this.UL = UL
}
catch (_) {
            ;
          };
try
{
  if (TEXT !== undefined)
  this.TEXT = TEXT
}
catch (_) {
            ;
          };
try
{
  if (fold !== undefined)
  this.fold = fold
}
catch (_) {
            ;
          };
try
{
  if (foldR !== undefined)
  this.foldR = foldR
}
catch (_) {
            ;
          };
try
{
  if (map !== undefined)
  this.map = map
}
catch (_) {
            ;
          };
try
{
  if (filter !== undefined)
  this.filter = filter
}
catch (_) {
            ;
          };
try
{
  if (member !== undefined)
  this.member = member
}
catch (_) {
            ;
          };
try
{
  if (slice !== undefined)
  this.slice = slice
}
catch (_) {
            ;
          };
try
{
  if (forEach !== undefined)
  this.forEach = forEach
}
catch (_) {
            ;
          };
try
{
  if (toJSONString !== undefined)
  this.toJSONString = toJSONString
}
catch (_) {
            ;
          };
try
{
  if (compilerInsertDomB !== undefined)
  this.compilerInsertDomB = compilerInsertDomB
}
catch (_) {
            ;
          };
try
{
  if (compilerInsertValueB !== undefined)
  this.compilerInsertValueB = compilerInsertValueB
}
catch (_) {
            ;
          };
try
{
  if (compilerLift !== undefined)
  this.compilerLift = compilerLift
}
catch (_) {
            ;
          };
try
{
  if (compilerCall !== undefined)
  this.compilerCall = compilerCall
}
catch (_) {
            ;
          };
try
{
  if (compilerIf !== undefined)
  this.compilerIf = compilerIf
}
catch (_) {
            ;
          };
try
{
  if (compilerUnbehavior !== undefined)
  this.compilerUnbehavior = compilerUnbehavior
}
catch (_) {
            ;
          };
try
{
  if (compilerEventStreamArg !== undefined)
  this.compilerEventStreamArg = compilerEventStreamArg
}
catch (_) {
            ;
          };
try
{
  if (Behavior !== undefined)
  this.Behavior = Behavior
}
catch (_) {
            ;
          };
try
{
  if (EventStream !== undefined)
  this.EventStream = EventStream
}
catch (_) {
            ;
          };
}).apply(impl,[]);
this.constantB = impl.constantB;
this.delayB = impl.delayB;
this.calmB = impl.calmB;
this.blindB = impl.blindB;
this.valueNow = impl.valueNow;
this.switchB = impl.switchB;
this.andB = impl.andB;
this.orB = impl.orB;
this.notB = impl.notB;
this.liftB = impl.liftB;
this.liftBI = impl.liftBI;
this.condB = impl.condB;
this.ifB = impl.ifB;
this.timerB = impl.timerB;
this.disableTimer = impl.disableTimer;
this.insertDomB = impl.insertDomB;
this.insertDom = impl.insertDom;
this.mouseTopB = impl.mouseTopB;
this.mouseLeftB = impl.mouseLeftB;
this.mouseB = impl.mouseB;
this.extractValueB = impl.extractValueB;
this.$B = impl.$B;
this.extractValueE = impl.extractValueE;
this.extractEventE = impl.extractEventE;
this.$E = impl.$E;
this.clicksE = impl.clicksE;
this.timerE = impl.timerE;
this.extractValueOnEventE = impl.extractValueOnEventE;
this.extractIdB = impl.extractIdB;
this.insertDomE = impl.insertDomE;
this.insertValueE = impl.insertValueE;
this.insertValueB = impl.insertValueB;
this.tagRec = impl.tagRec;
this.getWebServiceObjectE = impl.getWebServiceObjectE;
this.getForeignWebServiceObjectE = impl.getForeignWebServiceObjectE;
this.evalForeignScriptValE = impl.evalForeignScriptValE;
this.oneE = impl.oneE;
this.zeroE = impl.zeroE;
this.mapE = impl.mapE;
this.mergeE = impl.mergeE;
this.switchE = impl.switchE;
this.filterE = impl.filterE;
this.ifE = impl.ifE;
this.recE = impl.recE;
this.constantE = impl.constantE;
this.collectE = impl.collectE;
this.andE = impl.andE;
this.orE = impl.orE;
this.notE = impl.notE;
this.filterRepeatsE = impl.filterRepeatsE;
this.receiverE = impl.receiverE;
this.sendEvent = impl.sendEvent;
this.snapshotE = impl.snapshotE;
this.onceE = impl.onceE;
this.skipFirstE = impl.skipFirstE;
this.delayE = impl.delayE;
this.blindE = impl.blindE;
this.calmE = impl.calmE;
this.startsWith = impl.startsWith;
this.changes = impl.changes;
this.getElementsByClass = impl.getElementsByClass;
this.getObj = impl.getObj;
this.$ = impl.$;
this.readCookie = impl.readCookie;
this.swapDom = impl.swapDom;
this.getURLParam = impl.getURLParam;
this.cumulativeOffset = impl.cumulativeOffset;
this.map = impl.map;
this.A = impl.A;
this.B = impl.B;
this.BLOCKQUOTE = impl.BLOCKQUOTE;
this.BR = impl.BR;
this.BUTTON = impl.BUTTON;
this.CANVAS = impl.CANVAS;
this.DIV = impl.DIV;
this.FIELDSET = impl.FIELDSET;
this.FORM = impl.FORM;
this.FONT = impl.FONT;
this.H1 = impl.H1;
this.H2 = impl.H2;
this.H3 = impl.H3;
this.H4 = impl.H4;
this.HR = impl.HR;
this.IMG = impl.IMG;
this.IFRAME = impl.IFRAME;
this.INPUT = impl.INPUT;
this.LABEL = impl.LABEL;
this.LEGEND = impl.LEGEND;
this.LI = impl.LI;
this.OL = impl.OL;
this.OPTGROUP = impl.OPTGROUP;
this.OPTION = impl.OPTION;
this.P = impl.P;
this.PRE = impl.PRE;
this.SELECT = impl.SELECT;
this.SPAN = impl.SPAN;
this.STRONG = impl.STRONG;
this.TABLE = impl.TABLE;
this.TBODY = impl.TBODY;
this.TD = impl.TD;
this.TEXTAREA = impl.TEXTAREA;
this.TFOOT = impl.TFOOT;
this.TH = impl.TH;
this.THEAD = impl.THEAD;
this.TR = impl.TR;
this.TT = impl.TT;
this.UL = impl.UL;
this.TEXT = impl.TEXT;
this.fold = impl.fold;
this.foldR = impl.foldR;
this.map = impl.map;
this.filter = impl.filter;
this.member = impl.member;
this.slice = impl.slice;
this.forEach = impl.forEach;
this.toJSONString = impl.toJSONString;
this.compilerInsertDomB = impl.compilerInsertDomB;
this.compilerInsertValueB = impl.compilerInsertValueB;
this.compilerLift = impl.compilerLift;
this.compilerCall = impl.compilerCall;
this.compilerIf = impl.compilerIf;
this.compilerUnbehavior = impl.compilerUnbehavior;
this.compilerEventStreamArg = impl.compilerEventStreamArg;
this.Behavior = impl.Behavior;
this.EventStream = impl.EventStream;window.flapjax = {};
for (var ix in impl)
window.flapjax[ix] = impl[ix];
})();




(function ($, flapjax) {
    var methods = {
        'clicksE': function () {
            if (!(this instanceof $)) { return; }
            var events = [];

            var i;
            for (i = 0; i < this.length; i += 1) {
                var elm = this[i];
                events.push(flapjax.clicksE(elm));
            }

            return flapjax.mergeE.apply({}, events);
        },
        'extEvtE': function (eventName) {
            if (!(this instanceof $)) { return; }
            var events = [];

            var i;
            for (i = 0; i < this.length; i += 1) {
                var elm = this[i];
                events.push(flapjax.extractEventE(elm, eventName));
            }

            return flapjax.mergeE.apply({}, events);
        },
        'extValB': function () {
            if (!(this instanceof $) || this.length < 1) { return; }
            return flapjax.extractValueB(this.get(0));
        },
        'extValE': function () {  
            if (!(this instanceof $)) { return; }
            var events = [];

            var i;
            for (i = 0; i < this.length; i += 1) {
                var elm = this[i]; 
                events.push(flapjax.extractValueE(elm));
            }

            return flapjax.mergeE.apply({}, events);
        },
        'jQueryBind': function (eventName) {       
            if (!(this instanceof $)) { return; }
            var eventStream = receiverE();
            //alert('Binding to: '+eventName);
            this.bind(eventName, function (e) {
               //alert('BIND');
                eventStream.sendEvent(arguments.length > 1 ? arguments : e);
            });
            
            return eventStream;
        },
        'liftB': function (fn) {
            if (!(this instanceof $) || this.length < 1) { return; }
            return this.fj('extValB').liftB(fn);
        },
        'liftBArr': function (fn) {
            return this.map(function () {
                return flapjax.extractValueB(this).liftB(fn);
            });
        }
    };

    jQuery.fn.fj = function (method) {
        var args = Array.prototype.slice.call(arguments, 1);
        return methods[method].apply(this, args);
    };
})(jQuery, flapjax);



// Array Remove - By John Resig (MIT Licensed)

/*Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};      */


Array.indexOf = function(array, needle) {
        return arrayIndexOf(array, needle);
    };  

arrayIndexOf = function(arr, needle) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === needle) {
                return i;
            }
        }
        return -1;
    };            
function arrayCut(array, index) {
    array.splice(index,1); 
};
Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};
//}
/*Array.prototype.contains = function(ob){
    return this.indexOf('Sam') > -1;
}    */
function arrayContains(array, search){
    return arrayIndexOf(array, search) > -1; 
}

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};

String.prototype.replaceAll = function(replace, with_this) {
  return this.replace(new RegExp(replace, 'g'),with_this);
};

function RemoteData(key, context, initialValue, pollRate){
   
this.hash = "HASH";
    this.eventE = receiverE();
    this.event = this.eventE;
    this.originBehaviour = this.event.startsWith(initialValue);
    this.pollRate = (pollRate==undefined)?0:pollRate;//A pollrate of 0 means it will be requested once.
    this.lastUpdated = 0;
    this.behaviour = liftBI(
        function(value){
            return value;
        },
        function(value){
            //log("Upstream Event: "+key);
	    parent.data = value;
            parent.hash = null;
            parent.dirty=true;
        },
        this.originBehaviour);
    this.requiresPoll = function(){
        return ((new Date().getTime())>(this.lastUpdated+this.pollRate)||this.lastUpdated==0);
    }
    this.updateFromServer = function(data, hash){
        this.dirty = false;
        this.hash = hash;
        if(data.length!=0){
            this.lastUpdated = new Date().getTime();
            this.data = data;
            this.event.sendEvent(data);
        }
    }
    this.key = key;
    this.dirty = false;
    this.data = initialValue;
    this.context = (context==undefined)?"":context;
    this.remote = true;
    this.newData=null;
    var parent = this;
}

function CompositKey(key1, key2){
    this.getKey = function(){                   
        return (key2==undefined||key2.length==0)?key1:key1+"___"+key2;
    }
}
function BehaviourManager(){
    this.availableRemotes = new Array();
    this.localData = new Object();
    this.data = new Object();

    this.getRemote = function(key, context, initialValue, pollRate){
        var key2 = key;
        if(context=="_"||(context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        initialValue = (initialValue==undefined)?NOT_READY:initialValue;
        pollRate = (pollRate==undefined)?0:pollRate;
        if(this.data[key2]==undefined)
            this.data[key2] =  new RemoteData(key, context, initialValue, pollRate);
        else if(this.data[key2].pollRate<pollRate)
            this.data[key2].pollRate = pollRate;         
        return this.data[key2]; 
    }
    this.registerRemote=function(key){
        this.availableRemotes.push(key);
    }
    this.register=function(key, context, behaviour){
        context = (context==undefined||context.length==0)?"_":context;
        if(this.localData[key]!=undefined&&this.localData[key][context]!=undefined)
            return this.localData[key][context];
        if(this.localData[key]==undefined)
            this.localData[key] = new Array();
        this.localData[key][context] = behaviour;
        return this.localData[key][context]; 
    }
    this.deregister = function(key, context){
        context = (context=='undefined'||context==null||context.length==0)?"_":context;
        key = new CompositKey(key, context).getKey();
        this.data[key]=null;
        delete this.data[key];
    }   
    this.isEmpty = function(){
        return (this.size()==0);
    }
    this.size = function(){                 
        var size = 0, key;
        for (key in this.data) {
            if (this.data.hasOwnProperty(key)) size++;
        }
        return size;
        //return Object.keys(this.data).length; 
    }
    this.get = function(key, context){
        var mContext = (context==undefined||context.length==0)?"_":context;
        if(this.localData[key]!=undefined&&this.localData[key][mContext]!=undefined)
            return this.localData[key][mContext];
        if(context=="_"||(context!='undefined'&&context!=null&&context.length!=0)){
            key = new CompositKey(key, mContext).getKey();
        }
        return this.data[key].behaviour;
    }
    this.getDataRequest = function(){
        var arr = new Array();       
        for(index in this.data){
            var dataR = this.data[index];                            //rDatashow
            if(dataR.requiresPoll()){
                var packet = dataR.dirty?{key: dataR.key, context: dataR.context, data: dataR.data}:{key: dataR.key, context: dataR.context, hash: dataR.hash};
                arr.push(packet);
            }
        }                  
        return {database: arr};
    }
    this.startPolling = function(){
        var localData = this.localData;
        var data = this.data;
        var respE = receiverE();
        var requestEvery = SETTINGS.updateWait; // request with this delay, only if last request is already serviced
        var nowB = timerB(500); // current time, 500ms granularity
        var lastRespTmB = respE.snapshotE(nowB).startsWith(nowB.valueNow());
        var requestOkayB = liftB(function(now, lastRespTm) {
		//log("Request OK");
            return (now > (lastRespTm + requestEvery));                               
        }, nowB, lastRespTmB);
        var requestReadyE = requestOkayB.changes().filterE(function(x) { return x; }).filterE(function(x){return !DATA.isEmpty()}); 
        var dataRequestReady = requestReadyE.snapshotE(nowB).mapE(function(x){return DATA.getDataRequest();}); 
        var serverResponseE = getAjaxRequestE(dataRequestReady, SETTINGS.scriptPath+'getBehaviours');
        var localSyncE = serverResponseE.mapE(function(retData){                  
            for(key in retData){
                var dataRow = retData[key];
                for(context in dataRow){
                    var serverData = dataRow[context];
                   var localData = data[key+"___"+context]; 
                    //Pre getKey() check for json object contexts. 
                    localData = (localData!=null)?localData:data[(new CompositKey(key, context)).getKey()];
                    localData.updateFromServer(serverData.data, serverData.hash);
                }                                  
            }
            respE.sendEvent(true);
            return retData;
        });
        //respE.sendEvent(true);
    }
}


function WidgetManager(){
    this.widgets = new Array();
    this.add = function(widget){
        this.widgets.push(widget);
    }
    this.load = function(){
        for(index in this.widgets){
            var widget = this.widgets[index];
            widget.loader();
        }
    }
    this.clear = function(){
        this.widgets = new Array();     
    }
}

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


function renderPage(data){
    widgets=Array();    
    var elm = document.createElement('div');
    elm.innerHTML=data; 
    for (var key in widgetTypes) {
        //log(key);
        widgetDef = widgetTypes[key];
        var i=0; 
                                                                    
        var widgetPlaceholders = getElementsByClassName("widget_"+key, "img", elm);
        for (var index in widgetPlaceholders) {
            i++;
            var widgetPlaceholder = widgetPlaceholders[index];     
            var instanceId = (widgetPlaceholder.id!='')?widgetPlaceholder.id:key+i;
            var arguments={};
            try{         
            arguments = (widgetPlaceholder.alt==null||widgetPlaceholder.alt=="")?{placeholder: widgetPlaceholder}:jQuery.parseJSON(widgetPlaceholder.alt.replaceAll("'", '"'));    
            }
            catch(err){
            log("Widget Argument Parse Error: "+err);
            arguments={};
            }

            var element = document.createElement('span');
            if(typeof(arguments)!='string'&&widgetPlaceholder.width!=null&&widgetPlaceholder.width!=null){
                element.width = widgetPlaceholder.width;
                element.height = widgetPlaceholder.height; 
            }
            arguments.placeholder = widgetPlaceholder;
            widget = jQuery.extend(new widgetDef(instanceId, arguments), WIDGET);   
            WIDGETS.add(widget);
            
            var wBuild = widget.build();
            if(typeof(wBuild)=='string')
                element.innerHTML = wBuild;
            else
                element.appendChild(wBuild);
            widgetPlaceholder.parentNode.replaceChild(element, widgetPlaceholder);
        }
    } 
    return elm.innerHTML;            
}
function loadPage(pageName){
    window.location=SETTINGS.scriptPath+pageName;
}

function connection_error(error){
    log(error);
}
function checkPermission(groupId){
    for(index in SETTINGS.page.permissions.groups){
        if(SETTINGS.page.permissions.groups[index].group_id==groupId)
            return true;
    }
    return false;
}

function requestAndRenderPage(page){
    jQuery.ajax({
        dataType: 'json',
        url: SETTINGS.scriptPath+"request/getPage/"+page+"/",
        success: function(data){
            pagePermissions  = data.permissions;
            page = data;
            currentPage=page;      
            jQuery("#content").html(renderPage(data.pageData));
            for (var instanceId in topLevelWidgets){
                topLevelWidgets[instanceId].loader();
            }
        },
        error: connectionError
    }); 
}
function connectionError(error){
    log(error);
}
function isBase(){
    return SETTINGS.page.name==SETTINGS.defaultPage;
}



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



/* BASE WIDGETS */           
function GroupsManagerWidget(instanceId, data){
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW    
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        insertDomB(tableB, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
widgetTypes['GroupsManagerWidget']=GroupsManagerWidget;

function PluginManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_plugins", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_plugins", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
widgetTypes['PluginManagerWidget']=PluginManagerWidget;
function BehaviourPermissionsWidget(instanceId, data){
    
    this.loader=function(){
    	var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);
    	var behavioursR = DATA.getRemote("aurora_behaviours", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        var behaviourPermissionsR = DATA.getRemote("aurora_behaviour_permissions", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW 
        //var behaviourPermissionsTableB = JoinTableB(behavioursR.behaviour, behaviourPermissionsR.behaviour, "behaviourId");
        
	var groupsB = groupsR.behaviour;

var behavioursB = behavioursR.behaviour;

        var newTableB = liftBI(function(behaviourPermissions, groups, behaviours){   	
	if(groups==NOT_READY||behaviours==NOT_READY||behaviourPermissions==NOT_READY)
        		return NOT_READY;
        	//log(behaviourPermissions);
        	var columns = [{reference: "behaviour", display: "", type: "string", visible:true, readOnly: false}];
        	var groupColMap = new Array();
        	var count = 1;
        	for(groupIndex in groups.DATA){
        		var group = groups.DATA[groupIndex];
        		columns.push({reference: group[0], display: group[1], type: "readWrite", visible:true, readOnly: false});
        		groupColMap[group[0]+""] = count++;
        	}
        	var data = [];
        	var rowMetaData = [];
        	var cellMetaData = [];
        	var columnMetaData = [];
        	columnMetaData[0] = {permissions: "R"};
        	for(behaviourIndex in behaviours.DATA){
        		var behaviour = behaviours.DATA[behaviourIndex];
        		var behaviourId = getTableValue(behaviours, behaviourIndex, "behaviourId");
            		var dataRow = [behaviour[1]];
            		var cellMetaDataRow = [];
        		for(permissionIndex in behaviourPermissions.DATA){
        			var bPermissionsBehaviourId = getTableValue(behaviourPermissions, permissionIndex, "behaviourId");
        			if(behaviourId==bPermissionsBehaviourId){
        				var bPermission = behaviourPermissions.DATA[permissionIndex];
					var bPermissionId = getTableValue(behaviourPermissions, permissionIndex, "bPermissionId");
            				var bPermissionGroupId = getTableValue(behaviourPermissions, permissionIndex, "groupId");
            				var bPermissionPermission = getTableValue(behaviourPermissions, permissionIndex, "permissions");
        				var colIndex = groupColMap[bPermissionGroupId+""];
        				dataRow[colIndex] = bPermissionPermission;
                        //log("Setting "+bPermissionId);
        				cellMetaDataRow[colIndex-1] = {permissionId: bPermissionId};
        			}
        		}
        		cellMetaData.push(cellMetaDataRow);
        		data.push(dataRow);
        		rowMetaData.push(behaviourId);
        	}
	//log(cellMetaData);        	
var table = {DATA: data, COLUMNS: columns, TABLEMETADATA: {originalColumns: behaviourPermissions.COLUMNS, permissions: {canAdd: false, canDelete: false, canEdit: true}}, ROWMETADATA: rowMetaData, CELLMETADATA: cellMetaData, COLUMNMETADATA: columnMetaData, SOURCETABLES: {groups: groups, behaviours: behaviours,  behaviourPermissions: behaviourPermissions}};
        	return table;
        },
        function(value){
        	
        	var permissionsData = value.DATA;
        	var newData = [];
        	for(rowIndex in permissionsData){
        		//showObj(value.CELLMETADATA[rowIndex]);
        		newRow = [];
        		var row = permissionsData[rowIndex];
        		var behaviourName = row[0];
        		var behaviourId = value.ROWMETADATA[rowIndex];
        		for(colIndex in value.COLUMNS){
        			if(colIndex==0)
        				continue;
        			var dataIndex = parseInt(colIndex)+1;
        			var column = value.COLUMNS[colIndex];
        			var groupId = column.reference;
        			var dataCell = row[colIndex];
        			//log(column.display+" "+column.reference);
        			if(dataCell!=undefined){
        				//log(dataCell);
        				var id=(value.CELLMETADATA[rowIndex][colIndex-1]!=undefined)?value.CELLMETADATA[rowIndex][colIndex-1].permissionId:"NULL";
        				newData.push([id, behaviourId, groupId, , dataCell]);
        			}
        		}		
        	}
        	var newTable = {DATA: newData, COLUMNS: value.TABLEMETADATA.originalColumns, TABLEMETADATA: {permissions: {canAdd: false, canDelete: false, canEdit: true}}, ROWMETADATA: [], CELLMETADATA: [], COLUMNMETADATA: []};
		return [newTable, undefined,undefined];		
		//return [newTable, undefined,undefined];
        },
        behaviourPermissionsR.behaviour, groupsB, behavioursB);
        
        
        tableB = TableWidgetB(instanceId+"_table", data, newTableB);    
        insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_behaviours", "");
        DATA.deregister("aurora_behaviour_permissions", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
widgetTypes['BehaviourPermissionsWidget']=BehaviourPermissionsWidget; 

function AuroraUserGroupColumn(groups){
    this.groups = groups;
    this.getCellRenderer = function(value, cell, width){
	if(cell==undefined){
		//alert("caller is " + arguments.callee.caller.toString());
		return null;
	}	     
return new AuroraGroupCellRenderer(groups, value, cell, width);    
    }
}
function AuroraGroupCellRenderer(groups, value, cell, width){
    var select = document.createElement("select");
    var index;
    cell.className="TableWidgetCell";
    for(index in groups){
                var group = groups[index];
                var option=document.createElement("OPTION");
                option.appendChild(document.createTextNode(group[1]));
                option.value = group[0];
                select.appendChild(option);       
            }
            select.value = value;     
    this.render = function(){
        select.disabled = true;
        cell.removeChildren();
        cell.appendChild(select);    
    }
    this.renderEditor = function(){
        select.disabled = false;  
        cell.removeChildren();
        cell.appendChild(select);
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(select);
    }
}                                                            
function UsersManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_users", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST); //, NOT_READY, POLL_RATES.SLOW
        var renderedTableB = liftBI(function(data, groups){
            if(data==NOT_READY||groups==NOT_READY)
                return NOT_READY;
            for(colIndex in data.COLUMNS){
                if(data.COLUMNS[colIndex].reference=="group"){
                    if(data.COLUMNMETADATA[colIndex]==undefined)
                        data.COLUMNMETADATA[colIndex] = {};
                    data.COLUMNMETADATA[colIndex].renderer = new AuroraUserGroupColumn(groups.DATA);
                }
            
            }
            //showObj(data);
            return data;
        },function(value){
            return [value, null];
        }, dataR.behaviour, groupsR.behaviour);
    
    tableB = TableWidgetB(instanceId+"_table", data, renderedTableB);    
    insertDomB(tableB, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("aurora_users", "");
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
function auroraBaseFindCustomRendererForCol(renderers, colIndex){
    for(var index in renderers){
        if(renderers[index].columnIndex==colIndex)
            return renderers[index];
    }
    return undefined;
}          
widgetTypes['UsersManagerWidget']=UsersManagerWidget;        
     
StringBuilderEx = function(){
    this._buffer = new Array();
}

    StringBuilderEx.prototype =
    {
    // This method appends the string into an array 
        append : function(text)
        {
            this._buffer[this._buffer.length] = text;
        },
        
    // This method does concatenation using JavaScript built-in function
        toString : function()
        {
            return this._buffer.join("");
        }
    }; 
    
    


function liftBArray(f, argsF){
    argsF.unshift(f);
    var behaviour = liftB.apply(argsF[0], argsF);
    return behaviour;
}
function funcCallArray(f, argsF){
    var behaviour = f.apply(this, argsF);
} 
function jFadeInE(triggerE, elementId, time){
    var rec = receiverE();
    triggerE.mapE(function(event){
        jQuery(document.getElementById(elementId)).fadeIn(time, function(){rec.sendEvent(event);});
    });
    return rec;
}
function FileReaderLoadedE(fr){
    var rec = receiverE();
    fr.onload = function(event){
        rec.sendEvent(event);    
    }
    return rec;
}
function fileDragDropE(element){
    var rec = receiverE();
    element.addEventListener('drop', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;
    //return extractEventE(element, 'drop');    
}
function fileDropEnterE(element){
    var rec = receiverE();
    element.addEventListener('dragenter', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;    
}
function fileDragOverE(element){
    var rec = receiverE();
    element.addEventListener('dragover', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;    
}
function getAjaxRequestE(triggerE, url, timeout){
    timeout = (timeout==undefined)?15000:timeout;
    var rec = receiverE();                       
    triggerE.mapE(function(requestData){
        if(requestData.database.length>0){
        jQuery.ajax({
            type: "post",
            data: requestData,
            dataType: 'json',
            url: url,
            timeout: timeout,
            success: function(data){
                rec.sendEvent(data);
            },
            error: function(data){/*rec.sendEvent(data);*/}
        });
        }
    });                                          
    return rec;
}
function getAjaxRequestB(triggerB, url){
    var rec = receiverE();                       
    triggerB.liftB(function(requestData){
        jQuery.ajax({
            type: "post",
            data: requestData,
            dataType: 'json',
            url: url.replace("<VAL>", requestData),
            success: function(data){
                rec.sendEvent(data);
            },
            error: function(data){rec.sendEvent(data);}
        });
    });                                          
    return rec;
}
function FileReaderReadyE(fr){
    var rec = receiverE();
    fr.onload = function(event){
        rec.sendEvent(event.target.result);
    }
    return rec;
}     
function getAjaxFileRequest(triggerE, url, contentType){
    var rec = receiverE();
    triggerE.mapE(function(builder){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', contentType);
        //xhr.send(builder);
        xhr.sendAsBinary(builder);        
        xhr.onload = function(event) { 
            if (xhr.responseText)
                rec.sendEvent(JSON.parse(xhr.responseText));
        };
    });
    return rec;
}


function showObj(obj){
    alert(ObjectToString(obj));
}
function ObjectToString(object){
    var output = '';
for (property in object) {
  output += property + ': ' + object[property]+'; ';
}                                                   
return output;
}
function countProperties(object){
    var count = 0;
for (property in object) {
  count++;
}
return count;
}
function printHashTable(table){
 var loadWidgets = table.values();
    for(i=0;i<table.size();i++){
        alert(ObjectToString(loadWidgets[i]));
    }
}

function log(message){
    if (window.console)
        console.log(message);
}


/*function BehaviourTree(instanceId,data){
    var domId=instanceId+"_tree";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    this.loader=function(){
        log("Behaviour Tree loaded");
        timerB(1000).liftB(function(){
            var container = document.getElementById(domId);
            var domDiv = document.createElement("div");
            for(index in DATA.localData){
                var behaviour = DATA.localData[index];
                var value = behaviour["_"].last;
                if(value==undefined||value==NOT_READY)
                    value = "NOT READY";
                var display = index+": "+value;
                domDiv.appendChild(createDomElement("div", "", "", display));
            }  
            removeChildren(container);
            container.appendChild(domDiv);
        });
    }
    this.destroy=function(){}
    this.build=function(){
        return "<div class=\"behaviourTree\" style=\"width:"+width+"px; height: "+height+"px\"><div id=\""+domId+"\"></div></div>";
    }
}
widgetTypes['BehaviourTree']=BehaviourTree;


function BehaviourTest(instanceId,data){
    var domId=instanceId+"_tree";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    this.loader=function(){
       var t1B = timerB(500);
       var t2B = timerB(350);
       
       var mergeB = liftB(function(t1, t2){
        return t1+"<>"+t2;
       }, t1B, t2B);
       DATA.register("timer1", "", t1B);
       DATA.register("timer2", "", t2B);
       DATA.register("merge", "", mergeB);
       insertDomB(mergeB, domId);
    }
    this.destroy=function(){}
    this.build=function(){
        return "<div class=\"BehaviourTest\" style=\"width:"+width+"px; height: "+height+"px\"><div id=\""+domId+"\"></div></div>";
    }
}
widgetTypes['BehaviourTest']=BehaviourTest;*/


getElementsByClassName = function(class_name, tag, elm) {
    doc = elm || this;
    var docList = doc.all || doc.getElementsByTagName('*');
    var matchArray = new Array();

    /*Create a regular expression object for class*/
    var re = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
    for (var i = 0; i < docList.length; i++) {
        //showObj(docList[i]);
        if (re.test(docList[i].className) ) {
            matchArray[matchArray.length] = docList[i];
        }
    }
    return matchArray;
}
Element.prototype.removeChildren = function(element){
    if(element==undefined)
        element = this;
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
}
function getMilliseconds(){
var d = new Date();
return d.getTime(); 
} 

function createDomElement(type, id, className, innerHTML){
    var ele = document.createElement(type);
    if(id.length>0)
    ele.id = id;
    if(className.length>0)
    ele.className = className; 
    if(innerHTML.length>0)
    ele.innerHTML = innerHTML;
    return ele; 
}
function createIcon(src){
    var saveButton = document.createElement("img");
    saveButton.src=src;
    saveButton.style.cursor="pointer";
    return saveButton;
}
function findParentNodeWithTag(element, tag){
    if(element==undefined||element==null)
        return undefined; 
    else if(element.tagName.toUpperCase() == tag.toUpperCase())
        return element;
    return findParentNodeWithTag(element.parentNode, tag);    
}
function findTableRowIndex(table, row){
    for(i=0; i<table.rows.length; i++){
        if(table.rows[i]==row)
            return i;
    }
    return -1;
}

function stopEventBubble(event){
    agent = jQuery.browser;
    if(agent.msie) {
        event.cancelBubble = true;
    } else {
        event.stopPropagation();
    }
}


//var themesR = DATA.get("aurora_themes", "", true, POLL_RATES.FAST);

function ThemeSelect(instanceId, data){
    var targetId = instanceId+"_target";
    this.loader=function(){
    
    var themesR = DATA.getRemote("aurora_themes", "", true);
        themesR.behaviour.liftB(function(data){
            var html = "<select name=\""+instanceId+"\">";
            for(index in data){  
                theme = data[index];                                   
                html += "<option value=\""+theme.id+"\""+(theme.selected?" selected=\"true\"":"")+">"+theme.name+"</option>";
            }
            html += "</select>";
            if(document.getElementById(targetId))
                document.getElementById(targetId).innerHTML = html;
        }); 
    }
    this.destroy=function(){
        //DATA.deregister("aurora_themes", "");
    }
    this.build=function(){
        return "<span id=\""+targetId+"\"></span>";
    }
}                   
function WebpageSettingsStringFormatter(instanceId, data){
    var stringFormat = data.stringFormat;
    var value = data.value;
    var widgets = new Array(); 
    this.loader=function(){
            
    }
    this.build=function(){
        var controls = "";
        if(stringFormat.startsWith("textarea")){
            var attributes = stringFormat.split(":");
            controls = "<textarea name=\""+instanceId+"\" rows=\""+attributes[1]+"\" cols=\""+attributes[2]+"\">"+value+"</textarea>";
        }
        else if(stringFormat.startsWith("text")){
            var attributes = stringFormat.split(":");
            controls = "<input name=\""+instanceId+"\" type=\"text\" value=\""+value+"\""+((attributes[1]!=0)?" size=\""+attributes[1]+"\"":"")+((attributes[2]!=0)?" maxlength=\""+attributes[2]+"\"":"")+" />";    
        }
        else if(stringFormat.startsWith("check")){
            var options = stringFormat.split("|");
            for(index in options){
                var thisCheck = options[index];
                var attributes = thisCheck.split(":");
                var checked = value==attributes[2];
                controls+=attributes[1]+":<input type=\"radio\" name=\""+instanceId+"\" value=\""+attributes[2]+"\""+(value==attributes[2]?" checked=\"checked\" ":"")+" />";
            }    
        }
        else if(stringFormat.startsWith("select")){
            var attributes = stringFormat.split(":");
                if(attributes[1]=="<THEME_SELECT>"){
                    var themeSelector = new ThemeSelect(instanceId, {});
                    controls+=themeSelector.build();
                    themeSelector.loader();
                    widgets.push(themeSelector);
                    
                }
        }           
        return "<div id=\""+instanceId+"_wrapper\">"+controls+"</div>";
    }   
    this.destroy=function(){
        for(index in widgets){
            widgets[index].destroy();
        }    
    }     
}
function WebpageSettingsEditor(instanceId, data){
    //var themesR = DATA.getRemote("aurora_themes", "", true);//This is so it is requested early
    var settingsR = DATA.getRemote("aurora_settings", data.plugin, NOT_READY, POLL_RATES.NORMAL);
    var submitId = instanceId+"_submit";
    var tableDivId = instanceId+"_settings";
    var tableId = instanceId+"_table";
    var widgets = new Array();
    var parent = this;
    this.loader=function(){
        var renderHTMLTableB = liftBI(function(settings){
            if(settings==NOT_READY)     
                return createDomElement('div', "", "", "Loading ");
            log("renderHTMLTableB DOWN: "+ObjectToString(settings));
            //parent.destroyChildWidgets();
            
            widgets = new Array();
            widgets.length=0;
            var table = document.createElement('table');
            table.id = tableId;
            i=0;
            for(index in settings){    
                var setting = settings[index];  
                var tableRow = document.createElement('tr');
                var cell1 = document.createElement('td');
                cell1.appendChild(document.createTextNode(setting.description));
                tableRow.appendChild(cell1);                                   
                var formatter = new WebpageSettingsStringFormatter(instanceId+"_"+setting.name, {stringFormat: setting.formatString, value: setting.value});//"{'stringFormat':'"+settings[index].formatString+"', 'value':'"+settings[index].value+"'}"
                widgets.push(formatter);
                var cell2 = document.createElement('td');
                cell2.innerHTML = formatter.build();
                formatter.loader();
                tableRow.appendChild(cell2);
                table.appendChild(tableRow);
                i++;
            }
            console.log("OUtputting Table");
            return table;               
        }, function(settings){
            log("renderHTMLTableB UP: "+ObjectToString(settings));
          //  showObj(settings);
            //console.log("DOM - > DataStruct");
             for(index in settings){
                jQuery("input[name='"+instanceId+"_"+settings[index].name+"']").each(
                    function(i, domElement){
                        if(domElement.type=='checkbox'||domElement.type=='radio'){
                            if(domElement.checked==true)
                                settings[index].value = domElement.value;    
                        }
                        else if(domElement.type=='textarea'){
                            settings[index].value = domElement.innerHTML;
                        }     
                        else{
                            settings[index].value = domElement.value;
                        }
                    }
                );
                
            }
            return [settings];
        }, [settingsR.behaviour]);     
        var submitClickedE = extractEventE(submitId, 'click');
        
        submitClickedE.snapshotE(settingsR.behaviour).mapE(function(x){renderHTMLTableB.sendEvent(x);});
        insertDomB(renderHTMLTableB, tableDivId);
    }
    this.destroyChildWidgets = function(){
        for(index in widgets){
            widgets[index].destroy();
        }
        widgets = new Array();
    }
    this.destroy=function(){
        this.destroyChildWidgets();
        DATA.deregister("aurora_settings", data.plugin);
    }
    this.build=function(){
        return "<div id=\""+tableDivId+"\">&nbsp;</div><input id=\""+submitId+"\" type=\"submit\" />";
    }
}
widgetTypes['webpageSettingsEditor']=WebpageSettingsEditor;
widgetTypes['webpageSettingsStringFormatter']=WebpageSettingsStringFormatter;


var tableBackgroundColor = "#FFFFFF";
var tableBackgroundColorSelected = "#b3ddf8";
var CELL_RENDERERS = {"boolean":BooleanCellRenderer, "string":StringCellRenderer, "int":IntegerCellRenderer, "gender":GenderColumn, "date":DateColumn, "readWrite": ReadWriteColumn};
function DefaultCellRenderer(value, cell, width){
    this.render = function(){
        cell.innerHTML = value;
    }
    this.getValue = function(){
        return cell.innerHTML;
    }
    this.renderEditor = function(){
        
    }
    this.setSelected = function(selected){ 
        if(selected){
            cell.className="TableWidgetCellSelected"; 
           // cell.style.backgroundColor=tableBackgroundColorSelected; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.setValue = function(newValue){
        value = newValue;
    }
    this.getUpdateEvent = function(){
        return receiverE();
    }
}
function BooleanCellRenderer(value, cell, width){
    var checkbox = document.createElement("input");
    checkbox.type='checkbox';
    checkbox.checked = (value==undefined||value==null||value=="")?false:value;  
    cell.className="TableWidgetBooleanCell";
    checkbox.disabled = true; 
    
    this.render = function(){
        cell.removeChildren();
        checkbox.disabled = true; 
        cell.appendChild(checkbox);
        //jQuery(cell).fj('extEvtE', 'click').mapE(function(x){userChangeE.sendEvent()});
    }
    this.renderEditor = function(){
        cell.removeChildren();
        checkbox.disabled = false;
        cell.appendChild(checkbox);
    }
    this.setSelected = function(selected){
        //log("Chaning boolean "+selected);
        if(selected){
            cell.className="TableWidgetBooleanCellSelected";
            //cell.style.backgroundColor=tableBackgroundColorSelected;  
        }
        else  {
            cell.className="TableWidgetBooleanCell"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
    }
    this.getValue = function(){
        return checkbox.checked;
    }
    this.setValue = function(newValue){
        checkbox.checked = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(checkbox);
    }
}
function ReadWriteColumn(value, cell, width){
    value = (value==undefined||value==null||value=="")?"":value;
    var select = document.createElement("select");
    
noneOption=document.createElement("OPTION");
    noneOption.appendChild(document.createTextNode("--"));
    noneOption.value = "";
    select.appendChild(noneOption)

readOption=document.createElement("OPTION");
    readOption.appendChild(document.createTextNode("Read"));
    readOption.value = "R";
    select.appendChild(readOption);

    writeOption=document.createElement("OPTION");
    writeOption.appendChild(document.createTextNode("Write"));
    writeOption.value = "W";
    select.appendChild(writeOption)

rwOption=document.createElement("OPTION");
    rwOption.appendChild(document.createTextNode("Read+Write"));
    rwOption.value = "RW";
    select.appendChild(rwOption); 
    select.className="TableWidgetPermissionsCell";
    select.value = value;
     cell.className="TableWidgetCell"; 
           
    this.render = function(){
        cell.removeChildren();
        select.disabled = true; 
        cell.appendChild(select);
    }
    this.renderEditor = function(){
        cell.removeChildren();
        cell.appendChild(select);
        select.disabled = false;            
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(select);
    }
}
function GenderColumn(value, cell, width){
    value = (value==undefined||value==null||value=="")?"M":value;
    var select = document.createElement("select");
    maleOption=document.createElement("OPTION");
    maleOption.appendChild(document.createTextNode("Male"));
    maleOption.value = "M";
    femaleOption=document.createElement("OPTION");
    femaleOption.appendChild(document.createTextNode("Female"));
    femaleOption.value = "F";
    select.appendChild(maleOption);
    select.appendChild(femaleOption); 
    select.className="TableWidgetGenderCell";
    select.value = value;
     cell.className="TableWidgetCell"; 
           
    this.render = function(){
        cell.removeChildren();
        select.disabled = true; 
        cell.appendChild(select);
    }
    this.renderEditor = function(){
        cell.removeChildren();
        cell.appendChild(select);
        select.disabled = false;            
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(select);
    }
}
function DateColumn(value, cell, width){
   value = (value==undefined||value==null||value=="")?"2012-01-01":value;
    var div = document.createElement("div");
    cell.className="TableWidgetCell"; 
           
    var input = document.createElement("input");
    input.type = "text";
    //input.className = "TableWidgetStringCellRenderTextBox";
    this.render = function(){
        jQuery(input).datepicker("destroy");
        div.innerHTML = value;
        //jQuery(input).datepicker("setDate", value); 
        cell.removeChildren(); 
        cell.appendChild(div);
        
    }
    this.renderEditor = function(){     
        cell.removeChildren(); 
        cell.appendChild(input);
        //input.className = "TableWidgetStringCellTextBox";
        input.value = value;
        jQuery(input).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: false,changeYear: true, yearRange: '1910:2100', showButtonPanel: false});
        jQuery(input).datepicker("setDate", value); 
        //jQuery(input).datepicker("show");           
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
           // cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        date = jQuery.datepicker.formatDate('yy-mm-dd',jQuery(input).datepicker("getDate"));
        //date = jQuery(input).datepicker("getDate");
        return date;
    }
    this.setValue = function(newValue){
        jQuery(input).datepicker("setDate", newValue);
    }
    this.getUpdateEvent = function(){
        return jQuery(input).datepicker().fj('jQueryBind', 'change');
    }
}
function StringCellRenderer(value, cell, width){
    value = (value==undefined||value==null)?"":value;
    var displayDom = document.createElement("div");
    displayDom.className = "TableWidgetStringCellText";
    cell.className="TableWidgetStringCell";
    var textbox = document.createElement("input");
    textbox.className = "TableWidgetStringCellTextBox";
    textbox.type='text';
    textbox.value = value;
    //textbox.disabled = true;                 
    this.render = function(){ 
            displayDom.innerHTML = textbox.value; 
            cell.removeChildren(); 
            cell.appendChild(displayDom);
    }
    this.renderEditor = function(){
            var scrollWidth = (cell.scrollWidth==0)?cell.style.width:cell.scrollWidth+"px";
            if(width!=undefined){
                textbox.style.width = width+"px";
            }    
            cell.removeChildren();
            cell.appendChild(textbox);
    }                                         
    this.setSelected = function(selected){
        
        if(selected){
            cell.className="TableWidgetStringCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected;
        }
        else{
            cell.className="TableWidgetStringCell"; 
            ///cell.style.backgroundColor=tableBackgroundColor;
        }
    }
    this.getValue = function(){
        return textbox.value;
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(textbox);
    }
}
function IntegerCellRenderer(value, cell, width){
    var displayDom = document.createElement("div");
    displayDom.className = "TableWidgetIntegerCellText";
    cell.className="TableWidgetStringCell";
    var textbox = document.createElement("input");
    textbox.className = "TableWidgetIntegerCellTextBox";
    textbox.type='text';
    textbox.value = value;
    //textbox.disabled = true;                 
    this.render = function(){ 
            displayDom.innerHTML = textbox.value; 
            cell.removeChildren(); 
            cell.appendChild(displayDom);
    }
    this.renderEditor = function(){
            textbox.value = value;
            var scrollWidth = (cell.scrollWidth==0)?cell.style.width:cell.scrollWidth+"px";
            if(width!=undefined){
                textbox.style.width = width+"px";
            }
            cell.removeChildren();
            cell.appendChild(textbox);
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.getValue = function(){
        return textbox.value;
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
    this.getUpdateEvent = function(){
        return extractValueE(textbox);
    }
} 

function TableWidgetB(instanceId, widgetData, dataB){
    var table = document.createElement("table");
    table.id = instanceId+"_table";
    table.className = "TableWidget";
    this.table = table;
    
    
   //Control Bar Buttons
    var saveButton = createIcon(SETTINGS.theme.path+"save.png");
    var cancelButton = createIcon(SETTINGS.theme.path+"cancel.png");
    var addRowButton = createIcon(SETTINGS.theme.path+"add.png");
    var deleteRowButton = createIcon(SETTINGS.theme.path+"delete.png"); 
    
    var addRow = document.createElement("tr");
    var controlsRow = document.createElement("tr");
    var controlsCell = document.createElement("td");
            
            controlsCell.className = "TableWidgetControlBar";
            controlsCell.appendChild(saveButton);
            controlsCell.appendChild(cancelButton); 
            controlsCell.appendChild(addRowButton);
            controlsCell.appendChild(deleteRowButton);
            controlsRow.appendChild(controlsCell);
    
    var width = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.width!=undefined)?widgetData.placeholder.style.width:undefined;
    var height = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.height!=undefined)?widgetData.placeholder.style.height:undefined;
    var containerId = instanceId+"_cont";
    
    //Build Heading Row
    //Events
    var userEventE = receiverE();
    var userEventB = userEventE.startsWith("view");
    
    var saveButtonPressedE = extractEventE(saveButton,'click');
    var cancelButtonPressedE = extractEventE(cancelButton,'click');   
    var addButtonPressedE = extractEventE(addRowButton,'click');
   var deleteButtonPressedE = extractEventE(deleteRowButton,'click');
    
    
    //extractEventE(table,"click")                   jQuery(table).fj('extEvtE', 'click')
    var tableRowClickedE = extractEventE(table,"click").mapE(function(ev){
        stopEventBubble(ev);
        //ev.preventDefault();
        //return NOT_READY;
        var target = (ev.target==undefined)?ev.srcElement:ev.target;
        jQuery(target).focus();
        var cell = findParentNodeWithTag(target, "td");
        var row = findParentNodeWithTag(cell, "tr");
        var table =findParentNodeWithTag(row, "table");
            if(row!=undefined){
                var clickedIndex = jQuery(row).prevAll().length;
                if(clickedIndex<=0){
                    return NOT_READY;
                }
                return {clickedIndex: clickedIndex, shiftKey: ev.shiftKey, ctrlKey: ev.ctrlKey, target: target};
            }
        return NOT_READY;
    }).filterE(function(v){return v!=NOT_READY;});
    
    var tableBlurE = jQuery(document).fj('extEvtE', 'click').mapE(function(x){return NOT_READY;});    
    var rowSelectionResetE = receiverE();
    var tableSelectionRowIndexE = mergeE(tableRowClickedE, rowSelectionResetE.mapE(function(v){return NOT_READY;}), tableBlurE);
    var rowSelectionsE = tableSelectionRowIndexE.collectE([],function(newElement,arr) {
        if(newElement==NOT_READY)
            return []; 
        var clickedIndex = newElement.clickedIndex;
        var shiftKey = newElement.shiftKey;
        var ctrlKey = newElement.ctrlKey;
        if(ctrlKey){        
            if(arrayContains(arr, clickedIndex)){
                arr = jQuery.grep(arr, function(value) {return value != clickedIndex;});
            }
            else {
                arr[arr.length] = clickedIndex;
            }
        }
        else if(shiftKey){
            var min = Array.max(arr);
            var max = Array.min(arr);
            if(clickedIndex<min){
                for(i=clickedIndex;i<min;i++)
                    arr[arr.length] = i;    
            }
            else if(clickedIndex>max){
                for(i=max+1;i<=clickedIndex;i++)
                    arr[arr.length] = i; 
            }
        }
        else{
            if(arr.length==1&&arrayContains(arr, clickedIndex)){
                arr = [];
            }
            else{
                arr = [clickedIndex];
            }
        }
        
           
        return arr;
    });
    var rowSelectionsB = rowSelectionsE.startsWith([]);
    
    
    
    
    
    var showAddRowsResetE = receiverE();
    
    var showAddRowsB = mergeE(addButtonPressedE, showAddRowsResetE).collectE(false,function(newVal,lastVal){if(newVal==NOT_READY)return false;return !lastVal; }).startsWith(false);
           
    
    var pageRenderedB = liftBI(function(tableData){
        table.removeChildren();
        addRow.removeChildren();
        //If not ready, show a loading icon
        if(tableData==NOT_READY){
            var element = document.createElement("td");
            element.className = "TableWidgetCell";
            jQuery(element).attr('colspan',visibleColumnCount);                                         
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+SETTINGS.theme.path+"loading.gif\" alt=\"\"/>";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div")];
        }  
	//log("TABLE DATA");
        //log(tableData);
        var headingTableRow = document.createElement("tr");
        var visibleColumnCount = 0;
        var columns = tableData.COLUMNS;
        jQuery(controlsCell).attr('colspan',columns.length);

        
        for(index in columns){ 
            var col = columns[index];
            if(col.visible){
                var cell = document.createElement("th");
                if(col.width!=undefined){
                    cell.width = col.width;
                }
                cell.innerHTML = col.display;
                headingTableRow.appendChild(cell);
                visibleColumnCount++;
            }
        }
        table.appendChild(headingTableRow);
        
        //If ready render the table
        var tableMetaData = tableData.TABLEMETADATA;
        var tablePermissions = (tableMetaData!=undefined&&tableMetaData.permissions!=undefined&&tableMetaData.permissions.canEdit!=undefined)?tableMetaData.permissions.canEdit:true; 
        var data = tableData.DATA;
        renderedTable = new Array(); 
        for(index in data){
            var domRow = document.createElement("tr");
            var dataRow = data[index];
            var rowMetaData = tableData.ROWMETADATA[index];
            var rowPermissions = (rowMetaData!=undefined&&rowMetaData.permissions!=undefined)?rowMetaData.permissions:"RW";
            
            if(renderedTable[index]==undefined)
                renderedTable[index] = new Array();
            for(cellIndex in columns){
                var columnMetaData = tableData.COLUMNMETADATA[cellIndex];
                var columnPermissions = columnMetaData==undefined||columnMetaData.permissions==undefined?"RW":columnMetaData.permissions;
                var cellMetaData = (tableData.CELLMETADATA[index]==undefined)?undefined:tableData.CELLMETADATA[index][cellIndex];
                var cellPermissions = cellMetaData==undefined||cellMetaData.permissions==undefined?"RW":cellMetaData.permissions; 
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
		
                var column = columns[cellIndex];
		var customRenderer = (rowMetaData!=undefined&&rowMetaData.renderer!=undefined)?rowMetaData.renderer:(columnMetaData!=undefined&&columnMetaData.renderer!=undefined)?columnMetaData.renderer:(cellMetaData!=undefined&&cellMetaData.renderer!=undefined)?cellMetaData.renderer:undefined;

                if(customRenderer==undefined){
                    var renderClass = (CELL_RENDERERS[column.type]==undefined)?DefaultCellRenderer:CELL_RENDERERS[column.type];
                    renderer = new renderClass(dataRow[cellIndex], cell, column.width);
                }
                else
                    renderer = customRenderer.getCellRenderer(dataRow[cellIndex], cell, column.width);  
                
		if(tablePermissions==true&&rowPermissions=="RW"&&columnPermissions=="RW"&&cellPermissions=="RW")
                    renderer.renderEditor();    
                else
                    renderer.render();
                if(renderedTable[index]==undefined)
                    renderedTable[index] = new Array();
                
                renderedTable[index][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":index,"colIndex":cellIndex};          
                if(column.visible){                                
                    domRow.appendChild(cell);
                }
            }                                                                                           
            table.appendChild(domRow);    
        }
            
            newRowsRenderedTable = new Array();
            for(cellIndex in columns){
                var columnMetaData = tableData.COLUMNMETADATA[cellIndex];
                var columnPermissions = columnMetaData==undefined?"RW":columnMetaData.permissions;
                
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
                var column = columns[cellIndex];
                var customRenderer = (columnMetaData!=undefined&&columnMetaData.renderer!=undefined)?columnMetaData.renderer:undefined;	
		if(customRenderer==undefined){                           
			var renderClass = (CELL_RENDERERS[column.type]!=undefined)?CELL_RENDERERS[column.type]:DefaultCellRenderer;
                    	renderer = new renderClass(undefined, cell, column.width);
                }
                else{                   
			renderer = customRenderer.getCellRenderer(undefined, cell, column.width);  
                }
                renderer.renderEditor();
                if(newRowsRenderedTable[0]==undefined)
                    newRowsRenderedTable[0] = new Array();
                newRowsRenderedTable[0][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":0,"colIndex":cellIndex};
                if(columns[cellIndex].visible){    
                    addRow.appendChild(cell);
                }
            }                                                                                           
            table.appendChild(addRow);
            table.appendChild(controlsRow);
        return [renderedTable, table, tableData, newRowsRenderedTable];
        // Table of Cell Renderers, The Dom Table, the raw table data
    },function(value){
        return [value];
    }, dataB);
    
    var filteredRowSelectionsB = liftB(function(rowSelections, pageRendered){
        var renderedTable = pageRendered[0]
        var newRowsRenderedTable = pageRendered[3];
            for(index in rowSelections){
                var targetIndex = rowSelections[index];
                if(targetIndex>renderedTable.length){
                    arrayCut(rowSelections, index);
                }
            }
        return rowSelections;
    }, rowSelectionsB, pageRenderedB); 
   var rowSelectionsEmptyB = filteredRowSelectionsB.liftB(function(rowSelections){return rowSelections.length==0;});      
    
    
    var renderedRowSelectionsB = liftB(function(tableData, rowSelections){
        if(tableData==NOT_READY||rowSelections==NOT_READY)
            return NOT_READY; 
        var c = document.createElement("div");
            for(index in tableData[0]){   
                var isSelected = arrayContains(rowSelections, parseInt(index)+1);
                for(cellIndex in tableData[0][index]){
                    tableData[0][index][cellIndex].renderer.setSelected(isSelected);
                }
            }
    }, pageRenderedB, rowSelectionsB);
    
    
    var domTableB = liftB(function(pageRendered){
	//log("domTableB");
        return pageRendered[1];
    }, pageRenderedB);    
    
    var tableAllowsAddB = pageRenderedB.liftB(function(data){
	//log("tableAllowsAddB");
	var tableData = data[2];
	return (tableData.TABLEMETADATA!=undefined&&tableData.TABLEMETADATA.permissions!=undefined&&tableData.TABLEMETADATA.permissions.canAdd!=undefined)?tableData.TABLEMETADATA.permissions.canAdd:true;
    });
    var tableAllowsDeleteB = pageRenderedB.liftB(function(data){
	//log(tableAllowsDeleteB);
	var tableData = data[2];
	return (tableData.TABLEMETADATA!=undefined&&tableData.TABLEMETADATA.permissions!=undefined&&tableData.TABLEMETADATA.permissions.canDelete!=undefined)?tableData.TABLEMETADATA.permissions.canDelete:true;
    });
    
    var tableDataChangedB = pageRenderedB.liftB(function(pageRendered){
        if(pageRendered==NOT_READY||pageRendered[0].length==0)
            return receiverE().startsWith(NOT_READY);
	//log("tableDataChangedB");
        var rendererTable = pageRendered[0];
        var domTable = pageRendered[1];
        var dataTable = pageRendered[2][0];
        /*var newRenderTable = pageRendered[3];*/
        var updateEvents = new Array();
        for(rowIndex in rendererTable){
            for(colIndex in rendererTable[rowIndex]){
                updateE = rendererTable[rowIndex][colIndex].renderer.getUpdateEvent();
                updateEvents.push(updateE);
            }
        }
        /*for(rowIndex in newRenderTable){
            for(colIndex in newRenderTable[rowIndex]){
                updateE = newRenderTable[rowIndex][colIndex].renderer.getUpdateEvent();
                updateEvents.push(updateE);
            }
        } */
        return mergeE.apply(this, updateEvents).startsWith(false);   
    }).switchB();
    
   var userDataChangeB = orB(tableDataChangedB.changes().snapshotE(pageRenderedB).mapE(function(renderedData){
        // Table of Cell Renderers, The Dom Table, the raw table data
        var rendererTable = renderedData[0];
        var domTable = renderedData[1];
        var dataTable = renderedData[2].DATA;
        /*var newRenderTable = renderedData[3]; */       
        for(rowIndex in rendererTable){
            for(colIndex in rendererTable[rowIndex]){
                var renderCell = rendererTable[rowIndex][colIndex];
                var dataCell = dataTable[rowIndex][colIndex];
                if(renderCell.renderer.getValue()!=dataCell){
                    return true; 
                }
            } 
        }
        
        return false;
    }).startsWith(false), showAddRowsB); 
    /*
    Gui Updates
    */
    insertValueB(ifB(userDataChangeB, 'inline', 'none'),saveButton, 'style', 'display');
    insertValueB(ifB(userDataChangeB, 'inline', 'none'),cancelButton, 'style', 'display');
    insertValueB(ifB(showAddRowsB, 'table-row', 'none'),addRow, 'style', 'display');
  
    insertValueB(ifB(andB(notB(showAddRowsB), tableAllowsAddB), 'inline', 'none'),addRowButton, 'style', 'display');
    insertValueB(ifB(rowSelectionsEmptyB, 'auto', 'pointer'),deleteRowButton, 'style', 'cursor');
    insertValueB(ifB(tableAllowsDeleteB, 'inline', 'none'),deleteRowButton, 'style', 'display');
    insertValueB(ifB(notB(rowSelectionsEmptyB), SETTINGS.theme.path+'delete.png', SETTINGS.theme.path+'delete_disabled.png'),deleteRowButton, 'src');
 

    /*
    Save Rows
    */
    cancelButtonPressedE.snapshotE(dataB).mapE(function(data){
        showAddRowsResetE.sendEvent(NOT_READY);
        dataB.sendEvent(data); 
    });
    saveButtonPressedE.snapshotE(liftB(function(pageRendered, showAddRows){return [pageRendered, showAddRows]}, pageRenderedB,showAddRowsB)).mapE(function(data){
//log("saveButtonPressedE");        
	var renderedTable = data[0][0];
        var dataTable = data[0][2].DATA;
        var columns = data[0][2].COLUMNS;
        var newRenderedTable = data[0][3];  
        var renderRowIndex = renderedTable.length-1;
        var showAddRows = data[1];
        //log(data[2][0]);
        //log("ABOVE:"+data[2][0].length);                               
        if(renderedTable.length>dataTable.length){
        var dataRowIndex = dataTable.length;
        dataTable[dataRowIndex] = Array();
            for(c=0;c<renderedTable[renderRowIndex].length;c++){
                var cell = renderedTable[renderRowIndex][c];
                var value = cell.renderer.getValue();
                dataTable[dataRowIndex][c] = value;
            }
        }
        else{
            r=0;
                for(r=0;r<renderedTable.length;r++){
              //  log("Row "+r);
                    for(c=0;c<renderedTable[r].length;c++){
                        //log();
                        var cell = renderedTable[r][c];
                        var value = cell.renderer.getValue();
                        dataTable[r][c] = value;
                    }
                }
                if(showAddRows){
                for(rowIndex=0;rowIndex<newRenderedTable.length;rowIndex++){
                    for(c=0;c<newRenderedTable[rowIndex].length;c++){
                        var cell = newRenderedTable[rowIndex][c];
                        var value = cell.renderer.getValue();
                        if(dataTable[rowIndex+r]==undefined)
                            dataTable[rowIndex+r] = new Array();
                        dataTable[rowIndex+r][c] = value;
                    }
                }
                }
                
                
                
                
        }
        //log(data[0][2]);
        pageRenderedB.sendEvent(data[0][2]);  
        showAddRowsResetE.sendEvent(NOT_READY);    
    });      
    
    
    /*
    Delete Rows
    */
    var pageDataAndRowSelectionsB = liftB(function(renderedData, rowSelections){
//log(pageDataAndRowSelectionsB);        
if(renderedData==NOT_READY||rowSelections==NOT_READY)
            return NOT_READY;
        return {renderedData: renderedData, rowSelections: rowSelections};
    }, pageRenderedB, rowSelectionsB);
    var deleteTableRowsB = deleteButtonPressedE.snapshotE(pageDataAndRowSelectionsB).startsWith(NOT_READY);
    
    deleteTableRowsB.liftB(function(data){
//log("deleteTableRowsB");
        if(data==NOT_READY || data.rowSelections.length==0)
            return;
        var rowSelections = data.rowSelections.reverse(); 
        var renderedTable = data.renderedData[0];
        var dataTable = data.renderedData[2].DATA;
        var columns = data.renderedData[2].COLUMNS;
        for(index=0;index<rowSelections.length;index++){
            arrayCut(data.renderedData[2].DATA, (rowSelections[index]-1));
        }              
        UI.confirm("Delete Rows", "Are you sure you wish to delete these "+rowSelections.length+" row(s)", "Yes", function(val){
            rowSelectionResetE.sendEvent(true);
            pageRenderedB.sendEvent(data.renderedData[2]);
        }, "No",
        function(val){
            rowSelectionResetE.sendEvent(true);
        }); 
    });
    
    return domTableB
}
function getTableValue(table, rowIndex, columnName){
	for(colIndex in table.COLUMNS){
		if(table.COLUMNS[colIndex].reference==columnName){
			return table.DATA[rowIndex][colIndex];
		}
	}
	return null;
}
function JoinTableB(table1B, table2B, columnId){
    return liftBI(function(table1, table2){
        if(table1==NOT_READY||table2==NOT_READY)
            return NOT_READY;
        var searchColIndex1 = columnId;
        for(colIndex in table1.COLUMNS){
            if(columnId==table1.COLUMNS.reference){
                searchColIndex = colIndex;
                break;
            }        
        }
        var searchColIndex2 = columnId;
        for(colIndex in table2.COLUMNS){
            if(columnId==table2.COLUMNS.reference){
                searchColIndex = colIndex;
                break;
            }        
        }
        
        /*for(property in table1){
            log(property);
            log(table1[property]);
        }*/  
        
        table1.COLUMNS = table1.COLUMNS.concat(table2.COLUMNS);
        //table1.COLUMNMETADATA = table1.COLUMNMETADATA.concat(table2.COLUMNMETADATA);
        for(rowIndex in table1.DATA){
            var searchCell1 = table1.DATA[rowIndex][searchColIndex1];
            for(rowIndex2 in table2.DATA){
                var searchCell2 = table2.DATA[rowIndex2][searchColIndex2];
                if(searchCell1==searchCell2){
                    for(colIndex2 in table2.DATA[rowIndex2]){
                        table1.DATA[rowIndex][table1.COLUMNS.length+colIndex2] = table2.DATA[rowIndex2][colIndex2];
                    }
                }    
            }
        }
        return table1;
    }, function(mergeTable){
    
        return [table1, table2];
    }, table1B, table2B);
}


/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function(){CKEDITOR.config.jqueryOverrideVal=typeof CKEDITOR.config.jqueryOverrideVal=='undefined'?true:CKEDITOR.config.jqueryOverrideVal;var a=window.jQuery;if(typeof a=='undefined')return;a.extend(a.fn,{ckeditorGet:function(){var b=this.eq(0).data('ckeditorInstance');if(!b)throw 'CKEditor not yet initialized, use ckeditor() with callback.';return b;},ckeditor:function(b,c){if(!CKEDITOR.env.isCompatible)return this;if(!a.isFunction(b)){var d=c;c=b;b=d;}c=c||{};this.filter('textarea, div, p').each(function(){var e=a(this),f=e.data('ckeditorInstance'),g=e.data('_ckeditorInstanceLock'),h=this;if(f&&!g){if(b)b.apply(f,[this]);}else if(!g){if(c.autoUpdateElement||typeof c.autoUpdateElement=='undefined'&&CKEDITOR.config.autoUpdateElement)c.autoUpdateElementJquery=true;c.autoUpdateElement=false;e.data('_ckeditorInstanceLock',true);f=CKEDITOR.replace(h,c);e.data('ckeditorInstance',f);f.on('instanceReady',function(i){var j=i.editor;setTimeout(function(){if(!j.element){setTimeout(arguments.callee,100);return;}i.removeListener('instanceReady',this.callee);j.on('dataReady',function(){e.trigger('setData.ckeditor',[j]);});j.on('getData',function(l){e.trigger('getData.ckeditor',[j,l.data]);},999);j.on('destroy',function(){e.trigger('destroy.ckeditor',[j]);});if(j.config.autoUpdateElementJquery&&e.is('textarea')&&e.parents('form').length){var k=function(){e.ckeditor(function(){j.updateElement();});};e.parents('form').submit(k);e.parents('form').bind('form-pre-serialize',k);e.bind('destroy.ckeditor',function(){e.parents('form').unbind('submit',k);e.parents('form').unbind('form-pre-serialize',k);});}j.on('destroy',function(){e.data('ckeditorInstance',null);});e.data('_ckeditorInstanceLock',null);e.trigger('instanceReady.ckeditor',[j]);if(b)b.apply(j,[h]);},0);},null,null,9999);}else CKEDITOR.on('instanceReady',function(i){var j=i.editor;setTimeout(function(){if(!j.element){setTimeout(arguments.callee,100);return;}if(j.element.$==h)if(b)b.apply(j,[h]);},0);},null,null,9999);});return this;}});if(CKEDITOR.config.jqueryOverrideVal)a.fn.val=CKEDITOR.tools.override(a.fn.val,function(b){return function(c,d){var e=typeof c!='undefined',f;this.each(function(){var g=a(this),h=g.data('ckeditorInstance');if(!d&&g.is('textarea')&&h){if(e)h.setData(c);else{f=h.getData();return null;}}else if(e)b.call(g,c);else{f=b.call(g);return null;}return true;});return e?this:f;};});})();


pageRenderedE.calmE().mapE(function(){
 //getElementById("content")
 var element = document.createElement("span");
if(SETTINGS.page.permissions.canEdit || SETTINGS.page.permissions.canDelete){
    var adminPanel = document.createElement("span");
    adminPanel.style.position = 'absolute';
    adminPanel.style.top = '0px';
    adminPanel.style.right = '0px';
    
    //adminPanel.style = "position: absolute; top: 0px; right: 0px;";
    if(SETTINGS.page.permissions.canEdit){
        adminPanel.innerHTML += "<a href=\"javascript:editPage();\"><img style=\"width: 20px; height: 20px;\" src=\""+SETTINGS.scriptPath+"plugins/ckeditor/edit.png\" alt=\"\" /></a>";   
    }
    if(SETTINGS.page.permissions.canDelete){
        adminPanel.innerHTML += "<a href=\"javascript:deletePage();\"><img style=\"width: 20px; height: 20px;\" src=\""+SETTINGS.scriptPath+"plugins/ckeditor/delete.png\" alt=\"\" /></a>";   
    }
    document.body.appendChild(adminPanel);                                                  
}
 
 });
           
 
function replaceLinkPaths(parent, search, replace){
    child = parent.firstChild;
    while(child){
        if(child.nodeName.toLowerCase()=="a"){
            child.href = child.href.replaceAll(search, replace);
        }
        if(child.hasChildNodes()){               
            //parent.replaceChild(replaceLinkPaths(child, search, replace), child);
            child = replaceLinkPaths(child, search, replace);
        }
        if(child.nextSibling==null)  //Needed for weird old browser compatibility
            return parent;// parent;
        child = child.nextSibling;
    }
    return parent;
}   
function cleanUpHtml(html){
    var element = document.createElement("div");
    element.innerHTML = html;
    element = replaceLinkPaths(element, SETTINGS.scriptPath+"", "page://");
    //replaceLinkPaths(element, "&quot;", "'"); 
    return element.innerHTML;
}

function cleanDownHtml(html){
    var element = document.createElement("div");
    element.innerHTML = html;
    element = replaceLinkPaths(element, "page://", SETTINGS.scriptPath+"");
    return element.innerHTML;
}
              
 function showBodyEditor(theme, page){
    editorOpen = true; 
    
    theme = cleanUpHtml(theme);
    page = cleanUpHtml(page);
                                    
    //jQuery('#body').html("<div id=\"aurora_ckeditor_page_body\">"+SETTINGS.theme.html+"</div>");
    jQuery('#body').html(theme);
    jQuery('#content').html(page);
    jQuery('#body').ckeditor(function() {jQuery('#body').ckeditorGet().execCommand('maximize');},{customConfig: SETTINGS.scriptPath+'themes/'+SETTINGS.theme.name+'/auroraPageBodyConfig.js', extraPlugins : 'ajaxSave' });               
    }
function showContentEditor(data){
    editorOpen = true;
    data = cleanUpHtml(data); 
    
    jQuery("#content").html(data);
    jQuery('#content').ckeditor(function() {}, { customConfig: SETTINGS.scriptPath+'themes/'+SETTINGS.theme.name+'/auroraPageConfig.js', extraPlugins : 'ajaxSave' });               
} 
function ckeditor_ajaxSave(editor){
    var data = cleanDownHtml(editor.getData());
    if(isBase()){
        var sendData;
        sendData = seperateContentFromTheme(data);
        if(sendData.content.length==0)
            alert("Error - Your template MUST contain a div with an id of 'content'");
        else{
            commitPageChanges(sendData, editor);
        }
    }
    else{
        var groupsHTML = "";
        for(index in SETTINGS.groups){
            var group = SETTINGS.groups[index];
            var checked = checkPermission(group.group_id)?" checked=\"yes\"":"";
            groupsHTML+="<input type=\"checkbox\" name=\""+group.group_id+"\" id=\"groupcheck_"+group.group_id+"\" "+checked+" />&nbsp;"+group.name+"<br />";    
        }                                  
        UI.showMessage("Who can view this page?", groupsHTML, function(){
            var groupsAllowed = new Object();
            for(index in SETTINGS.groups){
                groupsAllowed[SETTINGS.groups[index].group_id] = document.getElementById("groupcheck_"+SETTINGS.groups[index].group_id).checked;
            }
            sendData = {content: data, pageName: SETTINGS.page.name+"", permissions: groupsAllowed};
            commitPageChanges(sendData, editor);
        }); 
    }
    editorOpen = false;
}
function seperateContentFromTheme(data){
    var element = document.createElement('div');
    element.innerHTML = data;    
    divs = element.getElementsByTagName('div');
    var contentHTML = "";
    for (i=0;i<divs.length;i++){
        var div = divs[i];//.childNodes[0].nodeValue; 
        if(div.id=="content"){
            contentHTML = div.innerHTML; 
            div.innerHTML = "<PAGE_CONTENT>";
        }
        else if(div.id=="aurora_adminPanel"){
            div.parentNode.removeChild(div);
        }
    } 
    return {content: contentHTML, template: element.innerHTML, pageName: SETTINGS.page.name+""};
} 
function removeAdminPanel(data){
    var element = document.createElement('div');
    element.innerHTML = data;    
    divs = element.getElementsByTagName('div');
    var contentHTML = "";
    for (i=0;i<divs.length;i++){
        var div = divs[i];
        if(div.id=="aurora_adminPanel")
            div.parentNode.removeChild(div);
    } 
    return element.innerHTML;
}                                      
function afterCommit(data, editor){
    editor.destroy();
    window.location=SETTINGS.scriptPath+SETTINGS.page.name;
}

function editPage(){
    if(isBase())
        showBodyEditor(SETTINGS.theme.html, SETTINGS.page.html);
    else
        showContentEditor(SETTINGS.page.html);
}
function deletePage(){
    UI.confirm("Delete Page", "Are you sure you wish to delete this page?", "Yes", function(val){
            jQuery.ajax({type: "post",
                url: SETTINGS.scriptPath +"request/deletePage",
                data: {pageName: SETTINGS.page.name+""},
                success: function(data){window.location=SETTINGS.scriptPath+SETTINGS.defaultPage;}
                });  
        }, "No",
        function(val){
            
        });
}
function commitPageChanges(dataObj, editor){
    jQuery.ajax({type: "post",
        url: SETTINGS.scriptPath +"request/commitPage",
        data: dataObj,
        success: function(data){afterCommit(data, editor);}
        });
}

function FileUploaderDragDropWidget(instanceId,data){
    var parent = this;
    var id = (data.targetId==undefined)?instanceId+"_area":data.targetId;
    var uploadCompleteE=receiverE();
    this.loader=function(){
        var boundary = '------multipartformboundary' + (new Date).getTime();
        var contentType = 'multipart/form-data; enctype=multipart/form-data; boundary=' + boundary;
        var dr = document.getElementById(id);        

        dropE = extractEventE(dr, 'drop').mapE(function(event){
            event.stopPropagation();  
            event.preventDefault();
            return event;    
        });
        extractEventE(dr, 'dragover').mapE(function(event){
            event.stopPropagation();  
            event.preventDefault();
            return event;
        });
        
        var readersReadyE = receiverE();
        var fileReaderE = dropE.mapE(function(event){
            var imagesReady = new Array();
            var data = event.dataTransfer;
            var dashdash = '--';
            var crlf = '\r\n';
            var builder = dashdash+boundary+crlf;        

                var file = data.files[0];                  
                var type = file.type;
                if(type=="image/jpeg"||type=="image/png"||type=="image/gif"){                
                    var reader = new FileReader();
                    reader.onload = function(event){
                        builder += 'Content-Disposition: form-data; name="files[]"';
                        if (file.fileName)
                            builder += '; filename="' + file.fileName + '"';    
                        builder += crlf+'Content-Type: application/octet-stream'+crlf+crlf+event.target.result+crlf+dashdash+boundary+crlf;
                        builder += dashdash+boundary+dashdash+crlf;
                        readersReadyE.sendEvent(builder);
                    }
                    reader.readAsDataURL(file);
                }
            return builder;
        });
        filesUploaded = getAjaxFileRequest(readersReadyE, SETTINGS.scriptPath+"request/fileuploader", contentType);
        filesUploaded.mapE(function(data){
            uploadCompleteE.sendEvent(data);    
        });

    }
    this.uploadCompleteE = function(){
        return uploadCompleteE;    
    }
    this.build=function(){
        if(!data.targetId){
            var dropZone = document.createElement('div');
            dropZone.id = id;
            dropZone.className = 'FileUploaderDragDropWidget';
            dropZone.style.display = 'inline-block';
            /*dropZone.style.width="200px";
            dropZone.style.height="140px";*/
            dropZone.innerHTML = "Drag Files Here";       
            dropZone.style.width = ((data.width==undefined)?placeholder.width:data.width)+'px';
            dropZone.style.height = ((data.height==undefined)?placeholder.height:data.height)+'px';
            return dropZone;
        }
        return "";
    }
    this.destroy=function(){
        /*log('Destroying FileUploader');
        document.getElementById(id).removeEventListener('drop', this.dragDrop);
        document.getElementById(id).removeEventListener('dragover', this.dragOver);*/
    }
}
function FileUploaderWidget(instanceId,data){
    var parent = this;
    this.loader=function(){
      
    }
    this.destroy=function(){

    }
    this.build=function(){
        var dropZone = document.createElement();
        return "<div id=\""+tableDivId+"\"></div>";
    }
}
widgetTypes['fileUploaderWidget']=FileUploaderWidget;
widgetTypes['fileUploaderDragDropWidget']=FileUploaderDragDropWidget;



function jsonSANITIZE(jsonString){
    return jsonString.replaceAll('"', "'");
}
/**
 * jQuery JSON Plugin
 * version: 2.3 (2011-09-17)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */

(function( $ ) {

    var    escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

    /**
     * jQuery.toJSON
     * Converts the given argument into a JSON respresentation.
     *
     * @param o {Mixed} The json-serializble *thing* to be converted
     *
     * If an object has a toJSON prototype, that will be used to get the representation.
     * Non-integer/string keys are skipped in the object, as are keys that point to a
     * function.
     *
     */
    $.toJSON = typeof JSON === 'object' && JSON.stringify
        ? JSON.stringify
        : function( o ) {

        if ( o === null ) {
            return 'null';
        }

        var type = typeof o;

        if ( type === 'undefined' ) {
            return undefined;
        }
        if ( type === 'number' || type === 'boolean' ) {
            return '' + o;
        }
        if ( type === 'string') {
            return $.quoteString( o );
        }
        if ( type === 'object' ) {
            if ( typeof o.toJSON === 'function' ) {
                return $.toJSON( o.toJSON() );
            }
            if ( o.constructor === Date ) {
                var    month = o.getUTCMonth() + 1,
                    day = o.getUTCDate(),
                    year = o.getUTCFullYear(),
                    hours = o.getUTCHours(),
                    minutes = o.getUTCMinutes(),
                    seconds = o.getUTCSeconds(),
                    milli = o.getUTCMilliseconds();

                if ( month < 10 ) {
                    month = '0' + month;
                }
                if ( day < 10 ) {
                    day = '0' + day;
                }
                if ( hours < 10 ) {
                    hours = '0' + hours;
                }
                if ( minutes < 10 ) {
                    minutes = '0' + minutes;
                }
                if ( seconds < 10 ) {
                    seconds = '0' + seconds;
                }
                if ( milli < 100 ) {
                    milli = '0' + milli;
                }
                if ( milli < 10 ) {
                    milli = '0' + milli;
                }
                return '"' + year + '-' + month + '-' + day + 'T' +
                    hours + ':' + minutes + ':' + seconds +
                    '.' + milli + 'Z"';
            }
            if ( o.constructor === Array ) {
                var ret = [];
                for ( var i = 0; i < o.length; i++ ) {
                    ret.push( $.toJSON( o[i] ) || 'null' );
                }
                return '[' + ret.join(',') + ']';
            }
            var    name,
                val,
                pairs = [];
            for ( var k in o ) {
                type = typeof k;
                if ( type === 'number' ) {
                    name = '"' + k + '"';
                } else if (type === 'string') {
                    name = $.quoteString(k);
                } else {
                    // Keys must be numerical or string. Skip others
                    continue;
                }
                type = typeof o[k];

                if ( type === 'function' || type === 'undefined' ) {
                    // Invalid values like these return undefined
                    // from toJSON, however those object members
                    // shouldn't be included in the JSON string at all.
                    continue;
                }
                val = $.toJSON( o[k] );
                pairs.push( name + ':' + val );
            }
            return '{' + pairs.join( ',' ) + '}';
        }
    };

    /**
     * jQuery.evalJSON
     * Evaluates a given piece of json source.
     *
     * @param src {String}
     */
    $.evalJSON = typeof JSON === 'object' && JSON.parse
        ? JSON.parse
        : function( src ) {
        return eval('(' + src + ')');
    };

    /**
     * jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     *
     * @param src {String}
     */
    $.secureEvalJSON = typeof JSON === 'object' && JSON.parse
        ? JSON.parse
        : function( src ) {

        var filtered = 
            src
            .replace( /\\["\\\/bfnrtu]/g, '@' )
            .replace( /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace( /(?:^|:|,)(?:\s*\[)+/g, '');

        if ( /^[\],:{}\s]*$/.test( filtered ) ) {
            return eval( '(' + src + ')' );
        } else {
            throw new SyntaxError( 'Error parsing JSON, source is not valid.' );
        }
    };

    /**
     * jQuery.quoteString
     * Returns a string-repr of a string, escaping quotes intelligently.
     * Mostly a support function for toJSON.
     * Examples:
     * >>> jQuery.quoteString('apple')
     * "apple"
     *
     * >>> jQuery.quoteString('"Where are we going?", she asked.')
     * "\"Where are we going?\", she asked."
     */
    $.quoteString = function( string ) {
        if ( string.match( escapeable ) ) {
            return '"' + string.replace( escapeable, function( a ) {
                var c = meta[a];
                if ( typeof c === 'string' ) {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };

})( jQuery );


function AnalogRegisterDisplay(instanceId, data){
    this.device = data.device;
    this.targetType = data.targetType;
    this.targetRegister = data.targetRegister; 
    this.units = data.units;
    this.loader=function(){  
	var pollRate = data.pollRate; 
	var dataR = DATA.getRemote("scada_integer_register", this.device+"|"+this.targetType+"|"+this.targetRegister, NOT_READY, pollRate);  //, NOT_READY, POLL_RATES.SLOW       
	var dataB = dataR.behaviour;        
	insertDomB(dataB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("scada_integer_register", this.targetRegister);
    }
    this.build=function(){
        return "<span class=\"scada_analogDisplay\"><span id=\""+instanceId+"_container\">&nbsp;</span>"+this.units+"</span>";
    }
}     
widgetTypes['AnalogRegisterDisplay']=AnalogRegisterDisplay;




