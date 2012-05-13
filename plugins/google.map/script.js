function GoogleMapWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var geocoder = new google.maps.Geocoder();
    this.loader=function(){
        //var latlng = new google.maps.LatLng(-34.397, 150.644);
        //var address="1 camperdown rd, miramar, wellington, new zealand";
        var address = data.address;
        geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var myOptions = {
          zoom: data.zoom,
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
        var element = createDomElement("div", mapId, "googleMapSurround", "<div id=\""+mapId+"\" class=\"map_canvas\"></div>");
        element.style = data.placeholder.style;
        return element;
    }
    this.destroy=function(){
    }
}
function GoogleStreetViewWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var geocoder = new google.maps.Geocoder();
    this.loader=function(){
       var pin = new google.maps.MVCObject();
        var address = data.address;
        geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      
        panorama = new google.maps.StreetViewPanorama(document.getElementById(mapId), {
       //navigationControl: false,
       enableCloseButton: false,
       addressControl: false,
       linksControl: false,
       visible: true,
       pov: {heading:data.heading,pitch:data.pitch,zoom:data.zoom},
       position: results[0].geometry.location
      });
      
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });              
    }
    this.build=function(){
        return "<div style=\"width: "+data.placeholder.style.width+"; height: "+data.placeholder.style.height+";\" class=\"googleMapSVSurround\"><div id=\""+mapId+"\" class=\"map_canvas\"></div></div>";
    }
    this.destroy=function(){
    }
}                                 
widgetTypes['googleMapWidget']=GoogleMapWidget;
widgetTypes['googleStreetViewWidget']=GoogleStreetViewWidget;

