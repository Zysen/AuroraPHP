-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 06, 2012 at 10:52 PM
-- Server version: 5.1.62
-- PHP Version: 5.3.6-13ubuntu3.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `minecraft_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `aurora_pathThemes`
--

CREATE TABLE IF NOT EXISTS `aurora_pathThemes` (
  `pathThemeId` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(200) NOT NULL,
  `theme_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  PRIMARY KEY (`pathThemeId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `aurora_pathThemes`
--

INSERT INTO `aurora_pathThemes` (`pathThemeId`, `path`, `theme_id`, `title`) VALUES
(1, 'bemis', 7, 'Bemis'),
(2, 'minecraft', 6, 'Ultimate Minecraft!'),
(4, 'konfidentkidz', 9, 'Konfident Kids Behavioural Tracking System'),
(5, 'konfidentkids', 9, 'Konfident Kids');

-- --------------------------------------------------------

--
-- Table structure for table `behaviour_permissions`
--

CREATE TABLE IF NOT EXISTS `behaviour_permissions` (
  `behaviour_permissionId` int(11) NOT NULL AUTO_INCREMENT,
  `behaviourId` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `permissions` varchar(2) NOT NULL,
  UNIQUE KEY `behaviour_permissionId` (`behaviour_permissionId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `behaviour_permissions`
--

INSERT INTO `behaviour_permissions` (`behaviour_permissionId`, `behaviourId`, `group_id`, `user_id`, `permissions`) VALUES
(1, 1, 3, NULL, 'RW'),
(2, 2, 3, NULL, 'RW'),
(3, 3, 3, NULL, 'RW'),
(4, 1, 2, NULL, 'R'),
(5, 4, 3, NULL, 'RW'),
(6, 5, 3, NULL, 'RW');

-- --------------------------------------------------------

--
-- Table structure for table `behaviour_register`
--

CREATE TABLE IF NOT EXISTS `behaviour_register` (
  `behaviourId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `pluginId` int(11) NOT NULL,
  PRIMARY KEY (`behaviourId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `behaviour_register`
--

INSERT INTO `behaviour_register` (`behaviourId`, `name`, `pluginId`) VALUES
(1, 'aurora_users', 66),
(2, 'aurora_groups', 66),
(3, 'aurora_plugins', 66),
(4, 'aurora_behaviours', 66),
(5, 'aurora_behaviour_permissions', 66);

-- --------------------------------------------------------

--
-- Table structure for table `chatroom_messages`
--

CREATE TABLE IF NOT EXISTS `chatroom_messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `context` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'owner',
  PRIMARY KEY (`message_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `chatroom_messages`
--

INSERT INTO `chatroom_messages` (`message_id`, `message`, `timestamp`, `context`, `user_id`) VALUES
(1, 'Hello lalalmkjlsd', '2011-10-27 01:14:29', 'chat', 1),
(2, 'jfsjdklsjkd;lsk;', '2011-10-27 01:14:37', 'chat', 2),
(3, 'asdfasdf', '2011-11-03 03:12:36', 'chat', -1),
(4, 'sdfsdfs', '2011-11-04 00:40:05', 'chat', 1),
(5, 'gdfgdfgdfgdfg', '2011-11-04 00:40:52', 'chat', 2);

-- --------------------------------------------------------

--
-- Table structure for table `core_permissions`
--

CREATE TABLE IF NOT EXISTS `core_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL DEFAULT '0',
  `reference` varchar(30) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `core_permissions`
--

INSERT INTO `core_permissions` (`id`, `group_id`, `reference`) VALUES
(1, 1, 'login'),
(2, 2, 'logout'),
(3, 3, 'logout'),
(4, 3, 'admin'),
(5, 1, 'forgotpassword'),
(6, 5, 'logout'),
(7, 1, 'validation');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL DEFAULT '',
  `locked` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `name`, `locked`) VALUES
(1, 'Public', 1),
(2, 'Moderators', 1),
(3, 'Administrators', 1);

-- --------------------------------------------------------

--
-- Table structure for table `imagegallery_galleries`
--

CREATE TABLE IF NOT EXISTS `imagegallery_galleries` (
  `imageGallery_galleryId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `user_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`imageGallery_galleryId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `imagegallery_galleries`
--

INSERT INTO `imagegallery_galleries` (`imageGallery_galleryId`, `title`, `user_id`, `timestamp`) VALUES
(1, 'Some Gallery', 1, '2011-11-13 03:52:00');

-- --------------------------------------------------------

--
-- Table structure for table `imagegallery_images`
--

CREATE TABLE IF NOT EXISTS `imagegallery_images` (
  `imageGallery_imageId` int(11) NOT NULL AUTO_INCREMENT,
  `caption` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `imageGallery_galleryId` int(11) NOT NULL,
  `upload_id` int(11) NOT NULL,
  PRIMARY KEY (`imageGallery_imageId`),
  UNIQUE KEY `upload_id` (`upload_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `imagegallery_images`
--

INSERT INTO `imagegallery_images` (`imageGallery_imageId`, `caption`, `user_id`, `timestamp`, `imageGallery_galleryId`, `upload_id`) VALUES
(2, '', 1, '2011-11-24 00:37:14', 1, 2),
(3, '', 1, '2011-11-24 00:42:31', 1, 4),
(4, '', 1, '2011-11-24 00:45:35', 1, 6);

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entry` longtext NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `entry`, `timestamp`) VALUES
(2, 'Array\n(\n)\n', '2012-01-06 04:56:15');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE IF NOT EXISTS `pages` (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL DEFAULT '',
  `content` longtext CHARACTER SET ascii NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`page_id`),
  FULLTEXT KEY `content` (`content`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=104 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`page_id`, `title`, `content`, `user_id`) VALUES
(1, 'home', '<P style="FONT-FAMILY: verdana; COLOR: #ffffff; FONT-SIZE: 10pt">Welcome to Ultimate Minecraft!</P>\r\n<P style="FONT-FAMILY: verdana; COLOR: #ffffff; FONT-SIZE: 10pt">YOYOOYYOYOOY</P>', 1),
(21, 'login', '<div style="text-align:center;">\n	<form action="" autocomplete="off" id="loginBox" method="post" style="margin: 0 auto; width: 307px; text-align:left;">\n		<table style=" height: 176px;">\n			<tbody>\n				<tr>\n					<td style="text-align: right;">\n						Email:</td>\n					<td>\n						<input id="loginBoxEmail" name="emailAddress" size="15" tabindex="1" type="text"></td>\n				</tr>\n				<tr>\n					<td style="text-align: right;">\n						Password:</td>\n					<td>\n						<input name="password" size="15" tabindex="2" type="password"></td>\n				</tr>\n				<tr>\n					<td style="text-align: right;">\n						Remember Me?</td>\n					<td>\n						<input name="remember" tabindex="3" type="checkbox"></td>\n				</tr>\n				<tr>\n					<td>\n						&nbsp;</td>\n					<td>\n						<input name="login" tabindex="4" value="Login" type="submit"><input name="login" value="loginSubmit" type="hidden"></td>\n				</tr>\n			</tbody>\n		</table>\n	</form>\n</div>\n<p>\n	&nbsp;</p>\n', 1),
(43, 'admin', '<h2>Administration!</h2>\n<p>\n	<a href="http://glenrd.dontexist.net/admin/settings">General Settings</a></p>\n<p>\n	<a href="http://glenrd.dontexist.net/admin/users">User Management</a></p>\n<p>\n	<a href="http://glenrd.dontexist.net/admin/plugins">Plugin Management</a></p>\n', 1),
(71, 'admin/settings', '<div style="font-size: 14pt; color:#000000;font-weight: bold;">Administration!</div>\r\n<img alt="{''plugin'':''aurora''}" class="widget_webpageSettingsEditor" height="20" src="content/noWidget.png" width="50" />', 1),
(99, 'lisa', '<p>\n	lisas oage</p>\n', 1),
(72, 'factions', '<h1>\n	Factions</h1>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	&nbsp;</p>\n<p style="color:#ffffff;font-family:verdana;font-size:10pt;">\n	<strong><span style="font-size:18px;">Assassins Guild<br />\n	<span style="font-size:12px;">Setting The Standard In Not To Be Fucked With</span></span></strong></p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	<span style="color:#000000;">Based in a sweet ass Tower in the far Northwest. Membership is elite and hard to aquire but one of the many perks is free Diamond pickaxes and swords for life.</span></p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size:18px;">Leader:Mk12Dr</span></span><br />\n	&nbsp;</p>\n<p style="color:#ffffff;font-family:verdana;font-size:10pt;">\n	<strong><span style="font-size:18px;">Atlanteans<br />\n	<span style="font-size:12px;">Your Fine Supplier of Alien Technology</span></span></strong></p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	<span style="color:#000000;">Set in a giant underwater dome featuring rivers, forests and the only faction home to feature a fully functioning train station, the Atlanteans design massive feats of engineering and build large structures and circuitry design</span></p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size:18px;">Leader:ZysenNZ</span></span><br />\n	&nbsp;</p>\n<p style="color:#ffffff;font-family:verdana;font-size:10pt;">\n	<strong><span style="font-size:18px;">Rebels<br />\n	<span style="font-size:12px;">The Rebel Nation</span></span></strong></p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	&nbsp;</p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size:18px;">Leader:Takahashi_NZ</span></span></p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	&nbsp;</p>\n<p style="color:#ffffff;font-family:verdana;font-size:10pt;">\n	<strong><span style="font-size:18px;">Alchemists Guild<br />\n	<span style="font-size:12px;">Default Faction Description</span></span></strong></p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	&nbsp;</p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size:18px;">Leader:Kiakaha</span></span><br />\n	&nbsp;</p>\n<p style="color: rgb(255, 255, 255); font-family: verdana; font-size: 10pt;">\n	<br />\n	&nbsp;</p>\n', 6),
(68, 'No Page', '<div style="font-size: 14pt; color:#000000;font-weight: bold;">\n	Opps!</div>\n<p>\n	This is not the page you are looking for.</p>\n', 1),
(69, 'wiki', '<div style="font-size: 14pt; color:#000000;font-weight: bold;">\n	Wiki!</div>\n<p>\n	Welcome to the wiki!</p>\n<p>\n	&nbsp;</p>\n<p>\n	<a href="http://glenrd.dontexist.net/jWikiHome">James'' Wiki</a></p>\n', 1),
(70, 'map', '<p>\n	<iframe id="mapFrame" src="http://glenrd.dontexist.net:8123" style="position: absolute; left: 0px; top: 150px; width: 100%; height: 620px;"></iframe></p>\n<script language="text/javascript">document.getElementById("mapFrame").style.height = (screen.height-280)+''px'';</script>\n', 1),
(74, 'players', '<h1>\n	Players</h1>\n<p>\n	<img alt="{''size'': 2}" class="widget_minecraftServerPlayerList" src="content/noWidget.png" style="width: 849px; height: 1036px;" /></p>\n', 1),
(75, 'bugs', '<h1>\n	Bug Tracker</h1>\n<ul>\n	<li>\n		Double Page Render</li>\n	<li>\n		CKEditor Styles</li>\n</ul>\n', 1),
(78, 'graphs', '<img src="content/noWidget.png" class="widget_GoogleGraphGuageWidget" alt="{''deviceName'':''D0''}" />\r\n\r\n<img src="content/noWidget.png" class="widget_GooglePieChartWidget" alt="{''deviceName'':''D0''}" />\r\n\r\n<img src="content/noWidget.png" class="widget_GoogleDyGraphWidget" alt="{''deviceName'':''D0''}" />\r\n\r\n\r\n<img src="content/noWidget.png" class="widget_GoogleLineGraphWidget" alt="{''deviceName'':''D0''}" />\r\n\r\n\r\n<img src="content/noWidget.png" class="widget_GoogleAnnodatedTimeLineWidget" alt="{''deviceName'':''D0''}" />\r\n', 0),
(77, 'plc', '<table>\n	<tbody>\n		<tr>\n			<td>\n				<img alt="{''deviceName'':''D0''}" class="widget_PLCDeviceWidget" src="content/noWidget.png" style="width: 100px; height: 100px;" /></td>\n			<td>\n				&nbsp;</td>\n			<td>\n				<img class="widget_PLCPollGroups" src="content/noWidget.png" style="width: 100px; height: 100px;" /></td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n<p>\n	<img class="widget_PLCLog" src="content/noWidget.png" style="width: 100px; height: 100px;" /></p>\n', 1),
(76, 'jWikiHome', '<ol>\n	<li>\n		Step 1 configure ram drive<br />\n		<pre>\n	sudo df -f ffk 0-sd d\n</pre>\n<pre>\none two three\n</pre>\n	</li>\n	<li>\n		&nbsp;</li>\n	<li>\n		eat cheese</li>\n</ol>\n<p>\n	&nbsp;</p>\n', 3),
(80, 'bemis/dashboard', '<p>\n	<img alt="{''device'':''D10''}" class="widget_PLCContinuousDeviceDataGraph" src="content/noWidget.png"></p>\n<p>             \n	<img alt="{''device'':''D88'', ''table'':''plcGetChangeLog''}" class="widget_PLCContinuousDeviceDataGraph" src="content/noWidget.png"></p>\n<div style="width:99%;height: 480px; overflow: auto;">\n	<table style="text-align: center;" width="100%">\n		<tbody>\n			<tr>\n				<td>\n					<img alt="{''deviceAddress'':''D10'', ''daysAgo'':100, ''startTime'':''07:00:00'', ''endTime'':''15:00:00'', ''title'':''Morning Shift\\n''}" class="widget_PLCMachineStatusPieGraph" src="content/noWidget.png"></td>\n				<td>\n					<img alt="{''deviceAddress'':''D100'', ''daysAgo'':100, ''startTime'':''07:00:00'', ''endTime'':''15:00:00'', ''title'':''Morning Shift\\n''}" class="widget_PLCMachineStatusPieGraph" src="content/noWidget.png"></td>\n			</tr>\n			<tr>\n				<td>\n					<img alt="{''deviceAddress'':''D10'', ''daysAgo'':100, ''startTime'':''15:00:00'', ''endTime'':''23:00:00'', ''title'':''Evening Shift\\n''}" class="widget_PLCMachineStatusPieGraph" src="content/noWidget.png"></td>\n				<td>\n					<img alt="{''deviceAddress'':''D100'', ''daysAgo'':100, ''startTime'':''15:00:00'', ''endTime'':''23:00:00'', ''title'':''Evening Shift\\n''}" class="widget_PLCMachineStatusPieGraph" src="content/noWidget.png"></td>\n			</tr>\n			<tr>\n				<td>\n					<img alt="{''deviceAddress'':''D10'', ''daysAgo'':100, ''startTime'':''23:00:00'', ''endTime'':''07:00:00'', ''title'':''Graveyard Shift\\n''}" class="widget_PLCMachineStatusPieGraph" src="content/noWidget.png"></td>\n				<td>\n					<img alt="{''deviceAddress'':''D100'', ''startTime'':''23:00:00'', ''endTime'':''07:00:00'', ''title'':''Graveyard Shift\\n''}" class="widget_PLCMachineStatusPieGraph" src="content,%20%27daysAgo%27:100/noWidget.png"></td>\n			</tr>\n		</tbody>\n	</table>\n</div>\n', 1),
(79, 'bemis', '<div style="width:99%;height: 480px; overflow: auto;" style="border: solid 1px #F0F0F0;">\r\n<table width="100%" style="text-align: center;">\r\n<tr>\r\n<td><img src="content/noWidget.png" class="widget_PLCMachineStatusPieGraph" alt="{''deviceAddress'':''101'', ''startTime'':''07:00:00'', ''endTime'':''15:00:00'', ''daysAgo'':7, ''title'':''Last Day Shift : ''}" /></td>\r\n<td><img src="content/noWidget.png" class="widget_PLCMachineStatusPieGraph" alt="{''deviceAddress'':''100'', ''startTime'':''07:00:00'', ''endTime'':''15:00:00'', ''daysAgo'':7, ''title'':''Last Day Shift : ''}" /></td>\r\n</tr>\r\n<tr>\r\n<td><img src="content/noWidget.png" class="widget_PLCMachineStatusPieGraph" alt="{''deviceAddress'':''101'', ''startTime'':''15:00:00'', ''endTime'':''23:00:00'', ''daysAgo'':7, ''title'':''Last Night Shift : ''}" /></td>\r\n<td><img src="content/noWidget.png" class="widget_PLCMachineStatusPieGraph" alt="{''deviceAddress'':''100'', ''startTime'':''15:00:00'', ''endTime'':''23:00:00'', ''daysAgo'':7, ''title'':''Last Night Shift : ''}" /></td>\r\n</tr>\r\n<tr>\r\n<td><img src="content/noWidget.png" class="widget_PLCMachineStatusPieGraph" alt="{''deviceAddress'':''101'', ''startTime'':''23:00:00'', ''endTime'':''11:00:00'', ''daysAgo'':7, ''title'':''Last Graveyard Shift : ''}" /></td>\r\n<td><img src="content/noWidget.png" class="widget_PLCMachineStatusPieGraph" alt="{''deviceAddress'':''100'', ''startTime'':''23:00:00'', ''endTime'':''11:00:00'', ''daysAgo'':7, ''title'':''Last Graveyard Shift : ''}" /></td>\r\n</tr>\r\n</table>\r\n</div>', 1),
(83, 'konfidentkidz/login', '<div style=\\"text-align:center;\\">\r\n<form action=\\"\\" autocomplete=\\"off\\" id=\\"loginBox\\" method=\\"post\\" style=\\"margin: 0 auto; width: 250px;text-align:left;\\">\r\n	<table>\r\n		<tbody>\r\n			<tr>\r\n				<td style=\\"text-align: right;\\">\r\n					Email:</td>\r\n				<td>\r\n					<input id=\\"loginBoxEmail\\" name=\\"emailAddress\\" size=\\"15\\" tabindex=\\"1\\" type=\\"text\\" /></td>\r\n			</tr>\r\n			<tr>\r\n				<td style=\\"text-align: right;\\">\r\n					Password:</td>\r\n				<td>\r\n					<input name=\\"password\\" size=\\"15\\" tabindex=\\"2\\" type=\\"password\\" /></td>\r\n			</tr>\r\n			<tr>\r\n				<td style=\\"text-align: right;\\">\r\n					Remember Me?</td>\r\n				<td>\r\n					<input name=\\"remember\\" tabindex=\\"3\\" type=\\"checkbox\\" /></td>\r\n			</tr>\r\n			<tr>\r\n				<td>\r\n					&nbsp;</td>\r\n				<td>\r\n					<input name=\\"login\\" type=\\"submit\\" value=\\"Login\\" /><input name=\\"login\\" tabindex=\\"4\\" type=\\"hidden\\" value=\\"loginSubmit\\" /></td>\r\n			</tr>\r\n		</tbody>\r\n	</table>\r\n</form>\r\n<p>\r\n	<a href=\\"index.php?dowhat=forgotpassword\\">Forgot Your Password?</a></p>\r\n</div>', 1),
(81, 'admin/plugins', '<div>\n	<img class="widget_PluginManagerWidget" src="http://glenrd.dontexist.net/content/noWidget.png" style="width: 256px; height: 365px;"></div>\n', 1),
(82, 'konfidentkidz', '<p style="text-align: center;">\n	<img alt="" src="themes/konfidentkidz/title1.jpg"></p>\n<table style="margin: 0pt auto;">\n	<tbody>\n		<tr>\n			<td bgcolor="#c92531" valign="top" width="400">\n				<h2>\n					Welcome to Konfident Kidz</h2>\n				<p>\n					The worlds most successful<br>\n					anti-bullying &amp; leadership system<br>\n					<br>\n					The Konfident Kidz system is the fun, new way students are learning to:<br>\n					&nbsp;</p>\n				<ul>\n					<li style="text-align: left;">\n						Keep safe</li>\n					<li style="text-align: left;">\n						Increase their self confidence</li>\n					<li style="text-align: left;">\n						Use innovative communication tools</li>\n				</ul>\n				<p>\n					<a href="http://glenrd.dontexist.net/success-stories">Read our success stories from Principals, Students and Parents</a></p>\n			</td>\n			<td style="5px;" bgcolor="#00cc33" width="400">\n				<p style="text-align: center;">\n					<span style="font-size: xx-large;"><span style="font-family: Comic Sans MS;"><span style="color: rgb(0, 0, 0);"><strong>Konfident Kidz on Television</strong></span></span> <span style="font-family: Comic Sans MS;"> </span></span></p>\n				<p style="text-align: center;">\n					&nbsp;</p>\n				<p>\n					<strong><span style="font-size: x-large;"><span style="font-family: Times New Roman;">This is a great way to see what we do in our school programmes</span></span></strong></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<iframe allowfullscreen="" src="http://www.youtube.com/embed/yACfelwvM8Y" frameborder="0" height="315" width="420"></iframe></p>\n				<p>\n					&nbsp;&nbsp;</p>\n				<p>\n					<span style="font-size: large;"><span style="font-family: Comic Sans MS;"><span style="color: rgb(255, 255, 0);">Have you seen us on the back of a bus yet ????</span></span></span><span style="font-family: Comic Sans MS;"><span style="font-size: large;"><span style="color: rgb(255, 255, 0);"> </span></span></span></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<img alt="" src="http://www.konfidentkidzone.com/uploads/images/bus%20back%20cover%202010%20[640x480].jpg" style="width: 343px; height: 340px;"></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					&nbsp;<span style="color: rgb(255, 255, 0);"><span style="font-family: Comic Sans MS;"><span style="font-size: large;">What about our new posters...</span></span></span></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<img alt="" src="http://www.konfidentkidzone.com/uploads/images/corridor%20advertisment%20for%20kk%20%5B320x200%5D.jpg" style="width: 418px; height: 287px;"></p>\n				<p>\n					<img alt="" src="http://www.konfidentkidzone.com/uploads/images/cafe%20advertisment%20for%20kk.jpg" style="width: 372px; height: 286px;"></p>\n				<p style="text-align: center;">\n					<span style="font-size: medium;"><span style="font-family: Comic Sans MS;"><span style="line-height: 115%; color: black;">Taken&nbsp;by - Amanda Carrington,&nbsp;&nbsp; Palmerston North UCOL,&nbsp; &nbsp;Photography Student</span></span></span></p>\n				<p style="text-align: center;">\n					<span style="line-height: 115%; font-family: ''Verdana'',''sans-serif''; color: black; font-size: 9pt;"><span style="font-family: Comic Sans MS;"><span style="font-size: medium;"><span style="line-height: 115%; color: black;">"A photographic advertisement on ''verbal bullying'' and the side effects of depression. If</span></span></span><span style="font-family: Comic Sans MS;"><span><span style="font-size: medium;"><span style="line-height: 115%; color: black;">&nbsp;</span></span></span></span><span style="font-family: Comic Sans MS;"><span style="font-size: medium;"><span style="line-height: 115%; color: black;">people can recognize the side effects&nbsp;they can&nbsp;support&nbsp;the&nbsp;target&nbsp;and ask for help."</span></span></span></span></p>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n', 1),
(84, 'admin/users', '<p>\n	<img alt="{}" class="widget_UsersManagerWidget" src="http://glenrd.dontexist.net/content/noWidget.png" style="width: 100%; height: 400px;"> <img alt="{}" class="widget_GroupsManagerWidget" src="http://glenrd.dontexist.net/content/noWidget.png" style="width: 100%; height: 400px;"></p>\n', 1),
(86, 'raro', '<div style="font-size: 14pt; color:#000000;font-weight: bold;">\n	Rarotonga Trip 2012</div>\n<p>\n	This is not the page you are looking for.</p>\n<p>\n	<img alt="{''gallery'':''1'', ''thumbWidth'':''200'', ''thumbHeight'':''150''}" class="widget_imageGallery" src="content/trans.png" style="width: 100%; height: 330px;"></p>\n', 1),
(87, 'konfidentkids', '<div style="font-size: 14pt; color:#000000;font-weight: bold;">\n	Konfident Kidz!</div>\n<p>\n	This is the new home of the KonfidentKids webpage</p>\n', 1),
(90, 'about-us', '<table border="0" cellpadding="0" cellspacing="0" width="100%">\n	<tbody>\n		<tr>\n			<td style="text-align: left; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; padding-top: 20px" valign="top" width="50%" align="left">\n				<h1 style="text-align: center">\n					<span style="color: rgb(0,0,128)"><span style="font-size: x-large"><span><img alt="" src="http://www.konfidentkidzone.com/images/how-did-it.jpg" style="width: 393px; height: 47px" height="60" width="401"></span></span></span><span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2"> </font></font></span></h1>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2">&nbsp;</font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2">&nbsp;</font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2"><span style="color: #000000"><span style="font-size: large">The Konfident Kidz Systems were conceived after company director Lisa Gembitsky was moved with compassion to do something about bullying in schools. </span></span></font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2">&nbsp;</font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2"><span style="color: #000000"><span style="font-size: large">Teaming up with family, friends and organizations from the community they launched a pilot in 2009 to local schools that had some unexpected and exciting results. </span></span></font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2">&nbsp;</font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2"><span style="color: #000000"><span style="font-size: large">Since then over 3,000 students have participated in the Konfident Kidz Systems and programmes.&nbsp; </span></span></font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2">&nbsp;</font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2"><span style="color: #000000"><span style="font-size: large">Now having partnered up with other professional services, the Konfident Kidz Systems are more cost effective and available to schools worldwide</span><span style="color: #000000"><span style="font-size: large">.</span></span></span></font></font></span></p>\n				<p align="left">\n					<span style="font-size: medium"><font face="ComicSansMS" size="2"><font face="ComicSansMS" size="2">&nbsp;</font></font></span></p>\n				<p style="text-align: left">\n					&nbsp;</p>\n				<h3 style="text-align: left">\n					&nbsp;</h3>\n				<h2 style="text-align: center">\n					<span style="color: rgb(0,0,128)"><span style="font-size: x-large"><span><img alt="" src="http://www.konfidentkidzone.com/images/kon-kids-really-is.jpg" style="width: 373px; height: 72px" height="72" width="328"></span></span></span></h2>\n				<h3 style="text-align: left">\n					&nbsp;</h3>\n			</td>\n			<td style="text-align: left; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; padding-top: 20px" bgcolor="#ffff99" valign="top" width="25%" align="left">\n				<h3 style="text-align: center;">\n					&nbsp;</h3>\n				<h3 style="text-align: center;">\n					<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: x-large;"><span style="font-family: Times New Roman;">Meet our Team!</span></span></strong></span></h3>\n				<h3 style="text-align: center;">\n					&nbsp;</h3>\n				<h3 style="text-align: center;">\n					<img alt="" src="http://www.konfidentkidzone.com/uploads/images/mummy%20headshot%20%5B320x200%5D.jpg" style="width: 135px; height: 155px;">&nbsp;&nbsp;</h3>\n				<h3 style="text-align: center">\n					<span style="color: rgb(0, 0, 0);"><span><strong><span style="font-size: medium;"><span style="font-size: medium;">Lisa Gembitsky is the owner/director of Konfident Kidz </span></span></strong></span></span><br>\n					<span style="font-size: medium"> </span></h3>\n				<p>\n					&nbsp;</p>\n				<p style="text-align: center;">\n					<span style="font-size: medium"><span style="font-size: medium"><img alt="" src="http://112.109.66.18/%7Ekidz/uploads/images/DADE%20%5B320x200%5D.jpg" style="width: 132px; height: 168px;"></span></span></p>\n				<h3 style="text-align: center;">\n					<strong><span style="color: rgb(0, 0, 0);"><span style="font-size: medium;">Sid Kahu is our business and cultural&nbsp; advisor. &nbsp;</span></span></strong></h3>\n				<p>\n					&nbsp;</p>\n				<h3 style="text-align: center;">\n					<span style="color: #000000"><span style="font-size: medium"><span style="color: #000000"><span style="font-size: medium"><span style="font-size: medium"><span style="font-size: medium"><img alt="" src="http://www.konfidentkidzone.com/uploads/images/other%20november%20photos%20004%20%5B320x200%5D.JPG" style="width: 132px; height: 165px;"></span></span></span></span></span></span></h3>\n				<p style="text-align: center;">\n					&nbsp;<span style="color: #000000"><span style="color: rgb(0, 0, 0);"><strong><span style="font-size: medium;">Barbara Gembitsky is our systems development engineer!! </span></strong></span></span></p>\n				<h3 style="text-align: left;">\n					&nbsp;</h3>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n', 1),
(101, 'admin/permissions', '<img class="widget_BehaviourPermissionsWidget" src="content/nowidget.png" alt="">', 64),
(89, 'kidz/', '<div style="color:#999999;font-family:verdana;font-size:12pt;font-weight:bold;">\n	Kidz</div>\n<p style="color:#ffffff;font-family:verdana;font-size:10pt;">\n	Welcome to the kids Page!</p>\n', 1),
(88, '', '<h2>Contact Us</h2>\n', 1),
(91, 'programmes', '<h2 style="margin-bottom: 0.0001pt; text-align: center; line-height: normal;" align="center">\n	<span style="font-size: xx-large;"><span style="color: rgb(0, 0, 0);"><b>What suits you?</b></span></span></h2>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;\n            text-align:center;line-height:normal" align="center">\n	&nbsp;</div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;\n            text-align:center;line-height:normal" align="center">\n	&nbsp;</div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<span style="color: rgb(0, 0, 0);"><b><span style="font-size: 16pt;">Konfident Kidz Safe School Systems</span></b></span></div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;\n            text-align:center;line-height:normal" align="center">\n	&nbsp;</div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	<p style="margin-bottom: 0.0001pt; text-align: left; line-height: normal;">\n		<span style="font-size: medium;">These exciting School Systems will allow your students to become confident and develop a leader based, responsible culture at your school.&nbsp; The systems are easily integrated into your school as the components work within the New Zealand School Curriculum Key Competencies and Values. </span></p>\n	<p style="margin-bottom: 0.0001pt; text-align: left; line-height: normal;">\n		<span style="font-size: medium;">Students enjoy the colourful storybooks and practising the skills taught in each lesson at school. These lessons are fun, interactive and meaningful which increase the students abilty to retain the information and use the skills they have been taught.</span><br>\n		<span style="font-size:12.0pt;Plantagenet Cherokee&quot;,&quot;serif&quot;;Times New Roman&quot;;Times New Roman&quot;;color:black;"> </span></p>\n	<p style="margin-bottom: 0.0001pt; text-align: left; line-height: normal;">\n		&nbsp;</p>\n	<ul>\n		<li>\n			<strong><span style="font-size: large;">Primary</span></strong></li>\n		<li>\n			<strong><span style="font-size: large;">Primary +</span><br>\n			<span style="font-size: large;"><span style="color: rgb(255, 255, 153);"><a href="http://www.konfidentkidzone.com/index.php?page=kk-system" title="How the stop bullying and confidence building for kids works">Click here</a><strong> to go To the School Systems Now!</strong></span></span></strong></li>\n		<li>\n			<strong><span style="font-size: large;">Intermediate</span></strong></li>\n	</ul>\n	<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n		<span style="color: rgb(0, 0, 0);"><b><span style="font-size: 16pt;">Family Programmes</span></b></span></div>\n</div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<b>&nbsp;</b></div>\n<p style="margin-bottom:0cm;margin-bottom:.0001pt;text-indent:-18.0pt;line-height:normal;">\n	<span style="font-size:12.0pt;"><span>??<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="font-size:12.0pt;Mongolian Baiti&quot;;Times New Roman&quot;;">These will be ready really soon....&nbsp;Watch this space</span></p>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<b>&nbsp;</b></div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<span style="color: rgb(0, 0, 0);"><b><span style="font-size: 16pt;">Parents Programmes</span></b></span></div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<b>&nbsp;</b></div>\n<p style="margin-bottom:0cm;margin-bottom:.0001pt;text-indent:-18.0pt;line-height:normal;">\n	<span style="font-size:12.0pt;"><span>??<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="font-size: 12pt;">These will be ready really soon....&nbsp;Watch this space&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span style="font-size: large;"><strong><span style="color: rgb(255, 255, 153);"><a href="http://www.konfidentkidzone.com/index.php?page=parentz" title="Deal with bullying, keep your kids safe and confident">Click Here</a><span> to go to the Parents page</span></span></strong></span><br>\n	<span style="font-size:12.0pt;Mongolian Baiti&quot;;Times New Roman&quot;;"> </span></p>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<b>&nbsp;</b></div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<b>&nbsp;</b></div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	<span style="color: rgb(0, 0, 0);"><b><span style="font-size: 16pt;">Storybooks</span></b></span></div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	&nbsp;</div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	<span style="font-size: medium;">These newly developed storybooks are one of a kind, colourful and exciting to read. The storybooks follow the adventures of a little lion cub named Kulu and her friends as she learns step by step how to be more confident.&nbsp; Along the way she learns how to deal with bulling and dangerous situations.<span><span><span>&nbsp;</span></span></span> </span></div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	&nbsp;</div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	&nbsp;</div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	<span style="font-size: medium;"><span><span><span>Your children will want to read these over and over again.&nbsp; And the best thing is they are learning amazing life skills without even knowing it.</span></span></span> </span></div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	&nbsp;</div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	<span style="font-size: medium;">These books come seperate or as a set.&nbsp; Suitable for 3yr olds - 10 yr olds.&nbsp; </span></div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	&nbsp;</div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	&nbsp;</div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	<span style="font-size: medium;">There is a book to suit all children...and infact I really love reading the Chapter book! </span></div>\n<div style="margin-bottom: 0.0001pt; line-height: normal;">\n	&nbsp;</div>\n<div style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:\n            normal">\n	&nbsp;</div>\n<ul>\n	<li>\n		<strong><span style="font-size: large;">Kulu does the Zulu</span></strong></li>\n	<li>\n		<strong><span style="font-size: large;">Rescue at the Jungle waterhole</span></strong></li>\n	<li>\n		<strong><span style="font-size: large;">Rumble Jumble in the Jungle </span></strong></li>\n	<li>\n		<strong><span style="font-size: large;">The Jungle Ruckus and Roar&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span style="color: rgb(255, 255, 153);">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; <span style="font-size: large;"><a href="http://www.konfidentkidzone.com/index.php?page=contact-us" title="Contact details Konfident Kidz ">Click here</a><strong> to pre-order your books Now!</strong></span></span></strong></li>\n	<li>\n		<strong><span style="font-size: large;">Surprise attack on the jungle track</span></strong></li>\n	<li>\n		<strong><span style="font-size: large;">Jungle escape at Castle Cliffs</span></strong></li>\n	<li>\n		<strong><span style="font-size: large;">The Unity Stone at Panther Rock ??? Chapter Book</span></strong></li>\n</ul>\n<p>\n	&nbsp;</p>\n<p style="text-align:center" align="center">\n	<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: 18pt; line-height: 115%;">Meet some of the Characters</span></strong>-</span></p>\n<p>\n	&nbsp;</p>\n<p style="text-align: center;">\n	<img alt="" src="http://www.konfidentkidzone.com/uploads/images/Kulu%20Lion%20small.jpg" style="width: 151px; height: 200px;">&nbsp;&nbsp; <img alt="" src="http://www.konfidentkidzone.com/uploads/images/Jane%20Giraffe%20small.jpg" height="200" width="133">&nbsp;&nbsp; <img alt="" src="http://www.konfidentkidzone.com/uploads/images/Bobby%20Bear%20small.jpg" height="200" width="142">&nbsp;&nbsp; <img alt="" src="http://www.konfidentkidzone.com/uploads/images/Tucker%20Tiger%20small.jpg" height="200" width="142"> &nbsp; <img alt="" src="http://www.konfidentkidzone.com/uploads/images/Priscilla%20Hippo%20small.jpg" height="200" width="146"></p>\n<p>\n	&nbsp;</p>\n<p>\n	&nbsp;</p>\n', 1),
(92, 'whats-on', '<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><span><strong><span style="font-size: 18pt; line-height: 115%;">Meet some of the Characters</span></strong>-</span> </span><br>\n	</span></p>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<img alt="" src="http://www.konfidentkidzone.com/uploads/images/Kulu%20Lion%20small.jpg" style="width: 151px; height: 200px;"></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);">This is Kulu, she a confident lion cub and helps to fix problems<br>\n	</span></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<img alt="" src="http://www.konfidentkidzone.com/uploads/images/Jane%20Giraffe%20small.jpg" height="200" width="133"></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);">This is Jane one of Kulu''s best friends and she thinks she knows everything!</span></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<img alt="" src="http://www.konfidentkidzone.com/uploads/images/Priscilla%20Hippo%20small.jpg" height="200" width="146"></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);">This is Priscilla Kulu''s other best friend, and she is a bit of a diva!</span></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<img alt="" src="http://www.konfidentkidzone.com/uploads/images/Tucker%20Tiger%20small.jpg" height="200" width="142"></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);">This is Tucker, he gets angry really fast and is pretty mean to the other kids</span></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<img alt="" src="http://www.konfidentkidzone.com/uploads/images/Bobby%20Bear%20small.jpg" height="200" width="142"></div>\n<div style="text-align: center;">\n	&nbsp;</div>\n<div style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);">This is Bobby one of Tucker''s friends.&nbsp; He looks friendly now but just wait.....</span></div>\n<p style="text-align:center" align="center">\n	<strong><span style="font-size:18.0pt;Mongolian Baiti&quot;;color:black;">Konfident Kidz is going GLOBAL!!</span></strong></p>\n<div style="text-align:center" align="center">\n	&nbsp;</div>\n<p style="text-align:center" align="center">\n	&nbsp;</p>\n<p style="text-align: center;" align="center">\n	<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: 14pt;">2012 - School systems are now</span></strong></span></p>\n<p style="text-align:center" align="center">\n	&nbsp;</p>\n<p style="text-align: center;" align="center">\n	<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: 14pt;">available - World Wide&nbsp;!!</span></strong></span></p>\n<p style="text-align: center;" align="center">\n	<span style="color: rgb(0, 0, 0);">&nbsp;</span></p>\n<p style="text-align:center" align="center">\n	&nbsp;</p>\n<p style="text-align: center;" align="center">\n	<span style="font-size: medium;"><span style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Your school can now have the most successful leadership, confidence building and anti-bullying system in the world.&nbsp; </strong></span></span></span></p>\n<p>\n	<span style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">&nbsp;</span></span><span style="color: rgb(0, 0, 0);"> <span style="font-size: medium;"> </span>&nbsp;</span> <span style="color: rgb(0, 0, 0);"> </span></p>\n<p style="text-align: center;" align="center">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size: medium;"><strong>Konfident Kidz changes school cultures and keeps kids safe.</strong></span></span></p>\n<div style="text-align:center" align="center">\n	<span style="color: rgb(0, 0, 0);">&nbsp;</span></div>\n<p style="text-align:center" align="center">\n	<span style="font-size: x-large;"><span style="color: rgb(0, 0, 0);"><strong>Start 2012 off with a bang&nbsp;the Konfident Kidz way!!!</strong></span></span></p>\n<p style="text-align: center;" align="center">\n	&nbsp;</p>\n<p style="text-align: center;" align="center">\n	&nbsp;</p>\n<p style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: 16pt;">Get Konfident Kidz at your school now</span></strong></span><strong><span style="font-size: 16pt;"> </span></strong></p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);">&nbsp;</span></p>\n<p style="text-align: center;" align="center">\n	&nbsp;<span style="color: rgb(0, 0, 0);"><span style="font-size: x-large;"><strong><a href="http://www.konfidentkidzone.com/index.php?page=contact-us" title="Contact details Konfident Kidz ">Contact Us</a><span><span><strong> now for more information</strong></span></span></strong></span></span></p>\n<p style="text-align: center;" align="center">\n	&nbsp;</p>\n<p style="text-align: center;" align="center">\n	&nbsp;</p>\n<p style="text-align: center;" align="center">\n	<span style="color: rgb(255, 153, 0);">************************************************************</span></p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	<b><span style="font-size:18.0pt;line-height:115%;Mongolian Baiti&quot;;\n            color:black;">Let your children experience Konfident Kidz at home</span></b></p>\n<div>\n	&nbsp;</div>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size: large;"><strong><span style="line-height: 115%;">One of a kind Konfident Kidz book series will be released March 2012!</span></strong></span></span></p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size: medium;"><strong><span style="line-height: 115%;">Teach your kids at home how to deal with scary and dangerous situations.&nbsp;</span></strong></span></span></p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);"><span style="font-size: medium;"><strong><span style="line-height: 115%;">Colourful and exciting books for you to read with your kids, learn valuable skills and keep them safe.</span></strong></span></span></p>\n<div>\n	<span style="color: rgb(0, 0, 0);">&nbsp;</span></div>\n<div>\n	&nbsp;</div>\n<div>\n	&nbsp;</div>\n<p style="text-align:center" align="center">\n	<span style="font-size: x-large;"><span style="color: rgb(0, 0, 0);"><strong><span style="line-height: 115%;">You can pre-order yours now by </span><a href="http://www.konfidentkidzone.com/index.php?page=contact-us" title="Contact details Konfident Kidz ">contacting us</a></strong></span></span></p>\n<p style="text-align:center" align="center">\n	&nbsp;</p>\n<p>\n	&nbsp;</p>\n<p style="text-align: center;">\n	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;</p>\n<p style="text-align: center;" align="center">\n	&nbsp;</p>\n<p style="text-align: center;" align="center">\n	&nbsp;</p>\n', 1),
(93, 'success-stories', '<p style="text-align: center;">\n	<span style="color: rgb(0, 0, 0);">&nbsp;<span style="font-family: Comic Sans MS;"><span style="font-size: xx-large;">Success Stories</span></span></span></p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<p style="text-align: center;">\n	&nbsp;</p>\n<table border="0" width="150" align="right">\n	<tbody>\n		<tr>\n			<td bgcolor="#3399ff" align="left">\n				<div style="text-align: center;">\n					&nbsp;</div>\n				<p style="text-align: center;">\n					&nbsp;</p>\n				<div style="text-align: center;">\n					<span style="font-family: Comic Sans MS;">&nbsp;</span></div>\n				<div style="text-align: center;">\n					<span style="font-size: medium;"><span style="font-family: Comic Sans MS;">&nbsp;</span></span></div>\n				<div style="text-align: center;">\n					&nbsp;</div>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<table border="0" cellpadding="1" cellspacing="1" width="750" align="left">\n	<tbody>\n		<tr>\n			<td style="text-align: center;" width="500">\n				<p>\n					<span style="font-family: Comic Sans MS;"><span style="font-size: large;">Principals feedback</span></span></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<span style="color: rgb(0, 0, 0);"><span style="font-size: medium;"><span style="font-family: Comic Sans MS;">Find out how the Konfident Kidz system has helped these schools, principals, teachers and their students...</span></span></span></p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=what-schools-say" title="Principals feedback"><span style="color: rgb(255, 204, 0);"><span style="font-size: medium;"><span style="font-family: Comic Sans MS;">More details...</span></span></span></a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					&nbsp;</p>\n			</td>\n			<td style="text-align: center;" width="500">\n				<p>\n					<span style="font-family: Comic Sans MS;"><span style="font-size: large;">Parents feedback</span></span></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<span style="color: rgb(0, 0, 0);"><span style="font-size: medium;"><span style="font-family: Comic Sans MS;"><span>Parents share some heart gripping stories </span></span></span><br>\n					<span> &nbsp;</span><span style="font-family: Comic Sans MS;"><span style="font-size: medium;"><span>of how their children have benefited from</span></span></span> <span style="font-family: Comic Sans MS;"><span style="font-size: medium;">the Konfident Kidz system...</span></span></span></p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=what-parents-say" title="Parents feedback"><span style="color: rgb(255, 204, 0);"><span style="font-family: Comic Sans MS;"><span style="font-size: medium;">More details...</span></span></span></a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					&nbsp;</p>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n<table border="0" cellpadding="1" cellspacing="1" width="750" align="left">\n	<tbody>\n		<tr>\n			<td style="text-align: center;" width="500">\n				<p>\n					<span style="font-size: large;"><span style="font-family: Comic Sans MS;">Student feedback</span></span></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<span style="color: rgb(0, 0, 0);"><span style="font-family: Comic Sans MS;"><span style="font-size: medium;">Evidence from students who have particpated in&nbsp; the Konfident Kidz system share their stories....</span></span></span></p>\n				<p style="text-align: left;">\n					&nbsp;</p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=what-kids-say" title="Student feedback"><span style="font-family: Comic Sans MS;"><span style="font-size: medium;"><span style="color: rgb(255, 204, 0);">More details...</span></span></span></a></p>\n			</td>\n			<td style="text-align: center;" width="500">\n				<p>\n					<span style="font-family: Comic Sans MS;"><span style="font-size: large;">Community feedback</span></span></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<span style="color: rgb(0, 0, 0);"><span style="font-family: Comic Sans MS;"><span style="font-size: medium;">Hear from people and organizations who support this successful system....</span></span></span></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=community-feedback" title="Community feedback"><span style="font-family: Comic Sans MS;"><span style="font-size: medium;"><span style="color: rgb(255, 204, 0);">More details...</span></span></span></a></p>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n', 1),
(94, 'contact-us', '<p style="text-align: center">\n	<span style="font-size: xx-large"><span style="color: rgb(255,255,0)"><img alt="" src="http://www.konfidentkidzone.com/images/send-us-a-message.jpg"></span></span></p>\n<table border="0" cellpadding="0" cellspacing="0" width="100%">\n	<tbody>\n		<tr>\n			<td valign="top" width="50%">\n				<form action="form.php" method="post" name="contact_form">\n					<table border="0" cellpadding="0" cellspacing="0" width="90%" align="center">\n						<tbody>\n							<tr>\n								<td colspan="2" style="text-align: left; color: rgb(255,0,0); font-weight: bold">\n									&nbsp;</td>\n							</tr>\n							<tr>\n								<td>\n									&nbsp;</td>\n								<td>\n									&nbsp;</td>\n							</tr>\n							<tr>\n								<td>\n									&nbsp;</td>\n								<td>\n									&nbsp;</td>\n							</tr>\n							<tr>\n								<td width="25%">\n									<h3>\n										<strong>Name<span style="color: rgb(201,50,47)">*</span></strong></h3>\n								</td>\n								<td width="75%">\n									<span style="font-size: large"><strong><input autocomplete="off" id="fname" name="fname" style="width: 250px" type="text"></strong></span></td>\n							</tr>\n							<tr>\n								<td>\n									<h3>\n										<strong>Phone<span style="color: rgb(201,50,47)">*</span></strong></h3>\n								</td>\n								<td>\n									<span style="font-size: large"><strong><input autocomplete="off" id="phone" name="phone" style="width: 250px" type="text"></strong></span></td>\n							</tr>\n							<tr>\n								<td>\n									<h3>\n										<strong>Email<span style="color: rgb(201,50,47)">*</span></strong></h3>\n								</td>\n								<td>\n									<span style="font-size: large"><strong><input autocomplete="off" id="email" name="email" style="width: 250px" type="text"></strong></span></td>\n							</tr>\n							<tr>\n								<td valign="top">\n									<br>\n									<br>\n									<h3>\n										<strong>Message</strong></h3>\n								</td>\n								<td valign="top">\n									<h3>\n										<textarea autocomplete="off" cols="29" id="message" name="message" rows="4"></textarea></h3>\n								</td>\n							</tr>\n							<tr>\n								<td>\n									&nbsp;</td>\n								<td>\n									&nbsp;</td>\n							</tr>\n							<tr>\n								<td>\n									<span style="font-size: large">&nbsp;</span></td>\n								<td>\n									&nbsp;</td>\n							</tr>\n						</tbody>\n					</table>\n				</form>\n			</td>\n			<td style="padding-top: 20px" valign="top" width="50%">\n				<p style="text-align: center">\n					<span style="font-family: Comic Sans MS"><span style="font-size: large"><span style="color: rgb(255,255,0)"><strong>Lisa Gembitsky</strong></span></span></span></p>\n				<p style="text-align: center">\n					<span style="font-family: Comic Sans MS"><span style="font-size: large"><span style="color: rgb(255,255,0)"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Owner/Director- 021 888 913</strong></span></span></span><span style="font-size: large"><span style="color: rgb(255,255,0)"><strong>&nbsp;&nbsp;</strong></span></span><span style="font-size: large"><span style="color: rgb(255,255,0)"><strong><span style="color: rgb(255,255,0)"><strong><span style="color: rgb(255,255,0)"><strong><span style="font-family: Comic Sans MS">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></strong></span></strong></span></strong></span></span></p>\n				<p style="text-align: center">\n					<span style="font-size: large"><strong><span style="font-family: Comic Sans MS"><span style="color: rgb(255,255,0)">Wellington Office- 0064 04 586 9222</span></span></strong></span></p>\n				<p>\n					&nbsp;</p>\n				<p style="text-align: center">\n					<a href="mailto:lisa@konfidentkidzone.com"><img alt="" src="http://112.109.66.18/%7Ekidz/uploads/images/lisa.jpg" style="width: 297px; height: 33px" border="0" height="33" width="251"></a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					&nbsp;</p>\n				<p>\n					&nbsp;</p>\n				<p>\n					&nbsp;</p>\n				<span style="font-size: medium">&nbsp;</span>\n				<p>\n					&nbsp;</p>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n', 1);
INSERT INTO `pages` (`page_id`, `title`, `content`, `user_id`) VALUES
(95, 'kidz', '<table border="0" cellpadding="0" cellspacing="0" width="100%">\n	<tbody>\n		<tr>\n			<td valign="top" width="30%" align="left">\n				<div style="margin: 10px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; color: rgb(0, 0, 0);">\n					<div style="background: rgb(255, 255, 255) none repeat scroll 0% 0%; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial;">\n						<div style="margin: 0px 3px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; overflow: hidden; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; height: 1px;">\n							&nbsp;</div>\n						<div style="margin: 0px 2px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; overflow: hidden; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; height: 1px;">\n							&nbsp;</div>\n						<div style="margin: 0px 1px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; overflow: hidden; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; height: 1px;">\n							&nbsp;</div>\n					</div>\n					<div style="padding: 10px 20px 20px;">\n						&nbsp;\n						<p style="text-align: center;" align="center">\n							<span style="font-size: large;"><span style="color: navy;">If you''re being bullied or you know someone who is <a href="http://www.konfidentkidzone.com/index.php?page=tips-on-bullying" title="tips on bullying how to deal with bullies">here are some tips!!</a></span></span></p>\n						<p style="text-align: center;" align="center">\n							&nbsp;</p>\n						<p style="text-align: center;" align="center">\n							<span style="color: rgb(51, 51, 153);"><span style="font-size: large;"><a href="http://www.konfidentkidzone.com/index.php?page=what-kids-say" title="Student feedback">Check out what other kids have to say.....</a></span></span></p>\n						<p style="text-align: center;" align="center">\n							<span style="font-size: large;">&nbsp;</span></p>\n						<p style="text-align: center;" align="center">\n							<span style="font-size: large;"><span style="color: navy;"><a href="http://www.konfidentkidzone.com/index.php?page=photoz" title="Photoz">Have a look at some awesome pictures of your friends!!</a></span></span></p>\n						<p style="text-align: center;" align="center">\n							<span style="font-size: large;">&nbsp;</span></p>\n						<p style="text-align: center;" align="center">\n							<span style="font-size: large;"><span style="color: navy;"><a href="http://www.konfidentkidzone.com/index.php?page=cool-games" title="cool games">Wanna play some cool games???</a></span></span><span style="font-size: large;">&nbsp;</span></p>\n						<p style="text-align: center;" align="center">\n							<span style="font-size: large;">&nbsp;</span></p>\n						<p style="text-align: center;" align="center">\n							<span style="font-size: large;"><span style="color: navy;"><a href="http://www.konfidentkidzone.com/index.php?page=kk-on-tv" title="Watch bullying on TV">Have a look at Konfident Kidz on T.V</a></span></span><br>\n							<br>\n							&nbsp;</p>\n					</div>\n					<div style="background: rgb(255, 255, 255) none repeat scroll 0% 0%; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial;">\n						<div style="margin: 0px 1px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; overflow: hidden; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; height: 1px;">\n							&nbsp;</div>\n						<div style="margin: 0px 2px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; overflow: hidden; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; height: 1px;">\n							&nbsp;</div>\n						<div style="margin: 0px 3px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; overflow: hidden; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; height: 1px;">\n							&nbsp;</div>\n						<div style="margin: 0px 5px; background: rgb(242, 242, 242) none repeat scroll 0% 0%; overflow: hidden; display: block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; height: 1px;">\n							&nbsp;</div>\n					</div>\n				</div>\n				<div>\n					&nbsp;</div>\n			</td>\n			<td valign="top" width="1%" align="left">\n				&nbsp;</td>\n			<td style="padding: 20px; text-align: left;" valign="top" width="69%" align="left">\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="color: yellow; font-size: 24pt;"><img alt="" src="http://www.konfidentkidzone.com/images/hi-everyone.jpg"></span></b></div>\n				<br>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="color: yellow; font-size: 24pt;"><img alt="" src="http://www.konfidentkidzone.com/images/do-you-wanna.jpg"></span></b></div>\n				<br>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="font-size: medium;">Well now it???s easy!&nbsp;We can come to your school or you can hang out with us at Konfident Kidz Private classes.</span></b></div>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="font-size: medium;">We have lots of fun and play heaps of different games.&nbsp;You even get to do some acting!</span></b></div>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="font-size: medium;">You will learn new skills to deal with bullies, stay safe in hairy situations and feel way more confident.</span></b></div>\n				<div style="margin: 0cm 0cm 10pt; line-height: normal;">\n					<b>&nbsp;</b></div>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="color: yellow; font-size: 24pt;"><img src="http://www.konfidentkidzone.com/images/check-out-what.jpg"></span></b></div>\n				<br>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="font-size: medium;">Konfident Kidz has been the most fun I???ve had in ages ???</span><span style="font-size: medium;">Emma 11yrs</span></b></div>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="font-size: medium;">Konfident Kidz has helped me deal with my anger ???</span></b><span style="font-size: 13.5pt;">Javan 12yrs</span></div>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="font-size: medium;">Konfident Kidz 4 life ??? </span></b><span style="font-size: 13.5pt;">Jannaia 11yrs</span></div>\n				<div style="margin: 0cm 0cm 10pt; text-align: center; line-height: normal;" align="center">\n					<b><span style="font-size: medium;">You have taught me stuff I will use throughout my whole life ??? </span><span style="font-size: medium;">Ashleigh 11yrs</span></b></div>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n', 1),
(96, 'parentz', '<table border="0" cellpadding="1" cellspacing="1" width="100%">\n	<tbody>\n		<tr>\n			<td>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=tips-for-parents" title="tips for parents">Are your kids being bullied? need some ideas....</a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=what-parents-say" title="Parents feedback">Check out what other parents have said....</a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=kk-on-tv" title="Watch bullying on TV">Watch Konfident Kidz on T.V....</a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=photoz" title="Photoz">Look at some pictures of what we do.......</a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=success-stories" title="Stories of how to deal with bullying">Read some Konfident Kidz success stories....... </a></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<a href="http://www.konfidentkidzone.com/index.php?page=cool-links" title="cool Links">Need more info go to the links page......</a></p>\n			</td>\n			<td>\n				&nbsp;</td>\n			<td>\n				<p align="center">\n					<strong><img alt="" src="http://www.konfidentkidzone.com/images/kon-kids-is-the-soln.jpg"></strong></p>\n				<br>\n				<p align="center">\n					<strong>Are your kids being bullied?</strong></p>\n				<p align="center">\n					<strong>Need more confidence?</strong></p>\n				<p align="center">\n					&nbsp;</p>\n				<p align="center">\n					<strong>Disrespectful, Demanding, Difficult??</strong></p>\n				<br>\n				<p align="center">\n					<strong><img alt="" src="http://www.konfidentkidzone.com/images/kon-kids-is-here-to-help.jpg"></strong></p>\n				<br>\n				<p>\n					<strong>The Konfident Kidz Programmes will empower your child with confidence, help them to develop a strong sense of self esteem and give them the tools to correctly deal with any unsafe situation they may find themselves in.</strong></p>\n				<p>\n					<strong>We believe that having fun is the best and most effective way to teach these skills.&nbsp; Physical exercise is a large part of the programmes and the kids love it!</strong></p>\n				<p>\n					<strong>In our classes each student takes responsibility for their own learning and actions.&nbsp; They also learn how to deal with the actions of others.</strong></p>\n				<p>\n					<strong>We offer school time programmes, workshops and private after school classes.&nbsp; These can be specifically designed for the children we are working with.&nbsp;</strong></p>\n				<p>\n					<strong>Parent workshops are now also available.</strong></p>\n				<p>\n					&nbsp;</p>\n				<p>\n					<strong>Keep an eye on our ''Whats on'' page for upcoming programmes and our new ''home system'' available soon! </strong></p>\n				<p>\n					<strong>Please <a href="http://www.konfidentkidzone.com/index.php?page=contact-us" title="Contact details Konfident Kidz ">contact us </a>for more information and to book a meeting time.</strong></p>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n', 1),
(97, 'schoolz', '<table style="width: 975px; height: 26px;" border="0" cellpadding="1" cellspacing="1">\n	<tbody>\n		<tr>\n			<td>\n				<p style="text-align: center;">\n					<span style="color: rgb(0, 0, 0);"><span style="font-size: x-large;"><strong>Konfident Kidz School Systems<br>\n					Year 1 to Year 8 - are now available to you </strong></span></span></p>\n				<p style="text-align: center;">\n					&nbsp;</p>\n				<p style="text-align: center;">\n					&nbsp;</p>\n				<p style="text-align: center;">\n					&nbsp;</p>\n				<p style="text-align: center;">\n					<br>\n					<span style="font-size: medium;">No matter where in the world your school or group is you can now teach your children essential social skills, communication tools and strategies to deal with many different situations.<br>\n					<br>\n					</span></p>\n				<p style="text-align: center;">\n					<span style="font-size: medium;">The systems can now be licensed to your school or group easily and quickly, with everything you need right here. This unique system works in the most interactive way possible.<br>\n					<br>\n					</span></p>\n				<p style="text-align: center;">\n					<span style="font-size: medium;">The students work with their teacher and their friends in a classroom environment. This means the social aspects of school and life are brought into this system and allows the students to learn how to deal with situations quickly and effectively.<br>\n					<br>\n					</span></p>\n				<p style="text-align: center;">\n					<span style="font-size: medium;">The students love participating in the lessons and learning new skills in a fun and exciting way. They are encouraged to ask questions, discuss concepts and find the best ideas that work for them.</span></p>\n				<div>\n					&nbsp;</div>\n				<p style="text-align: center;">\n					&nbsp;</p>\n				<p style="text-align: center;">\n					&nbsp;</p>\n				<p style="text-align: center;">\n					<span style="color: rgb(0, 0, 0);"><span style="font-size: large;"><strong>Licenses are now available for 2012 - <a href="http://www.konfidentkidzone.com/index.php?page=contact-us" title="Contact details Konfident Kidz ">contact us</a> now for more information</strong></span></span></p>\n				<p style="text-align: center;">\n					&nbsp;</p>\n			</td>\n			<td bgcolor="#ffff99" width="30%">\n				&nbsp;\n				<div style="text-align: center;">\n					<span style="color: rgb(0, 0, 0);"><span style="font-size: large;"><strong><a href="http://www.konfidentkidzone.com/index.php?page=kk-system" title="How the stop bullying and confidence building for kids works">Click here to see whats in the School Systems....</a></strong></span></span></div>\n				<div>\n					&nbsp;</div>\n				<div>\n					&nbsp;</div>\n				<div>\n					&nbsp;</div>\n				<div>\n					<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: medium;">"We have found that children are diffusing situations by themselves and are not always asking teachers/adults to support them" </span></strong><span style="font-size: medium;">- From the Principal of Roto-o-Rangi Primary school</span></span><span style="color: rgb(0, 0, 0);"> </span></div>\n				<div>\n					&nbsp;</div>\n				<div>\n					&nbsp;</div>\n				<div>\n					&nbsp;</div>\n				<p>\n					<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: medium;">"Our students have developed a range of strategies to deal with coflict situations and to keep themselves safe.&nbsp; The students really enjoy going to the programmeas it is fun and rewarding"</span></strong> - From the principal of Cannons Creek Primary school</span></p>\n				<div>\n					&nbsp;</div>\n				<div>\n					&nbsp;</div>\n				<p>\n					<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: medium;">"What I hope for the sake of all the children in our community is that they can be exposed to the skills and messages that Konfident Kidz provide and that Principals are able to access this system without considerable cost to the school" </span></strong>- From the Principal of Hutt Intermediate school</span></p>\n				<div>\n					&nbsp;</div>\n				<div>\n					&nbsp;</div>\n				<div style="text-align: center;">\n					<span style="color: rgb(0, 0, 0);"><strong><span style="font-size: large;"><span style="color: rgb(0, 0, 0);"><a href="http://www.konfidentkidzone.com/index.php?page=success-stories" title="Stories of how to deal with bullying">Read other references from Schools, Parents and Kids</a></span></span></strong></span></div>\n				<div style="text-align: center;">\n					&nbsp;</div>\n			</td>\n		</tr>\n	</tbody>\n</table>\n<p>\n	&nbsp;</p>\n', 1),
(98, 'photoz', '<p>\n	&nbsp;</p>\n<ul class="picturelist">\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/IMG_0450%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Very nice!! "> <img alt="Very nice!! - &lt;p&gt;These girls were great!!!&amp;nbsp; Thanks for being amazing!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_IMG_0450%20%5B320x200%5D.JPG" title="Very nice!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							These girls were great!!!&nbsp; Thanks for being amazing!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/IMG_0453%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Haha funny faces &lt;p&gt;Haha Funny faces!!!&lt;/p&gt;"> <img alt="Haha funny faces - &lt;p&gt;Haha Funny faces!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_IMG_0453%20%5B320x200%5D.JPG" title="Haha funny faces"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Haha Funny faces!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/IMG_0454%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Yay!!!  We rock!!! "> <img alt="Yay!!!  We rock!!! - &lt;p&gt;Yay We rock!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_IMG_0454%20%5B320x200%5D.JPG" title="Yay!!!  We rock!!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Yay We rock!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hunterandschool%20186%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="T and R!!  Love xxx "> <img alt="T and R!!  Love xxx - &lt;p&gt;T and R you 2 are soooo cool!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hunterandschool%20186%20%5B320x200%5D.JPG" title="T and R!!  Love xxx"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							T and R you 2 are soooo cool!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hunterandschool%20193%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="home page girls "> <img alt="home page girls - &lt;p&gt;home page girls&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hunterandschool%20193%20%5B320x200%5D.JPG" title="home page girls"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							home page girls</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hunterandschool%20198%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="TOOOO COOL!!!! &lt;p&gt;Cool Cats!!!!&lt;/p&gt;"> <img alt="TOOOO COOL!!!! - &lt;p&gt;Cool Cats!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hunterandschool%20198%20%5B320x200%5D.JPG" title="TOOOO COOL!!!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Cool Cats!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hunterandschool%20202%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="hi 5 boys!!! "> <img alt="hi 5 boys!!! - &lt;p&gt;hi 5 boys!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hunterandschool%20202%20%5B320x200%5D.JPG" title="hi 5 boys!!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							hi 5 boys!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hunterandschool%20205%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="awesome!!! "> <img alt="awesome!!! - &lt;p&gt;thanks for being so cool in our class!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hunterandschool%20205%20%5B320x200%5D.JPG" title="awesome!!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							thanks for being so cool in our class!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hutt%20kids%20website%20001%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="M and J "> <img alt="M and J - &lt;p&gt;Thanks for all your help girls!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hutt%20kids%20website%20001%20%5B320x200%5D.JPG" title="M and J"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Thanks for all your help girls!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hutt%20kids%20website%20005%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="girls "> <img alt="girls - &lt;p&gt;Look mum no hands!!!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hutt%20kids%20website%20005%20%5B320x200%5D.JPG" title="girls"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Look mum no hands!!!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hutt%20kids%20website%20013%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="group hug!! "> <img alt="group hug!! - &lt;p&gt;OHHHHH&amp;nbsp;&amp;nbsp; group hug!!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hutt%20kids%20website%20013%20%5B320x200%5D.JPG" title="group hug!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							OHHHHH&nbsp;&nbsp; group hug!!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/hutt%20kids%20website%20018%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Queen???? "> <img alt="Queen???? - &lt;p&gt;This is how she normally gets to her classes!!!!&amp;nbsp; lol&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_hutt%20kids%20website%20018%20%5B320x200%5D.JPG" title="Queen????"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							This is how she normally gets to her classes!!!!&nbsp; lol</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20044%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="cool man "> <img alt="cool man - &lt;p&gt;nice!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20044%20%5B320x200%5D.JPG" title="cool man"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							nice!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20005%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Role play at school "> <img alt="Role play at school - &lt;p&gt;Sitting at a bus stop with CREEPY Jo!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20005%20%5B320x200%5D.JPG" title="Role play at school"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Sitting at a bus stop with CREEPY Jo!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20028%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Role play at school "> <img alt="Role play at school - &lt;p&gt;Role play at school&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20028%20%5B320x200%5D.JPG" title="Role play at school"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Role play at school</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20031%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Role play against an attacker "> <img alt="Role play against an attacker - &lt;p&gt;Good job girls, get away fast!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20031%20%5B320x200%5D.JPG" title="Role play against an attacker"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Good job girls, get away fast!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20012%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Getting away from attacker "> <img alt="Getting away from attacker - &lt;p&gt;hold that boundary strong!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20012%20%5B320x200%5D.JPG" title="Getting away from attacker"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							hold that boundary strong!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20042%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="great acting!! "> <img alt="great acting!! - &lt;p&gt;Now take an exit fast!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20042%20%5B320x200%5D.JPG" title="great acting!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Now take an exit fast!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20015%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="getting away from attacker "> <img alt="getting away from attacker - &lt;p&gt;Put your angry face on !!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20015%20%5B320x200%5D.JPG" title="getting away from attacker"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Put your angry face on !!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20045%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="We Love KK &lt;p&gt;We Love Konfident Kidz!!!&lt;/p&gt;"> <img alt="We Love KK - &lt;p&gt;We Love Konfident Kidz!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20045%20%5B320x200%5D.JPG" title="We Love KK"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							We Love Konfident Kidz!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20056%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Da Boys!! &lt;p&gt;Check out what we got for Graduation!!!&lt;/p&gt;"> <img alt="Da Boys!! - &lt;p&gt;Check out what we got for Graduation!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20056%20%5B320x200%5D.JPG" title="Da Boys!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Check out what we got for Graduation!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20058%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Graduation day!! &lt;p&gt;Well done guys and girls!!!!&amp;nbsp; Graduation!!!!&lt;/p&gt;"> <img alt="Graduation day!! - &lt;p&gt;Well done guys and girls!!!!&amp;nbsp; Graduation!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20058%20%5B320x200%5D.JPG" title="Graduation day!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Well done guys and girls!!!!&nbsp; Graduation!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20061%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Girls Graduation day!! &lt;p&gt;Awesome work ladies, remember those skills!!!!!!&lt;/p&gt;"> <img alt="Girls Graduation day!! - &lt;p&gt;Awesome work ladies, remember those skills!!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20061%20%5B320x200%5D.JPG" title="Girls Graduation day!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Awesome work ladies, remember those skills!!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20062%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="girls graduation &lt;p&gt;Good job chooks!!!!!!!&amp;nbsp; awesome work!!&lt;/p&gt;"> <img alt="girls graduation - &lt;p&gt;Good job chooks!!!!!!!&amp;nbsp; awesome work!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20062%20%5B320x200%5D.JPG" title="girls graduation"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Good job chooks!!!!!!!&nbsp; awesome work!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20070%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="boys doing role play &lt;p&gt;I can feel the butterflies.......&lt;/p&gt;"> <img alt="boys doing role play - &lt;p&gt;I can feel the butterflies.......&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20070%20%5B320x200%5D.JPG" title="boys doing role play"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							I can feel the butterflies.......</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20097%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="realistic Role play!! &lt;p&gt;Ahhhhhhh, Freaky!!!!!!&lt;/p&gt;"> <img alt="realistic Role play!! - &lt;p&gt;Ahhhhhhh, Freaky!!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20097%20%5B320x200%5D.JPG" title="realistic Role play!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Ahhhhhhh, Freaky!!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20079%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="getting away from attacker &lt;p&gt;Yell loud!!!!&lt;/p&gt;"> <img alt="getting away from attacker - &lt;p&gt;Yell loud!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20079%20%5B320x200%5D.JPG" title="getting away from attacker"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Yell loud!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20104%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="stand strong &lt;p&gt;awesome work!!!&lt;/p&gt;"> <img alt="stand strong - &lt;p&gt;awesome work!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20104%20%5B320x200%5D.JPG" title="stand strong"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							awesome work!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20116%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Woo Hoo Yell Loud!!! &lt;p&gt;Great acting!!!&amp;nbsp; This is a cool picture!!!&lt;/p&gt;"> <img alt="Woo Hoo Yell Loud!!! - &lt;p&gt;Great acting!!!&amp;nbsp; This is a cool picture!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20116%20%5B320x200%5D.JPG" title="Woo Hoo Yell Loud!!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Great acting!!!&nbsp; This is a cool picture!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20134%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Everyone working!! &lt;p&gt;Great working class, get those ideas on paper!!&lt;/p&gt;"> <img alt="Everyone working!! - &lt;p&gt;Great working class, get those ideas on paper!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20134%20%5B320x200%5D.JPG" title="Everyone working!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Great working class, get those ideas on paper!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20135%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="hmmmmmmm??? &lt;p&gt;Hmmmm, Do you know who this is????&amp;nbsp; He is a lefty..........&amp;nbsp; : )&lt;/p&gt;"> <img alt="hmmmmmmm??? - &lt;p&gt;Hmmmm, Do you know who this is????&amp;nbsp; He is a lefty..........&amp;nbsp; : )&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20135%20%5B320x200%5D.JPG" title="hmmmmmmm???"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Hmmmm, Do you know who this is????&nbsp; He is a lefty..........&nbsp; : )</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20136%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="hmmm what about this guy??? &lt;p&gt;hmmmm, what about this guy??? He is a lefty too!!!!!&lt;/p&gt;"> <img alt="hmmm what about this guy??? - &lt;p&gt;hmmmm, what about this guy??? He is a lefty too!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20136%20%5B320x200%5D.JPG" title="hmmm what about this guy???"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							hmmmm, what about this guy??? He is a lefty too!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20139%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Good listening girls!! &lt;p&gt;Doing some good listening there!!&lt;/p&gt;"> <img alt="Good listening girls!! - &lt;p&gt;Doing some good listening there!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20139%20%5B320x200%5D.JPG" title="Good listening girls!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Doing some good listening there!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20140%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="And some good reading!! &lt;p&gt;And some good reading!!!!!&lt;/p&gt;"> <img alt="And some good reading!! - &lt;p&gt;And some good reading!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20140%20%5B320x200%5D.JPG" title="And some good reading!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							And some good reading!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20141%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="boys reading in class &lt;p&gt;good job boys!!&lt;/p&gt;"> <img alt="boys reading in class - &lt;p&gt;good job boys!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20141%20%5B320x200%5D.JPG" title="boys reading in class"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							good job boys!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20143%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Great picture!!!! &lt;p&gt;I Like Konfident Kidz!!! The games are cool!!&lt;/p&gt;"> <img alt="Great picture!!!! - &lt;p&gt;I Like Konfident Kidz!!! The games are cool!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20143%20%5B320x200%5D.JPG" title="Great picture!!!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							I Like Konfident Kidz!!! The games are cool!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20144%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Thanks for teaching us!! &lt;p&gt;Thanks for teaching us!!&lt;/p&gt;"> <img alt="Thanks for teaching us!! - &lt;p&gt;Thanks for teaching us!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20144%20%5B320x200%5D.JPG" title="Thanks for teaching us!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Thanks for teaching us!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20145%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="happy graduation!! &lt;p&gt;Well done everyone!!&lt;/p&gt;"> <img alt="happy graduation!! - &lt;p&gt;Well done everyone!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20145%20%5B320x200%5D.JPG" title="happy graduation!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Well done everyone!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/good%20size/school%20iphone%20146%20%5B320x200%5D.JPG" rel="lytebox[Good pics 2010]" title="Super!!! &lt;p&gt;Thanks kids for making our programme sooo much fun!!! We had a blast teaching you all!!&amp;nbsp; Big love&lt;/p&gt;"> <img alt="Super!!! - &lt;p&gt;Thanks kids for making our programme sooo much fun!!! We had a blast teaching you all!!&amp;nbsp; Big love&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/good%20size/thumb_school%20iphone%20146%20%5B320x200%5D.JPG" title="Super!!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Thanks kids for making our programme sooo much fun!!! We had a blast teaching you all!!&nbsp; Big love</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/Andrew%20climbed%20that%21%21Wow%20%5B320x200%5D.jpg" rel="lytebox[Good pics 2010]" title="Andrew climbed that!!Wow "> <img alt="Andrew climbed that!!Wow - &lt;p&gt;Andrew thats amazing!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/thumb_Andrew%20climbed%20that%21%21Wow%20%5B320x200%5D.jpg" title="Andrew climbed that!!Wow"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Andrew thats amazing!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/Andrew%20up%20the%20mountain%202%20%5B320x200%5D.jpg" rel="lytebox[Good pics 2010]" title="Andrew up the mountain "> <img alt="Andrew up the mountain - &lt;p&gt;Go the KK flag!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/thumb_Andrew%20up%20the%20mountain%202%20%5B320x200%5D.jpg" title="Andrew up the mountain"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Go the KK flag!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/Andrew%20up%20the%20mountain%20%5B320x200%5D.jpg" rel="lytebox[Good pics 2010]" title="Andrew up the mountain  "> <img alt="Andrew up the mountain  - &lt;p&gt;Awesome effort!!!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/thumb_Andrew%20up%20the%20mountain%20%5B320x200%5D.jpg" title="Andrew up the mountain "></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Awesome effort!!!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/Brrrrr%20Chilly%20%5B320x200%5D.jpg" rel="lytebox[Good pics 2010]" title="Brrrrr Chilly "> <img alt="Brrrrr Chilly - &lt;p&gt;Freeeeeezing!!!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/thumb_Brrrrr%20Chilly%20%5B320x200%5D.jpg" title="Brrrrr Chilly"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Freeeeeezing!!!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n	<li class="thumb">\n		<table class="thumbimg" width="100">\n			<tbody>\n				<tr>\n					<td valign="top">\n						<a href="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/Nice%20hat%20Andrew%21%21%20%5B320x200%5D.jpg" rel="lytebox[Good pics 2010]" title="Nice hat Andrew!! "> <img alt="Nice hat Andrew!! - &lt;p&gt;Cant wait to see where your gonna go next!!!!!!&lt;/p&gt;" src="http://www.konfidentkidzone.com/uploads/images/andrews%20good%20size/thumb_Nice%20hat%20Andrew%21%21%20%5B320x200%5D.jpg" title="Nice hat Andrew!!"></a></td>\n				</tr>\n				<tr>\n					<td>\n						<div class="space">\n							&nbsp;</div>\n						<p>\n							Cant wait to see where your gonna go next!!!!!!</p>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n	</li>\n</ul>\n<p>\n	&nbsp;</p>\n', 1);

-- --------------------------------------------------------

--
-- Table structure for table `page_permissions`
--

CREATE TABLE IF NOT EXISTS `page_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) DEFAULT NULL,
  `page_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=362 ;

--
-- Dumping data for table `page_permissions`
--

INSERT INTO `page_permissions` (`id`, `group_id`, `page_id`, `user_id`) VALUES
(1, 1, 1, NULL),
(2, 2, 1, NULL),
(3, 3, 1, NULL),
(361, 1, 21, NULL),
(5, 1, 37, NULL),
(6, 2, 37, NULL),
(7, 3, 37, NULL),
(8, 3, 43, NULL),
(9, 1, 51, NULL),
(10, 2, 51, NULL),
(11, 3, 51, NULL),
(12, 1, 53, NULL),
(13, 2, 53, NULL),
(14, 3, 53, NULL),
(131, 2, 56, NULL),
(130, 1, 56, NULL),
(17, 3, 56, NULL),
(116, 1, 55, NULL),
(117, 2, 55, NULL),
(20, 3, 55, NULL),
(123, 2, 57, NULL),
(122, 1, 57, NULL),
(23, 3, 57, NULL),
(24, 1, 51, NULL),
(25, 1, 51, NULL),
(64, 1, 63, NULL),
(65, 2, 63, NULL),
(68, 1, 64, NULL),
(69, 2, 64, NULL),
(74, 1, 65, NULL),
(75, 2, 65, NULL),
(108, 1, 66, NULL),
(109, 2, 66, NULL),
(110, 1, 67, NULL),
(111, 2, 67, NULL),
(134, 1, 68, NULL),
(135, 2, 68, NULL),
(167, 1, 69, NULL),
(168, 2, 69, NULL),
(150, 1, 70, NULL),
(151, 2, 70, NULL),
(161, 2, 73, NULL),
(160, 1, 73, NULL),
(194, 2, 72, NULL),
(193, 1, 72, NULL),
(198, 2, 74, NULL),
(197, 1, 74, NULL),
(359, 1, 0, NULL),
(360, 2, 0, NULL),
(183, 1, 76, NULL),
(184, 2, 76, NULL),
(207, 1, 77, NULL),
(208, 2, 77, NULL),
(209, 1, 78, NULL),
(210, 2, 78, NULL),
(211, 3, 78, NULL),
(212, 1, 79, NULL),
(213, 2, 79, NULL),
(214, 3, 79, NULL),
(355, 1, 80, NULL),
(356, 2, 80, NULL),
(217, 3, 80, NULL),
(218, 3, 81, NULL),
(323, 1, 82, NULL),
(324, 2, 82, NULL),
(221, 3, 82, NULL),
(348, 2, 91, NULL),
(347, 1, 91, NULL),
(232, 1, 86, NULL),
(225, 3, 84, NULL),
(233, 2, 86, NULL),
(234, 1, 85, NULL),
(235, 2, 85, NULL),
(240, 1, 87, NULL),
(241, 2, 87, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plugins`
--

CREATE TABLE IF NOT EXISTS `plugins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(60) NOT NULL DEFAULT '',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=79 ;

--
-- Dumping data for table `plugins`
--

INSERT INTO `plugins` (`id`, `reference`, `enabled`) VALUES
(50, 'aurora.settings', 1),
(52, 'imageGallery', 1),
(53, 'fileuploader', 1),
(54, 'google.map', 0),
(55, 'minecraftServer', 0),
(57, 'aurora.behaviours', 1),
(59, 'aurora.dom', 1),
(58, 'aurora.debug', 1),
(60, 'plc', 1),
(61, 'ckeditor', 1),
(62, 'google.graph', 1),
(63, 'jquery.visualize', 0),
(64, 'aurora.pathThemes', 1),
(76, 'aurora.tables', 1),
(66, 'aurora.administration', 1),
(67, 'jquery.json', 1),
(70, 'messorAuthenticator', 1),
(69, 'aurora.urlclean', 1),
(77, 'addOne', 0);

-- --------------------------------------------------------

--
-- Table structure for table `plugin_dependencies`
--

CREATE TABLE IF NOT EXISTS `plugin_dependencies` (
  `dependencyId` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(20) NOT NULL,
  `dependency` varchar(20) NOT NULL,
  PRIMARY KEY (`dependencyId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `plugin_dependencies`
--

INSERT INTO `plugin_dependencies` (`dependencyId`, `reference`, `dependency`) VALUES
(1, 'webpage_settings', 'auroraBaseWidgets'),
(2, 'plc', 'google.graph'),
(3, 'auroraBaseWidgets', 'jquery.json'),
(4, 'auroraBaseWidgets', 'aurora.debug'),
(6, 'auroraBaseWidgets', 'aurora.tables');

-- --------------------------------------------------------

--
-- Table structure for table `plugin_permissions`
--

CREATE TABLE IF NOT EXISTS `plugin_permissions` (
  `plugin_permission_id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(20) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`plugin_permission_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `plugin_permissions`
--

INSERT INTO `plugin_permissions` (`plugin_permission_id`, `reference`, `group_id`, `user_id`) VALUES
(1, 'editPage', NULL, NULL),
(2, 'deletePage', NULL, NULL),
(3, 'editPage', 3, NULL),
(4, 'deletePage', 3, NULL),
(5, 'editTemplate', NULL, NULL),
(6, 'createPage', NULL, NULL),
(7, 'createPage', 3, NULL),
(8, 'editTemplate', 3, NULL),
(9, 'imageGallery_admin', 3, NULL),
(10, 'viewPage', 3, NULL),
(11, 'editPage', 2, NULL),
(12, 'createPage', 2, NULL),
(13, 'editTemplate', 2, NULL),
(14, 'imageGallery_admin', 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `description` varchar(40) NOT NULL,
  `name` varchar(40) NOT NULL,
  `value` text NOT NULL,
  `formatString` text NOT NULL,
  `plugin` varchar(20) NOT NULL DEFAULT '0',
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`description`, `name`, `value`, `formatString`, `plugin`) VALUES
('Script Path', 'aurora_scriptPath', 'http://glenrd.dontexist.net/', 'text:40:0', 'aurora'),
('Website Status', 'aurora_pageEnabled', '1', 'check:Online:1|check:Under Construction:0', 'aurora'),
('Under construction display', 'aurora_disabledText', 'This website is currently under construction', 'textarea:5:35', 'aurora'),
('Theme', 'aurora_theme', '6', 'select:<THEME_SELECT>', 'aurora'),
('Secure Path', 'aurora_secureScriptPath', 'http://glenrd.dontexist.net/', 'text:40:0', 'aurora'),
('Allow registration', 'aurora_allowRegistration', '0', 'check:Yes:1|check:No:0', 'aurora'),
('Allow password recovery', 'aurora_allowPasswordRecovery', '1', 'check:Yes:1|check:No:0', 'aurora'),
('Allow Cookies', 'aurora_allowCookies', '1', 'check:Yes:1|check:No:0', 'aurora'),
('Application / Site Name', 'aurora_site_name', 'Ultimate Minecraft!', 'text:40:0', 'aurora'),
('Data Update Time (ms)', 'aurora_updateTime', '5000', 'text:0:40', 'aurora'),
('', 'aurora_appendIndexToUrl', '1', 'check:Yes:1|check:No:0', 'aurora'),
('Secret Passphraise', 'aurora_secret', 'ujf83kgf.,zsi205kjg-;fgpe34?/', 'text:0:40', 'aurora'),
('Maximum Temp Uploaded Avatar Size (bytes', 'aurora_avatarMaxUploadSizeBytes', '500000', 'text:15:0', 'aurora'),
('Allow animated GIF avatar uploads', 'aurora_allowAnimatedGif', '0', 'check:Yes:1|check:No:0', 'aurora'),
('Use image links for menu', 'aurora_imageLinks', '1', 'text:40:0', 'aurora'),
('Forgotten Password Email Name', 'aurora_forgottenPasswordName', 'Aurora Mailer', 'text:40:0', 'aurora'),
('Forgotten Password Email Address', 'aurora_forgottenPasswordAddress', 'noreply@zysen.geek.nz', 'text:40:0', 'aurora'),
('User Identity Display', 'aurora_userDisplay', '3', 'check:Username:1|check:<br />First Name:2|check:<br />Full Name:3', 'aurora'),
('Avatar Width', 'aurora_avatarWidth', '200', 'text:0:40', 'aurora'),
('Avatar Maximum Height', 'aurora_avatarHeight', '200', 'text:0:40', 'aurora'),
('Default Action', 'aurora_defaultAction', 'home', 'text:40:0', 'aurora'),
('', 'aurora_urlclean_search', 'page=', 'text:40:40', 'aurora_urlclean'),
('Static Page Uploaded Image Height', 'uploadedImage_maxHeight', '800', 'text:40:0', 'aurora'),
('Static Page Uploaded Image Width', 'uploadedImage_maxWidth', '800', 'text:40:0', 'aurora'),
('Require Email Validation', 'aurora_requireEmailValidation', '0', 'text:0:40', 'aurora'),
('Compile Javascript with Google Closure', 'closure_compile', '0', 'check:Yes:1|check:No:0', 'aurora'),
('', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE IF NOT EXISTS `themes` (
  `theme_id` int(11) NOT NULL AUTO_INCREMENT,
  `theme_name` varchar(25) NOT NULL,
  `theme_content` text NOT NULL,
  `theme_noPage` text NOT NULL,
  `theme_noPermission` text NOT NULL,
  PRIMARY KEY (`theme_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `themes`
--

INSERT INTO `themes` (`theme_id`, `theme_name`, `theme_content`, `theme_noPage`, `theme_noPermission`) VALUES
(6, 'ultimateminecraft', '<DIV style="BACKGROUND-IMAGE: url(http://glenrd.dontexist.net/themes/ultimateminecraft/sky.png)" id=sky><A href="http://glenrd.dontexist.net//"><IMG id=logo alt="" src="http://glenrd.dontexist.net/themes/ultimateminecraft/logo.png"> </A><IMG id=banner alt="" src="http://glenrd.dontexist.net/themes/ultimateminecraft/skull.png"></DIV>\r\n<DIV id=menu>\r\n<UL>\r\n<LI><A href="javascript:loadPage(''home'');">Home</A></LI>\r\n<LI><A href="javascript:loadPage(''factions'');">Factions</A></LI>\r\n<LI><A href="javascript:loadPage(''players'');">Players</A></LI>\r\n<LI><A href="javascript:loadPage(''stats'');">Statistics</A></LI>\r\n<LI><A href="javascript:loadPage(''map'')">World Map</A></LI>\r\n<LI><A href="javascript:loadPage(''wiki'');">Wiki</A></LI></UL></DIV>\r\n<DIV id=content></DIV>', '<div style=\\"font-size: 14pt; color:#000000;font-weight: bold;\\">Opps!</div>\r\nThis is not the page you are looking for.', '<div style=\\"font-size: 14pt; color:#000000;font-weight: bold;\\">Sorry </div>But your not allowed to access this page.\r\n\r\n<div style="text-align:center;">\r\n	<form action="" autocomplete="off" id="loginBox" method="post" style="margin: 0 auto; width: 307px; text-align:left;">\r\n		<table style=" height: 176px;">\r\n			<tbody>\r\n				<tr>\r\n					<td style="text-align: right;">\r\n						Email:</td>\r\n					<td>\r\n						<input id="loginBoxEmail" name="emailAddress" size="15" tabindex="1" type="text"></td>\r\n				</tr>\r\n				<tr>\r\n					<td style="text-align: right;">\r\n						Password:</td>\r\n					<td>\r\n						<input name="password" size="15" tabindex="2" type="password"></td>\r\n				</tr>\r\n				<tr>\r\n					<td style="text-align: right;">\r\n						Remember Me?</td>\r\n					<td>\r\n						<input name="remember" tabindex="3" type="checkbox"></td>\r\n				</tr>\r\n				<tr>\r\n					<td>\r\n						&nbsp;</td>\r\n					<td>\r\n						<input name="login" tabindex="4" value="Login" type="submit"><input name="login" value="loginSubmit" type="hidden"></td>\r\n				</tr>\r\n			</tbody>\r\n		</table>\r\n	</form>\r\n</div>\r\n'),
(7, 'bemis', '<div style="width: 1920px;height: 1080;overflow: hidden;">\r\n<div id="banner" style="background-image: url(''<ROOT_URL>themes/bemis/banner.png'');">&nbsp;</div>\r\n<div class="themeAuroraContent" id="content"><page_content></page_content></div>', '<div style=\\"font-size: 14pt; color:#000000;font-weight: bold;\\">Opps!</div>\r\nThis is not the page you are looking for.', '<div style=\\"font-size: 14pt; color:#000000;font-weight: bold;\\">Sorry </div>But your not allowed to access this page.'),
(9, 'konfidentkidz', '<div>\n	<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" data="http://glenrd.dontexist.net/themes/konfidentkidz/menu_v8.swf" height="202" width="1000"><param name="quality" value="high"><param name="movie" value="http://glenrd.dontexist.net/themes/konfidentkidz/menu_v8.swf"><embed pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" src="http://glenrd.dontexist.net/themes/konfidentkidz/menu_v8.swf" type="application/x-shockwave-flash" height="202" width="1000"></object><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" data="http://glenrd.dontexist.net/themes/konfidentkidz/header_v8.swf" height="414" width="1000"><param name="quality" value="high"><param name="movie" value="http://glenrd.dontexist.net/themes/konfidentkidz/header_v8.swf"><embed pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" src="http://glenrd.dontexist.net/themes/konfidentkidz/header_v8.swf" type="application/x-shockwave-flash" height="414" width="1000"></object><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" data="http://glenrd.dontexist.net/themes/konfidentkidz/banner_v8.swf" height="145" width="1000"><param name="quality" value="high"><param name="movie" value="http://glenrd.dontexist.net/themes/konfidentkidz/banner_v8.swf"><embed pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" src="http://glenrd.dontexist.net/themes/konfidentkidz/banner_v8.swf" type="application/x-shockwave-flash" height="145" width="1000"></object></div>\n<div style="text-align: center">\n	<div style="width: 1000px; text-align: center; margin: 0 auto;">\n		<img alt="" src="http://glenrd.dontexist.net/themes/konfidentkidz/bg_top.png" style="position: relative; bottom: -15px;">\n		<div style="background: url(''http://glenrd.dontexist.net/themes/konfidentkidz/bg_middle.png''); text-align: center;margin: 0 auto; padding: 0;">\n			<div id="content"><page_content></page_content></div>\n		</div>\n		<img alt="" src="http://glenrd.dontexist.net/themes/konfidentkidz/bg_bottom.png" style="position: relative; top: -3px;"></div>\n</div>\n', 'The page you are looking or does not exist', 'You do not have permission to view this page.');

-- --------------------------------------------------------

--
-- Table structure for table `uploadedfile`
--

CREATE TABLE IF NOT EXISTS `uploadedfile` (
  `upload_id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'owner',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`upload_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=30 ;

--
-- Dumping data for table `uploadedfile`
--

INSERT INTO `uploadedfile` (`upload_id`, `filename`, `user_id`, `timestamp`) VALUES
(1, 'image/jpeg', 1, '2011-11-24 00:31:26'),
(2, 'image/jpeg', 1, '2011-11-24 00:37:13'),
(3, 'image/jpeg', 1, '2011-11-24 00:37:57'),
(4, 'image/jpeg', 1, '2011-11-24 00:42:30'),
(5, 'image/jpeg', 1, '2011-11-24 00:43:19'),
(6, 'image/jpeg', 1, '2011-11-24 00:45:35'),
(7, 'image/jpeg', -1, '2011-11-24 01:57:53'),
(8, 'image/jpeg', -1, '2011-11-24 02:41:56'),
(9, 'image/jpeg', -1, '2011-11-24 02:43:01'),
(10, 'image/jpeg', 1, '2011-11-24 02:50:01'),
(11, 'image/jpeg', 1, '2011-11-24 02:52:08'),
(12, 'image/jpeg', 1, '2011-11-24 02:52:11'),
(13, 'image/jpeg', 1, '2011-11-24 02:52:11'),
(14, 'image/jpeg', 1, '2011-11-24 02:52:11'),
(15, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(16, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(17, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(18, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(19, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(20, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(21, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(22, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(23, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(24, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(25, 'image/jpeg', 1, '2011-11-24 02:52:26'),
(26, 'image/jpeg', 1, '2011-11-24 02:56:28'),
(27, 'image/jpeg', 1, '2011-11-24 02:56:34'),
(28, 'image/jpeg', 1, '2011-11-24 02:56:47'),
(29, 'image/jpeg', 1, '2011-11-26 10:18:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(30) NOT NULL DEFAULT '',
  `lastname` varchar(30) NOT NULL DEFAULT '',
  `username` varchar(30) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `group_id` int(11) NOT NULL DEFAULT '0',
  `validated` int(11) NOT NULL DEFAULT '0',
  `validation_code` text NOT NULL,
  `loggedIn` int(1) NOT NULL DEFAULT '0',
  `gender` char(1) NOT NULL,
  `dob` date NOT NULL,
  `country` text NOT NULL,
  `hearabout` text NOT NULL,
  `avatarFileExt` varchar(6) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=90 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `username`, `password`, `email`, `group_id`, `validated`, `validation_code`, `loggedIn`, `gender`, `dob`, `country`, `hearabout`, `avatarFileExt`) VALUES
(77, 'Taron', 'Stembridge', 'Duffman', '46e596fe953c17e8ebeadf8c544bf78e', 'duffman@paradise.net.nz', 3, 1, '', 0, 'M', '2012-01-10', '', '', ''),
(64, 'Jay', 'Shepherd', 'Zysen', 'cc9e4bb981e0591e9da7a2566d0cabe2', 'jay@zylex.net.nz', 3, 1, '', 0, 'M', '2012-01-01', '', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
