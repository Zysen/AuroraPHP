<?php
    $requestManager->registerRequestHandler("messorAuthernticator", "messorAuthernticator");
    
    function messorAuthernticator($path){
        print_r($_POST);
        print_r($_GET);
        print_r($_REQUEST);
        print_r($_SERVER);
        exit;
    }
    
?>
