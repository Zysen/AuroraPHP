<?php
    $page->registerScript("plugins/aurora.network/aurora.network.js", true, true);
    
    
    
    $behaviourManager->registerBehaviour("aurora_network_scan", "getScanResults", "setScanResults");
    function setScanResults($data, $context){
          global $current_user;
        /*if(!$current_user->canWritePermission("aurora_network_scan"))  
            return $data;        */
        $tableData = $data['DATA'];
        for($i=0; $i<count($tableData);$i++){
            $row = $tableData[$i];
            $name = mysql_escape_string($row[0]);
            $mac = mysql_escape_string($row[1]); 
            $ip = mysql_escape_string($row[2]); 
            if(strlen($mac)==0){
                $mac = $ip;
            }
            if(strlen($name)>0){
            
               mysql_query("INSERT INTO `aurora_network_naming` (`mac`, `name`) VALUES ('$mac', '$name') ON DUPLICATE KEY UPDATE mac='$mac', name='$name';");
               //echo "INSERT INTO `aurora_network_naming` (`mac`, `name`) VALUES ('$mac', '$name') ON DUPLICATE KEY UPDATE mac='$mac', name='$name';";    
            }           
        }
       // exit;
        return getScanResults($context);
    }
    function getScanResults($context){
        global $current_user;
        global $NO_PERMISSION;
       
        $ret = getEmptyTableDef();
        $ret["TABLEMETADATA"] = array("permissions"=>array("canEdit"=>true, "canAdd"=>false, "canDelete"=>false));
        $ret["COLUMNMETADATA"] = array(array("permissions"=>"RW"),array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"R"));  
        $ret["COLUMNS"] = array(
                array("reference"=>"description", 'display'=>"Description", 'type'=>"string", 'visible'=>true, 'readonly'=>false), 
                array("reference"=>"mac", 'display'=>"MAC", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"ip", 'display'=>"IP", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"hostname", 'display'=>"Hostname", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"online", 'display'=>"Online", 'type'=>"boolean", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"os", 'display'=>"OS", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"ports", 'display'=>"Open Ports", 'type'=>"string", 'visible'=>true, 'readonly'=>true)
        );
        
        $result = mysql_query("SELECT `ip`, `mac`, `hostname`,`online`, `os` FROM `aurora_network_hosts` WHERE `online`=1 ORDER BY INET_ATON(`ip`) ASC;", getPrimarySQLConnection());
        while($row = mysql_fetch_array($result)){
            $ip = $row['ip'];
            $hostname = $row['hostname'];
            $mac = $row['mac'];
            $online = $row['online'];
            $os = $row['os']; 
            $name="";
            $macLookup = $mac;
            if(strlen($mac)==0){
                $macLookup = $ip;
            }
            $result2 = mysql_query("SELECT * FROM `aurora_network_naming` WHERE `mac`='$macLookup' LIMIT 1;");    
            if(mysql_num_rows($result2)==1){
                $row2 = mysql_fetch_array($result2);
                $name = $row2['name'];
            }
            $ret["DATA"][count($ret["DATA"])] = array($name, $mac, $ip, $hostname, ($online)==1?true:false, $os, "");

            $result2 = mysql_query("SELECT * FROM `aurora_network_ports` WHERE `ip`='$ip' ORDER BY `port` ASC;");    
            while($row2 = mysql_fetch_array($result2)){
                $port = $row2['port'];
                if($port=="3389"){
                    $port = "<a href=\"http://glenrd.dontexist.net/guacamole/client.xhtml?id=".$ip."RDP\">$port</a>";
                }
                else if($port=="5900"){
                    $port = "<a href=\"http://glenrd.dontexist.net/guacamole/client.xhtml?id=".$ip."VNC\">$port</a>";
                }
                else if($port=="80"){
                    $port = "<a href=\"http://$ip\">$port</a>";
                }
                else if($port=="443"){
                    $port = "<a href=\"https://$ip\">$port</a>";
                }
                else if($port=="8080"){
                    $port = "<a href=\"http://$ip:8080\">8080</a>";
                }
                //192.168.1.80RDP
                $ret["DATA"][count($ret["DATA"])-1][6].=",$port";
            } 
        }
        $result = mysql_query("SELECT `ip`, `mac`, `hostname`,`online`, `os` FROM `aurora_network_hosts` WHERE `online`=0 ORDER BY INET_ATON(`ip`) ASC;", getPrimarySQLConnection());
        while($row = mysql_fetch_array($result)){
            $ip = $row['ip'];
            $hostname = $row['hostname'];
            $mac = $row['mac'];                      
            $online = $row['online'];  
            $os = $row['os'];   
            $name="";  
            $macLookup = $mac;
            if(strlen($mac)==0){
                $macLookup = $ip;
            }
            $result2 = mysql_query("SELECT * FROM `aurora_network_naming` WHERE `mac`='$macLookup' LIMIT 1;");    
            if(mysql_num_rows($result2)==1){
                $row2 = mysql_fetch_array($result2);
                $name = $row2['name'];
            }
            $ret["DATA"][count($ret["DATA"])] = array($name, $mac, $ip, $hostname, ($online)==1?true:false, $os, "");
            
            $result2 = mysql_query("SELECT * FROM `aurora_network_ports` WHERE `ip`='$ip' ORDER BY `port` ASC;");    
            while($row2 = mysql_fetch_array($result2)){
                $port = $row2['port'];
                if($port=="3389"){
                    $port = "<a href=\"http://glenrd.dontexist.net/guacamole/client.xhtml?id=".$ip."RDP\">$port</a>";
                }
                else if($port=="5900"){
                    $port = "<a href=\"http://glenrd.dontexist.net/guacamole/client.xhtml?id=".$ip."VNC\">$port</a>";
                }
                else if($port=="80"){
                    $port = "<a href=\"$ip\">$port</a>";
                }
                else if($port=="443"){
                    $port = "<a href=\"https://$ip\">$port</a>";
                }
                else if($port=="8080"){
                    $port = "<a href=\"http://$ip:8080\">8080</a>";
                }
                //192.168.1.80RDP
                $ret["DATA"][count($ret["DATA"])-1][6].=",$port";
            } 
        }
        return $ret;
    }

?>
