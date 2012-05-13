<?php                                         
    $page->registerScript("plugins/fileuploader/script.js");
    $page->registerCSS("plugins/fileuploader/style.css");
    $requestManager->registerRequestHandler("fileuploader", "fileuploader_receiveFile");
    function fileuploader_receiveFile($path){
        global $current_user;
        $files = array();
        print_r($_POST);
        foreach($_POST as $fileArr){
            echo "1";
            foreach($fileArr as $file){                   
                echo "2";
                $exp = explode(',', $file);
                $mime = str_replace("data:", "", str_replace(";base64", "", $exp[0]));
                $file = base64_decode($exp[1]);
                $filename = "$mime";
                mysql_query("INSERT INTO `uploadedfile` (`upload_id`, `filename`, `user_id`, `timestamp`) VALUES (NULL, '$filename', '".$current_user->get_SqlId()."', CURRENT_TIMESTAMP);");
                $id = mysql_insert_id();
                $filename = "content/uploads/$id";
                if (!$handle = fopen($filename, 'wb')) {
                    echo "Cannot open file ($filename)";
                    break;
                }
                if (fwrite($handle, $file) === FALSE) {
                    echo "Cannot write to file ($filename)";
                    break;
                }
                $files[count($files)] = array('src'=>$filename, 'id'=>$id);
                fclose($handle);
            }
        }
        echo json_encode(array('files'=>$files)); 
    }
?>