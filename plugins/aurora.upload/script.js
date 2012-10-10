function FileUploaderDragDropWidget(instanceId,data){
    var UPLOAD = new AuroraUploadManager(); 
    var parent = this;
    var multiFile = (data.multiFile==undefined)?false:data.multiFile;
    var acceptedTypes = (data.acceptedTypes==undefined)?[]:data.acceptedTypes;                      
    var textStatus = DOM.createDiv(instanceId+"_status", "Drop Files Here");
    textStatus.className = "auroraUpload_dropZoneProgress";
    var dropZone = DOM.createDiv(instanceId+"_dropZone"); 
    dropZone.appendChild(textStatus);
    dropZone.className = 'UploadDropZone';
    dropZone.style.display = 'inline-block';
    dropZone.style.width = ((data.placeholder!=undefined)?data.placeholder.getAttribute('width'):data.width)+'px';
    dropZone.style.height = ((data.placeholder!=undefined)?data.placeholder.getAttribute('height'):data.height)+'px';
            
            
    this.getDropZone = function(){return dropZone;};
    this.getPanel = function(){return textStatus;};
    this.loader=function(){     
        var dr = DOM.get((data.targetId!=undefined)?data.targetId:dropZone.id);
        dr.style.backgroundColor = "#FF0000";
        var dropE = F.extractEventE(dr, 'drop').mapE(function(event){
            DOM.stopEvent(event); 
            //log(event);
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
        
    
    
                                     
    
        var filesDropE = dropE.mapE(function(event){ 
            var files = event.target.files || event.dataTransfer.files;  
            var totalBytes = 0;
            var fileArray = [];
            for(fileIndex in files){
                if(files[fileIndex].size!=undefined){
               
                    if(files[fileIndex].type!=""){
                        totalBytes+=files[fileIndex].size;
                        UPLOAD.add(files[fileIndex]);
                    }
                    else{
                        log("Unable to upload directories skipping "+files[fileIndex].type);
                    }
                }
            }
            return {size: totalBytes, files:files};
        });
        this.filesDropE = filesDropE;
        this.uploadCompleteE = UPLOAD.uploadCompleteE;
        this.allUploadsCompleteE = UPLOAD.allUploadsCompleteE;
        //UPLOAD.allUploadsCompleteE;  
    
        var sendLoadStartE = UPLOAD.getUploader().sendLoadStartE.mapE(function(data){
            DOM.get(textStatus.id).innerHTML = "Uploading..."; 
        });
              
        var sendProgressE = UPLOAD.progressUpdateB.changes().filterE(function(val){return val!=NOT_READY;}).mapE(function(progress){
            // {total:totalSize, loaded:totalTransfered, currentTotal:progressUpdate.total, currentLoaded:progressUpdate.loaded};  
               var total = progress.currentTotal;
               var loaded = progress.currentLoaded;
               var currentPercentage = (loaded/total)*100;  
               
               var total = progress.total;
               var loaded = progress.loaded;
               var queuePercentage = (loaded/total)*100; 
               if(queuePercentage<0){
                queuePercentage = 0;
               }    
               else if(queuePercentage>100){
                queuePercentage = 100;
               }
                 
               /*if(DOM.get(textStatus.id)){
                DOM.get(textStatus.id).innerHTML = percentage+"%";
               }    */
             return {filePercentageComplete:currentPercentage, queuePercentageComplete:queuePercentage,currentFile:progress.currentFile, rate:progress.rate, queue:progress.queue, formattedTotal:progress.formattedTotal}; 
        });      

        this.sendProgressE = sendProgressE;
        // totalProgressB               filePercentageComplete  queuePercentageComplete currentFile
        this.totalProgressB = F.liftB(function(progress){
            if(!good()){
                return NOT_READY;
            }
            return progress;
        }, sendProgressE.startsWith(NOT_READY));
        
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
    var uploadRequestE = fileE.mapE(function(file){
        var xhrObj = new XMLHttpRequest();  
        var upload = (xhrObj.upload!=undefined)?xhrObj.upload:xhrObj;
        var sendLoadStartE = F.extractEventE(upload, 'loadstart');     
        var sendProgressE = F.extractEventE(upload, 'progress');     
        var uploadCompleteE = F.receiverE();
            
        var parent = this;
        xhrObj.onreadystatechange = function(){
                    if (xhrObj.readyState == 4) {
                        if (xhrObj.status == 200) {                                                                                   
                            uploadCompleteE.sendEvent(jQuery.parseJSON(xhrObj.responseText));
                        }
                    }
        };
            if(file==NOT_READY){
                return;
            }
            if(file.currentFile!=undefined){
                file = file.currentFile;
            } 
        xhrObj.open("POST", url, true);  
        xhrObj.setRequestHeader("Content-type", file.type);  
        xhrObj.setRequestHeader("X_FILE_NAME", file.name);  
        xhrObj.send(file);                 
        return {sendLoadStartE: sendLoadStartE, sendProgressE: sendProgressE, uploadCompleteE: uploadCompleteE};     
    });
        //Not happy about this recreate xmlhttpreq and then switch, but i had problems with reusing one xmlhttprequest object
    this.uploadCompleteE = uploadRequestE.mapE(function(uploadRequest){return uploadRequest.uploadCompleteE}).switchE();
    this.sendLoadStartE = uploadRequestE.mapE(function(uploadRequest){return uploadRequest.sendLoadStartE}).switchE();
    this.sendProgressE = uploadRequestE.mapE(function(uploadRequest){return uploadRequest.sendProgressE}).switchE();
}  
WIDGETS.register("FileUploaderDragDropWidget", FileUploaderDragDropWidget);

function AuroraFileBrowserWidget(instanceId,data){
    data.targetId = instanceId+"_dropZone";
    var uploadWidget = new FileUploaderDragDropWidget(instanceId+"_dnd",data); 
    this.loader=function(){ 
          uploadWidget.loader();
         var directoryR = DATA.getRemote("aurora_directory", "resources/upload/"+window['SETTINGS']['user']['id']+"/", NOT_READY, POLL_RATES.SLOW);  //, NOT_READY, POLL_RATES.SLOW 
         var directoryB = directoryR.behaviour;
         
         var tableResetE = F.receiverE();
         
         uploadTotalProgressB = F.mergeE(uploadWidget.totalProgressB.changes().blindE(500), tableResetE).startsWith(NOT_READY);
         
         var filesTableB = F.liftBI(function(table, progress){
            if(table==NOT_READY){
                return NOT_READY;
            }     
            var currentMatch = false;
            if(progress!=NOT_READY&&progress!=undefined){ 
                var queue = progress.queue;
                var currentFile = progress.currentFile;  
                var progressIndex = getColumnIndex(table, "uploadprogress"); 
                var newTable = table["DATA"];
                if(queue.length>0){
                    currentMatch = false;
                    for(var queueIndex in queue){
                        var queueItem = queue[queueIndex]; 
                        var match = false;
                        for(var tableIndex in newTable){
                            var tableRow = newTable[tableIndex];
                            var filename = tableRow[getColumnIndex(table, "filename")];
                            var currentProgress = tableRow[progressIndex];
                            if(filename==queueItem.name && (currentProgress!=""&& currentProgress!=undefined)){
                                match = true;
                            }       
                            
                            //TODO: sometimes FF will crash with lots of files
                            if(currentProgress!=""&&currentProgress!=undefined){
                            
                                if(currentFile.name==filename){
                                    newTable[tableIndex] = [currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)];
                                    currentMatch = true;
                                    
                                }
                                else if(!isNaN(table["DATA"][tableIndex][progressIndex])){
                                    table["DATA"][tableIndex][progressIndex] = 100;    
                                }
                            }                                                   
                        }
                        if(!match){
                            newTable.push([queueItem.type, queueItem.name, queueItem.name, "", queueItem.size, queueItem.type, (queueItem.name==currentFile.name)?Math.ceil(progress.filePercentageComplete):"Waiting..."]);
                        }
                    }
                    if(!currentMatch){
                        newTable.push([currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)]);
                    }              
                    
                    
                }
                else{
                    var match = false;
                    for(var tableIndex in newTable){
                        var tableRow = newTable[tableIndex];
                        var filename = tableRow[getColumnIndex(table, "filename")];
                        var currentProgress = tableRow[progressIndex];
                        if(currentProgress!=""&& currentProgress!=undefined){
                            if(filename==currentFile.name){
                                newTable[tableIndex] = [currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)];
                                match = true;
                            }      
                            else if(!isNaN(table["DATA"][tableIndex][progressIndex])){
                                    table["DATA"][tableIndex][progressIndex] = 100;    
                            }
                        }
                    }
                    if(!match){
                        newTable.push([currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)]); 
                    }
                    
                }   
                //Remove old uploads
                for(var tableIndex in newTable){
                    var tableRow = newTable[tableIndex];
                    var currentProgress = tableRow[getColumnIndex(newTable, "uploadprogress")]; 
                    if(currentProgress!="" && currentProgress!=undefined){
                        var match = false; 
                        for(var queueIndex in queue){
                            var queueItem = queue[queueIndex];
                            if(filename==queueItem.name){
                                match = true;
                                break;
                            }
                        }
                        if(!match || Math.ceil(currentProgress)==100){
                            tableRow = tableRow.splice(tableIndex, 1);         
                        }
                    }
                } 
            } 
            else{
                for(var rowIndex in table["DATA"]){   
                    table["DATA"][rowIndex][progressIndex] = "";
                } 
            }  
              
            var filenameIndex = getColumnIndex(table, "filename");
            var typeIndex = getColumnIndex(table, "type");
            var filesizeIndex = getColumnIndex(table, "filesize");
            var uploadProgressIndex = progressIndex;
            
            
            
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
            
            if(table.COLUMNMETADATA[uploadProgressIndex]==undefined){
                table.COLUMNMETADATA[uploadProgressIndex] = {"renderer":new UploadProgressColumnRenderer()};
            }
            else{ 
                table.COLUMNMETADATA[uploadProgressIndex]["renderer"] = new UploadProgressColumnRenderer();
            }
            return table;   
         },
         function(table){
            return [table, NOT_READY];
         }, directoryB, uploadTotalProgressB);         
         tableBI = TableWidgetB(instanceId+"_table", data, filesTableB);      
         F.insertDomB(tableBI, instanceId+"_container");  
        
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
            var updateCallback = function(){
                jQuery("#"+instanceId+"_totalProgress").progressbar("value", uploadProgress.queuePercentageComplete).children('.ui-progressbar-value').html("("+uploadProgress.queuePercentageComplete.toPrecision(3)+"%)").css("display", "block"); 
                
            };

            if(DOM.get(instanceId+"_downloadQueue").style.display=="none"){
                jQuery("#"+instanceId+"_totalProgress").progressbar({value:0});
                jQuery("#"+instanceId+"_downloadQueue").slideDown(300, updateCallback);
            }
            else{
                updateCallback();
            }
         });  
         
         uploadWidget.totalProgressB.blindB(1000).liftB(function(uploadProgress){
            if(!good()){
                return NOT_READY;
            }   
            DOM.get(instanceId+"_currentFile").innerHTML = "";                                            
            if(uploadProgress.rate!="0"){
                
            DOM.get(instanceId+"_rate").innerHTML = "Transferring "+uploadProgress.formattedTotal+" at "+uploadProgress.rate;
            }
         });
         uploadWidget.allUploadsCompleteE.mapE(function(uploadComplete){
            jQuery("#"+instanceId+"_totalProgress").progressbar("value", 100);   
            DOM.get(instanceId+"_currentFile").innerHTML = "Upload Complete";
            tableResetE.sendEvent(NOT_READY);
         }).delayE(3000).mapE(function(){jQuery("#"+instanceId+"_downloadQueue").slideUp(1000);});
         
         
         uploadWidget.dropE.mapE(function(drop){   

         }); 
         
          
    }
    this.build=function(){
        
        return "<div id=\"logger\"></div><span id=\""+instanceId+"_dropZone\" style=\"background-color: #FF0000;\"><span id=\""+instanceId+"_container\">&nbsp;</span><div id=\""+instanceId+"_downloadQueue\" style=\"display:none\"><div id=\""+instanceId+"_innerDownloadQueue\" class=\"auroraUploadQueue\"><div id=\""+instanceId+"_currentFile\"></div><div id=\""+instanceId+"_rate\"></div><div id=\""+instanceId+"_fileProgress\"></div><div id=\""+instanceId+"_totalProgress\"></div></div><span style=\"clear: both;\"></span></div></span>";  
    }
    this.destroy=function(){
        uploadWidget.destroy(); 
    }
}
WIDGETS.register("AuroraFileBrowserWidget", AuroraFileBrowserWidget);

function AuroraUploadManager(){
   
    // sendLoadStartE sendProgressE  uploadCompleteE
    var queue = new AuroraTaskQueue();
    var uploader = new AuroraFileUpload(queue.dequeueEventE, window['SETTINGS']['scriptPath']+"request/aurora.uploader");     
   
    this.getUploader = function(){
        return uploader;
    };
    this.add = function(upload){
        queue.enqueue(upload);
    };
    this.progressUpdateE = uploader.sendProgressE.mapE(function(progress){
        return progress;
    });
    this.uploadCompleteE = uploader.uploadCompleteE.mapE(function(upload){
        queue.next();
        return upload;
    });
    this.allUploadsCompleteE = queue.finishedE.mapE(function(complete){
        return complete;
    });
    
    
    this.uploadStartedE = queue.kickstartE;   
    
    this.dequeueEventE = queue.dequeueEventE;    
    var lastStamp = undefined;
    var lastBytes = undefined;  
    this.progressUpdateB = F.liftB(function(allQueue, queue, progressUpdate, currentFile){
        if(!good()){
            return NOT_READY;                             
        }   
        var totalSize = 0;
        var totalTransfered = progressUpdate.loaded;
        for(index in allQueue){    
            var file = allQueue[index];  
            var name = file.name;
            var size = file.size;
            
               
            
            totalSize+=size;
            if(name==currentFile.name){
                continue;
            } 
            var match = false;
            for(index in queue){
                if(queue[index].name == name){
                    match=true;
                    break;
                }
            }
            if(!match){
                totalTransfered+=size;    
            }
        }
    stamp = new Date().getTime();
    var rate = 0;
    
    
    if(lastStamp!=undefined){
        var timeDiff = (stamp-lastStamp)/1000;
        var bytesDiff = (totalTransfered-lastBytes);
        if(bytesDiff>0){
            rate = (bytesDiff*8)/timeDiff;
            
            if(rate>1000000000000){
                rate = (rate/1000000000000).toFixed(2)+" Tbps";    
            }
            else if(rate>1000000000){
                rate = (rate/1000000000).toFixed(2)+" Gbps";    
            }
            else if(rate>1000000){
                rate = (rate/1000000).toFixed(2)+" Mbps";    
            }
            else if(rate>1000){
                rate = (rate/1000).toFixed(2)+" Kbps";    
            }
            else rare = rate+" Bps"
        }
    }    
    var formattedTotal = totalSize;
            if(totalSize>1000000000000){
                formattedTotal = (totalSize/1000000000000).toFixed(2)+" TB";    
            }
            else if(totalSize>1000000000){
                formattedTotal = (totalSize/1000000000).toFixed(2)+" GB";    
            }
            else if(totalSize>1000000){
                formattedTotal = (totalSize/1000000).toFixed(2)+" MB";    
            }
            else if(totalSize>1000){
                formattedTotal = (totalSize/1000).toFixed(2)+" KB";    
            }
            else formattedTotal = totalSize+" Bps"
            
    lastBytes = totalTransfered;
    lastStamp = stamp;
    var ob = {total:totalSize, loaded:totalTransfered, currentTotal:progressUpdate.total, currentLoaded:progressUpdate.loaded, currentFile:currentFile, rate: rate, queue:queue, formattedTotal:formattedTotal};
    return ob;
    }, queue.jobQueueE.startsWith(NOT_READY), queue.queueB, this.progressUpdateE.startsWith(NOT_READY), this.dequeueEventE.startsWith(NOT_READY));
    
    
}




/**
 *  FileSizeRendererColumn
 * @constructor
 */
function UploadProgressColumnRenderer(){
    this.getCellRenderer = function(value, cell, width){
        if(cell==undefined){
            return null;
        }       
        return new UploadProgressCellRenderer(value, cell, width);    
    }
}
/**
 *  UploadProgressCellRenderer
 * @constructor
 */
function UploadProgressCellRenderer(value, cell, width){    
    var rValue = value; 
    var container = DOM.createDiv(undefined,undefined,"UploadProgressCellRenderer");
    cell.appendChild(container);
    
    this.render = function(){         
        if(rValue=="" || isNaN(rValue)){
            container.innerHTML = rValue;
        }
        else{
            jQuery(container).each(function() {
                jQuery(this).progressbar({
                    value: rValue
                }).children('.ui-progressbar-value').html("("+rValue.toPrecision(3)+"%)").css("display", "block");

            });
        }  
    }
    this.render();
    this.getValue = function(){
        return rValue;
    }
    this.renderEditor = function(){
         
    }
    this.setSelected = function(selected){ 
        if(selected){
            cell.className="TableWidgetCellSelected"; 
           // cell.style.backgroundColor=tableBackgroundColorSelected; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.setValue = function(newValue){
        rValue = newValue;
        this.render();
    }
    this.getUpdateEvent = function(){
        return F.zeroE();
    }
     
}