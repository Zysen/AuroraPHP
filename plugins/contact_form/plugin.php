<?php
    $page->registerScript("plugins/contact_form/script.js");
    $page->registerCSS("plugins/contact_form/style.css");
    $requestManager->registerRequestHandler("contactForm_sendMessage", "contactForm_sendMessage");

    function contactForm_sendMessage($path){    
        global $settings;
        if(count($_POST)>0){
            $message = "";
            $nameField = "";
            $emailField = "";
            foreach($_POST as $name=>$value){
                if($name=="target" || $name=="subject")
                    continue;
                $message .= "$name: $value<br />";
                if(stristr($name, "name")&&$nameField=="")
                    $nameField = $value;
                if(stristr($name, "email")&&$emailField=="")
                    $emailField = $value;    
            }                 
                $email = new Email($settings['contact_form_target'], $nameField."<".$emailField.">", $settings['contact_form_subject']);
                $email->SetHtmlContent($message);
                $email->Send();
        }    
    }
?>