/* BASE WIDGETS */        
/**
 *  WebpageSettingsWidget
 * @constructor
 */
function VideoPlayerWidget(instanceId, data){
    var width = (data.placeholder!=undefined&&data.placeholder.style.width!=undefined)?data.placeholder.style.width:undefined;
    var height = (data.placeholder!=undefined&&data.placeholder.style.height!=undefined)?data.placeholder.style.height:undefined;
    var poster = (data.poster!=undefined&&data.poster!="")?"&poster="+data.poster+"":"";
    var poster2 = (data.poster!=undefined&&data.poster!="")?"<img alt=\"happyfit2\" src=\""+data.poster+"\" style=\"position:absolute;left:0;\" width=\""+width+"\" height=\""+height+"\" title=\"Video playback is not supported by your browser\" />":"";
    var poster3 = (data.poster!=undefined&&data.poster!="")?" poster=\""+data.poster+"\"":"";
    var sources = data.sources;
    var flashPlayer = "/plugins/aurora.media/flashfox.swf";
    this.loader=function(){
         var sourcesStr = "";
        var mp4 = "";
        var autoplay = (data.autoplay==true||data.autoplay=="true")?true:false;
        for(index in sources){
            var type = sources[index]['type'];
            //window['SETTINGS']['scriptPath']
            if(sources[index]['type']=="video/mp4")
                mp4 = sources[index]['src']; 
            sourcesStr += "<source src=\""+sources[index]['src']+"\" type='"+type+"' />";
        }
        var flashPart = "";
        if(mp4!=""){
            flashPart = "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" type=\"application/x-shockwave-flash\" data=\""+flashPlayer+"\" width=\"604\" height=\"256\" style=\"position:relative;\">"+
                                "<param name=\"movie\" value=\""+flashPlayer+"\" />"+
                                "<param name=\"allowFullScreen\" value=\"true\" />"+
                                "<param name=\"flashVars\" value=\"autoplay="+autoplay+"&amp;controls=true&amp;loop=true&amp;src="+mp4+"\" />"+
                                "<embed src=\""+flashPlayer+"\" width=\"604\" height=\"256\" flashVars=\"src="+mp4+"&amp;autoplay="+autoplay+"&amp;controls=true&amp;loop=true"+poster+"\"    allowFullScreen=\"true\" wmode=\"transparent\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.adobe.com/go/getflashplayer_en\" />"+
                                poster2+
                                "</object>";
        }
        document.getElementById("video").innerHTML = "<video controls=\"controls\" "+(autoplay?" autoplay=\"autoplay\"":"")+"\""+poster3+" width=\""+width+"\" height=\""+height+"\" onclick=\"if(/Android/.test(navigator.userAgent))this.play();\">"+sourcesStr+flashPart+"</video>"; 
    }
    this.destroy=function(){
        DATA.deregister("aurora_settings", "");
    }
    this.build=function(){     
        return "<div id=\"video\"></div>";
    }
}   

function VideoPlayerWidgetConfigurator(){
    var id = "VideoWidgetCont";
    this['render'] = function(newData){
        var poster = (newData!=undefined&&newData['poster']!=undefined)?newData['poster']:"";
        var autoplay = (newData!=undefined&&newData['autoplay']!=undefined)?newData['autoplay']:"false";
        var returnString = "";
        var src1 = "";
        var type1="";
        var src2 = "";
        var type2="";
        var src3 = "";
        var type3="";
        if(newData!=undefined&&newData['sources'].length>0){
            src1 = (newData!=undefined&&newData['sources'][0]['src']!=undefined)?newData['sources'][0]['src']:"";
            type1 = (newData!=undefined&&newData['sources'][0]['type']!=undefined)?newData['sources'][0]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src1\" value=\""+src1+"\" /><br />Type<input type=\"text\" id=\""+id+"_type1\" value=\""+type1+"\" /><br />";
        if(newData!=undefined&&newData['sources'].length>1){
            src2 = (newData!=undefined&&newData['sources'][1]['src']!=undefined)?newData['sources'][1]['src']:"";
            type2 = (newData!=undefined&&newData['sources'][1]['type']!=undefined)?newData['sources'][1]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src2\" value=\""+src2+"\" /><br />Type<input type=\"text\" id=\""+id+"_type2\" value=\""+type2+"\" /><br />";
        if(newData!=undefined&&newData['sources'].length>2){
            src3 = (newData!=undefined&&newData['sources'][2]['src']!=undefined)?newData['sources'][2]['src']:"";
            type3 = (newData!=undefined&&newData['sources'][2]['type']!=undefined)?newData['sources'][2]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src3\" value=\""+src3+"\" /><br />Type<input type=\"text\" id=\""+id+"_type3\" value=\""+type3+"\" /><br />";
        return returnString+"Poster: <input type=\"text\" id=\""+id+"_poster\" value=\""+poster+"\" /><br />Autoplay: <input type=\"checkbox\" id=\""+id+"_autoplay\"  "+((autoplay)?" checked=\"true\"":"")+" />"; 
    }
    this['getData'] = function(){
        var sources = [];
        var src1 = document.getElementById(id+"_src1");
        var type1 = document.getElementById(id+"_type1");
        var src2 = document.getElementById(id+"_src2");
        var type2 = document.getElementById(id+"_type2");
        var src3 = document.getElementById(id+"_src3");
        var type3 = document.getElementById(id+"_type3");
        if(src1.value.length>0){
            var type1Value = (type1.value.length==0)?auroraMediaVideoSrcToType(src1):type1.value;
            sources.push({"src": src1.value, "type": type1Value});
        }
        if(src2.value.length>0){
            var type2Value = (type2.value.length==0)?auroraMediaVideoSrcToType(src2):type2.value; 
            sources.push({"src": src2.value, "type": type2Value});
        }
        if(src3.value.length>0){
            var type3Value = (type3.value.length==0)?auroraMediaVideoSrcToType(src3):type3.value; 
            sources.push({"src": src3.value, "type": type3Value});
        }
        return {"poster": document.getElementById(id+"_poster").value, "autoplay": document.getElementById(id+"_autoplay").checked, "sources": sources};
    }
    this['getName'] = function(){
        return "Video Player Widget";
    }
    this['getDescription'] = function(){
        return "An mp4 player";
    }
    this['getImage'] = function(){}
} 
WIDGETS.register("VideoPlayerWidget", VideoPlayerWidget, VideoPlayerWidgetConfigurator); 