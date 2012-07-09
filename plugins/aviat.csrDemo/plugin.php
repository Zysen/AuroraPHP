<?php
$page->registerScript("plugins/aviat.csrDemo/script.js", true, true);

 $behaviourManager->registerBehaviour("auroraDemo_intTable", "getAuroraDemo_IntTable", "setAuroraDemo_IntTable");  
     function getAuroraDemo_IntTable($context){
        global $current_user;
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"dataPointId", 'display'=>"ID", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"x", 'display'=>"X", 'type'=>"float", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"y", 'display'=>"Y", 'type'=>"float", 'visible'=>true, 'readonly'=>false)
        );
        $result = mysql_query("SELECT `dataPointId`, `x`, `y` FROM `auroraDemo_intTable` ORDER BY `x` ASC;", getPrimarySQLConnection());   
        while($row = mysql_fetch_array($result)){  
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['dataPointId'], (float)$row['x'], (float)$row['y']);
        }        
        $ret["TABLEMETADATA"] = array("permissions"=>array("canEdit"=>true, "canAdd"=>true, "canDelete"=>true), "idColumn"=>"dataPointId"); 
        return $ret;   
     }
     function setAuroraDemo_IntTable($data, $context){
        global $current_user;
//       /return getAuroraDemo_IntTable($context);
        $settings = $data["DATA"];
        $existingPlugins = getAuroraDemo_IntTable($context);
        //function compareAndDeleteRows($table, $matchingColumnName, $matchingColumnIndex, $existingArray, $newArray){  
        compareAndDeleteRows("auroraDemo_intTable", "dataPointId", 0, $existingPlugins["DATA"], $settings);
        for($i=0; $i<count($settings);$i++){
            $setting = $settings[$i];
            $id = mysql_escape_string($setting[0]);
            $id = ($id=="undefined"||$id=="")?'NULL':$id; 
            $x = mysql_escape_string($setting[1]);
            $y = mysql_escape_string($setting[2]);
            
            $query = "INSERT INTO `auroraDemo_intTable` (`dataPointId`, `x`, `y`) VALUES($id, $x, $y) ON DUPLICATE KEY UPDATE `x`='$x',`y`=$y;";
            mysql_query($query, getPrimarySQLConnection()); 
        }
          return getAuroraDemo_IntTable($context);
     } 
/*    $page->registerScript("plugins/aviat.csrDemo/script.js");
    $page->registerCSS("plugins/aviat.csrDemo/style.css"); 
    $behaviourManager->registerBehaviour("aurora_theme_list", "getThemeList", "setThemeList");
    
    function getThemeList($context){
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
    }        */
    ?>
