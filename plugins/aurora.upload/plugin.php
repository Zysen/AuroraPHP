<?php                                         
    $page->registerScript("plugins/aurora.upload/script.js");
    $page->registerCSS("plugins/aurora.upload/style.css");
    $requestManager->registerRequestHandler("aurora.uploader", "fileuploader_receiveFile");
    function fileuploader_receiveFile($path){
        global $current_user;
        global $scriptPath;
        $fn = (isset($_SERVER['HTTP_X_FILE_NAME']) ? $_SERVER['HTTP_X_FILE_NAME'] : false); 
        $newPath = "";
        if ($fn) {  
            $newPath = "resources/upload/".$current_user->get_SqlId()."/$fn";
            if(!file_exists("resources/upload/".$current_user->get_SqlId())){
                mkdir("resources/upload/".$current_user->get_SqlId());
            }
            file_put_contents("$newPath", file_get_contents('php://input'));  
        }
        echo json_encode(array("status"=>1, "path"=>$scriptPath."$newPath")); 
    exit();  
}  
    $behaviourManager->registerBehaviour("aurora_directory", "aurora_readDir", "aurora_setDir");
    function aurora_readDir($dir){
        global $current_user;
         global $NO_PERMISSION; 
        /*if(!$current_user->canReadPermission("aurora_directory")){
            return $NO_PERMISSION;
        }    */
        $ret = getEmptyTableDef();
        $ret["TABLEMETADATA"] = array("permissions"=>array("canEdit"=>true, "canAdd"=>false, "canDelete"=>true));
        $ret["COLUMNMETADATA"] = array(array("permissions"=>"R"),array("permissions"=>"RW"),array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"R")); 
        $ret["COLUMNS"] = array(              
                array("reference"=>"type", 'display'=>"", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"filename", 'display'=>"Filename", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"origfilename", 'display'=>"Filename", 'type'=>"string", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"path", 'display'=>"Path", 'type'=>"string", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"filesize", 'display'=>"Size", 'type'=>"int", 'visible'=>true, 'readonly'=>true, 'width'=>75),
                array("reference"=>"type", 'display'=>"Type", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"uploadprogress", 'display'=>"", 'type'=>"string", 'visible'=>true, 'readonly'=>true, 'width'=>125) 
        );
        $handle = opendir($dir);
        while($name = readdir($handle)) {
            $path = "$dir$name";
            if(is_dir($path)) {
                if($name != '.' && $name != '..') {
                        $ret["DATA"][count($ret["DATA"])] = array("directory", $name,$name, $path, -1, "directory", "");
                }
            }
            elseif(is_link("$dir/$name")) {
                $ret["DATA"][count($ret["DATA"])] = array("link", $name,$name, $path, -1, "link", "");
            }
            else {
                $type = mime_content_type($path);
                $ret["DATA"][count($ret["DATA"])] = array($type, $name,$name, $path, filesize($path), $type, "");
            }
        }
        closedir($handle);    
        return $ret;
    }
    function aurora_setDir($newData, $context){
        global $current_user;
        /*if(!$current_user->canWritePermission("aurora_directory"))
            return $data;  */
        $newDir = (!array_key_exists("DATA", $newData))?array():$newData["DATA"];
        
        $existingDirectory = aurora_readDir($context);
        $existingDirectory = $existingDirectory["DATA"];
        $removeIds = array();
        for($i=0;$i<count($existingDirectory);$i++){
            $exFile1 = $existingDirectory[$i];        //array("link", $name,$name, $path, -1);
            $exName1 = $exFile1[1];
            $match=false;
            for($c=0;$c<count($newDir);$c++){
                $newFile1 = $newDir[$c];              //array("link", $name,$name, $path, -1);
                $oldName = $newFile1[2];
                $newName = $newFile1[1];
                AuroraLog("aurora.upload", "try ($exName1==$oldName)"); 
                if($exName1==$oldName){
                    $match = true;    
                    AuroraLog("aurora.upload", "match ($exName1==$oldName)"); 
                    if($exName1!=$newName){
                        AuroraLog("aurora.upload", "rename($context.$exName1, $context.$newName);");
                        rename($context.$exName1, $context.$newName);  
                    }
                }
            }
            if($match==false){
                AuroraLog("aurora.upload", "unlink($context.$exName1)"); 
                if(is_dir($context.$exName1)){
                    deleteDir($context.$exName1);
                }
                else{
                    unlink($context.$exName1);
                }
            }
        }   
          
        return aurora_readDir($context);
    }

?>