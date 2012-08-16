nmap -sP -oX - 192.168.1.* > /var/www/plugins/aurora.network/onlinehosts.txt; 
wget -O /dev/null http://glenrd.dontexist.net/plugins/aurora.network/cron.php?mode=ping;