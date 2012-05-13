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
        insertDomB(renderHTMLGalleriesB, tableDivId);
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
widgetTypes['imageWidget']=ImageWidget;
widgetTypes['imageGallery']=ImageGalleryWidget;

