function ImageWidget(instanceId, data, galleryD, galleryB){
    allWidgets[instanceId] = this;
    this.deleteE = receiverE();
    var imageId = instanceId+"_img";
    var img = document.createElement('img');    
    
    this.loader=function(){
        this.deleteE.snapshotE(galleryB).mapE(function(galleries){
            for(index in galleries){                                                                                                                                                                                    
                for(imageId in galleries[index].images){
                    if(galleries[index].images[imageId].upload_id==data.upload_id){
                        galleries[index].images[imageId].deleted=true;
                        galleryD.set(galleries);
                        return;
                    } 
                }
            }

        });
        if(data.rights)
            jQuery(img).contextmenu({'menu':{'Delete':'javascript:allWidgets[\''+instanceId+'\'].deleteE.sendEvent(true);'}});
        if(data.fadeIn!=undefined){
            //var imgLoadedE = extractEventE(img, 'load');
            //var imageFadedE = jFadeInE(imgLoadedE, imageId, data.fadeIn);
            jQuery(document.getElementById(imageId)).fadeIn(data.fadeIn, function(){});
        }//fadeInE(getElement(imageId));
    }
    this.build=function(){
        img.id = imageId;
        //img.style.display=(data.fadeIn!=undefined)?'none':'block';
        img.src = (data.src!=undefined)?data.src:data.placeholder.src;
        
        img.width = (data.width!=undefined)?data.width:data.placeholder.style.width.replace('px', '');
        img.height = (data.height!=undefined)?data.height:data.placeholder.style.height.replace('px', '');
        
        var anchor = document.createElement('a');
        anchor.className = data.className;
        anchor.href=SETTINGS.scriptPath+"content/imagegallery/"+data.upload_id+"_medium"; 
        anchor.appendChild(img);
        return anchor;
    }
    this.destroy=function(){
        allWidgets[instanceId] = null;
        delete allWidgets[instanceId];
    }
}
function ImageGalleryWidget(instanceId,data){
    var dragHere = document.createElement('div');
                    dragHere.innerHTML = "Empty Gallery<br />Drag Images Here";
                    dragHere.className = "imageGallery_fileDragBox";
                    
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    var widgets = new Array();
    var widgetId = instanceId+"_MAIN";
    var tableDivId = instanceId+"_table";
    var parent = this;
    this.loader=function(){
        
        var dragDropW = new FileUploaderDragDropWidget(instanceId+"_dragDrop", {targetId:widgetId});
        //if(imagegalleryRights)
            dragDropW.loader();
        
        var uploadCompleteE = dragDropW.uploadCompleteE();
        var galleriesD = DATA.getRemote("imageGallery_galleryList", data.gallery);
        var galleriesB = galleriesD.event.startsWith(null);
        var renderHTMLGalleriesB = galleriesB.liftB(function(galleries){
            parent.destroyChildWidgets();
            if(galleries==null)
                return "";//show loading or something.
            widgets = new Array();
            widgets.length=0;
            var galleriesDiv = document.createElement('div');
            for(index in galleries){                                                                                                                                                       
                var gallery = galleries[index];
                var galleryDiv = document.createElement('div');
                galleryDiv.appendChild(dragHere);
                var galleryId = instanceId+"_"+gallery.galleryId;
                galleryDiv.id = galleryId;
                galleryDiv.className = 'imageGallery_gallery';                
                var gallery = galleries[index];                                          
                for(imageId in gallery.images){
                    var image = gallery.images[imageId];
                    if(image.deleted)
                        continue;
                    image.src = SETTINGS.scriptPath+'content/imagegallery/'+image.upload_id+"_small";
                    var newImage = new ImageWidget(instanceId+"_"+imageId, {src:image.src, width: data.thumbWidth, height: data.thumbHeight, fadeIn:500, rights: image.rights, upload_id: image.upload_id, className: "galleryLink"}, galleriesD, galleriesB);
                    widgets.push(newImage);
                    var rar = newImage.build();
                    galleryDiv.appendChild(rar);
                }
                
                if(gallery.images.length==0)
                    dragHere.style.display = 'block';    
                else
                    dragHere.style.display = 'none'; 
                galleriesDiv.appendChild(galleryDiv);
                break;
            }
            return galleriesDiv;               
        });
        F.insertDomB(renderHTMLGalleriesB, tableDivId);
        uploadCompleteE.snapshotE(liftB(function(uploadData, galleries){if(uploadData==null||galleries==null)return null;return {uploadData:uploadData, galleries:galleries};},uploadCompleteE.startsWith(null), galleriesB)).mapE(function(data){
            var gallery = data.galleries[0];
            var uploadData = data.uploadData;
            gallery.images[gallery.images.length] = {upload_id: data.uploadData.files[0].id, caption: "", rights: true};
            galleriesD.set(data.galleries);   
        });
        renderHTMLGalleriesB.liftB(function(x){if(x!=""){parent.loadChildWidgets();jQuery('a.galleryLink').lightBox();}/*parent.inflateEditorAreas();*/});
    }
    this.destroyChildWidgets = function(){
        for(index in widgets)
            widgets[index].destroy();
        widgets = new Array();
    }
    this.loadChildWidgets = function(){
        for(index in widgets){
            widgets[index].loader();
        }
    }
    this.destroy=function(){
        this.destroyChildWidgets();
        database.deregister("aurora_settings", data.plugin);
    }
    this.build=function(){
        return "<div id=\""+widgetId+"\" style=\"display: block; width: "+width+"px; height: "+height+"px;\" ><div id=\""+tableDivId+"\"></div></div>";
    }
}
WIDGETS.register("imageWidget", ImageWidget);
WIDGETS.register("imageGallery", ImageGalleryWidget);

/*function UploadableImageWidget(instanceId, data){    
	var width = data.placeholder.getAttribute("width");
    width=(width==null?data.placeholder.style.width.replace('px', ''):width);
	var height = data.placeholder.getAttribute("height");
	height=(height==null?data.placeholder.style.height.replace('px', ''):height);
    this.imageLoadE = F.receiverE();
    
    var parent = this;
    data.acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    data.targetId = instanceId+"_container";
    
    var uploadWidget = new FileUploaderDragDropWidget(instanceId+"_dnd",data);   
                         
    this.loader=function(widgetRefB){
    	DOM.get(instanceId+"_img").onload = function(event){
        	DOM.get(instanceId+"_container").style.width = DOM.get(instanceId+"_img").clientWidth+"px";
        	DOM.get(instanceId+"_container").style.height = DOM.get(instanceId+"_img").clientHeight+"px";
        	parent.imageLoadE.sendEvent(DOM.get(instanceId+"_img"));
        }
    	uploadWidget.loader();
        var thumbPathB = widgetRefB.liftB(function(widgetRef){
            if(!good())
                return NOT_READY;
            return window['SETTINGS']['scriptPath']+"resources/upload/public/imagegallery/thumbs/"+widgetRef+".png";
        });
        var imageExistsB = thumbPathB.liftB(function(imagePath){
        	var imageFrame = DOM.get(instanceId+"_img");
        	if(!good())
                return NOT_READY;
        	imageFrame.style.display = 'none';
            imageFrame.src = imagePath+"?time="+(new Date()).getTime();
            return UrlExists(imagePath);
        });
        
        imageExistsB.liftB(function(imageExists){
            if(!good())
                return NOT_READY;
            var dropZone = (!imageExists)?uploadWidget.getDropZone().outerHTML:uploadWidget.getPanel().outerHTML;
            DOM.get(instanceId+"_dz").innerHTML = dropZone;
            if(imageExists){
                DOM.get(uploadWidget.getPanel().id).innerHTML = "";
            }                                  
            
        });
        
        uploadWidget.sendProgressE.mapE(function(progress){
        	jQuery(DOM.get(instanceId+"_progress")).progressbar({value: Math.ceil(progress.queuePercentageComplete)});
        });
        
        var uploadCompleteB = uploadWidget.uploadCompleteE.mapE(function(response){
            return {path: response.path, width: width, height: height}; 
        }).startsWith(NOT_READY);
        
        var processRequestB = F.liftB(function(request, widgetRef){                                                                                                    
            if(!good())
                return NOT_READY;
            request.id = widgetRef;
            return request;
        }, uploadCompleteB, widgetRefB);
            
        var imageProcessedE = getAjaxRequestB(processRequestB, window['SETTINGS']['scriptPath']+"/request/IG_processImage").mapE(function(ret){
            if(ret==NOT_READY)
                return NOT_READY;
            var container = DOM.get(instanceId+"_container");
            var image = DOM.get(instanceId+"_img");
            log(image.clientWidth+" "+image.clientHeight);
            var progress = DOM.get(instanceId+"_progress"); 
            jQuery(DOM.get(instanceId+"_progress")).progressbar("destroy");
            //progress.innerHTML = uploadWidget.getPanel().outerHTML;
            image.src = ret.path+"?time="+(new Date()).getTime();
            DOM.get(uploadWidget.getPanel().id).innerHTML = "";
        });                                                                 
    }      
    this.hide = function(){
        DOM.get(instanceId+"_container").style.display = 'none';
    }              
    this.show = function(){
        DOM.get(instanceId+"_container").style.display = 'block';
    }                                
    this.build=function(){
        log("School Logo Widget BUILD");
    	return "<div id=\""+instanceId+"_container\" style=\"margin: 0 auto; text-align: center; width: "+width+"px; height: "+height+"px;\">"+DOM.createImg(instanceId+"_img", "UploadableImageWidget", "/resources/trans.png").outerHTML+"<div id=\""+instanceId+"_dz\"></div><div id=\""+instanceId+"_progress\"></div></div>";   
    }
    this.destroy=function(){
        uploadWidget.destroy();
    }
    
}*/




function UploadableImageWidget(instanceId, data){  
	var UPLOAD = new AuroraUploadManager(data); 
	var parent = this;
	var acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
	//Configure Dimensions 
	
	var dropHtml = data.dropHtml;
	var dropHoverHtml = data.dropHoverHtml;
	
	var width = data.placeholder.getAttribute("width");
    width=(width==null?data.placeholder.style.width.replace('px', ''):width);
	var height = data.placeholder.getAttribute("height");
	height=(height==null?data.placeholder.style.height.replace('px', ''):height);
	
    this.loader=function(widgetRefB){
    	widgetRefB = widgetRefB==undefined?F.constantB(data.widgetRef):widgetRefB;
    	var imageZone = DOM.get(instanceId+"_imagezone");
    	var imageElement = DOM.get(instanceId+"_imagezone");
    	parent.dropE = F.mergeE(F.extractEventE(imageZone, 'drop'), F.extractEventE(imageElement, 'dragenter')).cancelDOMBubbleE();
        parent.dragOverE = F.mergeE(F.extractEventE(imageZone, 'dragover'), F.extractEventE(imageElement, 'dragenter')).cancelDOMBubbleE().mapE(function(event){
        	event.dataTransfer.dropEffect = 'move';
            if(imageZone.innerHTML==dropHtml){
            	imageZone.innerHTML = dropHoverHtml;
            }
            return event;
        });
        
        parent.dragEnterE = F.mergeE(F.extractEventE(imageZone, 'dragenter'), F.extractEventE(imageElement, 'dragenter')).mapE(function(event){
        	if(imageZone.innerHTML==dropHtml){
        		imageZone.innerHTML = dropHoverHtml;
        	}
            return event;
        });
        
        parent.dragExitE = F.mergeE(F.extractEventE(imageZone, 'dragleave'), F.extractEventE(imageElement, 'dragenter')).mapE(function(event){
        	if(imageZone.innerHTML==dropHoverHtml){
        		imageZone.innerHTML = dropHtml;
        	}
            return event;
        });     
        parent.dragExitE = F.mergeE(F.extractEventE(imageZone, 'dragend'), F.extractEventE(imageElement, 'dragenter')).mapE(function(event){
        	if(imageZone.innerHTML==dropHoverHtml){
        		imageZone.innerHTML = dropHtml;
        	}
            return event;
        });
    
        parent.filesDropE = parent.dropE.filterE(function(event){
        	var files = event.target.files || event.dataTransfer.files; 
        	if(files!=undefined && files.length>1){
        		UI.showMessage("Upload Error", "Unable to process multiple images, please upload a single image.");
        		return false;
            }
        	return files!=undefined;
        	
        }).mapE(function(event){ 
        	var files = event.target.files || event.dataTransfer.files;  
            var totalBytes = 0;
            var fileArray = [];
            if(files[0]!=undefined && files[0].size!=undefined){
                if(files[0].type!="" && arrayContains(acceptedTypes, files[0].type)){
                    totalBytes=files[0].size;
                    UPLOAD.add(files[0]);
                }
                else{
                    log("Unable to upload directories skipping "+files[0].type);
                }
            }
            return {size: totalBytes, files:files};
        }).filterE(function(fileData){
        	return fileData.size>0;
        });
        parent.uploadCompleteE = UPLOAD.uploadCompleteE;
        parent.allUploadsCompleteE = UPLOAD.allUploadsCompleteE;
              
        var sendProgressE = UPLOAD.progressUpdateB.changes().filterE(function(val){return val!=NOT_READY;}).mapE(function(progress){              
               var total = progress.total;
               var loaded = progress.loaded;
               var queuePercentage = (loaded/total)*100; 
               queuePercentage = queuePercentage<0?0:(queuePercentage>100?100:queuePercentage); 
               DOM.get(instanceId+"_status").innerHTML = "Uploading "+Math.ceil(queuePercentage)+"%";
               jQuery(DOM.get(instanceId+"_progress")).progressbar({value: Math.ceil(queuePercentage)});
               return {filePercentageComplete:queuePercentage, queuePercentageComplete:queuePercentage,currentFile:progress.currentFile, rate:progress.rate, queue:progress.queue, formattedTotal:progress.formattedTotal}; 
        });     
        
        var thumbPathB=widgetRefB.liftB(function(ref){log(ref);if(!good()){return NOT_READY;}return window['SETTINGS']['scriptPath']+"resources/upload/public/imagegallery/thumbs/"+ref+".png";});
        
        imageElement.onload = function(){
        	imageElement.style.width = imageElement.clientWidth+"px";
        	imageElement.style.height = imageElement.clientHeight+"px";
        }
        
        var imageExistsB = thumbPathB.liftB(function(imagePath){
        	if(!good())
                return NOT_READY;
            if(UrlExists(imagePath)){
            	DOM.get(instanceId+"_img").src = imagePath+"?time="+(new Date()).getTime();
            	return true;
            }
            else if(dropHtml!=undefined){
            	DOM.get(instanceId+"_imagezone").innerHTML = dropHtml;
            }
            else{
            	DOM.get(instanceId+"_imagezone").innerHTML = "<div style=\"width:"+width+"px;height:"+height+"px\">Drop an image here</div>";
            }
            return false;
        });
        
        var processRequestB = F.liftB(function(uploadRequest, ref){                                                                                                    
            if(!good())
                return NOT_READY;
            return {id: ref, path: uploadRequest.path, width: width, height: height};
        }, parent.uploadCompleteE.filterE(function(res){
        	if(res.status==NO_PERMISSION){
        		log("Permission Error, You do not have permission to upload to this path");
        		UI.showMessage("Permission Error","You do not have permission to upload to this path");
        	}
        	return res.status==1;}).startsWith(NOT_READY), widgetRefB);
            
        var imageProcessedE = getAjaxRequestB(processRequestB, window['SETTINGS']['scriptPath']+"/request/IG_processImage").mapE(function(ret){
            if(ret==NOT_READY)
                return NOT_READY;
            DOM.get(instanceId+"_imagezone").innerHTML = "<img src=\""+ret.path+"?time="+(new Date()).getTime()+"\" alt=\"\" />";
            DOM.get(instanceId+"_status").innerHTML = "";
            jQuery(DOM.get(instanceId+"_progress")).progressbar("destroy");
        });                                                                 
    }      
    this.hide = function(){
        DOM.get(instanceId+"_container").style.display = 'none';
    }              
    this.show = function(){
        DOM.get(instanceId+"_container").style.display = 'block';
    }                                
    this.build=function(){
    	return "<div id=\""+instanceId+"_container\" style=\"margin: 0 auto; width: "+width+"px;\"><div id=\""+instanceId+"_imagezone\"><img id=\""+instanceId+"_img\" alt=\"\" /></div><div id=\""+instanceId+"_progress\"></div><div id=\""+instanceId+"_status\" style=\"position: relative; top: -25px;\" class=\"imageGallery_status\"></div></div>";   
    }
    this.destroy=function(){

    }
}





function UploadableImageWidgetConfigurator(){
    this['requiresRef'] = true;
	this['load'] = function(newData){}
    this['build'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "Image Uploader Widget";
    }
    this['getDescription'] = function(){
        return "A blank image which can be changed using drag and drop";
    }
    this['getPackage'] = function(){
        return "Image Gallery";
    }
} 
WIDGETS.register("UploadableImageWidget", UploadableImageWidget, UploadableImageWidgetConfigurator);