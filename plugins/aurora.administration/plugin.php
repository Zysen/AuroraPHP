<?php
    $page->registerScript("plugins/aurora.administration/script.js");
    $page->registerCSS("plugins/aurora.administration/style.css");
    $behaviourManager->registerBehaviour("aurora_groups", "getGroups", "setGroups"); 
    function getGroups($context){
        global $connection;
        global $current_user;
        if(!$current_user->canReadBehaviour("aurora_groups"))
            return array();
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"groupId", 'display'=>"ID", 'type'=>"int", 'visible'=>false, 'readonly'=>true),
                array("reference"=>"group", 'display'=>"Group", 'type'=>"string", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"locked", 'display'=>"Locked", 'type'=>"boolean", 'visible'=>false, 'readonly'=>true)
        );
        
        $result = mysql_query("SELECT * FROM `groups` WHERE `group_id`!=1 AND `group_id`!=3;", $connection);
        $ret["DATA"]=array(array(1, "Public", 1));    
        while($row = mysql_fetch_array($result)){
            if($row['group_id']=="1"||$row['group_id']==3)
                $ret["ROWMETADATA"][count($ret["DATA"])] = array("permissions"=>"R");    
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['group_id'], $row['name'], $row['locked']);
        }
	$ret["DATA"][count($ret["DATA"])] = array(3, "Administrators", 1);
        return $ret;
    }
    function setGroups($newData, $context){
        global $connection;
        global $current_user;
        if(!$current_user->canWriteBehaviour("aurora_groups"))
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
            if($group_id=="1"||$group_id=="3")
                continue;
            $group_id = ($group_id=="undefined")?'NULL':$group_id;  
            mysql_query("INSERT INTO `groups` (`group_id`, `name`, `locked`) VALUES ($group_id, '$name', $locked) ON DUPLICATE KEY UPDATE `name`='$name', `locked`=$locked;", $connection);
        }
        return getGroups($context);
    }
    $behaviourManager->registerBehaviour("aurora_users", "getUsers", "setUsers");
    function getUsers($context){
         global $connection;
         global $current_user;
        if(!$current_user->canReadBehaviour("aurora_users")){
            return array();
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
        $result = mysql_query("SELECT * FROM `users` ORDER BY `firstname` ASC;", $connection);
        $ret["DATA"]=array();    
        while($row = mysql_fetch_array($result))
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['user_id'], $row['firstname'], $row['lastname'], $row['username'], $row['email'],$row['password'], (int)$row['group_id'], (boolean)$row['validated'], $row['gender'], $row['dob']);
        return $ret;
    }
    
    function setUsers($newData, $context){
        global $connection;
        global $current_user;
        if(!$current_user->canWriteBehaviour("aurora_users"))
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
            mysql_query($query, $connection);        
        }
        return getUsers($context);
    }
    
    $behaviourManager->registerBehaviour("aurora_plugins", "getPlugins", "setPlugins");
    function getPlugins($context){
        
        global $connection;
        global $current_user;
        if(!$current_user->canReadBehaviour("aurora_plugins"))
            return array();
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
            array("reference"=>"pluginId", "display"=>"Id", "type"=>"int", "visible"=>false, 'readonly'=>true),
            array("reference"=>"reference", "display"=>"Reference", "type"=>"string", "visible"=>true, 'readonly'=>false),
            array("reference"=>"enabled", "display"=>"Enabled", "type"=>"boolean", "visible"=>true, 'readonly'=>false)
        );
        $result = mysql_query("SELECT * FROM `plugins` ORDER BY `reference` ASC;", $connection);
        $ret["DATA"]=array();
        while($row = mysql_fetch_array($result))
            $settings[count($settings)] = array((int)$row['id'], $row['reference'], (boolean)$row['enabled']);
        $ret["DATA"] = $settings;
        return $ret;
    }
    function setPlugins($data, $context){
        global $connection;
        global $current_user;
        if(!$current_user->canWriteBehaviour("aurora_plugins"))  
            return $data;
        $settings = $data["DATA"];
        $existingPlugins = getPlugins($context);
        compareAndDeleteRows("plugins", "id", 0, $existingPlugins["DATA"], $settings);
        for($i=0; $i<count($settings);$i++){
            $setting = $settings[$i];
            $id = mysql_escape_string($setting[0]);
            $id = ($id=="undefined")?'NULL':$id; 
            $reference = mysql_escape_string($setting[1]);
            $enabled = mysql_escape_string($setting[2]);
            $enabled = ($enabled=='true'||$enabled=='1')?1:0;
            $query = "INSERT INTO `plugins` (`id`, `reference`, `enabled`) VALUES($id, '$reference', $enabled) ON DUPLICATE KEY UPDATE `reference`='$reference',`enabled`=$enabled;";
            mysql_query($query, $connection); 
        }
          return getPlugins($context);
    } 
    
    
    
    

    
    $behaviourManager->registerBehaviour("aurora_behaviours", "getAuroraBehaviours", "setAuroraBehaviours");
    function getAuroraBehaviours($context){
        global $connection;
        global $current_user;
        if(!$current_user->canReadBehaviour("aurora_behaviours"))
            return array();
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(
                array("reference"=>"behaviourId", 'display'=>"ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"name", 'display'=>"Name", 'type'=>"string", 'visible'=>true, 'readonly'=>false),
                array("reference"=>"pluginId", 'display'=>"Plugin Id", 'type'=>"int", 'visible'=>true, 'readonly'=>true)
        ); 
        
        $result = mysql_query("SELECT * FROM `behaviour_register` ORDER BY `behaviourId` ASC;", $connection);
        $ret["DATA"]=array();
        while($row = mysql_fetch_array($result))
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['behaviourId'], $row['name'], (int)$row['pluginId']);
        return $ret;
    }
    function setAuroraBehaviours($data, $context){
        global $connection;
        global $current_user;    
          return getAuroraBehaviours($context);
    }
    
    $behaviourManager->registerBehaviour("aurora_behaviour_permissions", "getBPermmissions", "setBPermmissions");
    function getBPermmissions($context){
        global $connection;
        global $current_user;
        if(!$current_user->canReadBehaviour("aurora_behaviour_permissions"))
            return array();
        
        $ret = getEmptyTableDef();
        $ret["COLUMNS"] = array(                
                array("reference"=>"bPermissionId", 'display'=>"ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"behaviourId", 'display'=>"Behaviour ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"groupId", 'display'=>"Group ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"userId", 'display'=>"User ID", 'type'=>"int", 'visible'=>true, 'readonly'=>true),
                array("reference"=>"permissions", 'display'=>"Permissions", 'type'=>"string", 'visible'=>true, 'readonly'=>true)
        ); 
        
        $result = mysql_query("SELECT * FROM `behaviour_permissions` ORDER BY `behaviourId` ASC;", getPrimarySQLConnection());
        $ret["DATA"]=array();
        while($row = mysql_fetch_array($result))
            $ret["DATA"][count($ret["DATA"])] = array((int)$row['behaviour_permissionId'], (int)$row['behaviourId'], (int)$row['group_id'], (int)$row['user_id'], $row['permissions']);
        return $ret;
    }
    function setBPermmissions($data, $context){
        global $connection;
        global $current_user;
        if(!$current_user->canWriteBehaviour("aurora_behaviour_permissions"))
            return $data;
        
        $settings = $data["DATA"];
        $existingPlugins = getBPermmissions($context);
        $existingPlugins = $existingPlugins["DATA"];
        //compareAndDeleteRows("behaviour_permissions", "behaviour_permissionId", 0, $existingPlugins, $data);  
        for($i=0; $i<count($settings);$i++){
            $setting = $settings[$i];
            $permissionId = mysql_escape_string($setting[0]);
            $permissionId = ($permissionId=="undefined")?'NULL':$permissionId; 
            $behaviourId = mysql_escape_string($setting[1]);
            $groupId = mysql_escape_string($setting[2]);  
            $userId = mysql_escape_string($setting[3]); 
            $userId = ($userId=="undefined")?'NULL':$userId; 
            $permissions = mysql_escape_string($setting[4]); 
            $query = "INSERT INTO `behaviour_permissions` (`behaviour_permissionId`, `behaviourId`, `group_id`, `user_id`, `permissions`) VALUES($permissionId, $behaviourId, $groupId, $userId, '$permissions') ON DUPLICATE KEY UPDATE `permissions`='$permissions'";
            
            
           mysql_query($query, $connection); 
//echo $query."\n";
          //  echo mysql_error();
            
        }   
            
          return getBPermmissions($context);
    } 
    
    
    
    
    
    
    
    
    
    
    ?>
