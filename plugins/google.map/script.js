function GoogleMapWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var geocoder = new google.maps.Geocoder();
    this.loader=function(){
        //var latlng = new google.maps.LatLng(-34.397, 150.644);
        //var address="1 camperdown rd, miramar, wellington, new zealand";
        var address = data.address;
        var zoom = parseInt(data.zoom);
        geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var myOptions = {
          zoom: zoom,
          center: results[0].geometry.location,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById(mapId), myOptions);
        
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });

        
    }
    this.build=function(){
        /*var element = createDomElement("div", mapId, "googleMapSurround", "<div id=\""+mapId+"\" class=\"map_canvas\"></div>");
        element.style = data.placeholder.style;
        return element;   */
        return "<div id=\""+mapId+"\" style=\"width: 400px; height: 400px;\">MAP</div>";
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
    log(data);
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

