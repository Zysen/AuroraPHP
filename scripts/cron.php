<?php

//Make files writable
/*set_time_limit(0);
chmodChildren("../", 777, 1);
function chmodChildren($dir, $mod, $depth){
    if($depth>=20)
        return;
    
    if ($handle = opendir($dir)) {
        while (false !== ($entry = readdir($handle))) {
            
            if ($entry != "." && $entry != "..") {
                $entry = $dir.$entry;
                echo $entry."<br />";
                if(!chmod($entry, $mod))
                    echo "Error Unable to apply permissions";
                if(is_dir($entry)){
                    chmodChildren($entry."/", $mod, $depth+1);
                }
                    
               
            }
        }
        closedir($handle);
    }
}  */
chmod_R( '..', 0666, 0777); 
function chmod_R($path, $filemode, $dirmode) {
    if (is_dir($path) ) {
        if ((!chmod($path, $dirmode)) && $path!="../"&& $path!="."&& $path!="..") {
            $dirmode_str=decoct($dirmode);
            print "Failed applying filemode '$dirmode_str' on directory '$path'\n";
            print "  `-> the directory '$path' will be skipped from recursive chmod\n<br />";
            return;
        }
        $dh = opendir($path);
        while (($file = readdir($dh)) !== false) {
            if($file != '.' && $file != '..') {  // skip self and parent pointing directories
                $fullpath = $path.'/'.$file;
                chmod_R($fullpath, $filemode,$dirmode);
            }
        }
        closedir($dh);
    } else {
        if (is_link($path)) {
            print "link '$path' is skipped\n";
            return;
        }
        if (!chmod($path, $filemode)) {
            $filemode_str=decoct($filemode);
            print "Failed applying filemode '$filemode_str' on file '$path'\n";
            return;
        }
    }
} 
?>