<?php
function getUserDisplay($username, $firstname, $lastname){
    global $settings;
    switch($settings['aurora_userDisplay']){
        case 1:
            return $username;
        case 2:
            return $firstname;
        case 3:
            return $firstname." ".$lastname;
    }    
}
    class AuroraUser{
        var $username;
        var $firstname;
        var $lastname;
        var $group_id;
        var $sqlId=-1;
        var $email;
        var $avatar="";
        function AuroraLogout(){
            $current_user = createGuestUser();
            $_SESSION['USER'] = $current_user; 
            setcookie("emailAddress", "", time()-3600);
            setcookie("pass", "", time()-3600);
            return $current_user;
        }
        function updateFromDataBase(){
            $result = mysql_query("SELECT *, `groups`.`name` AS `groupName` FROM `users` LEFT JOIN `groups` ON `users`.`group_id`=`groups`.`id` WHERE user_id='".$this->sqlId."' LIMIT 1;");
            if(mysql_num_rows($result)==1)
                updateFromArray(mysql_fetch_array($result));
        }
        function updateFromArray($row){
            $this->sqlId = $row['user_id'];
            $this->username = $row['username'];
                $this->firstname = $row['firstname'];
                $this->lastname = $row['lastname'];
                $this->group_id = $row['group_id'];
                //$this->groupName = $row['groupName'];
                $this->email = $row['email'];
                if(strlen($row['avatarFileExt'])>0)
                    $this->avatar = $this->sqlId.".".$row['avatarFileExt'];
        }
        function updateToDatabase(){
            $result = mysql_query("UPDATE `users` SET `firstname` = '".$this->firstname."', `lastname` = '".$this->lastname."', `username` = '".$this->username."', `email` = '".$this->email."', `address` = '".$this->address."', `dob_year` = '".$this->dob_year."', `dob_month` = '".$this->dob_month."', `dob_day` = '".$this->dob_day."', `homephone` = '".$this->homephone."', `workphone` = '".$this->workphone."', `mobilephone` = '".$this->mobilephone."', `nzdralicense`='".$this->get_nzdranum()."' WHERE `id` = ".$this->sqlId." LIMIT 1;");
            $_SESSION['USER'] = $this;
            if($result)
                return true;
            return false;
        }
        
        //Getters and Setters
        function set_SqlId($sqlid){
            $this->sqlId = $sqlid;
            $this->updateFromDataBase();
        }
        function get_SqlId(){
            return $this->sqlId;
        }
        function get_username(){
            return $this->username;
        }
        function set_username($username){
            $this->username = $username;
        }
        function getDisplay(){
            return getUserDisplay($this->username, $this->firstname, $this->lastname);
        }
        function get_avatar(){
            return $this->avatar;
        }
        function get_avatar_file(){
            if(has_avatar())
                return "content/avatars/".$this->avatar;
            return "";
        }
        function has_avatar(){
            return strlen($this->avatar)>0;
        }
        function get_group_name(){
            return $this->groupName;
        }
    
        function get_group_id(){
            return $this->group_id;
        }
        function set_group_id($group_id){
            $this->group_id = $group_id;
        }
        
        function get_firstname(){
            return $this->firstname;
        }
        function set_firstname($firstname){
            $this->firstname = $firstname;
        }
        
        function get_lastname(){
            return $this->lastname;
        }
        function set_lastname($lastname){
            $this->lastname = $lastname;
        }
        function get_email(){
            return $this->email;
        }
        function set_email($email){
            $this->email = $email;
        }
        
      
        function is_admin(){
            if($this->group_id == 3)
                return true;
            else
                return false;
        }
        function getPermission($reference){
            global $connection;
            $result = mysql_query("SELECT `permissions` FROM `permission_register` NATURAL JOIN `permissions` WHERE `name`='$reference' AND (`user_id`=".$this->get_SqlId()." OR `group_id`=".$this->get_group_id().") LIMIT 1", $connection);
            if(mysql_num_rows($result)>0){
                $row = mysql_fetch_array($result);
                return $row['permissions'];
            }
            return false;
        }
        function permissionContains($behaviour, $search){
            $perms = $this->getPermission($behaviour);
            if($perms==false||(!strstr($perms, $search)))  {
                return false;
            }
            else{
                return true;
            }
        }
        function canReadPermission($behaviour){
            return $this->permissionContains($behaviour, "R");
        }
        function canWritePermission($behaviour){
            return $this->permissionContains($behaviour, "W");
        }
        function canAccessPage($title){
            global $current_user;
            global $connection;
            $result = mysql_query("SELECT * FROM `pages` WHERE `title`='$title' LIMIT 1;", $connection);
            if(mysql_num_rows($result)>0){
                $row = mysql_fetch_array($result);
                if($row['user_id']==$current_user->get_SqlId()||$this->permissionContains("aurora_all_pages", "R"))
                    return $row;
                $result2 = mysql_query("SELECT * FROM `page_permissions` WHERE `page_id`=".$row['page_id']." AND (`user_id`=".$this->get_SqlId()." OR `group_id`=".$this->get_group_id().") LIMIT 1;", $connection);                                
                if(mysql_num_rows($result2)>0){
                    return $row;
                }
                return 0;   //No Access
            }
            return -1;  //Sentinal for no page 
        }
    }
    $blowfish = $settings['aurora_secret'];
session_start();
/* Login Procedure */       
        if(array_key_exists("login", $_POST)||((!isset($_SESSION['USER']))&&isset($_COOKIE['emailAddress']))){            
            if(isset($_COOKIE['emailAddress'])&&isset($_COOKIE['pass'])){
                $email = mysql_escape_string($_COOKIE['emailAddress']);
                $password =mysql_escape_string(custom_decrypt($_COOKIE['pass'], $blowfish));
            }
            else{
                $email = mysql_escape_string($_POST['emailAddress']);
                $password = mysql_escape_string(md5($_POST['password']));
            }
                                       //`user_id`, `validated`, `loggedIn`, `email`
        $result = mysql_query("SELECT * FROM `users` WHERE email='$email' AND password='$password' LIMIT 1;", getPrimarySQLConnection());
        if(mysql_num_rows($result)==0)
            $result = mysql_query("SELECT * FROM `users` WHERE email='$postEmail' AND password='$postPass' LIMIT 1;", getPrimarySQLConnection());
        if(mysql_num_rows($result)>0){
            $row = mysql_fetch_array($result);
            if($settings['aurora_requireEmailValidation']==0||$row['validated']=="1"){
                $current_user = new AuroraUser();
                $current_user->updateFromArray($row);
                $_SESSION['USER'] = $current_user;
                if(isset($_POST['remember'])&&$_POST['remember']=="on"){
                    if(!isset($_COOKIE['emailAddress']))
                      setcookie("emailAddress", $email, time()+60*60*24*30);
                    if(!isset($_COOKIE['pass']))
                        setcookie("pass", custom_encrypt(md5($_POST['password']), $blowfish), time()+60*60*24*30);
                }
                if(isset($_SESSION['loginRedirect']))
                    header("Location: ".$_SESSION['loginRedirect']);
                //header("Location: ".$scriptPath);
                if(isset($_POST['emailAddress'])){
                    $page->addToMessage("Welcome ".$current_user->get_firstname()." you have successfully logged in.");
                    if(session_is_registered("aurora_requestedPage")&&count($_SESSION['aurora_requestedPage'])>0){
                        $path = $_SESSION['aurora_requestedPage'];
                        session_destroy("aurora_requestedPage");
                    }
                    else
                        $path = array($settings["aurora_defaultAction"]);
                }
                    
            }
            else{
                $page->addtomessage("Error - your account has not been activated. Activation has not yet been implemented, and you should not be here. Please contact a system administrator");
                //showValidationBox($row['email']);
            }   
        }
        else{
            $path = array("login");
            $page->addtomessage("Login Error - Username or password incorrect");
        }
    }
?>