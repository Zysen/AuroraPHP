<?php
function AuroraLog($tag, $message){
    $message = mysql_real_escape_string($message);
    mysql_query("INSERT INTO `logs` (`id`, `entry`, `tag`, `timestamp`) VALUES (NULL, '$message', '$tag',  CURRENT_TIMESTAMP);");   
}
/*    class log {
  private $_level;
  private $_message;
  private __construct($level, $message){
      self::$_level = $level;
      self::$_message = $message;
      
      switch($level){
        case LogLevel::USER_INFO{
            break;
        }
        case LogLevel::USER_ERROR{
            break;
        }
        case LogLevel::SYSTEM_INFO{
            break;
        }
        case LogLevel::SYSTEM_ERROR{
            break;
        }
        case LogLevel::ADMIN_ERROR{
            break;
        }
      }
      
      $message = mysql_real_escape_string($message);
      mysql_query("INSERT INTO `aurora`.`logs` (`id`, `entry`, `timestamp`) VALUES (NULL, '$message', CURRENT_TIMESTAMP);");
  }
}   */

class LogLevel{
    const USER_INFO = "USER_INFO";
    const USER_ERROR = "USER_ERROR";
    const SYSTEM_INFO = "SYSTEM_INFO";
    const SYSTEM_ERROR = "SYSTEM_ERROR";
    const ADMIN_ERROR = "ADMIN_ERROR";
}



?>
