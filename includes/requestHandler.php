<?php
class RequestManager {
    private $_requests=Array();
    public function __construct(){
           
    }
    public function registerRequestHandler($name, $callback){
        $this->_requests[$name] = $callback;
    }
    public function handlerExists($name){
        return (array_key_exists($name, $this->_requests));
    }
    public function getHandler($name){
        if($this->handlerExists($name))
            return  $this->_requests[$name];
        return FALSE;
    }
}
