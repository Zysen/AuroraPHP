function GoogleMapWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var zoom = parseInt(data.zoom);
    this.loader=function(addressB){
        //var scriptLoadedE = loadScriptE("http://maps.googleapis.com/maps/api/js?key=AIzaSyCP1Ej3uTUHUBkzi4Q6F4vujwyWd3ocVNA&sensor=false");
        var addressB = (addressB==undefined)?F.constantB(data.address):addressB;
        var mapB = F.oneE().startsWith(NOT_READY).liftB(function(data){
            if(!good())
                return NOT_READY;
            return new google.maps.Map(DOM.get(mapId), {zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP});
        });
        var locationB = geoCodeB(addressB);
        F.liftB(function(map, geocode){
            if(!good())
                return NOT_READY;
           if(geocode.results.length>0){
               if(DOM.get(mapId).style.display=='none'){
                    DOM.get(mapId).style.display = 'inline-block'; 
               }
               map.setCenter(geocode.results[0].geometry.location, zoom);
           }
           else{
                DOM.get(mapId).style.display = 'none';
           }
        }, mapB, locationB);                
    }
    this.build=function(){   
        var d = getPlaceholderDimensions(data.placeholder);
        return "<span id=\""+mapId+"\" style=\"margin: 0 auto; display: none; width: "+d.width+d.wUnit+"; height: "+d.height+d.hUnit+";\">&nbsp;</span>";
    }
    this.destroy=function(){
    }
}
function GoogleMapWidgetConfigurator(){
    var addressId = "addressId";
    var zoomId = "zoomId";
    this['render'] = function(newData){
        var address = (newData!=undefined&&newData['address']!=undefined)?newData['address']:"";
        var zoom = (newData!=undefined&&newData['zoom']!=undefined)?newData['zoom']:"2";
        return "Address: <input type=\"text\" id=\""+addressId+"\" value=\""+address+"\" /><br />"+
        "Zoom: <input type=\"text\" id=\""+zoomId+"\" value=\""+zoom+"\" />";  
    }
    this['getData'] = function(){
        return {"address": document.getElementById(addressId).value, "zoom":document.getElementById(zoomId).value};
    }
    this['getName'] = function(){
        return "Google Map";
    }
    this['getDescription'] = function(){
        return "GOogle Map";
    }
    this['getImage'] = function(){
        return undefined;
    }
}  

function GoogleStreetViewWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var geocoder = new google.maps.Geocoder();
    this.loader=function(){
       var pin = new google.maps.MVCObject();
        var address = data.address;
        var zoom = parseInt(data.zoom);
        var pitch = parseInt(data.pitch);
        var heading = parseInt(data.heading);
        geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      
        panorama = new google.maps.StreetViewPanorama(document.getElementById(mapId), {
       //navigationControl: false,
       enableCloseButton: false,
       addressControl: false,
       linksControl: false,
       visible: true,
       pov: {heading:heading,pitch:pitch,zoom:zoom},
       position: results[0].geometry.location
      });
      
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });              
    }
    this.build=function(){
       /* return "<div style=\"width: "+data.placeholder.style.width+"; height: "+data.placeholder.style.height+";\" class=\"googleMapSVSurround\"><div id=\""+mapId+"\" class=\"map_canvas\"></div></div>";              */
       return "<div id=\""+mapId+"\" style=\"width: 400px; height: 400px;\">MAP</div>";
    }
    this.destroy=function(){
    }
}  
/**
 *  IntegerTableWidgetConfigurator
 * @constructor
 */
function GoogleStreetViewWidgetConfigurator(){
    var addressId = "addressId";
    var headingId = "headingId";
    var pitchId = "pitchId";
    var zoomId = "zoomId";
    this['render'] = function(newData){
        var address = (newData!=undefined&&newData['address']!=undefined)?newData['address']:"";
        var heading = (newData!=undefined&&newData['heading']!=undefined)?newData['heading']:"0";
        var pitch = (newData!=undefined&&newData['pitch']!=undefined)?newData['pitch']:"0";
        var zoom = (newData!=undefined&&newData['zoom']!=undefined)?newData['zoom']:"2";
        return "Address: <input type=\"text\" id=\""+addressId+"\" value=\""+address+"\" /><br />"+
        "Heading: <input type=\"text\" id=\""+headingId+"\" value=\""+heading+"\" /><br />"+
        "Pitch: <input type=\"text\" id=\""+pitchId+"\" value=\""+pitch+"\" /><br />"+
        "Zoom: <input type=\"text\" id=\""+zoomId+"\" value=\""+zoom+"\" /><br />";  
    }
    this['getData'] = function(){
        return {"address": document.getElementById(addressId).value, "heading":document.getElementById(headingId).value, "pitch":document.getElementById(pitchId).value, "zoom":document.getElementById(zoomId).value};
    }
    this['getName'] = function(){
        return "Google Street View";
    }
    this['getDescription'] = function(){
        return "Street View";
    }
    this['getImage'] = function(){
        return undefined;
    }
}         
WIDGETS.register("googleMapWidget", GoogleMapWidget, GoogleMapWidgetConfigurator);
WIDGETS.register("googleStreetViewWidget", GoogleStreetViewWidget, GoogleStreetViewWidgetConfigurator);                



function geoCodeB(addressB){
    var rec = F.receiverE();
    addressB.liftB(function(address){  
        if(!good())
            return NOT_READY;
        log("Geocoding: "+address);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            log(status);
            log(results);
            rec.sendEvent({results: results, status: status});
        });
    });
    
    return rec.startsWith(NOT_READY); 
}
