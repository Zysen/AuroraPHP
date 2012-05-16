-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 11, 2012 at 03:33 PM
-- Server version: 5.1.62
-- PHP Version: 5.3.6-13ubuntu3.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `aurora`
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
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL DEFAULT '',
  `locked` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `name`, `locked`) VALUES
(1, 'Public', 1),
(3, 'Administrators', 1),
(2, 'Moderators', 1);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=109 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`page_id`, `title`, `content`, `user_id`) VALUES
(1, 'home', '\n		<h1>\n			Welcome to Aurora</h1>\n		<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n			Aurora is a web based application framework designed to take advantage of HTML5, jQuery, CkEditor and Functional Reactive Programming. Using Flapjax to implement FRP Aurora offers a flexible, scalable and powerful data processing model. Whats more, that data processing model also handles user interactions and system events in one clean structure that eliminates boiler-plate code. Allowing the developer to only write the real logic for the program and have the system take care of the nitty gritty.</p>\n		<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n			"Keeping things consistent should be viewed as the responsibility of the language, rather than the responsibility of the developer."<span style="font-size: 11px; "><em>-Shriram Krishnamurthi</em></span></p>\n		<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n			This powerful data and interaction processing model sits on top of an easy to use page, plugin and widget system. We use CkEditor to make it easy for the user to create rich, well-formatted documents. Using widgets you can add dyanmic, interactive elements to those documents.</p>\n	', 1),
(21, 'login', '<div style="text-align:center;">\n	<form action="" autocomplete="off" id="loginBox" method="post" style="margin: 0 auto; width: 307px; text-align:left;">\n		<table style=" height: 176px;">\n			<tbody>\n				<tr>\n					<td style="text-align: right;">\n						Email:</td>\n					<td>\n						<input id="loginBoxEmail" name="emailAddress" size="15" tabindex="1" type="text"></td>\n				</tr>\n				<tr>\n					<td style="text-align: right;">\n						Password:</td>\n					<td>\n						<input name="password" size="15" tabindex="2" type="password"></td>\n				</tr>\n				<tr>\n					<td style="text-align: right;">\n						Remember Me?</td>\n					<td>\n						<input name="remember" tabindex="3" type="checkbox"></td>\n				</tr>\n				<tr>\n					<td>\n						&nbsp;</td>\n					<td>\n						<input name="login" tabindex="4" value="Login" type="submit"><input name="login" value="loginSubmit" type="hidden"></td>\n				</tr>\n			</tbody>\n		</table>\n	</form>\n</div>\n<p>\n	&nbsp;</p>\n', 1),
(43, 'admin', '<h1>\n	Administration</h1>\n<p>\n	<a href="http://glenrd.dontexist.net/admin/settings">General Settings</a></p>\n<p>\n	<a href="http://glenrd.dontexist.net/admin/users">User Management</a></p>\n<p>\n	<a href="http://glenrd.dontexist.net/admin/plugins">Plugin Management</a></p>\n', 1),
(71, 'admin/settings', '<h1>\n	General Settings</h1>\n<p>\n	<img alt="{}" class="widget_WebpageSettingsWidget" src="resources/noWidget.png"></p>\n', 1),
(68, 'No Page', '<div style="font-size: 14pt; color:#000000;font-weight: bold;">\n	Opps!</div>\n<p>\n	This is not the page you are looking for.</p>\n', 1),
(81, 'admin/plugins', '<h1>\n	Plugin Management</h1>\n<div>\n	<img class="widget_PluginManagerWidget" src="http://glenrd.dontexist.net/content/noWidget.png" style="width: 256px; height: 365px;"></div>\n', 1),
(84, 'admin/users', '<h1>\n	User Management</h1>\n<h2>\n	Users</h2>\n<p>\n	<img alt="" class="widget_UsersManagerWidget" src="http://glenrd.dontexist.net/plugins/aurora.administration/usersWidget.png" style="width: 865px; height: 110px;"></p>\n<h2>\n	Groups</h2>\n<p>\n	<img alt="{}" class="widget_GroupsManagerWidget" src="https://glenrd.dontexist.net/plugins/aurora.administration/groupWidget.png" style="width: 213px; height: 133px;"></p>\n<h2>\n	Permissions</h2>\n<p>\n	<img alt="{}" class="widget_BehaviourPermissionsWidget" src="http://glenrd.dontexist.net/content/nowidget.png" style="width: 213px; height: 133px;"></p>\n', 1),
(101, 'admin/permissions', '<img class="widget_BehaviourPermissionsWidget" src="content/nowidget.png" alt="">', 64);
INSERT INTO `pages` (`page_id`, `title`, `content`, `user_id`) VALUES
(104, 'docs', '<h1>\n	Documentation</h1>\n<ol class="toc">\n	<li>\n		Installation</li>\n	<li>\n		User Documentation\n		<ol>\n			<li>\n				Creating and Managing Pages</li>\n			<li>\n				User Management</li>\n		</ol>\n	</li>\n	<li>\n		Developer Documentation\n		<ol>\n			<li>\n				System Description\n				<ol>\n					<li>\n						Introduction</li>\n					<li>\n						<a href="http://glenrd.dontexist.net/docs#staticpages" style="color: rgb(255, 255, 255); text-decoration: none;">Static Pages</a></li>\n					<li>\n						<a href="http://glenrd.dontexist.net/docs#frp" style="color: rgb(255, 255, 255); text-decoration: underline;">Functional Reactive Programming</a></li>\n					<li>\n						<a href="http://glenrd.dontexist.net/docs#flapjax" style="color: rgb(255, 255, 255); text-decoration: none;">Flapjax</a></li>\n					<li>\n						<a href="http://glenrd.dontexist.net/docs#inverseBehaviours" style="color: rgb(255, 255, 255); text-decoration: none;">Inverse Behaviours</a></li>\n					<li>\n						<a href="http://glenrd.dontexist.net/docs#plugins" style="color: rgb(255, 255, 255); text-decoration: none;">Plugins</a></li>\n					<li>\n						<a href="http://glenrd.dontexist.net/docs#widgets" style="color: rgb(255, 255, 255); text-decoration: none;">Widgets</a></li>\n					<li>\n						<a href="http://glenrd.dontexist.net/docs#tables" style="color: rgb(255, 255, 255); text-decoration: none;">Tables</a></li>\n				</ol>\n			</li>\n			<li>\n				Tutorials\n				<ol>\n					<li>\n						Using Flapjax</li>\n					<li>\n						Using liftBI</li>\n					<li>\n						Creating Plugins</li>\n					<li>\n						Creating Remote Behaviours</li>\n					<li>\n						Working with DataTables</li>\n				</ol>\n			</li>\n			<li>\n				Reference\n				<ol>\n					<li>\n						Behaviour Reference</li>\n					<li>\n						Function Reference</li>\n					<li>\n						System Object</li>\n				</ol>\n			</li>\n		</ol>\n	</li>\n</ol>\n<h1>\n	Installation</h1>\n<h1>\n	User Documentation</h1>\n<h1>\n	Developer Documentation</h1>\n<p>\n	&nbsp;</p>\n<h2>\n	<a href="http://glenrd.dontexist.net/docs" id="staticpages">Static Pages</a></h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Pages are created and modified using the CkEditor WYSIWYG plugin. When logged in as a user with the correct permissions an edit button and a delete button will appear in the top right corner on every page. Clicking this will turn the page into an editable space using CkEditor. You can now make changes, just like a word processor and click the save button when you are done. If you are on the home page of the site, the editor will let you change the theme or template design also. This is for making changes that are visible on every page. When you click save you will be asked to pick which user groups are allowed to view the page.</p>\n<h2 style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	<a href="http://glenrd.dontexist.net/docs" id="frp" style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); text-decoration: none; ">Functional Reactive Programming</a></h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	In an FRP system you build functional blocks that have inputs, an output and a transformation. Each block reacts when its parents input values change and its reaction is to recalculate and output to its children. Each block is used to form a tree structure of data dependancies. This tree also serves as the applications database but it includes transformations on the raw data as new database values that can be extracted at any time. Whats more, the database is constantly keeping itself updated and the gui can then react to the changes in the database and redraw itself accordingly.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Often combining these two systems can be very problematic and you end up with sequencing issues and state bugs just to name a few.</p>\n<h2 style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	<a href="http://glenrd.dontexist.net/docs" id="flapjax" style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); text-decoration: none; ">Flapjax</a></h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Flapjax is an implementation of FRP written in JavaScript and we use it to drive the data flow in our system. Using FRP principals FlapJax solves the problem of marrying interactivity and computation. The problem is that the structure of a user interaction and the structure of a data transformation are very different. Consider a user click, an IO ready and a change to a variable. Each are usually handled in very different ways with alot of boilerplate code, but each of them can be thought of as some data attached to an event.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Flapjax provides events and behaviours that form the nodes in an FRP tree. Using this model user interactions, IO changes and data changes are all treated the same way. This allows for a much better structure which scales up very well.<br>\n	<br>\n	In flapjax it is important to be aware of the difference between behaviours and events. An event does not retain any data, whereas a behaviour has variable data which changes with each event and is triggered by (N) parent behaviours. In Flapjax the convention is to end event variable names with an ''E'' and to end behaviour variable names with a ''B''. We have adoped this convention and use an ''R'' on the variable names of remote behaviours. Which you will read about in the next section.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Flapjax implements the FRP programming paradigm and comes as its own language or as a javascript library. This framrwork uses Flapjax as a library.</p>\n<h2 style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Remote Behaviours</h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Remote behaviours are used to synchronize data between the client and the server. Remote behaviours sit at the top of the tree and are implemented using client and server side code. Variable names for remote behaviours usually end in an R to avoid confusion. For example an event might be positionUpdateE, a behaviour might be positionUpdateB and a remote behaviour would be positionUpdateR.</p>\n<pre class="codeStyle" style="background-color: gray; display: block; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-image: initial; margin-top: 10px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; "> var dataR = DATA.getRemote(behaviourKey, behaviourContext, [initialValue], [pollRate]);\n\n#Example\nvar usersR= DATA.getRemote("aurora_users", "", NOT_READY, POLL_RATES.VERY_FAST);\nvar usersB = usersR.behaviour;\n</pre>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Remote behaviours take a string key, a string context an optional initial value and an optional poll rate. On the server side specific code is executed to calculate the value for the behaviour key, the context is passed along as an argument to the calculation. If not specified the initial value will be NOT_READY which is a constant that is used to signal that a behaviour is not ready. If not specified a poll rate of POLL_RATES.SLOW will be used. Options are ONCE, VERY_SLOW, SLOW, NORMAL, FAST and VERY_FAST.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	More information can be found in the Tutorial "Creating Remote Behaviours"</p>\n<h2 style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	<a href="http://glenrd.dontexist.net/docs" id="inverseBehaviours" style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); text-decoration: none; ">Inverse Behaviours</a></h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Now its time to introduce another concept, inversable behaviours which turn the FRP tree into a graph. Our addition to FlapJax was liftBI which will lift some data into a behaviour that has both a downwards and an upwards transformation function. You might be asking why this is important and the answer is mostly for encapsulation.</p>\n<pre class="codeStyle" style="background-color: gray; display: block; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-image: initial; margin-top: 10px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">liftBI(fd,fu, arg_1, ..., arg_n)</pre>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Typically data flows from its source at the top of the tree downwards until the leaf nodes render the changes. Behaviours only need to know what their parents look like to be able to respond to the parents updates. However if user interactions change the data, events are fired at some points in the tree. If its a global change then the source data (usually the server-side database) is updated and then updates filter down the tree. The problem with this is that the user interaction events must know what the nodes they are effecting look like.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	With two way behaviours, each behaviour only needs to know about its parents. The user interaction event is created at the bottom of the tree and passed up the graph effecting each parent until the source data is updated. If you''re still wondering why this is any better imagine this situation. Three seperate developers create plugins and each adds one inversable behaviour to the graph. The first behaviour processes some data from the database. The second behaviour takes that data and further processes it and then the third behaviour takes the data from behaviour 2 and processes it some more. Now when the user modifies the third behaviour it updates the second behaviour which updates the first behaviour which naturally updates the source data. Even though the third behaviour didnt have any idea what the data from the first behaviour would look like. As long as a behaviour knows what its parents data looks like then the whole tree works.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	<span style="font-size: 12px; "><em><u><strong>A Simple Example</strong></u></em></span></p>\n<pre class="codeStyle" style="background-color: gray; display: block; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-image: initial; margin-top: 10px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">var threeSplitB = liftBI(\n   function(parent1, parent2, parent3){           //Downwards Transformation\n      var value = parent1+"/"+parent2+"/"+parent3;\n      return value;\n   },\n   function(value){                               //Upwards Transformation\n      var split = value.split("/");\n      var parent1Value = split[0];\n      var parent2Value = split[1];\n      var parent3Value = split[2];\n      return [parent1Value, parent2Value, parent3Value];\n   },\n   parent1B, parent2B, parent3B);</pre>\n<h2 style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	<a href="http://glenrd.dontexist.net/docs" id="plugins" style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); text-decoration: none; ">Plugins</a></h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Aurora was built to be as modular as possible and to that end the core logic is very minimal. Most of the functionality comes from a very flexible plugin system and various pre-installed plugins. Plugins specify thier dependents and that is used to calculate a load order. Each plugin has its own directory in the plugins directory and from there the plugin can load javascript, css or various resources to manipulate the main system. Plugins also add widgets that make up the interactive and updating parts of the page, the html document positions the widgets on the page.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	When a plugin is created its dependencies to other plugins are saved. This data is used to calculate a load order, so you can guarantee that a dependent plugin has loaded and you can use its behviours.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	See "Creating Plugins" for more information.</p>\n<h2 style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	<a href="http://glenrd.dontexist.net/docs" id="widgets" style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); text-decoration: none; ">Widgets</a></h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Widgets give the page its interactivity but are very simple in design. They have a loader method which load behaviours into the graph. A destroy method to clean up behaviours when the widget is removed and a build method for adding elements to the dom. A widget takes two arguments, the first is a system designated instanceId and the second is an object containing arguments to the widget. These arguments can be specified at the time of page editing.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	An example is given below.</p>\n<pre class="codeStyle" style="background-color: gray; display: block; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-image: initial; margin-top: 10px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">function AuroraUsers(instanceId, data){\n    this.loader=function(){\n        var dataR = DATA.getRemote("aurora_users", "");  \n        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    \n        insertDomB(tableB, instanceId+"_container");\n    }\n    this.destroy=function(){\n        DATA.deregister("aurora_groups", "");\n    }\n    this.build=function(){\n        return "&lt;span id=""+instanceId+"_container"&gt;&amp;nbsp;&lt;/span&gt;";\n    }\n}     \nwidgetTypes[''AuroraUsers'']=AuroraUsers;</pre>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	When editing a page, a widget can be added and modified from the drop down menu on the toolbar. Or you can simple add the following html code</p>\n<pre class="codeStyle" style="background-color: gray; display: block; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-image: initial; margin-top: 10px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">&lt;img src="resources/noWidget.png" class="widget_AuroraUsers" alt="{width: 100, argument1: ''blah''}" /&gt;</pre>\n<h2 style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	<a href="http://glenrd.dontexist.net/docs" id="tables" style="font-family: ''Minecraft Regular''; font-size: 1em; color: rgb(255, 255, 255); text-decoration: none; ">Tables</a></h2>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	Tables follow this structure, however most attributes are not required. You can create a table behaviour by creating a behaviour that returns an object that matches the description at the bottom of this section. Tables can be modified using a variety of transformation behaviours such as JoinTableB and SplitTableB. Finally you can put a table behaviour into a TableWidget and it will render for the gui.</p>\n<p style="font-family: verdana; font-size: medium; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">\n	For each cell if a renderer is not found in the row, column or cell meta-data then the columns type attribute is used with a default renderer.</p>\n<pre class="codeStyle" style="background-color: gray; display: block; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-image: initial; margin-top: 10px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; ">var permissionsObj = {\n      canAdd: true,\n      canDelete: true,\n      canEdit: true\n}\nvar rendererObj = {\n   getCellRenderer = function(value, domCell, width){\n\n   }\n}\n\n{\nCOLUMNS: [\n   {reference: "col1", display: "Column #1", type: "int"},\n   ...\n],\nDATA: [\n   [\n      cell1,\n      ...\n   ],\n   ...\n],\nTABLEMETADATA: {\n   permissions: permissionsObj\n},\nROWMETADATA: [\n   {\n      permissions: permissionsObj\n      renderer: rendererObj\n   },\n   ...\n],\nCOLUMNMETADATA: [\n   {\n      permissions: permissionsObj,\n      renderer: rendererObj\n   },\n   ...\n],\nCELLMETADATA: [\n   [  \n      {   \n         permissions: permissionsObj,\n         renderer: rendererObj\n      },\n      ...\n   ],\n   ...\n]\n}</pre>\n<p>\n	&nbsp;</p>\n', 64),
(105, 'downloads', '<h1>\n	Downloads</h1>\n<p>\n	This is the downloads section</p>\n', 64);
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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=401 ;

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
(241, 2, 87, NULL),
(399, 1, 104, NULL),
(400, 2, 104, NULL),
(389, 2, 105, NULL),
(384, 1, 106, NULL),
(385, 2, 106, NULL),
(386, 1, 107, NULL),
(387, 2, 107, NULL),
(388, 1, 105, NULL),
(390, 1, 84, NULL),
(391, 2, 84, NULL),
(392, 2, 108, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE IF NOT EXISTS `permissions` (
  `behaviour_permissionId` int(11) NOT NULL AUTO_INCREMENT,
  `behaviourId` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `permissions` varchar(20) NOT NULL,
  PRIMARY KEY (`behaviour_permissionId`),
  UNIQUE KEY `behaviour_permissionId` (`behaviour_permissionId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=71 ;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`behaviour_permissionId`, `behaviourId`, `group_id`, `user_id`, `permissions`) VALUES
(1, 2, 3, NULL, 'RW'),
(2, 4, 3, NULL, 'RW'),
(3, 5, 3, NULL, 'RW'),
(4, 1, 1, NULL, ''),
(5, 1, 2, NULL, ''),
(6, 1, 3, NULL, 'RW'),
(7, 2, 1, NULL, ''),
(8, 2, 2, NULL, ''),
(9, 3, 1, NULL, ''),
(10, 3, 2, NULL, ''),
(11, 3, 3, NULL, 'RW'),
(12, 4, 1, NULL, ''),
(13, 4, 2, NULL, ''),
(14, 5, 1, NULL, ''),
(15, 5, 2, NULL, ''),
(16, 6, 1, NULL, ''),
(17, 6, 2, NULL, ''),
(18, 6, 3, NULL, ''),
(19, 7, 1, NULL, ''),
(20, 7, 2, NULL, ''),
(21, 7, 3, NULL, 'RW'),
(22, 7, 3, NULL, 'RW'),
(23, 8, 1, NULL, ''),
(24, 8, 2, NULL, ''),
(25, 8, 3, NULL, 'RW'),
(29, 9, 1, NULL, 'false'),
(30, 9, 2, NULL, 'false'),
(31, 9, 3, NULL, 'true'),
(32, 10, 1, NULL, ''),
(33, 10, 2, NULL, ''),
(34, 10, 3, NULL, 'RW'),
(35, 11, 1, NULL, 'false'),
(36, 11, 2, NULL, 'false'),
(37, 11, 3, NULL, 'true'),
(38, 11, 1, NULL, 'false'),
(39, 11, 2, NULL, 'false'),
(40, 11, 3, NULL, 'true'),
(41, 11, 1, NULL, 'false'),
(42, 11, 2, NULL, 'false'),
(43, 11, 3, NULL, 'true'),
(44, 11, 1, NULL, 'false'),
(45, 11, 2, NULL, 'false'),
(46, 11, 3, NULL, 'true'),
(47, 11, 1, NULL, 'false'),
(48, 11, 2, NULL, 'false'),
(49, 11, 3, NULL, 'true'),
(50, 11, 1, NULL, 'false'),
(51, 11, 2, NULL, 'false'),
(52, 11, 3, NULL, 'true'),
(53, 11, 1, NULL, 'false'),
(54, 11, 2, NULL, 'false'),
(55, 11, 3, NULL, 'true'),
(56, 11, 1, NULL, 'false'),
(57, 11, 2, NULL, 'false'),
(58, 11, 3, NULL, 'true'),
(59, 12, 1, NULL, ''),
(60, 12, 2, NULL, ''),
(61, 12, 3, NULL, 'RW'),
(62, 12, 1, NULL, ''),
(63, 12, 2, NULL, ''),
(64, 12, 3, NULL, 'RW'),
(65, 13, 1, NULL, ''),
(66, 13, 2, NULL, ''),
(67, 13, 3, NULL, 'RW'),
(68, 13, 1, NULL, ''),
(69, 13, 2, NULL, ''),
(70, 13, 3, NULL, 'RW');

-- --------------------------------------------------------

--
-- Table structure for table `permission_register`
--

CREATE TABLE IF NOT EXISTS `permission_register` (
  `behaviourId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` text NOT NULL,
  `type` varchar(20) NOT NULL,
  `pluginId` int(11) NOT NULL,
  PRIMARY KEY (`behaviourId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `permission_register`
--

INSERT INTO `permission_register` (`behaviourId`, `name`, `description`, `type`, `pluginId`) VALUES
(1, 'aurora_users', 'User Information', 'RW', 66),
(2, 'aurora_groups', 'User Groups', 'RW', 66),
(3, 'aurora_plugins', 'Plugins', 'RW', 66),
(4, 'aurora_behaviours', 'Behaviours', 'RW', 66),
(5, 'aurora_behaviour_permissions', 'Behaviour Permissions', 'RW', 66),
(8, 'aurora_all_pages', 'All Pages', 'RW', 0),
(9, 'aurora_pages', 'Create Pages', 'boolean', 0),
(10, 'aurora_mod_template', 'Modify Template', 'RW', 0),
(11, 'imageGallery_master', 'Image Gallery Master', 'boolean', 0),
(12, 'aurora_settings', 'General Settings for Aurora', 'RW', 0),
(13, 'aurora_theme_list', 'A List of Themes', 'RW', 66);

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
(52, 'imageGallery', 0),
(67, 'jquery.json', 1),
(63, 'jquery.visualize', 0),
(76, 'aurora.tables', 1),
(69, 'aurora.urlclean', 1),
(61, 'ckeditor', 1),
(53, 'fileuploader', 1),
(62, 'google.graph', 0),
(54, 'google.map', 0),
(64, 'aurora.pathThemes', 1),
(59, 'aurora.dom', 1),
(58, 'aurora.debug', 1),
(57, 'aurora.behaviours', 1),
(66, 'aurora.administration', 1);

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
-- Table structure for table `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `description` varchar(40) NOT NULL,
  `name` varchar(40) NOT NULL,
  `value` text NOT NULL,
  `formatString` text NOT NULL,
  `plugin` varchar(20) NOT NULL DEFAULT '0',
  `type` varchar(20) NOT NULL,
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`description`, `name`, `value`, `formatString`, `plugin`) VALUES
('Script Path', 'aurora_scriptPath', 'http://glenrd.dontexist.net/', 'aurora', 'string'),
('Website Status', 'aurora_pageEnabled', '1', 'check:Online:1|check:Under Construction:0', 'aurora', 'boolean'),
('Under construction display', 'aurora_disabledText', 'This website is currently under construction',  'aurora', 'string'),
('Theme', 'aurora_theme', '10',  'aurora', 'themeSelect'),
('Secure Path', 'aurora_secureScriptPath', 'https://glenrd.dontexist.net/', 'aurora', 'string'),
('Allow registration', 'aurora_allowRegistration', '0',  'aurora', 'boolean'),
('Allow password recovery', 'aurora_allowPasswordRecovery', '1', 'aurora', 'boolean'),
('Allow Cookies', 'aurora_allowCookies', '1', 'aurora', 'boolean'),
('Application / Site Name', 'aurora_site_name', 'Aurora',  'aurora', 'string'),
('Data Update Time (ms)', 'aurora_updateTime', '100',  'aurora', 'int'),
('Append Index to URL', 'aurora_appendIndexToUrl', '1',  'aurora', 'boolean'),
('Secret Passphraise', 'aurora_secret', 'ujf83kgf.,zsi205kjg-;fgpe34?/',  'aurora', 'string'),
('Maximum Temp Uploaded Avatar Size (bytes', 'aurora_avatarMaxUploadSizeBytes', '500000', 'aurora', 'int'),
('Allow animated GIF avatar uploads', 'aurora_allowAnimatedGif', '0', 'aurora', 'boolean'),
('Use image links for menu', 'aurora_imageLinks', '1',  'aurora', 'boolean'),
('Forgotten Password Email Name', 'aurora_forgottenPasswordName', 'Aurora Mailer',  'aurora', 'string'),
('Forgotten Password Email Address', 'aurora_forgottenPasswordAddress', 'noreply@zysen.geek.nz', 'aurora', 'string'),
('User Identity Display', 'aurora_userDisplay', '3',  'aurora', 'userDisplay'),
('Avatar Width', 'aurora_avatarWidth', '300', 'aurora', 'int'),
('Avatar Maximum Height', 'aurora_avatarHeight', '200', 'aurora', 'int'),
('Default Action', 'aurora_defaultAction', 'home', 'aurora', 'string'),
('Search Term', 'aurora_urlclean_search', 'page=',  'aurora_urlclean', 'string'),
('Static Page Uploaded Image Height', 'uploadedImage_maxHeight', '800',  'aurora', 'int'),
('Static Page Uploaded Image Width', 'uploadedImage_maxWidth', '800',  'aurora', 'int'),
('Require Email Validation', 'aurora_requireEmailValidation', '0',  'aurora', 'boolean'),
('Compile Javascript with Google Closure', 'closure_compile', '0',  'aurora', 'boolean');

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `themes`
--

INSERT INTO `themes` (`theme_id`, `theme_name`, `theme_content`, `theme_noPage`, `theme_noPermission`) VALUES
(10, 'aurora', '<div id="headerBar">\n	<img alt="" src="http://glenrd.dontexist.net/themes/aurora/logo.png" style="width: 432px; height: 156px;">\n	<div id="menu">\n		<ul>\n			<li>\n				<a href="javascript:loadPage(''home'');">Home</a></li>\n			<li>\n				<a href="javascript:loadPage(''docs'');">Docs</a></li>\n			<li>\n				<a href="javascript:loadPage(''downloads'');">Downloads</a></li>\n			<li>\n				<a href="javascript:loadPage(''discuss'');">Discuss</a></li>\n			<li>\n				<a href="javascript:loadPage(''demo'');">Demo</a></li>\n		</ul>\n	</div>\n</div>\n<div id="contentWrapper">\n	<img alt="" src="http://glenrd.dontexist.net/themes/aurora/shadowBarTop.png" style="width: 1000px; height: 17px;">\n	<div id="content"><page_content></page_content></div>\n</div>\n<div style="margin: 0pt auto; text-align: center;">\n	<img alt="" src="http://glenrd.dontexist.net/themes/aurora/shadowBarBottom.png" style="width: 1000px; height: 21px;"></div>\n', '<h1>Error 404</h1>\r\n<p>This is not the page you are looking for.</p>', '<h1>Access Violation</h1>\r\n<p>Your not allowed to access this page.</p>\r\n\r\n<div style="text-align:center;">\r\n	<form action="" autocomplete="off" id="loginBox" method="post" style="margin: 0 auto; width: 307px; text-align:left;">\r\n		<table style=" height: 176px;">\r\n			<tbody>\r\n				<tr>\r\n					<td style="text-align: right;">\r\n						Email:</td>\r\n					<td>\r\n						<input id="loginBoxEmail" name="emailAddress" size="15" tabindex="1" type="text"></td>\r\n				</tr>\r\n				<tr>\r\n					<td style="text-align: right;">\r\n						Password:</td>\r\n					<td>\r\n						<input name="password" size="15" tabindex="2" type="password"></td>\r\n				</tr>\r\n				<tr>\r\n					<td style="text-align: right;">\r\n						Remember Me?</td>\r\n					<td>\r\n						<input name="remember" tabindex="3" type="checkbox"></td>\r\n				</tr>\r\n				<tr>\r\n					<td>\r\n						&nbsp;</td>\r\n					<td>\r\n						<input name="login" tabindex="4" value="Login" type="submit"><input name="login" value="loginSubmit" type="hidden"></td>\r\n				</tr>\r\n			</tbody>\r\n		</table>\r\n	</form>\r\n</div>\r\n');

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
(64, 'Jay', 'Shepherd', 'Zysen', 'cc9e4bb981e0591e9da7a2566d0cabe2', 'jay@zylex.net.nz', 3, 1, '', 0, 'M', '2012-01-18', '', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
