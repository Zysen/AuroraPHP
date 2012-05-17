<?php
$minifyAll = false;
function getPageData($pageId){
    global $current_user;
    global $settings;
    global $path;
    
    $pageData = $current_user->canAccessPage($pageId);
    if($pageData==-1){
        $pageData = getNoPageTemplate($pageId); 
    }
    else if($pageData==0){
        //session_register("aurora_requestedPage");
        $_SESSION['aurora_requestedPage'] = $path;   
        $pageData = getNoPermissionTemplate();
    }
    if(array_key_exists("page_id", $pageData)){
        session_destroy("aurora_requestedPage");
        $pageId = $pageData['page_id'];
        $result = mysql_query("SELECT * FROM `page_permissions` WHERE `page_id`=$pageId;", getPrimarySQLConnection());
        $permissions = array();
        while($row = mysql_fetch_array($result)){
            $permissions[count($permissions)] = array("group_id"=>$row['group_id']);
        } 
        $owner = $pageData['user_id']==$current_user->get_SqlId();
        $canDelete = ($pageData['title']!="login"&&$pageData['title']!=$settings['aurora_defaultAction'])&&($current_user->permissionContains("aurora_all_pages", "W")||$owner); 
        $pageData['permissions'] = array("canEdit"=>($current_user->permissionContains("aurora_all_pages", "W")||$owner), "canDelete"=>$canDelete, "changePermission"=>$owner, "groups"=>$permissions);
    }
    else
        $pageData['permissions'] = array("canEdit"=>$current_user->permissionContains("aurora_pages", "true"));
    return $pageData;
}
class AuroraPage {
        private $_messages;
        private $_head = "";
        private $_scripts;
        private $_inlineScripts;
        private $_styles;
        private $_name;
        private $_title="";
        private $_content="";
        private $_theme;
        private $_themeName;
        
        public function __construct($name){
            global $settings;  
            global $scriptPath;
            $this->_name = $name;
            $this->_theme = $settings['aurora_theme'];
            $this->_themeName = $this->lookupThemeName($this->_theme);
            $this->registerScript($scriptPath."js/jquery-1.7.1.js", false);
            $this->registerScript("js/jquery-ui-1.8.16.custom.min.js");

           $this->registerScript("js/flapjax-2.1-inverse.js");
           $this->registerScript("js/jquery-flapjax.js");
           $this->registerScript("js/aurora.library.js");
           $this->registerScript("js/BehaviourManager.js");
           $this->registerScript("js/WidgetManager.js");
            
           $this->registerScript("js/aurora.js");
           $this->registerScript("js/aurora_page.js");
           $this->registerScript("js/aurora_ui.js");             
        }                
        public function lookupThemeName($themeId){
            $result = mysql_query("SELECT `theme_name` FROM `themes` WHERE `theme_id`=$themeId LIMIT 1;", getPrimarySQLConnection());
            $row = mysql_fetch_array($result);
            return $row['theme_name'];
        }
        public function getThemeName(){
            return $this->_themeName;    
        }
        public function getTheme(){
            return $this->_theme;    
        }
        public function setTitle($title){
            return $this->_title = $title;    
        }
        public function setTheme($themeId){
            $this->_theme = $themeId;
            $this->_themeName = $this->lookupThemeName($themeId);    
        }
        public function addInlineScript($script){
            $this->_inlineScripts[count($this->_inlineScripts)] = $script;    
        }
        public function getLastModifiedJS(){
            global $localPath;
            $max = 0;
                for($i=0;$i<count($this->_scripts);$i++){
                    if($this->_scripts[$i][1]==false&&strstr($this->_scripts[$i][0], "https://")!=FALSE)
                        continue;
                    if($this->_scripts[$i][0]!=null)
                        $max = max(filemtime($localPath.$this->_scripts[$i][0]), $max);
                }
            return $max;
        }
        public function addToMessage($message){
            $this->_messages[count($this->_messages)] = $message;    
        }
        public function addToHead($message){
            $this->_head .= $message;    
        }
        public function getLastModifiedCSS(){
            $max = 0;
            foreach ($this->_styles as $style){
                $max = max(filemtime($style), $max);
            }
            return $max;
        }
        public function addComponent($data){
            $this->_content.=$data;
            //$this->_content[count($this->_content)] = $data;
        }
        public function registerScript($script, $merge = true){
            $this->_scripts[count($this->_scripts)]=array($script, $merge);
        }
        public function registerCSS($style){
            $this->_styles[count($this->_styles)] = $style;
        }
        public function getThemeTemplate($themeId){
            $result = mysql_query("SELECT `theme_content` FROM `themes` WHERE `theme_id`=$themeId LIMIT 1;", getPrimarySQLConnection());
            $row = mysql_fetch_array($result);
            return $row['theme_content'];
        }
        public function mergeScriptAndStyle($theme){
            global $scriptPath;
            global $minifyAll;
            global $settings;
            $minifyAll = false;
            $htmlHead = "";
            $scriptDir = "js/";
            $scriptName = "script-".$this->getLastModifiedJS().".js";
            $scriptNameMin = "script-".$this->getLastModifiedJS()."-min.js";
            if(!file_exists($scriptName)){
                
                if($settings['closure_compile']=="1"){
                    $closure = new PhpClosure();
                    //$closure->hideDebugInfo();
                    $closure->advancedMode();
                    $closure->cacheDir("js/temp/");
                    $closure->useCodeUrl($scriptPath);
                } 
                
                   $mergeCount = 0; 
                removeFilesWithPrefix("script-", $scriptDir);
                     for($i=0;$i<count($this->_scripts);$i++){
                            if($this->_scripts[$i]!=null){
                                $script = $this->_scripts[$i][0];
                                $merge = $this->_scripts[$i][1];
                                //$htmlHead.="<script type=\"text/javascript\" src=\"".((!strstr($script, "http://"))?"".$scriptPath:"").$script."\"></script>\n";
                                
                                if(!$merge)
                                    $htmlHead.="<script type=\"text/javascript\" src=\"".$script."\"></script>\n";
                                else{ 
                                    $data = file_get_contents($script);
                                    file_put_contents($scriptDir.$scriptName, $data."\n\n", FILE_APPEND);
                                    $mergeCount++;
                                }
                                
                                
                            }
                        }
             
                if($settings['closure_compile']=="1"){
                    $closure->add($scriptDir.$scriptName);                            
                    $compiledScript = $closure->_compile();
                    print_r($compiledScript['debug']);
                    if(count($compiledScript['errors'])==0){      
                        file_put_contents($scriptDir.$scriptNameMin, $compiledScript['compiledCode']);
                        $scriptName=$scriptNameMin;
                    }
                    else
                        $this->addInlineScript($compiledScript['debug']);
                }
            }
            

            $styleDir = "themes/".$this->_themeName."/";
            $styleFile = "style-".$this->getLastModifiedCSS().".css";
            // $styleFile = "style-".time().".css";
            if(!file_exists($styleFile)){
                removeFilesWithPrefix("style-", $styleDir);
                foreach ($this->_styles as $style){
                    //if(strstr($style, "flexigrid"))
                    file_put_contents($styleDir.$styleFile, file_get_contents($style), FILE_APPEND);
                    //file_put_contents($styleFile, minifyCSS(file_get_contents($style)), FILE_APPEND);
                }
            }
            $htmlHead.="<style type=\"text/css\" media=\"all\">@import \"".$scriptPath."themes/".$this->_themeName."/$styleFile\";</style>\n"; 
            if($mergeCount>0)
                $htmlHead.="<script type=\"text/javascript\" src=\"".$scriptPath."js/$scriptName\"></script>\n";
            
            return array('htmlHead'=>$htmlHead, 'externalCSS'=>$scriptPath."themes/".$theme."/".$styleFile);
        }
        public function renderPage($pageData){
            global $settings;
            global $minifyAll;
            global $scriptPath;
            global $dowhat;
            global $current_user;
           
            $this->registerScript("themes/".$this->_themeName."/script.js");
            $this->registerCSS("themes/".$this->_themeName."/style.css");
            
            $title = ($this->_title=="")?$settings['aurora_site_name']:$this->_title;
            
            if($pageData!=FALSE)                                                                                                 
                $this->addComponent($pageData['content']);
            $page = array("name"=>$pageData['title'],"noPage"=>$pageData['noPage'], "ownerId"=>$pageData['user_id'], "permissions"=>$pageData['permissions'], "html"=>str_replace("\\\"", "\"", str_replace("\\'", "'", str_replace("<ROOT_URL>", "$scriptPath", $this->_content))));
            $theme = array("name"=>$this->_themeName,"path"=>$scriptPath.'themes/'.$this->_themeName.'/', "html"=>str_replace("\\\"", "\"", str_replace("\\'", "'", str_replace("<ROOT_URL>", "$scriptPath", $this->getThemeTemplate($this->_theme)))));
            
            
            
                                   
            $noPage = $this->_content=="";
            $this->_content=$noPage?getNoPageTemplate():$this->_content;
            $messages = "";                                     
            if(count($this->_messages)>0){
                $messages = "";
                foreach($this->_messages as $message){
                    $messages .= $message."<br />";
                }                                                           
            }                                          
            
            $groups = array();
            $groups[0] = array("group_id"=>1, "name"=>"Public");
            $result = mysql_query("SELECT `name`, `group_id` FROM `groups` WHERE `group_id`!=1 AND `group_id`!=3 ORDER BY `name`;", getPrimarySQLConnection());
            while($row = mysql_fetch_array($result)){
                $groups[count($groups)] = array("group_id"=>$row['group_id'], "name"=>$row['name']);
            }
            //$htmlHead="<script type=\"text/javascript\" src=\"".$scriptPath."js/ckeditor/ckeditor.js\"></script>\n";
            $scriptData= $this->mergeScriptAndStyle($theme['name']);
            $htmlHead = $scriptData['htmlHead'];
            $clientSettings = json_encode(array("updateWait"=>(int)$settings['aurora_updateTime'],"page"=>$page,"defaultPage"=>$settings['aurora_defaultAction'], "scriptPath"=>$scriptPath, "theme"=>$theme, "externalCSS"=>$scriptData['externalCSS'], "groups"=>$groups, "pagePermissions"=>$pageData['permissions'], "messages"=>$messages));
            
            $htmlHead.="<script type=\"text/javascript\">var SETTINGS = $clientSettings;";
                   
            for($i=0;$i<count($this->_inlineScripts);$i++){
                $htmlHead .= $this->_inlineScripts[$i];
            }

            $htmlHead.="</script>\n";//.$this->_head;
            
            $compiledPage = /*$theme["html"].*/$page["html"];
            
            echo "<!DOCTYPE html>\n<html>\n<head>\n<title>$title</title>\n$htmlHead\n</head>\n<body class=\"themeAuroraBody\"><div id=\"body\"  style=\"display: none;\">$compiledPage</div></body>\n</html>";
        }
} 
?>
