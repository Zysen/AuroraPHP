<?php
    $page->registerScript("plugins/aurora.media/script.js");
    $page->registerCSS("plugins/aurora.media/style.css");
    
    //$behaviourManager->registerBehaviour("aurora_pluginPermissions", "getPluginPermissions", "setPluginPermissions");
    
   /* function getThemeList($context){
        global $current_user;
        global $NO_PERMISSION;
        if(!$current_user->canReadPermission("aurora_theme_list"))
            return $NO_PERMISSION;
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"theme_id", 'display'=>"ID", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"theme_name", 'display'=>"Group", 'type'=>"string", 'visible'=>true, 'readonly'=>false)
        );
        
        $result = mysql_query("SELECT * FROM `themes`;", getPrimarySQLConnection());   
        while($row = mysql_fetch_array($result)){    
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['theme_id'], $row['theme_name']);
        }        
        return $ret;
    }
    function setThemeList($newData, $context){
        global $current_user;
        if(!$current_user->canWritePermission("aurora_theme_list"))
            return $data;
        return getThemeList($context);
    }              */
   
    ?>
