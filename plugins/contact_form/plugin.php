<?php
    $page->registerScript("plugins/contact_form/script.js");
    $page->registerCSS("plugins/contact_form/style.css");
    $requestManager->registerRequestHandler("contactForm_sendMessage", "contactForm_sendMessage");

    function contactForm_sendMessage($path){    
        global $settings;
        if(count($_POST)>0){
        	$subject = (array_key_exists('subject', $_POST)?$_POST['subject']:$settings['contact_form_subject']);
            $message = "";
            $nameField = "";
            $emailField = "noreply@konfidentkidzone.com";
            foreach($_POST as $name=>$value){
                if($name=="target" || $name=="subject")
                    continue;
                $message .= "$name: $value<br />";
                if(stristr($name, "name")&&$nameField=="")
                    $nameField = $value;
                if(stristr($name, "email"))
                    $emailField = $value;    
            } 
            $targets = explode(",", $settings['contact_form_target']);
            for($i=0;$i<count($targets);$i++){
                $target = trim($targets[$i]);            
                $email = new Email($target, $nameField."<".$emailField.">", $subject);
                $email->SetHtmlContent($message);
                $email->Send();
            }
        }    
    }
?>