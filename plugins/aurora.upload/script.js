function FileUploaderDragDropWidget(instanceId,data){
    var parent = this;
    var multiFile = (data.multiFile==undefined)?false:data.multiFile;
    var acceptedTypes = (data.acceptedTypes==undefined)?[]:data.acceptedTypes;
    //var progressBar = DOM.createDiv(instanceId+"_progress"); 
    var textStatus = DOM.createDiv(instanceId+"_status", "Drop Files Here");
    textStatus.className = "auroraUpload_dropZoneProgress";
    //textStatus.style.backgroundColor = "#FF0000";
    var dropZone = DOM.createDiv(instanceId+"_dropZone"); 
    dropZone.appendChild(textStatus);
    dropZone.className = 'UploadDropZone';
    dropZone.style.display = 'inline-block';
    dropZone.style.width = ((data.placeholder!=undefined)?data.placeholder.getAttribute('width'):data.width)+'px';
    dropZone.style.height = ((data.placeholder!=undefined)?data.placeholder.getAttribute('height'):data.height)+'px';
            
            
    //this.getProgressPanel = function(){return DOM.get(progressBar.id);};
    this.getDropZone = function(){return dropZone;/*return DOM.get(dropZone.id);*/};
    this.getPanel = function(){return textStatus;/*return DOM.get(textStatus.id);*/};
    this.loader=function(){     
        var dr = DOM.get((data.targetId!=undefined)?data.targetId:dropZone.id);
        dr.style.backgroundColor = "#FF0000";
        var dropE = F.extractEventE(dr, 'drop').mapE(function(event){
            DOM.stopEvent(event); 
            if(DOM.get(dropZone.id))
                    DOM.get(dropZone.id).className = "UploadDropZone";
            return event;    
        }); 
        this.dropE = dropE;
        var dragOverE = F.extractEventE(dr, 'dragover').mapE(function(event){
            DOM.stopEvent(event); 
            if(DOM.get(dropZone.id))
                DOM.get(dropZone.id).className = "UploadDropZoneHover";
            event.dataTransfer.dropEffect = 'move';
            return event;
        });
        
        var dragEnterE = F.extractEventE(dr, 'dragenter').mapE(function(event){
            DOM.stopEvent(event); 
            if(DOM.get(dropZone.id))
                DOM.get(dropZone.id).className = "UploadDropZoneEnter";
            return event;
        });
        
        var dragExitE = F.extractEventE(dr, 'dragexit').mapE(function(event){
            DOM.stopEvent(event); 
            if(DOM.get(dropZone.id))
                DOM.get(dropZone.id).className = "UploadDropZone";
            return event;
        });
        
    
    
    
        multiFile=true;
    
    
        if(multiFile){
         this.uploadCompleteE = F.receiverE();
         var uploadCompleteE = this.uploadCompleteE;
        
        
        
        
         var queuedFileE = F.receiverE();
        var filesDropE = dropE.mapE(function(event){ 
            var files = event.target.files || event.dataTransfer.files;    
            var totalBytes = 0;
            var fileArray = [];
            for(fileIndex in files){
                if(files[fileIndex].size!=undefined){
                    totalBytes+=files[fileIndex].size;
                    fileArray.push(files[fileIndex]);
                }
            }
            queuedFileE.sendEvent({totalBytes:totalBytes, transferedBytes:0, files:fileArray});
        });
       
        var currentFileE = queuedFileE.mapE(function(multiFileTransfer){
            if(multiFileTransfer.files.length==0){
                 multiFileTransfer.currentFile = undefined;
                 multiFileTransfer.sent = multiFileTransfer.total;
                 uploadCompleteE.sendEvent(multiFileTransfer);
            }
            else{
                var lastSize = (multiFileTransfer.currentFile==undefined)?0:multiFileTransfer.currentFile.size;
                multiFileTransfer.transferedBytes+=lastSize;
                multiFileTransfer.currentFile = multiFileTransfer.files.pop();        
            }
            return multiFileTransfer;
        }).filterE(function(multiFileTransfer){
            return multiFileTransfer.currentFile!=undefined;
        });
        var currentFileB = currentFileE.startsWith(NOT_READY);
        var uploader = new AuroraFileUpload(currentFileE, window['SETTINGS']['scriptPath']+"request/aurora.uploader");
        
        this.totalProgressB = F.liftB(function(progress, queueStatus){
            if(!good()){
                return NOT_READY;
            }
            var currentFile = queueStatus.currentFile; 
            var name = currentFile.name; 
            var currentLoaded = progress.loaded;
            var currentTotal = progress.totalSize;
            var allFilesBytesTransfered = queueStatus.transferedBytes+currentLoaded;
            var allFilesTotalBytes = queueStatus.totalBytes;
            var queuePercentageComplete = (allFilesBytesTransfered/allFilesTotalBytes)*100;
            var filePercentageComplete = (currentLoaded/currentTotal)*100;

            return {currentFile: name, currentFileSent: currentLoaded, currentFileTotal:currentTotal, sent: allFilesBytesTransfered, total:allFilesTotalBytes,  filePercentageComplete: filePercentageComplete,  queuePercentageComplete: queuePercentageComplete};
        }, uploader.sendProgressE.startsWith(NOT_READY), currentFileE.startsWith(NOT_READY));
        
    
        uploader.uploadCompleteE.snapshotE(currentFileB).mapE(function(currentFile){
          //  log("Pushing next file");
            setTimeout(function(){queuedFileE.sendEvent(currentFile)}, 1000);
        });
       }
       else{
        this.firstFileE = FirstFileE(dropE).filterE(function (file) {
            var accepted = arrayContains(acceptedTypes, file.type);
            if(!accepted&&acceptedTypes.length>0){
                UI.showMessage("Error", "Sorry, but that file type is not supported.");
                return false;
            }
            return true;
        });
        
        var uploader = new AuroraFileUpload(this.firstFileE, window['SETTINGS']['scriptPath']+"request/aurora.uploader");
        this.uploadCompleteE = uploader.uploadCompleteE.mapE(function(data){
        
      //  log("UPLOAD Complete");log(data);
            if(DOM.get(textStatus.id)){
                DOM.get(textStatus.id).innerHTML = "Upload Complete";
            }
            return data;
        });
       }
    
        
        
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
        var sendLoadStartE = uploader.sendLoadStartE.mapE(function(data){
      //  log("Load Start");
      //  log(data);
            DOM.get(textStatus.id).innerHTML = "Uploading..."; 
        });

        var sendProgressE = uploader.sendProgressE.mapE(function(evt){
            if (evt.lengthComputable) {  
               var total = evt.total;
               var loaded = evt.loaded;
               var percentage = (loaded/total)*100;          
               if(DOM.get(textStatus.id)){
                DOM.get(textStatus.id).innerHTML = percentage+"%";
               }
             }  
        });
        this.sendProgressE = sendProgressE;
    }
    this.build=function(){
        if(!data.targetId){
            
            return dropZone.outerHTML;
        }
        //textStatus.innerHTML = "";
        return textStatus.outerHTML;
    }
    this.destroy=function(){
        /*log('Destroying FileUploader');
        document.getElementById(id).removeEventListener('drop', this.dragDrop);
        document.getElementById(id).removeEventListener('dragover', this.dragOver);*/
    }
}
              
function FirstFileE(fileE){
    return fileE.mapE(function(event){ 
        var files = event.target.files || event.dataTransfer.files;    
        return files[0];
    });
}
function AuroraBlankFileUpload(fileE, url){
        this.sendLoadStartE = F.zeroE();     
        this.sendProgressE = F.zeroE();     
        this.uploadCompleteE = F.zeroE();
}  
function AuroraFileUpload(fileE, url){
    var xhrObj = new XMLHttpRequest();  
    var upload = (xhrObj.upload!=undefined)?xhrObj.upload:xhrObj;
        this.sendLoadStartE = F.extractEventE(upload, 'loadstart');     
        this.sendProgressE = F.extractEventE(upload, 'progress');     
        this.uploadCompleteE = F.receiverE();
        var parent = this;
        xhrObj.onreadystatechange = function(){
                
              //  log("xhrObj.readyState=="+xhrObj.readyState+" xhrObj.status=="+xhrObj.status);
                if (xhrObj.readyState == 4 /* complete */ ) {
                    if (xhrObj.status == 200) {
                        parent.uploadCompleteE.sendEvent(jQuery.parseJSON(xhrObj.responseText));
                    }
                }
        };
        
        fileE.mapE(function(file){
            if(file.currentFile!=undefined){
                file = file.currentFile;
            }
            xhrObj.open("POST", url, true);  
            xhrObj.setRequestHeader("Content-type", file.type);  
            xhrObj.setRequestHeader("X_FILE_NAME", file.name);  
            xhrObj.send(file);     
        });

}  
WIDGETS.register("FileUploaderDragDropWidget", FileUploaderDragDropWidget);


function AuroraFileBrowserWidget(instanceId,data){
    data.targetId = instanceId+"_dropZone";
    var uploadWidget = new FileUploaderDragDropWidget(instanceId+"_dnd",data); 
    this.loader=function(){ 
         var directoryR = DATA.getRemote("aurora_directory", "/var/www/resources/upload/64/", NOT_READY, POLL_RATES.SLOW);  //, NOT_READY, POLL_RATES.SLOW 
         var directoryB = directoryR.behaviour;
         filesTableB = F.liftBI(function(table){
            if(!good())
                return NOT_READY;
            var filenameIndex = getColumnIndex(table, "filename");
            var typeIndex = getColumnIndex(table, "type");
            var filesizeIndex = getColumnIndex(table, "filesize");
            var filenameSorter = function(row1, row2){
                if((row1[typeIndex]=="directory"||row2[typeIndex]=="directory") && (row1[typeIndex]!=row2[typeIndex])){   //XOR
                    return (row1[typeIndex]=="directory")?-1:1;
                }
                return row1[filenameIndex].localeCompare(row2[filenameIndex]);
            };
            table.TABLEMETADATA['sortColumn'] = filenameIndex;
            table.TABLEMETADATA['sortOrder'] = "DESC";
            if(table.COLUMNMETADATA[filenameIndex]==undefined){
                table.COLUMNMETADATA[filenameIndex] = {"sorter":filenameSorter};
            }
            else{
                table.COLUMNMETADATA[filenameIndex]["sorter"] = filenameSorter;   
            }
            if(table.COLUMNMETADATA[filesizeIndex]==undefined){
                table.COLUMNMETADATA[filesizeIndex] = {"renderer":new FileSizeRendererColumn()};
            }
            else{  
                table.COLUMNMETADATA[filesizeIndex]["renderer"] = new FileSizeRendererColumn();
            }
            if(table.COLUMNMETADATA[typeIndex]==undefined){
                table.COLUMNMETADATA[typeIndex] = {"renderer":new FileTypeRendererColumn()};
            }
            else{ 
                table.COLUMNMETADATA[typeIndex]["renderer"] = new FileTypeRendererColumn();
            }
            return table;   
         },
         function(table){
            return [table];
         }, directoryB);
         tableBI = TableWidgetB(instanceId+"_table", data, directoryB);      
         F.insertDomB(tableBI, instanceId+"_container");  
         uploadWidget.loader();
         tableBI.liftB(function(table){
            if(!good()){
                return NOT_READY;
            }
            var width = table.scrollWidth;
            DOM.get(instanceId+"_downloadQueue").style.width=width+"px";
         }); 
         
         uploadWidget.totalProgressB.liftB(function(uploadProgress){
            if(!good()){
                return NOT_READY;
            }
            
            jQuery("#"+instanceId+"_fileProgress").progressbar("value", uploadProgress.filePercentageComplete);
            jQuery("#"+instanceId+"_totalProgress").progressbar("value", uploadProgress.queuePercentageComplete); 
            DOM.get(instanceId+"_currentFile").innerHTML = "Current File: "+uploadProgress.currentFile;  
         });
         uploadWidget.uploadCompleteE.mapE(function(uploadComplete){
            jQuery("#"+instanceId+"_fileProgress").progressbar("value", 100);
            jQuery("#"+instanceId+"_totalProgress").progressbar("value", 100);   
            DOM.get(instanceId+"_currentFile").innerHTML = "Upload Complete";
            setTimeout(function(){jQuery("#"+instanceId+"_downloadQueue").slideUp(1000)}, 3000);
         });
         uploadWidget.dropE.mapE(function(drop){
         var files = drop.target.files || drop.dataTransfer.files;    
            
            if(files.length==1){
                DOM.get(instanceId+"_fileProgress").style.display='none';
                DOM.get(instanceId+"_currentFile").style.display='none';    
            }
            else{
                DOM.get(instanceId+"_fileProgress").style.display='block';
                DOM.get(instanceId+"_currentFile").style.display='block'; 
                jQuery("#"+instanceId+"_fileProgress").progressbar({value:0}); 
            }
            jQuery("#"+instanceId+"_totalProgress").progressbar({value:0});
            
            
            jQuery("#"+instanceId+"_downloadQueue").slideDown(300)
         });
         
         jQuery("#"+instanceId+"_fileProgress").progressbar({value:0});
         jQuery("#"+instanceId+"_totalProgress").progressbar({value:0});
    }
    this.build=function(){
        
        return "<span id=\""+instanceId+"_dropZone\" style=\"background-color: #FF0000;\"><span id=\""+instanceId+"_container\">&nbsp;</span><div id=\""+instanceId+"_downloadQueue\" style=\"display:none\"><div id=\""+instanceId+"_innerDownloadQueue\" class=\"auroraUploadQueue\"><div id=\""+instanceId+"_currentFile\"></div><div id=\""+instanceId+"_fileProgress\"></div><div id=\""+instanceId+"_totalProgress\"></div></div></div></span>";  
    }
    this.destroy=function(){
        uploadWidget.destroy(); 
    }
}
WIDGETS.register("AuroraFileBrowserWidget", AuroraFileBrowserWidget);

