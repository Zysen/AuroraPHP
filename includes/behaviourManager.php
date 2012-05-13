<?php
    class BehaviourManager {
        private $_behaviours;
        public function __construct(){
           
        }
        public function registerBehaviour($name, $get=null, $set=null){
            if($get!=null)
            $this->_behaviours[$name]['get'] = $get;
            if($set!=null)
            $this->_behaviours[$name]['set'] = $set;
        }
        public function setBehaviourValue($behaviour, $context, $value){
            if(array_key_exists('set', $this->_behaviours[$behaviour])){
                $callback = $this->_behaviours[$behaviour]['set'];
                return $callback($value, $context);
            }
        }                                                                                     
        public function getBehaviourValue($behaviour, $context){
            if(array_key_exists('get', $this->_behaviours[$behaviour])){
                $callback = $this->_behaviours[$behaviour]['get'];
                return $callback($context);
            }
            return "";
        }
        public function getBehaviours(){
            $behaviours = array_key_exists("database", $_POST)?$_POST['database']:$_GET['database']; 
            $returnArray=Array();
            foreach ($behaviours as $reactiveData){
                $bKey = $reactiveData['key'];
                $context = $reactiveData['context'];
                $setValue = array_key_exists("data", $reactiveData)&&$reactiveData['data']!='null';
                if($setValue){             
                    $value = $this->setBehaviourValue($bKey,$context, $reactiveData['data']);
                    $hash = md5(json_encode($reactiveData['data']));
                    $newHash = md5(json_encode($value));
                }
                else{
                    $value = $this->getBehaviourValue($bKey, $context);
                    $newHash = md5(json_encode($value));
                    $hash = array_key_exists("hash", $reactiveData)?$reactiveData['hash']:null;
                }
                $reactiveData['data'] = ($hash!=$newHash)?$value:"";
                $reactiveData['hash'] = $newHash;
                if($hash!=$newHash || $setValue)
                    $returnArray[$bKey][$context] = $reactiveData;              
            }                
            return json_encode($returnArray);
        }
    }
?>
