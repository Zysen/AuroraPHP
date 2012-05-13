<?
/*
$scadaConnection = mysql_connect("localhost", $dbusername, $dbpasswd);
if(!$scadaConnection){
    echo "Couldn't connect to server. Either the server does not exist or your username and password are incorrect";
    exit;
}
$db2 = mysql_select_db("plc", $scadaConnection);
if(!$db2){
    echo "Couldn't select database.";
    exit;
}
function getScadaSQLConnection(){
	global $scadaConnection;
	return $scadaConnection;
}

*/
$page->registerScript("plugins/scada/scada.js");
$page->registerCSS("plugins/scada/scada.css");

 $behaviourManager->registerBehaviour("scada_integer_register", "scada_getRegister", "scada_setRegister"); 
    function scada_getRegister($context){
        global $current_user;
        if(!$current_user->canReadBehaviour("scada_integer_register"))
            return array();
	//4003|D|88
	$args = explode("|", $context);
 	$result = mysql_query("SELECT `poll_value` FROM `7_poll_change_monitor` WHERE `device_id` = ".$args[0]." AND `poll_type` = '".$args[1]."' AND `poll_address` = ".$args[2]." LIMIT 1;", getScadaSQLConnection());
	$row = mysql_fetch_rows($result);
	if(mysql_num_rows($result)==0)
		$ret = -1;
	else
		$ret = $row['poll_value'];
        return $ret;
    }
    function scada_setRegister($newData, $context){
        global $current_user;
        if(!$current_user->canWriteBehaviour("scada_integer_register"))
            return $newData;
        $args = explode("|", $context);
	$result = mysql_query("UPDATE `plc`.`7_poll_change_monitor` SET `poll_value` = '".$args[4]."' WHERE `7_poll_change_monitor`.`device_id` = ".$args[0]." AND `7_poll_change_monitor`.`poll_type` = '".$args[1]."' AND `7_poll_change_monitor`.`poll_address` = ".$args[2].";");
	/*$result = mysql_query("INSERT (`poll_type`, `poll_address`, `device_id`, `poll_value`) VALUES('".$args[0]."', ".$args[1].", ".$args[2].", ".$args[3].") ON DUPLICATE KEY UPDATE `name`='$name', `locked`=$locked;", getScadaSQLConnection());*/
        return scada_getRegister($context);
    }


?>
