function BuildProductWidgetHTML(id, title, description, price, text){
    var text = (text==undefined)?"Add To Cart":text;
    return "<div id=\""+id+"\" class=\"ProductWidget\"><img id=\""+id+"_image\" src=\"resources/aurora.products/"+id+".png\" alt=\"\" class=\"ProductWidgetImg\" /><h2>"+title+"</h2>"+description+"<div style=\"clear:both;\" class=\"ProductWidgetPrice\"><form style=\"float: right;\" target=\"paypal\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\"><input id=\""+id+"_submit\" type=\"image\" src=\"/plugins/aurora.products/addtocart.png\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\"><input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\"><input type=\"hidden\" name=\"hosted_button_id\" value=\""+id+"\"></form>$"+price+"</div></div>";
//<input id=\""+id+"_submit\" type=\"submit\" src=\"/border=\"0\" name=\"submit\" value=\""+text+"\" alt=\"PayPal - The safer, easier way to pay online!\">    
//<input id=\""+id+"_submit\" type=\"image\" src=\"/plugins/aurora.products/addtocart.png\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">    
 /*<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\"> */   
    
}
/**
 *  ProductWidget
 * @constructor
 */ 
function ProductWidget(instanceId, data){
    var id = instanceId+"_container";
    var title = data.title;
    var description = data.description;
    var price = data.price;
    var productId = data.productId;
    this.loader=function(){
        //jQuery("#"+productId+"_submit").button();
        var img = document.getElementById(productId+"_image");
        if(!img.complete){
            img.src = "/resources/trans.png";
        }
    }
    this.destroy=function(){}
    this.build=function(){
        return BuildProductWidgetHTML(productId, title, description, price);
    }                         
}
                     
/**
 *  ProductWidgetConfigurator
 * @constructor
 */                                                      
function ProductWidgetConfigurator(){
	this['load'] = function(newData){}
    var id = "ProductWidgetConfigurator";
    this['build'] = function(newData){
        var productId = "";
        var title = ""; 
        var description = ""; 
        var price = "";
        if(newData!=undefined){
            productId = newData['productId'];
            title = newData['title']; 
            description = newData['description']; 
            price = newData['price']; 
        }
        return "Product Id: <input type=\"text\" id=\""+id+"_id\" value=\""+productId+"\" /><br />"+
        "Title: <input type=\"text\" id=\""+id+"_title\" value=\""+title+"\" /><br />"+
        "Description: <input type=\"text\" id=\""+id+"_description\" value=\""+description+"\" /><br />"+
        "Price: <input type=\"text\" id=\""+id+"_price\" value=\""+price+"\" />";
    }
    this['getData'] = function(){
        return {productId: document.getElementById(id+'_id').value, title: document.getElementById(id+'_title').value, description: document.getElementById(id+'_description').value, price: document.getElementById(id+'_price').value};
    }
    this['getName'] = function(){
        return "Product Widget";
    }
    this['getDescription'] = function(){
        return "A product item with an add to cart button";
    }
    this['getPackage'] = function(){
        return "Products";
    }
/*    this['getPlaceholder'] = function(editor){
    	var data = this.getData();
    	var abbr = editor.document.createElement('span');
		abbr.setAttribute('class', "widget_ProductWidget");
        abbr.setAttribute('title', JSON.stringify(data).replace('"', "'"));
		abbr.$.innerHTML = BuildProductWidgetHTML(data.productId, data.title, data.description, data.price, data.text);
        return abbr;
    }*/
} 
WIDGETS.register("ProductWidget", ProductWidget); //ProductWidgetConfigurator 


/*
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
	this['load'] = function(newData){}
    var id = "VideoWidgetCont";
    this['build'] = function(newData){
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
    this['getPackage'] = function(){
        return "Audio/Video";
    }
} */