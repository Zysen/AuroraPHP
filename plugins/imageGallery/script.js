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

function UploadableImageWidget(instanceId, data){    
    var width = data.placeholder.getAttribute("width");
    var height = data.placeholder.getAttribute("height");
    
    data.acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    data.targetId = instanceId+"_container";
    
    var uploadWidget = new FileUploaderDragDropWidget(instanceId+"_dnd",data);   
                         
    this.loader=function(widgetRefB){ 
        uploadWidget.loader();
        var thumbPathB = widgetRefB.liftB(function(widgetRef){
            if(!good())
                return NOT_READY;
            return window['SETTINGS']['scriptPath']+"resources/upload/public/imagegallery/thumbs/"+widgetRef+".png";
        });
        var imageExistsB = thumbPathB.liftB(function(imagePath){
            if(!good())
                return NOT_READY;
            DOM.get(instanceId+"_img").src = imagePath+"?time="+(new Date()).getTime();
            return UrlExists(imagePath);
        });
        
        imageExistsB.liftB(function(imageExists){
            if(!good())
                return NOT_READY;
                log(imageExistsB);
            var dropZone = (!imageExists)?uploadWidget.getDropZone().outerHTML:uploadWidget.getPanel().outerHTML;
            DOM.get(instanceId+"_progress").innerHTML = dropZone;
            if(imageExists){
                DOM.get(uploadWidget.getPanel().id).innerHTML = "";
            }                                  
            
        });

        var uploadCompleteB = uploadWidget.uploadCompleteE.mapE(function(response){
            var path = response.path;
            var dimension = (height>width)?" width=\""+width+"\"":" height=\""+height+"\"";       
            return {path: path, width: width, height: height}; 
        }).startsWith(NOT_READY);
        
        
        var processRequestB = F.liftB(function(response, widgetRef){                                                                                                    
            if(!good())
                return NOT_READY;
            response.id = widgetRef;
            return response;
        }, uploadCompleteB, widgetRefB);
            
        var imageProcessedE = getAjaxRequestB(uploadCompleteB, window['SETTINGS']['scriptPath']+"/request/IG_processImage").mapE(function(ret){
            if(ret==NOT_READY)
                return NOT_READY;
            var container = DOM.get(instanceId+"_container");
            var image = DOM.get(instanceId+"_img");
            var progress = DOM.get(instanceId+"_progress"); 
            
            progress.innerHTML = uploadWidget.getPanel().outerHTML;
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
        return "<div id=\""+instanceId+"_container\" style=\"margin: 0 auto; position: inline-block; text-align: center; width: "+width+"px; height: "+height+"px;\">"+DOM.createImg(instanceId+"_img", "UploadableImageWidget", "/resources/trans.png").outerHTML+"<div id=\""+instanceId+"_progress\"></div></div>";   
    }
    this.destroy=function(){
        uploadWidget.destroy();
    }
}


function UploadableImageWidgetConfigurator(){
    this['requiresRef'] = true;
    this['render'] = function(newData){
    }
    this['getData'] = function(){
        return {};
    }
    this['getName'] = function(){
        return "Image Uploader Widget";
    }
    this['getDescription'] = function(){
        return "A blank image which can be changed using drag and drop";
    }
    this['getImage'] = function(){}
} 
WIDGETS.register("UploadableImageWidget", UploadableImageWidget, UploadableImageWidgetConfigurator);