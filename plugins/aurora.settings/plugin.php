<?php
    $page->registerScript("plugins/aurora.settings/script.js");
    $page->registerCSS("plugins/aurora.settings/style.css");
    $behaviourManager->registerBehaviour("aurora_settings", "getSettings", "setSettings");
    function getSettings($context){
        global $connection;
        $result = mysql_query("SELECT * FROM `settings` WHERE `plugin`='$context';", $connection);
        $settings=array();
        while($row = mysql_fetch_array($result))
            $settings[count($settings)] = array('description'=>$row['description'], 'name'=>$row['name'], 'value'=>$row['value'], 'formatString'=>$row['formatString']);
        return $settings;
    }
    function setSettings($data, $context){
        global $connection;
        foreach($data as $setting){
            $key = mysql_escape_string($setting['name']);
            $value = mysql_escape_string($setting['value']);
            mysql_query("UPDATE `settings` SET `value`='$value' WHERE `name`='$key' LIMIT 1;", $connection);
        }
        return getSettings($context);
    }
    $behaviourManager->registerBehaviour("aurora_themes", "getThemes");
    function getThemes(){
        
        global $connection;
        $result = mysql_query("SELECT `value` FROM `settings` WHERE `plugin`='aurora' AND `name`='aurora_theme' LIMIT 1;", $connection);
        $row = mysql_fetch_array($result);
        $selected = $row['value'];
        $ret = array();
        $result = mysql_query("SELECT `theme_name`, `theme_id` FROM `themes` ORDER BY `theme_name`;", $connection);
        while($row = mysql_fetch_array($result))
            $ret[count($ret)] = array("name"=>$row['theme_name'], "id"=>$row['theme_id'], "selected"=>$selected==$row['theme_id']);
        return $ret;
    }
    //mysql_query("UPDATE `settings` SET `value` = '".$_POST[$row['name']]."' WHERE name = '".$row['name']."' LIMIT 1;")  
?>