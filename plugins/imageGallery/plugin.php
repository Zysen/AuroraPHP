<?php                                         
    $page->registerScript("plugins/imageGallery/script.js");
    $page->registerCSS("plugins/imageGallery/style.css");
    $behaviourManager->registerBehaviour("imageGallery_galleryList", "getGalleries", "setGalleries");
    function getGalleries($context){
        global $current_user;
        $where = ($context=="_"||strlen($context)==0)?"":" `imagegallery_galleries`.`imageGallery_galleryId`=$context ";
        $galleries = array();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          //`imagegallery_galleries`.`user_id`=".$current_user->get_SqlId()."
        $result = mysql_query("SELECT `imagegallery_galleries`.`imageGallery_galleryId`, `title`, `imagegallery_galleries`.`user_id` AS `galleryOwner`, `imagegallery_galleries`.`timestamp` AS `galleryTimestamp`, `imagegallery_imageId`, `caption`, `imagegallery_images`.`timestamp` as `imageTimestamp`,`imagegallery_images`.`upload_id`, `imagegallery_images`.`user_id` AS `imageOwner`  FROM `imagegallery_galleries` LEFT JOIN `imagegallery_images` ON `imagegallery_galleries`.`imageGallery_galleryId`=`imagegallery_images`.`imageGallery_galleryId` WHERE $where;");
        $lastRow = null;
        $images = array();
        while($row = mysql_fetch_array($result)){
            /*print_r($row);
            echo "\n\n\n\n";*/
            $changed = $lastRow['imageGallery_galleryId']!=$row['imageGallery_galleryId'];
            $galleryTitle = $row['title'];
            //'imageId'=>$row['imageGallery_imageId'], 
            if(array_key_exists("upload_id", $row)&&$row['upload_id']!=null)
                $images[count($images)] = array('caption'=>$row['caption'], 'upload_id'=>$row['upload_id'],'timestamp'=>$row['imageTimestamp'], 'rights'=>($row['imageOwner']==$current_user->get_SqlId()||$current_user->canAccessPlugin("imageGallery_admin")));
            if($lastRow!=null&&$changed){
                $galleries[count($galleries)] = array("title"=>$row['title'], "galleryId"=>$row['imageGallery_galleryId'], "timestamp"=>$row['galleryTimestamp'], 'rights'=>($row['galleryOwner']==$current_user->get_SqlId()||$current_user->canAccessPlugin("imageGallery_admin")), 'images'=>$images);
                $images = array();
            }
            $lastId = $row['imageGallery_galleryId'];
            $lastRow = $row;
        }                           
        if($lastRow!=null){
            $galleries[count($galleries)] = array("title"=>$lastRow['title'], "galleryId"=>$lastRow['imageGallery_galleryId'], "timestamp"=>$lastRow['galleryTimestamp'], 'rights'=>($lastRow['galleryOwner']==$current_user->get_SqlId()||$current_user->canAccessPlugin("imageGallery_admin")), 'images'=>$images);
        }
        return $galleries;
    }
    function setGalleries($data, $context){
        global $current_user;
        if(!$current_user->canAccessPlugin("imageGallery_admin"))
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
?>