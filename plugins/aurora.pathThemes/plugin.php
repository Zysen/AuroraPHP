<?php

$max = 0;
$maxTheme = array();
$result = mysql_query("SELECT * FROM `aurora_pathThemes`;", $connection);
while($row = mysql_fetch_array($result)){
    $cPath = $row['path'];
    
    $pathExplode = explode("/", $cPath);
    $count = 0;
    if(count($pathExplode)>0){
    foreach($pathExplode as $key=>$value){
        if(array_key_exists($key, $path)&&$path[$key]==$value)
            $count++;
        else
            break;
    }
    if($count>$max){
        $max = $count;
        $maxTheme = array($row['theme_id'], $row['title']);
    }
    }
}
if($max>0){
    $page->setTheme($maxTheme[0]);
    $page->setTitle($maxTheme[1]); 
}
?>
