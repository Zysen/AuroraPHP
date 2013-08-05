function GoogleMapWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var mapType = (data.mapType!=undefined?data.mapType:"ROADMAP"); //SATELLITE  HYBRID TERRAIN
    this.mapTypeIdChangedE = F.receiverE();
    this.mapTypeIdChangedB = this.mapTypeIdChangedE.startsWith(mapType);
    this.zoomChangedE = F.receiverE();
    this.zoomChangedB = this.zoomChangedE.startsWith(data.zoom);
    this.centerChangedE = F.receiverE();
    this.centerChangedB = this.centerChangedE.startsWith(NOT_READY);
    this.boundsChangedE = F.receiverE();
    this.resizedE = F.receiverE();
    this.mapE = F.receiverE();
   	this.dimensionsE = F.receiverE();
   	this.dimensionsB = this.dimensionsE.startsWith(NOT_READY);
    this.mapB = this.mapE.startsWith(NOT_READY);
    var parent = this;
    var configuredAddressE = F.receiverE();
    
    this.loader=function(addressB){
    	mapType = (data.mapType!=undefined?data.mapType:"ROADMAP"); //SATELLITE  HYBRID TERRAIN
        if(addressB==undefined){
        	addressB = F.mergeE(configuredAddressE, F.oneE(data.address).filterE(function(address){return data.address!=undefined&&data.lat==undefined})).startsWith(NOT_READY);
        }
        
        var mapB = F.oneE().mapE(function(){
        	var map = new google.maps.Map(DOM.get(mapId), {zoom: data.zoom, mapTypeId: google.maps.MapTypeId[mapType]});
            var marker = new google.maps.Marker({
			    position: map.getCenter(),
			    map: map,
			    title: 'Click to zoom'
			  });
			  parent.mapTypeIdChangedE.sendEvent(map.getMapTypeId().toUpperCase());
			google.maps.event.addListener(map, 'zoom_changed', function() {
				parent.zoomChangedE.sendEvent(map.getZoom());
			});
			
			google.maps.event.addListener(map, 'center_changed', function() {
				parent.centerChangedE.sendEvent(map.getCenter().toString());
			});
			
			google.maps.event.addListener(map, 'maptypeid_changed', function() { 
			    parent.mapTypeIdChangedE.sendEvent(map.getMapTypeId().toUpperCase());
			} );

			google.maps.event.addListener(map, 'bounds_changed', function(ev) {
				parent.boundsChangedE.sendEvent(ev);
			});
			
			google.maps.event.addListener(map, 'resize', function(ev, ui) {
				parent.resizedE.sendEvent(ev);
			});


			if(data.resizable!=undefined&&data.resizable==true){
				jQuery("#"+instanceId+"_container").resizable(
		    	{
		    		animate: false,
		    		resize: function(event, ui) {
		    			//google.maps.event.trigger(map, 'resize');
		    		},
		    		stop: function(event, ui) {
		    			parent.dimensionsE.sendEvent(ui.size);
		    			google.maps.event.trigger(map, 'resize');
		    		}
	    		}); 
    		}

			if(data.lat&&data.lng){
				map.panTo(new google.maps.LatLng(data.lat, data.lng), data.zoom);
				//parent.centerChangedE.sendEvent(map.getCenter().toString());
				parent.zoomChangedE.sendEvent(map.getZoom());
			}
			parent.mapE.sendEvent(map);
			parent.mapTypeIdChangedE.sendEvent(map.getMapTypeId().toUpperCase());
			parent.dimensionsE.sendEvent({width: jQuery("#"+instanceId+"_container").width(), height: jQuery("#"+instanceId+"_container").height()});
			
			 return {map: map, marker: marker};
        }).startsWith(NOT_READY);
        
        var locationB = geoCodeB(addressB);
        var centerChangedB = F.liftB(function(map, geocode){
            if(!good())
                return NOT_READY;
           if(geocode.results.length>0){
               map.map.panTo(geocode.results[0].geometry.location, data.zoom);
               parent.centerChangedE.sendEvent(map.map.getCenter().toString());
				parent.zoomChangedE.sendEvent(map.map.getZoom());
           }
        }, mapB, locationB);            
    }
    this.build=function(newData){   
        if(newData!=undefined){
        	data = newData;
        }
        var mapType = (newData!=undefined&&newData.mapType!=undefined?newData.mapType:"ROADMAP");
        var width = "100%";
        var height = "300px";
        if(data.placeholder!=undefined){
        	var d = getPlaceholderDimensions(data.placeholder);
	        var width = d.width+d.wUnit;
	        var height = d.height+d.hUnit;
        }
        
        return "<div id=\""+instanceId+"_container\" style=\"width: "+width+"; height: "+height+";\"><div id=\""+mapId+"\" style=\"width: 100%; height: 100%;\"></div></div>";
    }
    this.destroy=function(){
    }
}
function GoogleMapWidgetConfigurator(){
	var placeholder = document.createElement("img");
	placeholder.setAttribute('width', "100%");
	placeholder.setAttribute('height', "300px");
	
	var instanceId = "GoogleMapWidget1";
	var exampleWidget = new GoogleMapWidget(instanceId, {zoom: 16, placeholder:placeholder, resizable: true});//placeholder: mapContainer, 
    var addressId = "addressId";
    var parent = this;
    this['load'] = function(newData){
    	log("GoogleMapWidgetConfigurator load with data:");
    	log(newData);
    	var addressB = F.extractValueB(addressId, 'innerHTML').calmB(1000);//F.constantB("26 manuka st, stokes valley, lower hutt")
    	exampleWidget.loader(addressB);    	
    	exampleWidget.resizedE.mapE(function(ev){
    		log("Resized");
    		log(ev);
    	});
    }
    this['build'] = function(newData){
    	var address = (newData!=undefined&&newData['address']!=undefined)?newData['address']:(newData!=undefined&&newData['lat']!=undefined)?"":"Wellington";
        var zoom = (newData!=undefined&&newData['zoom']!=undefined)?newData['zoom']:16;
    	//return "<h2>Google Map Widget</h2><div id=\""+instanceId+"_container\" style=\"height: 300px;\">"+exampleWidget.build(newData)+"</div>"+
    	return "<h2>Google Map Widget</h2>"+exampleWidget.build(newData)+
        "<textarea type=\"text\" id=\""+addressId+"\" value=\""+address+"\" rows=\"8\" cols=\"80\">"+address+"</textarea>"; 
    }
    this['getData'] = function(){
    	var location = exampleWidget.centerChangedB.valueNow().replace('(', '').replace(')', '').replace(' ', '').split(',');
        return {lat: parseFloat(location[0]), lng: parseFloat(location[1]),"zoom":exampleWidget.zoomChangedB.valueNow(), mapType: exampleWidget.mapTypeIdChangedB.valueNow(), resizable: true};
    }
    this['getPlaceholder'] = function(editor){
    	log("GoogleMapWidgetConfigurator getPlaceholder");
    	//var data = (dataString!=undefined&&typeof(dataString)=='string')?JSON.parse(dataString.replace("'", '"')):(dataString!=undefined&&typeof(dataString)=='object')?dataString:this.getData();
    	//data = (data==undefined?this.getData():data);
    	var data = this.getData();
    	var abbr = editor.document.createElement('img');
		var width = exampleWidget.dimensionsB.valueNow().width;
		var height = exampleWidget.dimensionsB.valueNow().height;
    	
        abbr.setAttribute('src', "http://maps.googleapis.com/maps/api/staticmap?center="+data.lat+","+data.lng+"&zoom="+data.zoom+"&size="+width+"x"+height+"&sensor=false&maptype="+data.mapType.toLowerCase()+"");
        abbr.setAttribute('width', width);
        abbr.setAttribute('height', height);
        abbr.setAttribute('class', "widget_googleMapWidget");
        abbr.setAttribute('alt', JSON.stringify(data).replace('"', "'"));
        return abbr;
    }
    this['getName'] = function(){
        return "Google Map";
    }
    this['getDescription'] = function(){
        return "GOogle Map";
    }
    this['getPackage'] = function(){
        return "Google";
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
    $( "#"+mapId).resizable();           
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
    this['load'] = function(newData){}
    this['build'] = function(newData){
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
    this['getPackage'] = function(){
        return "Google";
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
        if(typeof(address)=='string'){
	        var geocoder = new google.maps.Geocoder();
	        geocoder.geocode( { 'address': address}, function(results, status) {
	            log(status);
	            log(results);
	            rec.sendEvent({results: results, status: status});
	        });
        }
        else{
        	rec.sendEvent({results: address, status: 1});
        }
    });
    
    return rec.startsWith(NOT_READY); 
}
