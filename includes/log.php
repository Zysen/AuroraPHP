<?php
    class log {
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
  }
}
class LogLevel{
    const USER_INFO = 0;
    const USER_ERROR = 1;
    const SYSTEM_INFO = 2;
    const SYSTEM_ERROR = 3;
    const ADMIN_ERROR = 4;
}

?>
