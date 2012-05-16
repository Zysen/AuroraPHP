<?php
function compareAndDeleteRows($table, $matchingColumnName, $matchingColumnIndex, $existingArray, $newArray){
        global $connection;
            foreach($existingArray as $i => $existingVal){
            	$match = false;
            	foreach($newArray as $c => $newVal){
                	if($newArray[$matchingColumnIndex]==$existingVal[$matchingColumnIndex]){
                        $match = true;
                        break;
                    }    
                }
                if(!$match){
                    mysql_query("DELETE FROM `$table` WHERE `$matchingColumnName`=".$existingArray[$i][$matchingColumnIndex]." LIMIT 1;", $connection);
                }    
            }  
        //}
}

function getEmptyTableDef(){
    return array("COLUMNS"=>array(), "DATA"=>array(), "TABLEMETADATA"=>array(), "ROWMETADATA"=>array(), "CELLMETADATA"=>array(), "COLUMNMETADATA"=>array());
}

function minifyCSS($buffer){
  /* remove comments */
        $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
        /* remove tabs, spaces, newlines, etc. */
        $buffer = str_replace(array("\r\n","\r","\n","\t",'  ','    ','     '), '', $buffer);
        /* remove other spaces before/after ; */
        $buffer = preg_replace(array('(( )+{)','({( )+)'), '{', $buffer);
        $buffer = preg_replace(array('(( )+})','(}( )+)','(;( )*})'), '}', $buffer);
        $buffer = preg_replace(array('(;( )+)','(( )+;)'), ';', $buffer);
        return $buffer;
  }
function findDependencyDepth($array, $search, $depth){
    $depCount = count($array[$search]);
    if($depCount==0)
        return $depth;
    else{
        $maxDepth = 0;
        for($i=0;$i<$depCount;$i++){
            $dependency = $array[$search][$i];
            $maxDepth = max($maxDepth, findDependencyDepth($array, $dependency, $depth+1)); 
        }
        return $maxDepth;
    }
}
function getCleanPathVariables(){
    if(array_key_exists("PATH_INFO", $_SERVER)){
        $path = explode("/",$_SERVER['PATH_INFO']);
        if(count($path)>1){
            $args=array();
            $first = true;
            foreach($path as $arg){
                if($first)
                    $first = false;
                else if($arg!="")
                    $args[count($args)] = $arg;    
            }
            return $args;
        }                               
    }
    return false;
}
function getRestOfPath(){
    global $path;
    $new = "";
    foreach($path as $pathBit)
        $new.= $pathBit."/";
    return trim($new, "/");
}
function createGuestUser(){
        $current_user = new AuroraUser();
        $current_user->set_username("Guest");
        $current_user->set_firstname("Guest");
        $current_user->set_group_id("1");
        return $current_user;
    }
function getNoPageTemplate($pageId){
    global $connection;
    global $settings;
    $themeId = $settings['aurora_theme'];
            $result = mysql_query("SELECT `theme_noPage` FROM `themes` WHERE `theme_id`=$themeId LIMIT 1;", $connection);
            $row = mysql_fetch_array($result);
            return array("content"=>$row['theme_noPage'], "title"=>$pageId, "user_id"=>-2, "noPage"=>true);
}
function getNoPermissionTemplate(){
    global $connection;
    global $settings;
    $themeId = $settings['aurora_theme'];
            $result = mysql_query("SELECT `theme_noPermission` FROM `themes` WHERE `theme_id`=$themeId LIMIT 1;", $connection);
            $row = mysql_fetch_array($result);
            return array("content"=>$row['theme_noPermission'], "title"=>"No Permission", "user_id"=>-2);
}

function minifyJSFile($inputFile, $outputFile, $append=false){
    //require_once('../libraries/jsminplus.php');
    
    $data = JSMinPlus::minify(file_get_contents($inputFile,($append?FILE_APPEND:null)));
    file_put_contents($outputFile, $data);
}
function minifyCSSFile($inputFile, $outputFile, $append=false){
    //require_once('../libraries/minifyCss.php');
    $data = minifyCSS(file_get_contents($inputFile),($append?FILE_APPEND:null));
    file_put_contents($outputFile, $data);
}
function removeFilesWithPrefix($prefix, $path="."){
    if ($handle = opendir($path)) {
    while (false !== ($file = readdir($handle))) {
        if(str_prefix($file, strlen($prefix))==$prefix)
            unlink($path.$file);
    }
    closedir($handle);
}
}
function str_prefix($str, $n=1){
    $ns = "";
    for ($x=0;$x<$n;$x++){
        if($x<strlen($str))
            $ns.=$str[$x];
    } 
    return $ns; 
}
function getPage($page){
    $pageData = getPageData($page);
if($pageData==FALSE)
    $pageData[1] = getNoPageTemplate();
    return $pageData;
}
function extractHtmlContent($input){
    libxml_use_internal_errors(true);
    $dom = new SmartDOMDocument;
    $dom->loadHTML($input);
    $dom->formatOutput = true;
    $dom->preserveWhiteSpace = false;
    $dom->substituteEntities = false;
    $divs = $dom->getElementsByTagName("div");
    $pageContent="";
    foreach ($divs as $div){
        $attId = str_replace("\\\"", "", $div->getAttribute('id')."");
        if($attId=="content"){
            foreach($div->childNodes as $child)
                $div->removeChild($child);
            $pageContent = $div->textContent;
        }
    }
    return array(template=>$dom->saveHTMLExact(), content=>$pageContent); 
}
function injectContent($template, $content){
    if(strlen($content)==0)
        return $template;
    libxml_use_internal_errors(true);
    $dom = new SmartDOMDocument();
    $dom->loadHTML($template);
    $div = $dom->getElementById("content");
    $div->appendChild($dom->createTextNode($content));
    $html = $dom->saveHTMLExact();
    return $html;
}
function custom_encrypt($text, $key){
    if(function_exists("mcrypt_get_iv_size")){ 
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
       $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
       return mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $text, MCRYPT_MODE_ECB, $iv);
    }
    else
        return simple_crypt($text, $key); 
}
function custom_decrypt($text, $key){
    if(function_exists("mcrypt_get_iv_size")){ 
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
       $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
       return mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $text, MCRYPT_MODE_ECB, $iv);
    }
    else{
        return simple_crypt($text, $key);
    }
}
function simple_crypt($str,$ky=''){
if($ky=='')return $str;
$ky=str_replace(chr(32),'',$ky);
if(strlen($ky)<8)exit('key error');
$kl=strlen($ky)<32?strlen($ky):32;
$k=array();for($i=0;$i<$kl;$i++){
$k[$i]=ord($ky{$i})&0x1F;}
$j=0;for($i=0;$i<strlen($str);$i++){
$e=ord($str{$i});
$str{$i}=$e&0xE0?chr($e^$k[$j]):chr($e);
$j++;$j=$j==$kl?0:$j;}
return $str;
} 
function getBetween($str, $start, $end, $keepstart, $keepend, $array=Array()){
    if ($start){ // Start position
          $startPos = strpos($str, $start);
          if ($keepstart == 0 && $startPos > -1)
            $startPos += strlen($start);
    }
    if ($end){  // End position
        $endPos = strpos($str, $end, $startPos);
        if ($keepend == 1 && $endPos > -1)
           $endPos += strlen($end);
    }
    if ($startPos > -1 && $endPos > -1){
        if($end)
            $array[count($array)] = substr($str, $startPos, $endPos - $startPos);
        else
            $array[count($array)] = substr($str, $startPos);
        return getBetween(substr($str, $endPos), $start, $end, $keepstart, $keepend, $array);
    }
    return $array;
}
class TimeFormat
{
    const HOUR24 = 0;
    const HOUR12 = 1;
}
class DateFormat
{
    const SHORT_ENGLISH = 0;
}
function TimestampToEngDatetime($Tstamp, $dateFormat=DateFormat::SHORT_ENGLISH, $timeFormat=TimeFormat::HOUR12) {
    $date = "";
    $time = "";
    $Tstamp = str_replace(":", "", $Tstamp);
    $Tstamp = str_replace("-", "", $Tstamp);
    $Tstamp = str_replace(" ", "", $Tstamp);
    if(substr($Tstamp,0,8) != "00000000"){
        $month = substr($Tstamp,4,2);
        switch($month){
            case "01":{
                $month = "January";
                break;
            }
            case "02":{
                $month = "February";
                break;
            }
            case "03":{
                $month = "March";
                break;
            }
            case "04":{
                $month = "April";
                break;
            }
            case "05":{
                $month = "May";
                break;
            }
            case "06":{
                $month = "June";
                break;
            }
            case "07":{
                $month = "July";
                break;
            }
            case "08":{
                $month = "August";
                break;
            }
            case "09":{
                $month = "September";
                break;
            }
            case "10":{
                $month = "October";
                break;
            }
            case "11":{
                $month = "November";
                break;
            }
            case "12":{
                $month = "December";
                break;
            }
            default:{
                if($tm[0] != "00" && $tm[1] != "00" && substr($Tstamp,6,2) == "00" && substr($Tstamp,0,4) == "00"){
                    $page->addtomessage("Date Conversion Error.");
                    return "";
                }
                break;
            }
        }
        $date = substr($Tstamp,6,2) . " " . $month . " " . substr($Tstamp,0,4);
    }
    $ampm = " AM";
    $tm[0] = substr($Tstamp,8,2);
    $tm[1] = substr($Tstamp,10,2);
    if($tm[0] != "00"){ 
        if($timeFormat==TimeFormat::HOUR12){
            if($tm[0]>12){
                $tm[0] -= 12;
                $ampm = " PM";
            }
            $time = join($tm,":").$ampm;
        }    
        else if($timeFormat==TimeFormat::HOUR24)
            $time = " ".join($tm,":");
    }
   return array('date'=>$date, 'time'=>$time);
}
?>