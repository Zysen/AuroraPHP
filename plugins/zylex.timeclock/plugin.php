<?php
    $page->addToHead("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes\" />");
    $page->registerScript("plugins/zylex.timeclock/zylex.timeclock.js");
    $page->registerCSS("plugins/zylex.timeclock/zylex.timeclock.css");
    
    $behaviourManager->registerBehaviour("zylex_timeclock", "getUserTimeClock", "setUserTimeClock");
    
    function getUserTimeClock($context){
        global $current_user;
        //global $NO_PERMISSION;
        //if(!$current_user->canReadPermission("zylex_timeclock"))
        //    return $NO_PERMISSION;
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"timeclock_id", 'display'=>"ID", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"user_id", 'display'=>"User", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"timestamp", 'display'=>"Timestamp", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"type", 'display'=>"Type", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"latitude", 'display'=>"Lat", 'type'=>"string", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"longitude", 'display'=>"Long", 'type'=>"string", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"comment", 'display'=>"Comment", 'type'=>"string", 'visible'=>false, 'readonly'=>true)
        );
        //echo "SELECT * FROM `zylex_timeclock` WHERE `user_id`=".$current_user->get_SqlId()."\n";
        $result = mysql_query("SELECT * FROM `zylex_timeclock` WHERE `user_id`=".$current_user->get_SqlId()." ORDER BY `timestamp` DESC;", getPrimarySQLConnection());   
        while($row = mysql_fetch_array($result)){  
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['timeclock_id'], (int)$row['user_id'], $row['timestamp'], $row['type'], $row['latitude'], $row['longitude'], $row['comment']);
        }        
        $ret["TABLEMETADATA"] = array("permissions"=>array("canEdit"=>false, "canAdd"=>false, "canDelete"=>false)); 
        return $ret;
    }
    function setUserTimeClock($data, $context){
        global $current_user;
        //if(!$current_user->canWritePermission("zylex_timeclock"))
        //    return $data;
        //AuroraLog("Timeclock", $data);
        $timesheets = $data["DATA"];
        $ids = "";
        for($i=0; $i<count($timesheets);$i++){
            $timesheet = $timesheets[$i];
            $id = mysql_escape_string($timesheet[0]);
            $id = (((int)$id<0)||$id=="undefined")?"NULL":(int)$id;                                     
            $user_id = $current_user->get_SqlId();
            $timestamp = mysql_escape_string($timesheet[2]);
            $timestamp = (strlen($timestamp)==0||$timestamp=="undefined")?"CURRENT_TIMESTAMP":"'".$timestamp."'"; 
            $type = mysql_escape_string($timesheet[3]); 
            $latitude = mysql_escape_string($timesheet[4]);
            $longitude = mysql_escape_string($timesheet[5]);
            $comment = $id.">".$i." ".count($timesheets)." ".$_SERVER['HTTP_USER_AGENT']." ".mysql_escape_string($timesheet[6]);
            $result = mysql_query("SELECT `type`, `timestamp` FROM `zylex_timeclock` WHERE `user_id`=".$current_user->get_SqlId()." ORDER BY `zylex_timeclock`.`timestamp` DESC LIMIT 1;");
            $row = mysql_fetch_array($result);
            $lastType = $row['type'];
            $lastTimestamp = $row['timestamp'];
            $lastCheck = (mysql_num_rows($result)==0||$lastType!=$type);
            if($lastCheck&&($id=="NULL"||(int)$id>=0)){
                $query = "INSERT INTO `zylex_timeclock` (`timeclock_id`, `user_id`, `timestamp`, `type`, `latitude`, `longitude`, `comment`) VALUES ($id, $user_id, $timestamp, '$type', '$latitude', '$longitude', '$comment');";
                mysql_query($query, getPrimarySQLConnection());
                /*if($id<0){
                echo $query;
                echo mysql_error();
                echo mysql_affected_rows();
                }  */
                
            }
            else{
                //echo "Dupe ".mysql_num_rows($result).$row['type']."|".$type."<br />\n";
            }
        }
        return getUserTimeClock($context);
    }
    
    $behaviourManager->registerBehaviour("zylex_timeclock_now", "getDatabaseNow", "setDatabaseNow");
    function getDatabaseNow($context){  
        $row = mysql_fetch_array(mysql_query("SELECT NOW() as `timestamp`;", getPrimarySQLConnection())); 
        return $row['timestamp'];
    }
    function setDatabaseNow($data, $context){
        return getDatabaseNow($context);
    }
    
    
    
         
     
    
?>