function ajax(options) {
    if(typeof jQuery != 'undefined'){
        jQuery.ajax(options);
    }
    else{
        var type = (options["type"]=='undefined')?"POST":options["type"];
        var success = options["success"];
        var error = options["fail"];
        var dataType = options["dataType"];
        var url = options["url"];
        var data = options["data"];
        
        function getXMLHttpRequest() {
            if (window.XMLHttpRequest) {
                return new window.XMLHttpRequest;
            } else {
                try {
                    return new ActiveXObject("MSXML2.XMLHTTP");
                } catch (ex) {
                    return null;
                }
            }
        }

        if(typeof data == 'string'){
            data = JSON.parse(data);
        } 
        var dataStr="";
        var count =0;
        for(index in data){
            var dataPiece = (typeof(data[index])=='string')?data[index]:JSON.stringify(data[index]);
            if(count!=0)
                dataStr+="&";
            dataStr += index+"="+dataPiece;
            count++;
        }
        //dataStr = dataStr.replaceAll("\"", "'");
        /*var oReq = getXMLHttpRequest();
        if (oReq != null) {
            oReq.open("POST", url, true);
            oReq.onreadystatechange = handler;
            oReq.send(dataStr);
        } else {
            UI.showMessage("AJAX (XMLHTTP) not supported.");
        }  */
        var xmlhttp = getXMLHttpRequest(); 
        
        if (xmlhttp != null) {
            xmlhttp.open("POST",url,true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send(dataStr);
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == 4 /* complete */ ) {
                    if (xmlhttp.status == 200 && success!=undefined) {
                        success(xmlhttp.responseText);
                    }
                    else if(error!=undefined)
                        error(xmlhttp.status);
                }
            };
        } else {
            UI.showMessage("AJAX (XMLHTTP) not supported.");
        }
    }    
}
window['createBehaviour'] = function(initialValue){
    return F.receiverE().startsWith(initialValue);
}
function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;el != null;lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){}
    return {x: lx,y: ly};
}

function aurora_viewport()
{
var e = window
, a = 'inner';
if ( !( 'innerWidth' in window ) )
{
a = 'client';
e = document.documentElement || document.body;
}
return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}
//John Resig   
var ready = ( function () {
function addEvent( obj, type, fn ) {
    if (obj.addEventListener) {
        obj.addEventListener( type, fn, false );
        EventCache.add(obj, type, fn);
    }
    else if (obj.attachEvent) {
        obj["e"+type+fn] = fn;
        obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
        obj.attachEvent( "on"+type, obj[type+fn] );
        EventCache.add(obj, type, fn);
    }
    else {
        obj["on"+type] = obj["e"+type+fn];
    }
}
var EventCache = function(){
    var listEvents = [];
    return {
        listEvents : listEvents,
        add : function(node, sEventName, fHandler){
            listEvents.push(arguments);
        },
        flush : function(){
            var i, item;
            for(i = listEvents.length - 1; i >= 0; i = i - 1){
                item = listEvents[i];
                if(item[0].removeEventListener){
                    item[0].removeEventListener(item[1], item[2], item[3]);
                };
                if(item[1].substring(0, 2) != "on"){
                    item[1] = "on" + item[1];
                };
                if(item[0].detachEvent){
                    item[0].detachEvent(item[1], item[2]);
                };
                item[0][item[1]] = null;
            };
        }
    };
}();
// Usage
/*addEvent(window,'unload',EventCache.flush);
addEvent(window,'load', function(){});       */

  function ready( f ) {
    if( ready.done ) return f();

    if( ready.timer ) {
      ready.ready.push(f);
    } else {
      addEvent( window, "load", isDOMReady );
      ready.ready = [ f ];
      ready.timer = setInterval(isDOMReady, 13);
    }
  };

  function isDOMReady() {
    if( ready.done ) return false;

    if( document && document.getElementsByTagName && document.getElementById && document.body ) {
      clearInterval( ready.timer );
      ready.timer = null;
      for( var i = 0; i < ready.ready.length; i++ ) {
        ready.ready[i]();
      }
      ready.ready = null;
      ready.done = true;
    }
  }

  return ready;
})();


function caller(ob, depth, maxDepth){
    if(depth==undefined)
        depth = 1;
    if(maxDepth==undefined)
        maxDepth = 10;
    log("Probing at depth: "+depth);
    log(ob);
    log(ob.callee);
    log(ob.callee.toString);
    log(ob.callee.caller);
    log(ob.callee.caller.toString());
    log("");
    if(depth<=maxDepth)
        caller(ob.callee.caller.arguments, depth+1, maxDepth);
}
function auroraParseBoolean(b){
    if(b=="true"||b==true)
        return true;
    return false;
}

function getViewPortDimensions(){
 
 var viewportwidth;
 var viewportheight;
  
 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  
 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }
  
// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 
 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }
  
 // older versions of IE
  
 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }
return {width: viewportwidth, height: viewportheight};
}
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
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

String.prototype.replaceAll = function(replace, with_this) {
  return this.replace(new RegExp(replace, 'g'),with_this);
};
/*if (!document.addEventListener && document.attachEvent)
{
    Object.prototype.addEventListener = function(eventName, func, capture)
    {
        if (this.attachEvent)
            this.attachEvent('on' + eventName, func);
    }

    var i, l = document.all.length;

    for (i = 0; i < l; i++)
        document.all[i].addEventListener = Object.prototype.addEventListener;

    window.addEventListener = Object.prototype.addEventListener;
    document.addEventListener = Object.prototype.addEventListener;
}*/
if(!window.addEventListener && document.attachEvent){
window.addEventListener = function(eventName, func, capture){
        this.attachEvent('on' + eventName, func);
    }
}


/*document.getElementsByClassName = function(cl) {
var retnode = [];
var myclass = new RegExp('\\b'+cl+'\\b');
var elem = this.getElementsByTagName('*');
for (var i = 0; i < elem.length; i++) {
var classes = elem[i].className;
if (myclass.test(classes)) retnode.push(elem[i]);
}
return retnode;
}; 
function getElementsByClassName2(className, body){
    var retnode = [];
     var element = document.createElement('div');
    element.innerHTML = body;
    var tags = element.getElementsByTagName('img');
    for(index in tags){
        var tag = tags[index];
        if(tag.className==className){
            retnode.push(tag);
        }
    }
    return retnode;
}          */
function test(ob){
    alert(getClassName(ob)+" | "+ob+" | "+ObjectToString(ob));
}
function getClassName(element) { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((element).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
}; 

function loadXMLString(txt)
{
if (window.DOMParser)
  {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(txt,"text/xml");
  }
else // Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(txt);
  }
return xmlDoc;
}
var getElementsByClassName = function(class_name, tag, elm) {
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
function getElement(id){
    return document.getElementById(id);
}
function disableEventPropagation(event)
{
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
} 
function disableHighlight(target){
	target = (typeof(target)=='string')?DOM.get(target):target;
    if(document.all)
        target.onselectstart = handleSelectAttempt;
    target.onmousedown = handleSelectAttempt;   
}

function handleSelectAttempt(e) {
    var sender = e && e.target || window.event.srcElement;
    if (window.event) {
        event.returnValue = true;
    }
    return true;
}
function makeUnselectable(node) {
    if (node.nodeType == 1) {
        node.unselectable = true;
    }
    var child = node.firstChild;
    while (child) {
        makeUnselectable(child);
        child = child.nextSibling;
    }
}

function objectEquals(ob1, ob2)
{
    if(typeof(ob1)=='undefined'||typeof(ob2)=='undefined'){
        return (typeof(ob1)=='undefined'&&typeof(ob2)=='undefined');
    }


  var p;
  for(p in ob1) {
      if(typeof(ob2)=='undefined'||typeof(ob2[p])=='undefined') {return false;}
  }

  for(p in ob1) {
      if (ob1[p]) {
          switch(typeof(ob1[p])) {
              case 'object':
                  if (!objectEquals(ob1[p], ob2[p])) { return false; } break;
              case 'function':
                  if (typeof(ob2)=='undefined' || typeof(ob2[p])=='undefined' ||
                      (p != 'equals' && ob1[p].toString() != ob2[p].toString()))
                      return false;
                  break;
              default:
                  if (ob1[p] != ob2[p]) { return false; }
          }
      } else {
          if (ob2[p])
              return false;
      }
  }

  for(p in ob2) {
      if(typeof(ob1)=='undefined'||typeof(ob1[p])=='undefined') {return false;}
  }

  return true;
}   
//Object.prototype.equals = objectEquals;
function clone(source){
    return cloneObject(source);
}  
//Object.prototype.clone = clone;
function cloneObject(source) {
   if (source instanceof Array) {
        var copy = [];
        for (var i = 0; i < source.length; i++) {
            copy[i] = cloneObject(source[i]);
        }
        return copy;
    }
   var copiedObject = {};
   jQuery.extend(true, copiedObject,source);
   return copiedObject;
   }


/*  
/*Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};    */

/*function cloneObject(source) {
    /*for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        }
        else{
            this[i] = source[i];
    }
    } 
//    return Object.extend({ }, object);
   // return jQuery.extend(true, {}, source);
   //return clone(source);
   
   var copiedObject = {};
   jQuery.extend(copiedObject,source);
   return copiedObject;
}  
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

       */
       
       //LZW Compression/Decompression for Strings
var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            if (dictionary[wc]) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },
 
 
    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = [],
            w,
            result,
            k,
            entry = "",
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }
 
        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
 
            result += entry;
 
            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
 
            w = entry;
        }
        return result;
    }
}; // For Test Purposes
/*    comp = LZW.compress("TOBEORNOTTOBEORTOBEORNOT"),
    decomp = LZW.decompress(comp);
document.write(comp + '<br>' + decomp);*/




/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/
 
var MD5 = function (string) {
 
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
 
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
     }
 
     function F(x,y,z) { return (x & y) | ((~x) & z); }
     function G(x,y,z) { return (x & z) | (y & (~z)); }
     function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
 
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
 
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };
 
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
 
    string = Utf8Encode(string);
 
    x = ConvertToWordArray(string);
 
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
 
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
    return temp.toLowerCase();
}

/*objectEquals = function(ob1, x)
{
  for(p in ob1) {
      if(typeof(x[p])=='undefined') {return false;}
  }

  for(p in ob1) {
      if (ob1[p]) {
          switch(typeof(ob1[p])) {
              case 'object':
                  if (!objectEquals(ob1[p], x[p])) { return false; } break;
              case 'function':
                  if (typeof(x[p])=='undefined' ||
                      (p != 'equals' && ob1[p].toString() != x[p].toString()))
                      return false;
                  break;
              default:
                  if (ob1[p] != x[p]) { return false; }
          }
      } else {
          if (x[p])
              return false;
      }
  }

  for(p in x) {
      if(typeof(ob1[p])=='undefined') {return false;}
  }

  return true;
} */


         
function loadScriptE(url){
    var rec = F.receiverE();
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                rec.sendEvent(true);
            }
        };
    } else {  //Others
        script.onload = function(){
            rec.sendEvent(true);
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    return rec;
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function aurora_requestWidgetRefE(page){
    var rec = F.receiverE();
    jQuery.ajax({
        dataType: 'json',
        type: "post",
        data: {page: page},
        url: SETTINGS.scriptPath+"request/getWidgetRef",
        success: function(data){
            rec.sendEvent(data);
        },
        error: connectionError
    });
    return rec;
}
function aurora_requestWidgetRef(page, callback){
    jQuery.ajax({
        dataType: 'json',
        type: "post",
        data: {page: page},
        url: SETTINGS.scriptPath+"request/getWidgetRef",
        success: function(data){
            callback(data);
        },
        error: connectionError
    });
}
function getPlaceholderDimensions(placeholder){
    var width = placeholder.getAttribute('width');
    var height = placeholder.getAttribute('height');
    width = (width!=undefined)?width:placeholder.style.width;
    height = (height!=undefined)?height:placeholder.style.height;
    wUnit = width.contains("%")?"%":"px";
    hUnit = height.contains("%")?"%":"px";
    return {width: parseInt(width.replace('px', '')), height: parseInt(height.replace('px', '')), wUnit: wUnit, hUnit:hUnit};
}

function getObjectValues(ob){
    var ret = [];
    log("getObjectValues");
    for(index in ob){
    	log(index);
    	log(ob[index]);
        ret.push(ob[index]);
    }
    return ret;
}     
