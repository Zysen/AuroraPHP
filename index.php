<?    
//error_reporting(E_ALL);
error_reporting(0); // Turn off error reporting to stop the problem with session_start
//header("Pragma: no-cache");
//header("Cache-Control: no-store, no-cache, must-revalidate");
//header("Cache-Control: post-check=0, pre-check=0", false);  
//header("Content-Type: text/html; charset=ISO-8859-1");
//error_reporting(E_ALL);
//ini_set('display_errors', 'On');








$NO_PERMISSION = 978001;

include("includes/mysqldata.php");
include("includes/log.php");
include("includes/settings.php");

include("includes/requestHandler.php");
include("includes/core.php"); 
include("includes/php-closure.php");
//url prefix
$url = getURL();
if($settings["aurora_scriptPath"]!=$url["prefix"].$url["server"]){
    header("Location: ".$settings["aurora_scriptPath"].substr($url['request'], 1));
    exit;
}

$scriptPath = (array_key_exists('HTTPS', $_SERVER)&&$_SERVER['HTTPS'])?$settings['aurora_secureScriptPath']:$settings['aurora_scriptPath'];
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
    if(array_key_exists($ref, $pluginDependencys))
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
        case "js":
            header("content-type: application/x-javascript");
            echo file_get_contents("js/".$path[1]);
            exit;
        case "phpinfo":
            echo exec('whoami');
            phpinfo();
            exit;                    
        case "request":
            switch($path[1]){
                case "getWidgetRef": 
                    $page = mysql_real_escape_string($_POST['page']);
                    mysql_query("INSERT INTO `aurora_widgetRefs` (`widgetRef_id`, `page`, `user_id`, `timestamp`) VALUES (NULL, '$page', '".$current_user->get_SqlId()."', CURRENT_TIMESTAMP);", getPrimarySQLConnection());
                    $id = mysql_insert_id(getPrimarySQLConnection());
                    echo json_encode(array("id"=>$id));
                    break;          
                case "getPage":
                    $pageData = getPageData(mysql_real_escape_string(str_replace("request/getPage/", "", getRestOfPath()))); 
                    $page = array("name"=>$pageData['title'], "ownerId"=>$pageData['user_id'], "permissions"=>$pageData['permissions'], "html"=>str_replace("\\\"", "\"", str_replace("\\'", "'", $pageData['content'])));
                    echo json_encode($page);
                    break;
                case "getTemplate":
                    $themeName = $page->getThemeName($settings['aurora_theme']);
                    echo str_replace("<THEME_DIR>", $scriptPath."themes/$themeName/", $page->getThemeTemplate($settings['aurora_theme']));
                    break;
                case "recompile":  
                    aurora_recompile();       
                    /*if($current_user->permissionContains("aurora_recompile", "1")||$current_user->permissionContains("aurora_recompile", "true")){
                        aurora_recompile();
                    }
                    else{
                        echo "Permission Denied";
                        $message = "Recompile Error, Insufficient privileges. ".$_SERVER['REMOTE_ADDR'];
                        AuroraLog("SECURITY", $message);
                    }     */
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
    }
}
else{
    $dowhat=$settings['aurora_defaultAction'];
}



$page->renderPage(getPageData($dowhat));
?>