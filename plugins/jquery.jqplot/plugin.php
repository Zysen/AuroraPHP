<?php
    $page->addToHead("<!--[if lt IE 9]><script language=\"javascript\" type=\"text/javascript\" src=\"excanvas.js\"></script><![endif]--> "); 
    $page->registerScript("plugins/jquery.jqplot/jquery.jqplot.js", false); 
    $page->registerScript("plugins/jquery.jqplot/plugins/jqplot.dragable.min.js", false);
    $page->registerScript("plugins/jquery.jqplot/plugins/jqplot.highlighter.min.js", false);
    $page->registerCSS("plugins/jquery.jqplot/jquery.jqplot.css"); 
    $page->registerScript("plugins/jquery.jqplot/jquery.jqplot.widgets.js"); 
    $page->addExternsUrl("plugins/jquery.jqplot/jqplot.closure.externs.js");
?>
