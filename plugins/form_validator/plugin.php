<?php
    $page->registerScript("plugins/form_validator/script.js");
    $page->registerCSS("plugins/form_validator/style.css");
    //$behaviourManager->registerBehaviour("portMonitor_tx", "portMonitor_getTx");
    $requestManager->registerRequestHandler("form_validator_check_email", "formValidators_checkEmail");
    function formValidators_checkEmail($path){     
        if(array_key_exists("email", $_GET)){
            $email = $_GET['email'];
            $valid = true; 
            if (!preg_match("/^[^@]{1,64}@[^@]{1,255}\$/", $email)) {
                 $valid =  false;
             }
             $email_array = explode("@", $email);
             $local_array = explode(".", $email_array[0]);
             for ($i = 0; $i < sizeof($local_array); $i++) {
                 if (!preg_match("/^(([A-Za-z0-9!#\$%&'*+?^_`{|}~-][A-Za-z0-9!#\$%&'*+?^_`{|}~\.-]{0,63})|(\"[^(\\|\")]{0,62}\"))\$/", $local_array[$i])) {
                    $valid =  false;
                 }
             }
             if (!preg_match("/^\[?[0-9\.]+\]?\$/", $email_array[1])) {
                 $domain_array = explode(".", $email_array[1]);
                 if (sizeof($domain_array) < 2) {
                    $valid =  false; 
                 }
                 for ($i = 0; $i < sizeof($domain_array); $i++) {
                     if (!preg_match("/^(([A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9])|([A-Za-z0-9]+))\$/", $domain_array[$i])) {
                        $valid =  false;
                    }
                }
            }
            if($valid){
                list($userName, $mailDomain) = explode("@", $email);
                if (!checkdnsrr($mailDomain, "MX"))
                    $valid =  false;
            }
            echo json_encode(array('valid'=>$valid, 'address'=>$email));
        }
    }           
?>