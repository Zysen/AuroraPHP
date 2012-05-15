<?php
$dbhost = 'localhost';
$dbusername = 'aurora';
$dbpasswd = 'YBxPL9MZqNFXY3KT';
$database_name = "aurora";
$connection = mysql_connect($dbhost, $dbusername, $dbpasswd);
if(!$connection){
    echo "Couldn't connect to server. Either the server does not exist or your username and password are incorrect";
    exit;
}
$db = mysql_select_db("$database_name", $connection);
if(!$db){
    echo "Couldn't select database.";
    exit;
}
function getPrimarySQLConnection(){
    global $connection;
    return $connection;
}
?>
