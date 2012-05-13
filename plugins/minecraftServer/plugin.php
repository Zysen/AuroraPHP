<?php                                         
    $page->registerScript("plugins/minecraftServer/script.js");
    $page->registerCSS("plugins/minecraftServer/style.css");
    $behaviourManager->registerBehaviour("minecraftServer_getPlayers", "getPlayerList");
    $minecraftServer = mysql_connect($dbhost, $dbusername, $dbpasswd, true);
    mysql_select_db("minecraft", $minecraftServer);       
    
    
    
    function getPlayerList($context){
        global $minecraftServer;
        $players=array();                                //GROUP BY `player_name`
        $result = mysql_query("SELECT * FROM `players` ORDER BY `player_name` ASC;", $minecraftServer);
        while($row = mysql_fetch_array($result)){
            $players[count($players)] = $row;    
        }
        return $players;     
    }
    
    
?>