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
        //session_destroy();
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
        private $_externsURLs = Array();
        
        public function __construct($name){
            global $settings;  
            global $scriptPath;
            $this->_name = $name;
            $this->_theme = $settings['aurora_theme'];
            $this->_themeName = $this->lookupThemeName($this->_theme);
            
           $this->registerScript("js/closure-base.js", false); 
           //$this->registerScript("js/closure-deps.js");
           
           $this->registerScript("js/JSON.js");
           $this->registerScript("js/flapjax-jan2012.js");
           
           $this->registerScript("js/aurora.library.js");
           $this->registerScript("js/BehaviourManager.js");
           $this->registerScript("js/WidgetManager.js");
            
           $this->registerScript("js/aurora.js");
           $this->registerScript("js/aurora_page.js");
           $this->registerScript("js/aurora_ui.js");
           
           //$this->registerScript("themes/".$this->_themeName."/script.js");         
        }      
        public function addExternsUrl($url){
            $this->_externsURLs[count($this->_externsURLs)] = $url;
        }          
        public function lookupThemeName($themeId){
            $result = mysql_query("SELECT `theme_name` FROM `themes` WHERE `theme_id`=$themeId LIMIT 1;", getPrimarySQLConnection());
            $row = mysql_fetch_array($result);
            return $row['theme_name'];
        }
        public function getThemeName(){
            return $this->_themeName;    
        } 
        public function getScripts(){
            return $this->_scripts;    
        }  
        public function getStyles(){
            return $this->_styles;    
        } 
        public function getExterns(){
            return $this->_externsURLs;    
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
        public function addToMessage($message){
            $this->_messages[count($this->_messages)] = $message;    
        }
        public function addToHead($message){
            $this->_head .= $message;    
        }
        public function addComponent($data){
            $this->_content.=$data;
            //$this->_content[count($this->_content)] = $data;
        }
        public function registerScript($script, $compile=true, $merge=true){
            $this->_scripts[count($this->_scripts)]=array("script"=>$script,"compile"=>$compile, "merge"=>$merge);
        }
        public function registerCSS($style){
            $this->_styles[count($this->_styles)] = $style;
        }
        public function getThemeTemplate($themeId){
            $result = mysql_query("SELECT `theme_content` FROM `themes` WHERE `theme_id`=$themeId LIMIT 1;", getPrimarySQLConnection());
            $row = mysql_fetch_array($result);
            return $row['theme_content'];
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

            $clientSettings = json_encode(array("user"=>array("groupid"=>$current_user->get_group_id(),"firstname"=>$current_user->get_firstname(), "lastname"=>$current_user->get_lastname(), "username"=>$current_user->get_username()), "updateWait"=>(int)$settings['aurora_updateTime'],"page"=>$page,"defaultPage"=>$settings['aurora_defaultAction'], "scriptPath"=>$scriptPath, "theme"=>$theme, "externalCSS"=>$scriptData['externalCSS'], "groups"=>$groups, "pagePermissions"=>$pageData['permissions'], "messages"=>$messages, "aurora_encapsulationMethod"=>$settings['aurora_encapsulationMethod']));
            $htmlHead = $this->_head."\n<script type=\"text/javascript\" src=\"".$scriptPath."js/script-".$this->_themeName."".(($settings['closure_compile']=="1")?"-min":"").".js\"></script>\n";
            
            //$scriptPath."js/".$this->_themeName."-script.js
            
            for($i=0;$i<count($this->_scripts);$i++){
                if($this->_scripts[$i]!=null){
                    $script = $this->_scripts[$i]["script"];
                    $merge = $this->_scripts[$i]["merge"];
                    if(!$merge){
                        $htmlHead.="<script type=\"text/javascript\" src=\"".$script."\"></script>\n";
                    }   
                }
            }
            
            
            $htmlHead.="<style type=\"text/css\" media=\"all\">@import \"".$scriptPath."themes/".$this->_themeName."/style-gen.css\";</style>\n<script type=\"text/javascript\">var SETTINGS = $clientSettings;\n";
            for($i=0;$i<count($this->_inlineScripts);$i++){
                $htmlHead .= $this->_inlineScripts[$i]."\n";
            }
            $htmlHead.="</script>\n<meta charset=\"utf-8\" />";
            echo "<!DOCTYPE html>\n<html>\n<head>\n<title>$title</title>\n$htmlHead\n</head>\n<body class=\"themeAuroraBody\"><div id=\"body\"  style=\"display: none;\">".$page["html"]."</div></body>\n</html>";
        }
} 
?>