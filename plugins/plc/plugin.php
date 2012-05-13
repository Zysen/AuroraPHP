<?php
$page->registerScript("plugins/plc/plc.library.js");
$page->registerScript("plugins/plc/plc.widgets.js");

  
    
    $plcDatabase = mysql_connect("localhost", "plc", "plc", true);
    mysql_select_db("plc", $plcDatabase);  
    if(!$plcDatabase){ 
        echo "NO PLC DB";
                                                  
    }
    
    $behaviourManager->registerBehaviour("plcGetDevice", "getRegister");     
    function getRegister($context){
        global $plcDatabase;    
        $result = mysql_query("SELECT `poll_value`, `last_update` FROM `7_poll_change_monitor` WHERE `poll_type`='".$context[0]."' AND `poll_address`='".       str_replace($context[0], "", $context)."' LIMIT 1;", $plcDatabase);
        $row = mysql_fetch_array($result);
        return array("value"=>(int)$row['poll_value'], "timestamp"=>$row['last_updated']);       
    }
    
     $behaviourManager->registerBehaviour("plcGetMachineCode", "getMachineCode");     
    function getMachineCode($context){
                                                         
      /*  mysql> SELECT
    -> t1.id AS id1, t2.id AS id2,
    -> t2.date,
    -> t1.ab AS ab1, t2.ab AS ab2,
    -> t1.h AS h1, t2.h AS h2,
    -> t2.ab-t1.ab AS abdiff,
    -> t2.h-t1.h AS hdiff,
    -> TRUNCATE(IFNULL((t2.h-t1.h)/(t2.ab-t1.ab),0),3) AS ba
    -> FROM player_stats AS t1, player_stats AS t2
    -> WHERE t1.id+1 = t2.id
    -> ORDER BY t1.id;*/
        
        /*global $plcDatabase;                          
        $result = mysql_query("SELECT * FROM `words` WHERE `name`='$context' LIMIT 1;", $plcDatabase);
        return mysql_fetch_array($result);*/
       // return array("value"=>rand(1, 100), "timestamp"=>time());
    }
            
            
            
    $behaviourManager->registerBehaviour("plcGetShift", "plcGetShift");
      function plcGetShift($context){
        //$context = str_replace("'", "\"", $context);
        $context = str_replace("'", "\"", $context);
          $args = json_decode($context);
          $shiftStartTime =$args[0];//"07:00:00"; 
          $shiftEndTime = $args[1];//"15:00:00";
          $maxDaysAgo = $args[2];//2;
          $deviceAddress = $args[3];
          
          $pollType = $deviceAddress[0];
          $deviceAddress = substr($deviceAddress, 1);                                                                   //(DATE(`last_update`)=(DATE_SUB(CURDATE(), INTERVAL $daysAgo DAY))
        global $plcDatabase;
        $startDaysAgo = (strtotime($shiftStartTime) > strtotime($shiftEndTime))?1:0;     
        $endDaysAgo = 0;
        
        do{
            $query ="SELECT `last_update`, `8_poll_change_log`.`poll_value`,`menu_struc`, `op_code_text` FROM `8_poll_change_log` LEFT JOIN `status_codes` ON `8_poll_change_log`.`poll_value`=`status_codes`.`poll_value` WHERE `poll_address`='$deviceAddress' AND `poll_type`='$pollType' AND `status_codes`.`poll_value`<300 AND `last_update` >  TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL $startDaysAgo DAY),'$shiftStartTime') AND `last_update`<TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL $endDaysAgo DAY), '$shiftEndTime') ORDER BY `8_poll_change_log`.`last_update`  ASC;";
            //$query ="SELECT `last_update`, `8_poll_change_log`.`poll_value`,`menu_struc`, `op_code_text` FROM `8_poll_change_log` LEFT JOIN `status_codes` ON `8_poll_change_log`.`poll_value`=`status_codes`.`poll_value` WHERE `poll_address`='$deviceAddress' AND `poll_type`='D' AND `status_codes`.`poll_value`<300 AND `last_update` >  TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL $startDaysAgo DAY),'$shiftStartTime') AND `last_update`<TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL $endDaysAgo DAY), '$shiftEndTime') ORDER BY `8_poll_change_log`.`last_update`  ASC;";
            //echo $query."\n\n\n\n||||";
            $result = mysql_query($query); 
/*            if(mysql_num_rows($result)>0)
                echo $query."\n\n\n\n||||";     */
        $startDaysAgo++;
        $endDaysAgo++;
        }while($endDaysAgo<$maxDaysAgo&&mysql_num_rows($result)==0);
          $sum=true;
          $values = array();
        $lastRow = null;
        $minTimestamp = null;
        $maxTimestamp = 0;
        while($row = mysql_fetch_array($result)){
            if($row['poll_value']=="0")
                continue; 
            $minTimestamp = ($minTimestamp==null)?$row['last_update']:min($minTimestamp, $row['last_update']);
            $maxTimestamp = max($maxTimestamp, $row['last_update']);
            $value = ($row['op_code_text']!=null)?$row['op_code_text']:$row['poll_value'];
            $lastValue = ($lastRow['op_code_text']!=null)?$lastRow['op_code_text']:$lastRow['poll_value'];
            $timestamp = $row['last_update'];
            if($lastRow!=null){
                $diff = strtotime($timestamp)-strtotime($lastRow['last_update']);
                $saveValue=($lastRow['menu_struc']=="System"&&$row['menu_struc']!="System")?$value:$lastValue;
                $groups[$saveValue]+=$diff;
            }
            else{
/*                $diff = strtotime($timestamp)-strtotime($shiftStartTime);
                $saveValue=($row['menu_struc']!="System")?$value:$lastValue;
                $groups[$saveValue]+=$diff; */
            }
            $lastRow = $row;
        }
        
       // arsort($values, SORT_NUMERIC);
       if($sum){
       arsort($groups, SORT_NUMERIC);
        foreach($groups as $status=>$durationSum){
            $values[count($values)] = array($status." ", $durationSum);
        }   
       }
        
        
        
         return array("TITLE"=>"$minTimestamp - $maxTimestamp", "COLUMNS"=>array(/*"timestamp"=>array("display"=>"Timestamp", "type"=>"string", 'visible'=>true, 'readonly'=>true), "poll_value"=>array("display"=>"value", "type"=>"int", 'visible'=>true, 'readonly'=>true),*/ "op_code_text"=>array("display"=>"Status", "type"=>"string", 'visible'=>true, 'readonly'=>true), "duration"=>array("display"=>"Duration", "type"=>"int", 'visible'=>true, 'readonly'=>true)), "COL_KEY"=>"op_code_text", "DATA"=>$values);
         
      }  
    
    
    $behaviourManager->registerBehaviour("plcGetMachineStatus", "getMachineStatus");
    function getMachineStatus($context){
        global $plcDatabase;
        $groups = array();                           
        $pd = $context[0];
        $pa = str_replace($context[0], "", $context);
        $table = "8_poll_change_log";
        //$table = "test1";
        /*$result = mysql_query("SELECT last_update, `$table`.`poll_value`, `op_code_text` FROM `$table` LEFT JOIN `status_codes` ON `$table`.`poll_value`=`status_codes`.`poll_value` WHERE `poll_address`=$pa AND `poll_type`='$pd' AND `menu_struc`='System' ORDER BY last_update ASC;", $plcDatabase);             */
        
        
        $query = "SELECT last_update, `$table`.`poll_value`, `op_code_text`, `menu_struc` FROM `$table` LEFT JOIN `status_codes` ON `$table`.`poll_value`=`status_codes`.`poll_value` WHERE `poll_address`=$pa AND `poll_type`='$pd' AND `status_codes`.`poll_value`<300 ORDER BY `8_poll_change_log`.`last_update`  ASC";
        
        $result = mysql_query($query, $plcDatabase);
                                                                         //  
        $sum = true;
        
        $values = array();
        $lastRow = null;
        while($row = mysql_fetch_array($result)){
            if($row['poll_value']=="0")
                continue; 
            $value = ($row['op_code_text']!=null)?$row['op_code_text']:$row['poll_value'];
            $lastValue = ($lastRow['op_code_text']!=null)?$lastRow['op_code_text']:$lastRow['poll_value'];
            $timestamp = $row['last_update'];
            if($lastRow!=null){
                $diff = strtotime($timestamp)-strtotime($lastRow['last_update']);
                $saveValue=($lastRow['menu_struc']=="System"&&$row['menu_struc']!="System")?$value:$lastValue;
                //$saveValue = $lastValue;
                $groups[$saveValue]+=$diff;
                if(!$sum)
                    $values[count($lastValue)] = array($saveValue." ", $diff); 
            }
            $lastRow = $row;
        }
        
       // arsort($values, SORT_NUMERIC);
       if($sum){
       arsort($groups, SORT_NUMERIC);
        foreach($groups as $status=>$durationSum){
            $values[count($values)] = array($status." ", $durationSum);
        }   
       }
        return array("COLUMNS"=>array("status"=>array("display"=>"Status", "type"=>"string"), "duration"=>array("display"=>"Duration", "type"=>"int")), "COL_KEY"=>"status", "DATA"=>$values);       
    }
                                                
    
    $behaviourManager->registerBehaviour("plcGetDeviceRows", "getDeviceRows");     
    function getDeviceRows($context){
        global $plcDatabase;                         
        $pd = $context[0];
        $pa = str_replace($context[0], "", $context);
        $result = mysql_query("SELECT `last_update`, MIN(`poll_value`) as `poll_value` FROM `6_poll_periodic_log` WHERE `poll_address`=$pa AND `poll_type`='$pd' AND DATE(`last_update`)>(DATE_SUB(CURDATE(), INTERVAL 1 YEAR)) GROUP BY DATE_FORMAT(`last_update`,'%m%d%Y%h%i');", $plcDatabase);

        // 
       
        $values = array();
        while($row = mysql_fetch_array($result)){
            $values[count($values)] = array($row['last_update'],(int)$row['poll_value']);
        }
                 return array("COLUMNS"=>array("timestamp"=>array("display"=>"Timestamp", "type"=>"string", 'visible'=>true, 'readonly'=>true), "poll_value"=>array("display"=>"value", "type"=>"int", 'visible'=>true, 'readonly'=>true)), "COL_KEY"=>"timestamp", "DATA"=>$values); 
    }
    $behaviourManager->registerBehaviour("plcGetChangeLog", "getChangeLogRows");     
    function getChangeLogRows($context){
        global $plcDatabase;                         
        $pd = $context[0];
        $pa = str_replace($context[0], "", $context);
        $result = mysql_query("SELECT `last_update`, MIN(`poll_value`) as `poll_value` FROM `8_poll_change_log` WHERE `poll_address`=$pa AND `poll_type`='$pd' AND DATE(`last_update`)>(DATE_SUB(CURDATE(), INTERVAL 1 YEAR)) GROUP BY DATE_FORMAT(`last_update`,'%m%d%Y%h%i');", $plcDatabase);

        // 
       
        $values = array();
        while($row = mysql_fetch_array($result)){
            $values[count($values)] = array($row['last_update'],(int)$row['poll_value']);
        }
                 return array("COLUMNS"=>array("timestamp"=>array("display"=>"Timestamp", "type"=>"string", 'visible'=>true, 'readonly'=>true), "poll_value"=>array("display"=>"value", "type"=>"int", 'visible'=>true, 'readonly'=>true)), "COL_KEY"=>"timestamp", "DATA"=>$values); 
    }                                      
    
    
    $behaviourManager->registerBehaviour("plcPollGroups", "getPollGroups");     
    function getPollGroups($context){
        global $plcDatabase;
        $words=array();                                //GROUP BY `player_name`
        $result = mysql_query("SELECT * FROM `3_poll_requests` ORDER BY `plc_poll_requests`.`poll_group` ASC", $plcDatabase);
        while($row = mysql_fetch_array($result)){
            $words[count($words)] = $row;    
        }
        return $words;     
    }
     $behaviourManager->registerBehaviour("plcLog", "getLogs");     
    function getLogs($context){
        global $plcDatabase;                                                 
        $words=array();                                //GROUP BY `player_name`
        $result = mysql_query("SELECT * FROM `4_poll_system_log` ORDER BY `timestamp` DESC LIMIT 10;", $plcDatabase);
        while($row = mysql_fetch_array($result)){
            $words[count($words)] = $row;    
        }
        return $words;     
    }
  
 /*
  SELECT `last_update`, `8_poll_change_log`.`poll_value`,`menu_struc`, `op_code_text` FROM `8_poll_change_log` LEFT JOIN `status_codes` ON `8_poll_change_log`.`poll_value`=`status_codes`.`poll_value` WHERE `poll_address`='100' AND `poll_type`='D' AND `status_codes`.`poll_value`<300 AND `last_update` >  TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 0 DAY),'07:00:00') AND `last_update`<TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 0 DAY), '15:00:00') ORDER BY `8_poll_change_log`.`last_update`  ASC;*/
  
  
?>
