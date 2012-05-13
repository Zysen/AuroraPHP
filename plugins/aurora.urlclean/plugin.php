<?php                       

if(strstr($_SERVER['QUERY_STRING'], $settings["aurora_urlclean_search"])){
    $newPageNamee = str_replace($settings["aurora_urlclean_search"],"",$_SERVER['QUERY_STRING']);
    if(count($path)==0)
        $path[0] = $newPageNamee;
    else
        $path[count($path)-1] = $newPageNamee;
      
}
?>
