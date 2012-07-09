<?php
    $page->registerScript("plugins/aurora.administration/script.js");
    $page->registerCSS("plugins/aurora.administration/style.css");
    
    $behaviourManager->registerBehaviour("aurora_pluginPermissions", "getPluginPermissions", "setPluginPermissions");
    $behaviourManager->registerBehaviour("aurora_groups", "getGroups", "setGroups"); 
    $behaviourManager->registerBehaviour("aurora_users", "getUsers", "setUsers");
    $behaviourManager->registerBehaviour("aurora_plugins", "getPlugins", "setPlugins");
    $behaviourManager->registerBehaviour("aurora_permissions", "getAuroraPermissions", "setAuroraPermissions");
    $behaviourManager->registerBehaviour("aurora_permissions_set", "getBPermmissions", "setBPermmissions");
    $behaviourManager->registerBehaviour("aurora_settings", "getWebpageSettings", "setWebpageSettings");  
    $behaviourManager->registerBehaviour("aurora_theme_list", "getThemeList", "setThemeList");
    
    function getThemeList($context){
        global $current_user;
        global $NO_PERMISSION;
        if(!$current_user->canReadPermission("aurora_theme_list"))
            return $NO_PERMISSION;
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"theme_id", 'display'=>"ID", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"theme_name", 'display'=>"Group", 'type'=>"string", 'visible'=>true, 'readonly'=>false)
        );
        
        $result = mysql_query("SELECT * FROM `themes`;", getPrimarySQLConnection());   
        while($row = mysql_fetch_array($result)){    
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['theme_id'], $row['theme_name']);
        }        
        return $ret;
    }
    function setThemeList($newData, $context){
        global $current_user;
        if(!$current_user->canWritePermission("aurora_theme_list"))
            return $data;
        return getThemeList($context);
    }
    
    function getWebpageSettings($context){
        global $current_user;
        global $NO_PERMISSION;
        if(!$current_user->canReadPermission("aurora_settings"))
            return $NO_PERMISSION;
        $ret = getEmptyTableDef();  
        $ret["COLUMNS"] = array(
                array("reference"=>"name", 'display'=>"Name", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"description", 'display'=>"Description", 'type'=>"string", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"value", 'display'=>"Value", 'type'=>"int", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"type", 'display'=>"Type", 'type'=>"string", 'visible'=>false, 'readonly'=>false)
        );
        $result = mysql_query("SELECT * FROM `settings` WHERE `plugin`='$context';");
        while($row = mysql_fetch_array($result)){
            $value = $row['value'];
            if($row['type']=="boolean")
                $value = (boolean)$value;
            $ret["DATA"][count($ret["DATA"])] = array($row['name'], $row['description'], $value, $row['type']);
        }
        $ret["TABLEMETADATA"] = array("permissions"=>array("canEdit"=>true, "canAdd"=>false, "canDelete"=>false));
        $ret["COLUMNMETADATA"] = array(array("permissions"=>"R"),array("permissions"=>"R"),array("permissions"=>"RW"),array("permissions"=>"R"));
        return $ret; 
    }
    function setWebpageSettings($data, $context){
        global $current_user;
        if(!$current_user->canWritePermission("aurora_settings"))
            return $data;
        $settings = $data["DATA"];
        for($i=0; $i<count($settings);$i++){
            $setting = $settings[$i];
            $name = mysql_escape_string($setting[0]);
            $description = mysql_escape_string($setting[1]);
            $value = mysql_escape_string($setting[2]); 
            $value = $setting[2]; 
            $type = mysql_escape_string($setting[3]); 
            if($type=="boolean"){
                $value = ($value=="true"||$value=="1")?"1":"0";
            }
            mysql_query("UPDATE `settings` SET `value`='$value' WHERE `name`='$name' AND `plugin`='$context' LIMIT 1;", getPrimarySQLConnection());
        }
        return getWebpageSettings($context);
    }   
    
    function getGroups($context){
        global $current_user;
        global $NO_PERMISSION;
        if(!$current_user->canReadPermission("aurora_groups"))
            return $NO_PERMISSION;
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"groupId", 'display'=>"ID", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"group", 'display'=>"Group", 'type'=>"string", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"locked", 'display'=>"Locked", 'type'=>"boolean", 'visible'=>false, 'readonly'=>true)
        );
        
        $result = mysql_query("SELECT * FROM `groups` WHERE `group_id`!=1 AND `group_id`!=3;", getPrimarySQLConnection());
        $ret["DATA"]=array(array(1, "Public", 1));    
        $ret["ROWMETADATA"][0] = array("permissions"=>"R");
        while($row = mysql_fetch_array($result)){    
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['group_id'], $row['name'], $row['locked']);
        }
	    $ret["ROWMETADATA"][count($ret["DATA"])] = array("permissions"=>"R");
        $ret["DATA"][count($ret["DATA"])] = array(3, "Administrators", 1);
        
        return $ret;
    }
    function setGroups($newData, $context){
        global $current_user;
        if(!$current_user->canWritePermission("aurora_groups"))
            return $data;
        
        
        $data = $newData["DATA"];
        $existingGroups = getGroups($context);
        $existingGroups = $existingGroups["DATA"];
        $removeIds = array();
        for($i=0;$i<count($existingGroups);$i++){
        	 if($existingGroups[$i][0]==1||$existingGroups[$i][0]==3){
        		$removeIds[count($removeIds)] = $i;
        	} 
        }
        for($i=0;$i<count($removeIds);$i++){
        	unset($existingGroups[$removeIds[$i]]);	
        }   
        compareAndDeleteRows("groups", "group_id", 0, $existingGroups, $data);  
        foreach($data as $group){
            $name = $group[1];
            $locked = $group[2];
            $group_id = $group[0];
            if($group_id==1||$group_id==3)
                continue;
            $group_id = ($group_id=="undefined")?'NULL':$group_id;  
            mysql_query("INSERT INTO `groups` (`group_id`, `name`, `locked`) VALUES ($group_id, '$name', $locked) ON DUPLICATE KEY UPDATE `name`='$name', `locked`=$locked;", getPrimarySQLConnection());
        }
        return getGroups($context);
    }

    function getUsers($context){
         global $current_user;
         global $NO_PERMISSION; 
        if(!$current_user->canReadPermission("aurora_users")){
            return $NO_PERMISSION;
        }
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"uid", 'display'=>"user_id", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"firstname", 'display'=>"First Name", 'type'=>"string", 'visible'=>true, 'readonly'=>false, 'width'=>75),
                array("reference"=>"lastname", 'display'=>"Last Name", 'type'=>"string", 'visible'=>true, 'readonly'=>false, 'width'=>75),
                array("reference"=>"username", 'display'=>"Username", 'type'=>"string", 'visible'=>true, 'readonly'=>false, 'width'=>75),
                array("reference"=>"email", 'display'=>"Email Address", 'type'=>"string", 'visible'=>true, 'readonly'=>false, 'width'=>115),
                array("reference"=>"password", 'display'=>"Password", 'type'=>"string", 'visible'=>true, 'readonly'=>false, 'width'=>75),
                array("reference"=>"group", 'display'=>"Group", 'type'=>"auroraGroup", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"validated", 'display'=>"Validated", 'type'=>"boolean", 'visible'=>true, 'readonly'=>false, 'width'=>20),
                array("reference"=>"gender", 'display'=>"Gender", 'type'=>"gender", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"dob", 'display'=>"Date Of Birth", 'type'=>"date", 'visible'=>true, 'readonly'=>false, 'width'=>75)
        );
        //$ret["COLUMNMETADATA"][5] = array("permissions"=>"R");
        $result = mysql_query("SELECT * FROM `users` ORDER BY `firstname` ASC;", getPrimarySQLConnection());
        $ret["DATA"]=array();    
        while($row = mysql_fetch_array($result))
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['user_id'], $row['firstname'], $row['lastname'], $row['username'], $row['email'],$row['password'], (int)$row['group_id'], (boolean)$row['validated'], $row['gender'], $row['dob']);
        return $ret;
    }
    
    function setUsers($newData, $context){
        global $current_user;
        if(!$current_user->canWritePermission("aurora_users"))
            return $data;
            
        $columns = $newData["COLUMNS"];    
        $data = $newData["DATA"];
        $existingUsers = getUsers($context);
        $existingUsers = $existingUsers["DATA"];
        compareAndDeleteRows("users", "user_id", 0, $existingUsers, $data);
        for($i=0; $i<count($data);$i++){
            $setting = $data[$i];
            $user_id = mysql_escape_string($setting[0]);
            $user_id = ($user_id=="undefined")?'NULL':$user_id;
            $firstname = mysql_escape_string($setting[1]);
            $lastname = mysql_escape_string($setting[2]);
            $username = mysql_escape_string($setting[3]);
            $emailaddress = mysql_escape_string($setting[4]);
            $password = mysql_escape_string($setting[5]); 
            $group_id = mysql_escape_string($setting[6]);
            $validated = mysql_escape_string($setting[7]);
            $validated = ($validated=="false")?0:($validated=="true")?1:$validated;
            if($validated=="false")
                $validated = 0;
                
            if(!(!empty($password) && preg_match('/^[a-f0-9]{32}$/', $password))){
                $password = md5($password);    
            }
            $gender = mysql_escape_string($setting[8]);
            $dob = mysql_escape_string($setting[9]);
            $query = "INSERT INTO `users` (`firstname`,`lastname`,`username`,`email`,`password`, `group_id`, `validated`, `gender`, `dob`, `user_id`) VALUES ('$firstname', '$lastname', '$username', '$emailaddress','$password', $group_id, $validated, '$gender', '$dob', $user_id) ON DUPLICATE KEY UPDATE `firstname`='$firstname',`lastname`='$lastname',`username`='$username',`email`='$emailaddress',`password`='$password',`group_id`=$group_id,`validated`=$validated,`gender`='$gender', `dob`='$dob';";
            mysql_query($query, getPrimarySQLConnection());        
        }
        return getUsers($context);
    }
    
   
    function getPlugins($context){
        global $NO_PERMISSION; 
        global $current_user;
        if(!$current_user->canReadPermission("aurora_plugins"))
            return $NO_PERMISSION;    
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
            array("reference"=>"pluginId", "display"=>"Id", "type"=>"int", "visible"=>false, 'readonly'=>true),
            array("reference"=>"reference", "display"=>"Reference", "type"=>"string", "visible"=>true, 'readonly'=>true),
            array("reference"=>"enabled", "display"=>"Enabled", "type"=>"boolean", "visible"=>true, 'readonly'=>false)
        );
        $result = mysql_query("SELECT * FROM `plugins` ORDER BY `reference` ASC;", getPrimarySQLConnection());
        $ret["DATA"]=array();
        while($row = mysql_fetch_array($result))
            $settings[count($settings)] = array((int)$row['id'], $row['reference'], (boolean)$row['enabled']);
        $ret["DATA"] = $settings;
        return $ret;
    }
    function setPlugins($data, $context){
        global $current_user;
        if(!$current_user->canWritePermission("aurora_plugins"))  
            return $data;
        $settings = $data["DATA"];
        $existingPlugins = getPlugins($context);
        compareAndDeleteRows("plugins", "id", 0, $existingPlugins["DATA"], $settings);
        for($i=0; $i<count($settings);$i++){
            $setting = $settings[$i];
            $id = mysql_escape_string($setting[0]);
            $id = ($id=="undefined"||$id=="")?'NULL':$id; 
            $reference = mysql_escape_string($setting[1]);
            
            $enabled = mysql_escape_string($setting[2]);
            $enabled = ($enabled=='true'||$enabled=='1')?1:0;
            $query = "INSERT INTO `plugins` (`id`, `reference`, `enabled`) VALUES($id, '$reference', $enabled) ON DUPLICATE KEY UPDATE `reference`='$reference',`enabled`=$enabled;";
            mysql_query($query, getPrimarySQLConnection()); 
            /*if($reference=="aviat.csrDemo"){
                echo $query."\n";
                echo mysql_error(); 
                exit;   
            } */
        }
          return getPlugins($context);
    } 
    
    
    
    

    
    
    function getAuroraPermissions($context){
        global $current_user;
        global $NO_PERMISSION; 
        if(!$current_user->canReadPermission("aurora_permissions"))
            return $NO_PERMISSION;
    
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"permissionRegisterId", 'display'=>"ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"name", 'display'=>"Name", 'type'=>"string", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"description", "display"=>"Action", "type"=>"string", "visible"=>true, 'readonly'=>true),
                array("reference"=>"pluginId", 'display'=>"Plugin Id", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"type", 'display'=>"Type", 'type'=>"string", 'visible'=>false, 'readonly'=>true) 
        ); 
        
        $result = mysql_query("SELECT * FROM `permission_register` ORDER BY `permissionRegisterId` ASC;", getPrimarySQLConnection());
        $ret["DATA"]=array();
        while($row = mysql_fetch_array($result))
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['permissionRegisterId'], $row['name'],$row['description'], (int)$row['pluginId'], $row['type']);
        return $ret;
    }
    function setAuroraPermissions($data, $context){
        global $current_user;    
          return getAuroraBehaviours($context);
    }
    
    
    function getBPermmissions($context){
        global $current_user;
        global $NO_PERMISSION;                                                       
        if(!$current_user->canReadPermission("aurora_permissions_set"))
            return $NO_PERMISSION;
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(                
                array("reference"=>"permissionId", 'display'=>"ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"permissionRegisterId", 'display'=>"Behaviour ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"groupId", 'display'=>"Group ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"userId", 'display'=>"User ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"permissions", 'display'=>"Permissions", 'type'=>"string", 'visible'=>true, 'readonly'=>true)
        ); 
        
        $result = mysql_query("SELECT * FROM `permissions` ORDER BY `permissionRegisterId` ASC;", getPrimarySQLConnection());
        $ret["DATA"]=array();
        while($row = mysql_fetch_array($result))
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['permissionId'], (int)$row['permissionRegisterId'], (int)$row['group_id'], (int)$row['user_id'], $row['permissions']);
        return $ret;
    }
    function setBPermmissions($data, $context){
        global $current_user;
        /*for($i=0;$i<count($data["DATA"]);$i++){
            echo $data["DATA"][$i][0]."\n";
        }
        exit;*/
        if(!$current_user->canWritePermission("aurora_permissions_set"))
            return $data;
        $settings = $data["DATA"];
        $existingPlugins = getBPermmissions($context);
        $existingPlugins = $existingPlugins["DATA"]; 
        for($i=0; $i<count($settings);$i++){
            $setting = $settings[$i];
            $permissionId = mysql_escape_string($setting[0]);
            $permissionId = ($permissionId=="undefined")?'NULL':$permissionId; 
            $behaviourId = mysql_escape_string($setting[1]);
            $groupId = mysql_escape_string($setting[2]);  
            $userId = mysql_escape_string($setting[3]); 
            $userId = ($userId=="undefined")?'NULL':$userId; 
            $permissions = mysql_escape_string($setting[4]); 
            $query = "INSERT INTO `permissions` (`permissionId`, `permissionRegisterId`, `group_id`, `user_id`, `permissions`) VALUES($permissionId, $behaviourId, $groupId, $userId, '$permissions') ON DUPLICATE KEY UPDATE `permissions`='$permissions'";
            if(!($groupId==3&&($behaviourId==2||$behaviourId==4||$behaviourId==5))){   
                  //echo $query;
                mysql_query($query, getPrimarySQLConnection());    
            }
        }   
        //exit;
          return getBPermmissions($context);
    } 
    ?>
