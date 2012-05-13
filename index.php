<?    
error_reporting(E_ALL);
header("Pragma: no-cache");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);  
include("includes/mysqldata.php");
include("includes/settings.php");
include("includes/requestHandler.php");
$scriptPath = ($_SERVER['HTTPS'])?$settings['aurora_secureScriptPath']:$settings['aurora_scriptPath'];
/* Load Functions */
if ($handle = opendir('functions/')) {
        while (false !== ($file = readdir($handle)))
            if($file != "." && $file != ".." && is_file("functions/$file"))
                include("functions/$file");
        closedir($handle);
}
$path = getCleanPathVariables();  
include("includes/page.php");
$page = new AuroraPage("Page");
include("includes/user.php");

include("includes/behaviourManager.php");

/* User set up Phase */
if(isset($_SESSION['USER']))
    $current_user = $_SESSION['USER'];
else{
    $current_user = createGuestUser();
    $_SESSION['USER'] = $current_user;
}  

$requestManager = new RequestManager();
$behaviourManager = new BehaviourManager();


/*$pluginSelectResult = mysql_query("SELECT * FROM `plugins` WHERE `enabled`=1;", $connection);
while($row = mysql_fetch_array($pluginSelectResult)){
    $ref = $row['reference'];
    include("plugins/$ref/plugin.php");
}  */   
$pluginDependencys = array();
$pluginSelectResult = mysql_query("SELECT `plugins`.`reference`, `dependency` FROM `plugins` LEFT JOIN `plugin_dependencies` ON `plugins`.`reference`=`plugin_dependencies`.`reference` WHERE `enabled`=1 ORDER BY `plugins`.`reference` ASC;", $connection);
while($row = mysql_fetch_array($pluginSelectResult)){
    $ref = $row['reference'];
    $dependency = $row['dependency'];
    if(array_key_exists($ref, $pluginDepth))
        $pluginDependencys[$ref][count($pluginDependencys[$ref])] = $dependency;
    else
        $pluginDependencys[$ref] = array($dependency);
}
$orderedPlugins = array();
foreach($pluginDependencys as $plugin=>$dependencies){
    $depth = findDependencyDepth($pluginDependencys, $plugin, 0); 
    if(array_key_exists($depth, $orderedPlugins))
        $orderedPlugins[$depth][count($orderedPlugins[$depth])] = $plugin;
    else
        $orderedPlugins[$depth] = array($plugin);
}
ksort($orderedPlugins);
foreach($orderedPlugins as $loadOrder=>$plugins){
    foreach($plugins as $plugin){
        include("plugins/$plugin/plugin.php");    
    }
} 
if(count($path)>0 && $path[0]!=""){
    switch($path[0]){
        case "logout":
            $current_user = $current_user->AuroraLogout();
            $dowhat = $settings['aurora_defaultAction'];
            $page->addToMessage("You have logged out");
        break;
        case "phpinfo":
            echo exec('whoami');
            phpinfo();
        exit;
        case "request":
            switch($path[1]){          
                case "getPage":
                    $pageData = getPageData(mysql_escape_string(str_replace("request/getPage/", "", getRestOfPath()))); 
                    $page = array("name"=>$pageData['title'], "ownerId"=>$pageData['user_id'], "permissions"=>$pageData['permissions'], "html"=>str_replace("\\\"", "\"", str_replace("\\'", "'", $pageData['content'])));
                    echo json_encode($page);
                    break;
                case "getTemplate":
                    $themeName = $page->getThemeName($settings['aurora_theme']);
                    echo str_replace("<THEME_DIR>", $scriptPath."themes/$themeName/", $page->getThemeTemplate($settings['aurora_theme']));
                    break;
                default:
                    $handler = $requestManager->getHandler($path[1]);
                    if($handler!=FALSE)
                        $handler(getRestOfPath());
                break;
            }
            exit;
        case "getBehaviours":
            echo $behaviourManager->getBehaviours();
            exit;
        default:
            $dowhat=getRestOfPath();
            //$dowhat=$path[0];
    }   
}
else
    $dowhat=$settings['aurora_defaultAction'];
     
     
     

$page->renderPage(getPageData($dowhat));
?>