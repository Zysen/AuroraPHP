function FileUploaderDragDropWidget(instanceId,data){
    var parent = this;
    var id = (data.targetId==undefined)?instanceId+"_area":data.targetId;
    var uploadCompleteE=receiverE();
    this.loader=function(){
        var boundary = '------multipartformboundary' + (new Date).getTime();
        var contentType = 'multipart/form-data; enctype=multipart/form-data; boundary=' + boundary;
        var dr = document.getElementById(id);        

        dropE = extractEventE(dr, 'drop').mapE(function(event){
            event.stopPropagation();  
            event.preventDefault();
            return event;    
        });
        extractEventE(dr, 'dragover').mapE(function(event){
            event.stopPropagation();  
            event.preventDefault();
            return event;
        });
        
        var readersReadyE = receiverE();
        var fileReaderE = dropE.mapE(function(event){
            var imagesReady = new Array();
            var data = event.dataTransfer;
            var dashdash = '--';
            var crlf = '\r\n';
            var builder = dashdash+boundary+crlf;        

                var file = data.files[0];                  
                var type = file.type;
                if(type=="image/jpeg"||type=="image/png"||type=="image/gif"){                
                    var reader = new FileReader();
                    reader.onload = function(event){
                        builder += 'Content-Disposition: form-data; name="files[]"';
                        if (file.fileName)
                            builder += '; filename="' + file.fileName + '"';    
                        builder += crlf+'Content-Type: application/octet-stream'+crlf+crlf+event.target.result+crlf+dashdash+boundary+crlf;
                        builder += dashdash+boundary+dashdash+crlf;
                        readersReadyE.sendEvent(builder);
                    }
                    reader.readAsDataURL(file);
                }
            return builder;
        });
        filesUploaded = getAjaxFileRequest(readersReadyE, SETTINGS.scriptPath+"request/fileuploader", contentType);
        filesUploaded.mapE(function(data){
            uploadCompleteE.sendEvent(data);    
        });

    }
    this.uploadCompleteE = function(){
        return uploadCompleteE;    
    }
    this.build=function(){
        if(!data.targetId){
            var dropZone = document.createElement('div');
            dropZone.id = id;
            dropZone.className = 'FileUploaderDragDropWidget';
            dropZone.style.display = 'inline-block';
            /*dropZone.style.width="200px";
            dropZone.style.height="140px";*/
            dropZone.innerHTML = "Drag Files Here";       
            dropZone.style.width = ((data.width==undefined)?placeholder.width:data.width)+'px';
            dropZone.style.height = ((data.height==undefined)?placeholder.height:data.height)+'px';
            return dropZone;
        }
        return "";
    }
    this.destroy=function(){
        /*log('Destroying FileUploader');
        document.getElementById(id).removeEventListener('drop', this.dragDrop);
        document.getElementById(id).removeEventListener('dragover', this.dragOver);*/
    }
}
function FileUploaderWidget(instanceId,data){
    var parent = this;
    this.loader=function(){
      
    }
    this.destroy=function(){

    }
    this.build=function(){
        var dropZone = document.createElement();
        return "<div id=\""+tableDivId+"\"></div>";
    }
}
WIDGETS.register("fileUploaderWidget", FileUploaderWidget);
WIDGETS.register("fileUploaderDragDropWidget", FileUploaderDragDropWidget);

