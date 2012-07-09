<?php
$page->registerScript($scriptPath."plugins/ckeditor/ckeditor/ckeditor.js", false, false); 
//$page->registerScript($scriptPath."plugins/ckeditor/ckeditor/adapters/jquery.js", false, false); 
$page->registerScript("plugins/ckeditor/ckeditor.library.js", true, true);
//$page->registerCSS("plugins/ckeditor/style.css");

$requestManager->registerRequestHandler("commitPage", "ckeditor_commitPage");
$requestManager->registerRequestHandler("deletePage", "ckeditor_deletePage");

function ckeditor_commitPage($restOfPath){
	global $connection;
	global $current_user;
    global $settings;
    
    $pageName = mysql_escape_string($_POST['pageName']);
    $pageContent = mysql_escape_string($_POST['content']);

    
    if(array_key_exists("template", $_POST)&&$current_user->permissionContains("aurora_mod_template", "W"))
        mysql_query("UPDATE `themes` SET `theme_content` = '".mysql_escape_string($_POST['template'])."' WHERE `theme_id` = ".$settings['aurora_theme']." LIMIT 1;", getPrimarySQLConnection());                  
    $row = getPageData($pageName);
    $page_id = $row['page_id'];

    if((array_key_exists("noPage", $row))&& $current_user->permissionContains("aurora_pages", "true")){  
    	mysql_query("INSERT INTO `pages` (`page_id`, `title`, `content`, `user_id`) VALUES (NULL, '$pageName', '$pageContent', '".$current_user->get_SqlId()."');", getPrimarySQLConnection());
        $page_id = mysql_insert_id();
    }
    else if((!array_key_exists("noPage", $row)) && ($row['user_id']==$current_user->get_SqlId()||$current_user->permissionContains("aurora_all_pages", "W"))){  	
    	mysql_query("UPDATE `pages` SET `content`='$pageContent' WHERE `title`='$pageName' LIMIT 1;", getPrimarySQLConnection());    
    }
    foreach($_POST['permissions'] as $group_id=>$allowed){
        mysql_query("DELETE FROM `page_permissions` WHERE `page_id`=$page_id AND `group_id`=$group_id LIMIT 1;", getPrimarySQLConnection());
        if($allowed=="true"){
            mysql_query("INSERT INTO `page_permissions` (`page_id`, `group_id`) VALUES ($page_id, $group_id);", getPrimarySQLConnection());
        }               
    }
}

function ckeditor_deletePage(){
    global $current_user;
    global $settings;
    $pageName = mysql_escape_string($_POST['pageName']);
    $row = getPageData($pageName);
    if(($row['title']!=$settings['aurora_defaultAction'])&&$row!=FALSE&&($row['user_id']==$current_user->get_SqlId()||$current_user->permissionContains("aurora_all_pages", "W"))){
        mysql_query("DELETE FROM `pages` WHERE `title`='$pageName' LIMIT 1;", getPrimarySQLConnection());
    }
}

?>
