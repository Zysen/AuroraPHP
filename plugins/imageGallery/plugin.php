<?php   

function resizeImage($filename, $fileLocation, $mime, $target_path, $w, $h, $allowAnimatedGif, $outputFormat=null){
    if(strlen($fileLocation)==0)
        return "File Location is Empty";
    $extension = "";
        if($filename!=""){
                $imagedata = getimagesize($fileLocation);
                $width = $imagedata[0];
                $height = $imagedata[1];     
                if(($width > $w) || ($height > $h)){
                    if($w>$h){
                        $w = ($h / $height) * $width;
                    }
                    else{
                        $h = ($w / $width) * $height;
                    }
                }
                else{                                   //Image is smaller than frame
                    $w = $width;
                    $h = $height;
                }
                if(file_exists($target_path))
                    unlink($target_path);
                //echo "$filename<br />$fileLocation<br />$mime <br />$target_path<br /> $w<br /> $h <br />$allowAnimatedGif";
                switch($mime){
                    case "image/jpeg":                        
                        $im2 = imagecreatetruecolor($w,$h);
                        $image = imagecreatefromjpeg($fileLocation);
                        imagecopyresampled ($im2, $image, 0, 0, 0, 0, $w, $h, $width, $height);       
                        if($outputFormat==null)
                            imagejpeg($im2, $target_path);                  
                    break;
                    case "image/gif":
                        if(isAnimatedGif($fileLocation)){
                            if($allowAnimatedGif==1)
                                move_uploaded_file($fileLocation, $target_path);
                            else
                                return "Error, Animated GIFs are not allowed";
                        }
                        else{
                            $im2 = imagecreatetruecolor($w,$h);
                            $image = imagecreatefromgif($fileLocation);
                            imagecopyresampled ($im2, $image, 0, 0, 0, 0, $w, $h, $width, $height);
                            
                            if($outputFormat==null)
                                imagegif($im2, $target_path, 100);
                        }
                    break;
                    case "image/png":
                        $im2 = imagecreatetruecolor($w,$h);
                        imagealphablending($im2, false);
                        imagesavealpha($im2, true);

                        $image = imagecreatefrompng($fileLocation);
                        imagecopyresampled ($im2, $image, 0, 0, 0, 0, $w, $h, $width, $height);
                        if($outputFormat==null)
                            imagepng($im2, $target_path);
                    break;
                    default:
                       return "Error unsupported file type, please use JPG, GIF or PNG";
                        break;
                }
                if($outputFormat!=null){
                    switch($outputFormat){
                        case "jpg":{
                            imagejpeg($im2, $target_path);
                            break;
                        }
                        case "jpeg":{
                            imagejpeg($im2, $target_path);
                            break;
                        }
                        case "gif":{
                            imagegif($im2, $target_path);
                            break;
                        }
                        case "png":{
                            imagepng($im2, $target_path);
                            break;
                        }
                    }
                }
            
        }
}          
                                      
    $page->registerScript("plugins/imageGallery/script.js");
    $page->registerCSS("plugins/imageGallery/style.css");
    
    $requestManager->registerRequestHandler("IG_processImage", "IG_processImage");
    
    function IG_processImage($path){
        global $current_user;
        global $scriptPath;
        $filePath = str_replace("/resources/", "resources/", str_replace($scriptPath, "", mysql_real_escape_string($_POST['path'])));
        $width = intval(mysql_real_escape_string($_POST['width']));
        $height = intval(mysql_real_escape_string($_POST['height']));
        $id = str_replace("/","_", mysql_real_escape_string($_POST['id']));
         
        $type = mime_content_type($filePath);
        $target_path = "resources/upload/public/imagegallery/thumbs/$id.png"; 
        
        if(!file_exists("resources/upload/public/imagegallery")){
            mkdir("resources/upload/public/imagegallery");
        }
        if(!file_exists("resources/upload/public/imagegallery/thumbs")){
            mkdir("resources/upload/public/imagegallery/thumbs");
        }
        
        resizeImage($id, $filePath,$type, $target_path, $width, $height, false, "png");
        unlink($filePath);
        echo json_encode(array("status"=>1, "path"=>"/$target_path"));
        exit;            
    }
    
    
    
    
    
    
/*    
    $behaviourManager->registerBehaviour("imageGallery_galleryList", "getGalleries", "setGalleries");
    function getGalleries($context){
        global $current_user;
        $where = ($context=="_"||strlen($context)==0)?"":" `imagegallery_galleries`.`imageGallery_galleryId`=$context ";
        $galleries = array();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          //`imagegallery_galleries`.`user_id`=".$current_user->get_SqlId()."
        $result = mysql_query("SELECT `imagegallery_galleries`.`imageGallery_galleryId`, `title`, `imagegallery_galleries`.`user_id` AS `galleryOwner`, `imagegallery_galleries`.`timestamp` AS `galleryTimestamp`, `imagegallery_imageId`, `caption`, `imagegallery_images`.`timestamp` as `imageTimestamp`,`imagegallery_images`.`upload_id`, `imagegallery_images`.`user_id` AS `imageOwner`  FROM `imagegallery_galleries` LEFT JOIN `imagegallery_images` ON `imagegallery_galleries`.`imageGallery_galleryId`=`imagegallery_images`.`imageGallery_galleryId` WHERE $where;");
        $lastRow = null;
        $images = array();
        while($row = mysql_fetch_array($result)){
            $changed = $lastRow['imageGallery_galleryId']!=$row['imageGallery_galleryId'];
            $galleryTitle = $row['title'];
            //'imageId'=>$row['imageGallery_imageId'], 
            if(array_key_exists("upload_id", $row)&&$row['upload_id']!=null)
                $images[count($images)] = array('caption'=>$row['caption'], 'upload_id'=>$row['upload_id'],'timestamp'=>$row['imageTimestamp'], 'rights'=>($row['imageOwner']==$current_user->get_SqlId()||$current_user->permissionContains("imageGallery_master", "true")));
            if($lastRow!=null&&$changed){
                $galleries[count($galleries)] = array("title"=>$row['title'], "galleryId"=>$row['imageGallery_galleryId'], "timestamp"=>$row['galleryTimestamp'], 'rights'=>($row['galleryOwner']==$current_user->get_SqlId()||$current_user->permissionContains("imageGallery_master", "true")), 'images'=>$images);
                $images = array();
            }
            $lastId = $row['imageGallery_galleryId'];
            $lastRow = $row;
        }                           
        if($lastRow!=null){
            $galleries[count($galleries)] = array("title"=>$lastRow['title'], "galleryId"=>$lastRow['imageGallery_galleryId'], "timestamp"=>$lastRow['galleryTimestamp'], 'rights'=>($lastRow['galleryOwner']==$current_user->get_SqlId()||$current_user->permissionContains("imageGallery_master", "true")), 'images'=>$images);
        }
        return $galleries;
    }
    function setGalleries($data, $context){
        global $current_user;
        if(!$current_user->permissionContains("imageGallery_master", "true"))
            return;
        foreach($data as $gallery){
            $title = $gallery['title'];
            $galleryId = $gallery['galleryId'];
            $timestamp = $gallery['timestamp'];
            foreach($gallery['images'] as $image){
                $caption = $image['caption'];
                $upload_id = $image['upload_id'];
                //$timestamp = $image['timestamp'];
                if(array_key_exists("deleted", $image)&&$image['deleted']){
                    mysql_query("DELETE FROM `imagegallery_images` WHERE `imagegallery_images`.`upload_id`=$upload_id LIMIT 1;");
                    unlink("content/uploads/$upload_id");
                    unlink("content/imagegallery/".$upload_id."_small");
                    unlink("content/imagegallery/".$upload_id."_medium");    
                }
                else if(mysql_num_rows(mysql_query("SELECT * FROM `imagegallery_images` WHERE `upload_id`=$upload_id LIMIT 1;"))==1){
                    mysql_query("UPDATE `imagegallery_images` SET `caption` = '$caption' WHERE `imagegallery_images`.`upload_id` =$upload_id LIMIT 1;");    
                }
                else{
                    resizeImage("imageupload_small_$upload_id", "content/uploads/$upload_id", "image/jpeg", "content/imagegallery/".$upload_id."_small", 200, 200, false, null);
                    resizeImage("imageupload_medium_$upload_id", "content/uploads/$upload_id", "image/jpeg", "content/imagegallery/".$upload_id."_medium", 800, 800, false, null);
                    mysql_query("INSERT INTO `imagegallery_images` (`imageGallery_imageId`, `caption`, `user_id`, `timestamp`, `imageGallery_galleryId`, `upload_id`) VALUES (NULL, '$caption', '".$current_user->get_SqlId()."', CURRENT_TIMESTAMP, '$galleryId', '$upload_id');");
                    
                }
                
            }
        } 
        return $data;    
    }
    */
?>