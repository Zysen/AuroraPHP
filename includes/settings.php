<?php

         function loadSettings(){
             global $settings;
             updateSettings();
            $settings = $_SESSION['SETTINGS']; 
         }
         function updateSettings(){
             
                 $data;
                 $result = mysql_query("SELECT * FROM `settings`");
                 while($row = mysql_fetch_array($result)){          
                    $name = $row['name'];
                    $value = $row['value'];
                    $data[$name] = $value; 
                 }
                 if(!isset($_SESSION['SETTINGS']))
                 $_SESSION['SETTINGS']=$data;
        }      
        loadSettings(); 
?>
