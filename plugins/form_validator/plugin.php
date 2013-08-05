<?php
    $page->registerScript("plugins/form_validator/script.js");
    $page->registerCSS("plugins/form_validator/style.css");
    //$behaviourManager->registerBehaviour("portMonitor_tx", "portMonitor_getTx");
    $requestManager->registerRequestHandler("form_validator_check_email", "formValidators_checkEmail");
    $requestManager->registerRequestHandler("form_validator_check_email_with_unique", "formValidators_checkEmailUnique");
    function formValidators_checkEmailUnique($path){
    	$emailCheck = formValidators_checkEmail($path, true);	
		$emailCheck['unique'] = false;
		if(strlen($emailCheck['address'])>0){
			$emailCheck['unique'] = mysql_num_rows(mysql_query("SELECT * FROM `users` WHERE `email`='".mysql_real_escape_string($_POST['email'])."' LIMIT 1;"))==0;	
		}
		echo json_encode($emailCheck);
	}
    
    function formValidators_checkEmail($path, $retMode){
    	
        if(array_key_exists("email", $_POST)){
            $email = $_POST['email'];
			$domainExists = false;
            $valid = true; 
            if (!preg_match("/^[^@]{1,64}@[^@]{1,255}\$/", $email)) {
                 $valid =  false;
             }
             $email_array = explode("@", $email);
             if(strstr($email, "@")!=FALSE){
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
			 }
			 else{
			 	$valid = false;
			 }
            if($valid){
                list($userName, $mailDomain) = explode("@", $email);
                if (!checkdnsrr($mailDomain, "MX")){
                    $valid =  false;
				}
				else{
					$domainExists = true;
				}
            }
			if(!$retMode){
            	echo json_encode(array('valid'=>$valid, 'address'=>$email, 'domainExists'=>$domainExists));
			}
			else{
				return array('valid'=>$valid, 'address'=>$email, 'domainExists'=>$domainExists);
			}
			
        }
    }           
?>