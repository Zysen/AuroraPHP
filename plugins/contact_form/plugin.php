<?php
    $page->registerScript("plugins/contact_form/script.js");
    $page->registerCSS("plugins/contact_form/style.css");
    $requestManager->registerRequestHandler("contactForm_sendMessage", "contactForm_sendMessage");

    function contactForm_sendMessage($path){    
        if(count($_GET)>0){
            $message = "";
            $nameField = "";
            $emailField = "";
            foreach($_GET as $name=>$value){
                if($name=="target" || $name=="subject")
                    continue;
                $message .= "$name: $value<br />";
                if(stristr($name, "name")&&$nameField=="")
                    $nameField = $value;
                if(stristr($name, "email")&&$emailField=="")
                    $emailField = $value;    
            }                         
            foreach($_GET['target'] as $target){
                $email = new Email($target, $nameField."<".$emailField.">", $_GET['subject']);
                $email->SetHtmlContent($message);
                $email->Send();
            }
        }    
    }
?>