Aurora
======

Aurora is a web framework that follows the FRP programming paradigm. It is modeled on the layout and functionality of a Wiki but it more of an application framework. It is modular, highly scalable and uses a page widget view model. There are modules for ckEditor jQuery, jQuery UI and Closure library. Aurora is optionally compiled with Closure Compiler.

Installation:

    1) Copy files to your web directory.
    2) rename includes/mysqldata-example.php to mysqldata.php, open this file and enter the target database details
    3) Import aurora.sql however you like, i usually use phpmyadmin.
    4) Browse the SQL database and open the settings table. Find the script_path row and change this to the base URL of your project.
    5) Browse the SQL database and open the users table. Create a new user for yourself with a group of 3 make sure you MD5 the password. In phpmyadmin there is an MD5 option in the functions drop down.
    6) Open a web browser and load $scriptPath$/request/recompile.
    7) Open a browser to $scriptPath$ and your done