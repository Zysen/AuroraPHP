/* BASE WIDGETS */        
/**
 *  WebpageSettingsWidget
 * @constructor
 */
function VideoPlayerWidget(instanceId, data){
    var poster = (data.poster!=undefined&&data.poster!="")?" poster=\""+data.poster+"\"":"";
    var width = (data.placeholder!=undefined&&data.placeholder.style.width!=undefined)?data.placeholder.style.width:undefined;
    var height = (data.placeholder!=undefined&&data.placeholder.style.height!=undefined)?data.placeholder.style.height:undefined;
    var sources = data.sources;
    this.loader=function(){
      
    }
    this.destroy=function(){
        DATA.deregister("aurora_settings", "");
    }
    this.build=function(){
        var sourcesStr = "";
        for(index in sources){
            sourcesStr += "<source type=\""+sources[index]['type']+"\" src=\""+sources[index]['src']+"\">";
        }
        //<track kind=\"subtitles\" srclang=\"ru\" src=\"./media/sintel_ru.srt\">
        return "<video controls"+poster+" width=\""+width+"\" height=\""+height+"\">"+sourcesStr+"</video>";
    }
}     
function VideoPlayerWidgetConfigurator(){
    var id = "VideoWidgetCont";
    this['render'] = function(newData){
        var poster = (newData!=undefined&&newData['poster']!=undefined)?newData['poster']:"";
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
        return returnString+"Poster: <input type=\"text\" id=\""+id+"_poster\" value=\""+poster+"\" />"; 
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
        return {"poster": document.getElementById(id+"_poster").value, "sources": sources};
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
function auroraMediaVideoSrcToType(src){
    var t = src.split('.').pop();
    switch(src){
        case "ogg":{
            return "video/ogg";
        }
        case "mp4":{
            return "video/mp4";
        }
        case "webm":{
            return "video/webm";
        }
        default:{
            return "video/"+t; 
        }
    }
}