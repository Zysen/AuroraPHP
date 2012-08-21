<?php                                         
    $page->registerScript("plugins/google.map/script.js");
    $page->registerScript("http://maps.googleapis.com/maps/api/js?key=AIzaSyCP1Ej3uTUHUBkzi4Q6F4vujwyWd3ocVNA&sensor=false", false, false);
    
    $page->registerCSS("plugins/google.map/style.css");
    
    $page->addToHead("<meta name=\"viewport\" content=\"initial-scale=1.0, user-scalable=no\" />");

?>