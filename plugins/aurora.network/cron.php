<?php
error_reporting(E_ALL); 
set_time_limit(0);
include("../../includes/mysqldata.php");
include("../../includes/log.php"); 
/*function detectClientsByNMAP(){
    writeLog("Executing... ");
    $commandRet = exec("nmap -A 192.168.1.*");
    AuroraLog("NMAP", $commandRet);
    writeLog($commandRet);
}*/
$IGNORE_OS = array("Sony PlayStation 3 game console test kit");
$SWAP_OS = array("AVM FRITZ!Box FON WLAN 7050, Linksys WAG200G, or Netgear DG834GT wireless broadband router"=>"Linksys WAG200G", "Chumby Internet radio"=>"Linksys Wireless N Ethernet Router");
function pingScan(){
    $result = mysql_query("SELECT * FROM `aurora_network_hosts`;");
    while($row = mysql_fetch_array($result)){
        $ip = $row['ip'];
        $online = (ping($ip))?1:0;
        writeLog("$ip $online");
        mysql_query("UPDATE `aurora_network_hosts` SET `online`=$online WHERE `ip`=$ip;");
    }
}
function readNMapPingResults(){
    //AuroraLog("aurora.network", "CRON: NMap ping results processed");
     $hostsFile = file_get_contents("onlinehosts.txt");
    if(strlen($hostsFile)==0)
        return;
    
    //writeLog("<pre>$hostsFile</pre>");
    writeLog("H2");
    $doc = new DOMDocument();
    $doc->loadHTML($hostsFile);
    $xpath = new DOMXpath($doc);
    $elements =  $xpath->query("//status[@state='up']/..");  
    mysql_query("UPDATE `aurora_network_hosts` SET `online`=0;"); 
    
    for($i=0;$i<$elements->length;$i++){
        $ipv4="";
        $ipv6="";
        $mac="";
        $hostname="";
        $os="";
        $openPorts=array();
        $host = $elements->item($i);
        $children = $host->childNodes;
        for($c=0;$c<$children->length;$c++){
            $child = $children->item($c);
            $tagName = $child->localName;
            if($tagName=="address"){    
                $type = $child->getAttribute("addrtype");
                if($type=="ipv4")
                    $ipv4 = $child->getAttribute("addr");   
                else if($type=="ipv6")
                    $ipv6 = $child->getAttribute("addr"); 
            }
            
        }
        $ip = (strlen($ip4)==0)?$ipv4:$ipv6;  
        mysql_query("INSERT INTO `aurora_network_hosts` (`ip`, `online`) VALUES('$ip', 1) ON DUPLICATE KEY UPDATE `online`=1;");
        writeLog("INSERT INTO `aurora_network_hosts` (`ip`, `online`) VALUES('$ip', 1) ON DUPLICATE KEY UPDATE `online`=1;");
    }
}
function advancedScan(){
    global $IGNORE_OS;
    global $SWAP_OS;
    //AuroraLog("aurora.network", "CRON: NMap advanced scan results processed");
    $hostsFile = file_get_contents("advancedscan.txt");
    if(strlen($hostsFile)==0)
        return;
    $doc = new DOMDocument();
    $doc->loadHTML($hostsFile);
    $xpath = new DOMXpath($doc);
    $elements =  $xpath->query("//status[@state='up']/..");
    //mysql_query("UPDATE `aurora_network_hosts` SET `online`=0;");
    for($i=0;$i<$elements->length;$i++){
        $ipv4="";
        $ipv6="";
        $mac="";
        $hostname="";
        $os="";
        $openPorts=array();
        $host = $elements->item($i);
        $children = $host->childNodes;
        for($c=0;$c<$children->length;$c++){
            $child = $children->item($c);
            $tagName = $child->localName;
            if($tagName=="address"){    
                $type = $child->getAttribute("addrtype");
                if($type=="ipv4")
                    $ipv4 = $child->getAttribute("addr");   
                else if($type=="ipv6")
                    $ipv6 = $child->getAttribute("addr"); 
                else if($type=="mac")
                    $mac = $child->getAttribute("addr");  
            }
            else if($tagName=="ports"){    
                $ports = $child->childNodes;
                for($portIndex=0;$portIndex<$ports->length;$portIndex++){
                    $port = $ports->item($portIndex);
                    if($port->localName=="port"){      
                        $openPorts[count($openPorts)] = $port->getAttribute("portid");
                    }                       
                } 
            }
            else if($tagName=="os"){
                $osmatches = $child->childNodes;
                for($osindex=0;$osindex<$osmatches->length;$osindex++){
                    $osmatch = $osmatches->item($osindex);
                    //AuroraLog($osmatch->getAttribute("name"));
                    if(!in_array($osmatch->getAttribute("name"), $IGNORE_OS)){
                        $os = $osmatch->getAttribute("name");
                    }
                }  
            }                                
            else if($tagName=="hostscript"){
                 $hostScripts = $child->childNodes;
                for($scriptIndex=0;$scriptIndex<$hostScripts->length;$scriptIndex++){
                    $script = $hostScripts->item($scriptIndex);
                    $scriptId = $script->getAttribute("id");
                    $scriptOutput = $script->getAttribute("output");
                    if($scriptId=="nbstat"){
                        $cutString = str_replace("NetBIOS name: ", "", $scriptOutput);
                        $hostname = ucfirst(strtolower(substr($cutString, 0,strpos($cutString, ", ")))); 
                        //writeLog("Hostname: $hostname");
                    }
                    else if($scriptId=="smb-os-discovery"){         
                        $os = substr($scriptOutput, 8,strpos($scriptOutput, "Name: ")-9); 
                        //writeLog("OS: $os"); 
                    }                          
                    //writeLog("Script output ".$scriptOutput);
                }
            }
        }
        $ip = (strlen($ip4)==0)?$ipv4:$ipv6;
        //writeLog("<b>$os ".in_array($os, $SWAP_OS)." ".count($SWAP_OS)."</b>");
        if(array_key_exists($os, $SWAP_OS)){
            $os = $SWAP_OS[$os];
        }
        if(count($openPorts)>0){
            mysql_query("DELETE FROM `aurora_network_ports` WHERE `ip`='$ip';");
        }
        foreach($openPorts as $port){
            mysql_query("INSERT INTO `aurora_network_ports` (`ip`, `port`, `portId`) VALUES ('$ip', '$port', NULL);");
        }        
        
        $query = "INSERT INTO `aurora_network_hosts` (`ip`".((strlen($mac)>0)?", `mac`":"").", `online`, `hostname`".((strlen($os)>0)?", `os`":"").") VALUES('$ip'".((strlen($mac)>0)?", '$mac'":"").", 1, '$hostname'".((strlen($mac)>0)?", '$os'":"").") ON DUPLICATE KEY UPDATE `online`=1".((strlen($mac)>0)?", `mac`='$mac'":"").", `hostname`='$hostname'".((strlen($os)>0)?", `os`='$os'":"").";";  
        $result = mysql_query($query);                                                      
        writeLog("$hostname $ipv4 $ipv6 $mac $os");
        writeLog($query);
      //  writeLog($query);   
    }
}   



function ping($ip=NULL) {
 if(empty($ip)) {$ip = $_SERVER['REMOTE_ADDR'];}
 if(getenv("OS")=="Windows_NT") {
  return count(explode(" ", exec("ping -n 3 -l 64 ".$ip)))>1; 
 }
 else {
     $arr = explode(" ", exec("ping -c 3 -s 64 -t 64 ".$ip));
     $count = count($arr);
     //print_r($arr);
  return $count>2;
 }
}
function writeLog($message){
    write("<p>".$message."</p>");
}
function write($message){
    ob_end_clean();
    ob_start();
    echo $message;
    ob_end_flush();
    flush();
}
function getNetbiosInfo($ip){ 
    $arr = explode(" ", str_replace("  ", " ", str_replace("   ", " ", str_replace("    ", " ", str_replace("     ", " ", str_replace("      ", " ", exec("nbtscan $ip")))))));
    return array("ip"=>$arr[0], "hostname"=>$arr[1], "mac"=>$arr[4]);
}
function processIp($ip, $online){
    $ports = array(3389,5900,8080,8081,25565);       //21,22,23,80,443   
    $wait = 2; 
    $nodeDetails = getNetbiosInfo($ip);
                $host = $nodeDetails['hostname'];
                $mac = $nodeDetails['mac'];
                writeLog("$host : $ip : $mac<br />");
                mysql_query("INSERT INTO `aurora_network_hosts` (`hostname`, `ip`, `mac`, `timestamp`, `online`) VALUES ('$host', '$ip', '$mac', CURRENT_TIMESTAMP, $online) ON DUPLICATE KEY UPDATE hostname='$host', ip='$ip', online=$online;");
                mysql_query("DELETE FROM `aurora_network_ports` WHERE `ip`='$ip';");
                  
                    for($i=1;$i<1024;$i++){
                        tryPort($i, $ip, $wait);
                    }
                    foreach($ports as $portIndex=>$port){
                        tryPort($port, $ip, $wait);
                    }
}
function ignoreIP($bannedIps, $ip){
    for($c=0;$c<count($bannedIps);$c++){
        if($bannedIps[$c]==$ip)
            return true;
    }
    return false;
}
function processRange($prefix, $iStart, $iEnd, $bannedIps){
    for($i=$iStart; $i<=$iEnd; $i++){
            $ip = $prefix.$i;
            if(!ignoreIP($bannedIps, $ip)){
                writeLog("Pinging: $ip");
                $ping = ping($ip);
                $online = $ping?1:0;
                if($ping){
                    processIp($ip, $online); 
                }
                else{
                    mysql_query("DELETE FROM `aurora_network_hosts` WHERE `ip`='$ip';");
                }
            }
        }
}
function tryPort($port, $ip, $wait){
    //writeLog("Trying Port $port on |$ip|");
                        $ptcp = fsockopen($ip, $port, &$errno, &$errstr, $wait);
                        if($ptcp) {
                            writeLog("$port open!");
                            mysql_query("INSERT INTO `aurora_network_ports` (`ip`, `port`, `portId`) VALUES ('$ip', '$port', NULL);");
                        } 
                        else {
                         
                        }    
                        fclose($ptcp);
}
function getFieldValue($xpath, $query){
    $elements =  $xpath->query($query);
    if (is_null($elements)||$elements->length==0){
        return false; 
    }
    return $elements->item(0)->childNodes->item(0)->nodeValue;
}
function getBannedIps(){
    $bannedIps = array();
    $data = file_get_contents("http://192.168.1.1/setup.cgi?next_file=DHCPClientTable.htm", false, $context);
    $doc = new DOMDocument();
    $doc->loadHTML($data);
    $xpath = new DOMXpath($doc);
    $hostname="";
    $missCount = 0;
    for($hostIndex=0;true;$hostIndex++){
        $ip = getFieldValue($xpath, "//input[@name='ip$hostIndex']/@value");
        if($missCount>10){
            break;
        }
        if($ip=false||strlen($ip)<=10){
        $missCount++;
            continue;
        }
        $missCount = 0;
        $bannedIps[count($bannedIps)] = $ip;
    } 
    return $bannedIps;  
}
function detectClientsByDHCP(){
    $username = "admin";
    $password = "artemis1";
    $context = stream_context_create(array(
        'http' => array(
            'header'  => "Authorization: Basic " . base64_encode("$username:$password")
        )
    ));
    $data = file_get_contents("http://192.168.1.1/setup.cgi?next_file=DHCPClientTable.htm", false, $context);
    writeLog("Length: "+strlen($data));
    if(strlen($data)==0){
        $data = file_get_contents("http://192.168.1.1/setup.cgi?next_file=DHCPClientTable.htm", false, $context);  
    }
    $wait = 2;

    // echo $data;
    //echo $data;
    $doc = new DOMDocument();
    $doc->loadHTML($data);
    $xpath = new DOMXpath($doc);
    $hostname="";
    $dudCount==0;
    for($hostIndex=0;true;$hostIndex++){
        $mac = getFieldValue($xpath, "//input[@name='mac$hostIndex']/@value");
        $ip = getFieldValue($xpath, "//input[@name='ip$hostIndex']/@value");
        $hostname = getFieldValue($xpath, "//input[@name='name$hostIndex']/@value");
        writeLog("$hostname $ip $mac");
        if($dudCount>10){
            writeLog("IP Is false breaking... $ip $mac $hostname $hostIndex");
            break;
        }
        if($ip==falase || strlen($ip)<=10){
            writeLog("Weird IP $ip continuing...");
            $dudCount++;
            continue;
        }
        $dudCount = 0;
        $ping = ping($ip);
        $online = $ping?1:0;
        writeLog("Online: $online");
        if($ping){
            $nodeDetails = getNetbiosInfo($ip);
            if($nodeDetails['hostname']!=""){
                $hostname = $nodeDetails['hostname'];
            }
            mysql_query("DELETE FROM `aurora_network_ports` WHERE `ip`='$ip';");
            $ports = array(3389,5900,8080,8081,25565);       //21,22,23,80,443
            for($i=1;$i<1024;$i++){
                tryPort($i, $ip, $wait);
                tryPort($i, $ip, $wait);
            }
            foreach($ports as $portIndex=>$port){
                tryPort($port, $ip, $wait);
            }
        }
        /* $query = "INSERT INTO `aurora_network_hosts` (`hostname`, `ip`, `mac`, `online`, `timestamp`) VALUES ('$hostname', '$ip', '$mac', $online, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE hostname='$hostname', ip='$ip', online=$online;";    */
        if(strlen($hostname)>0){     
           mysql_query("UPDATE `aurora_network_hosts` SET `hostname`='$hostname' WHERE `hostname`='' AND `ip`='$ip' LIMIT 1;");
        }
        if(strlen($mac)>0){
            mysql_query("UPDATE `aurora_network_hosts` SET `mac`='$mac' WHERE `mac`='' AND `ip`='$ip' LIMIT 1;");  
        }
    }
}

write("<html><head><title>Cron</title></head><body>");
if(array_key_exists('mode', $_GET) && $_GET['mode']=="ping"){
    writeLog("Detecting By online scan ff");
    readNMapPingResults();  
}
else if(array_key_exists('mode', $_GET) && $_GET['mode']=="advancedscan"){
    writeLog("Detecting By advanced scan");
    advancedScan();  
    //writeLog("Detecting By DHCP");  
    //detectClientsByDHCP();
}
else if(array_key_exists('mode', $_GET) && $_GET['mode']=="dhcp"){
    writeLog("Detecting By DHCP");
    detectClientsByDHCP();
}
write("</body></html>");
?>

