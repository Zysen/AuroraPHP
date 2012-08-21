rm -f advancedscan.txt;
#nmap -A -sR -oX - 192.168.1.* > /var/www/advancedscan.txt;  
nmap -A -oX - 192.168.1.* > /var/www/plugins/aurora.network/advancedscan.txt;
wget -O /dev/null http://glenrd.dontexist.net/plugins/aurora.network/cron.php?mode=advancedscan;