# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: hykrdb.cmsfrokrxjf7.us-west-2.rds.amazonaws.com (MySQL 5.6.27-log)
# Database: hyfer
# Generation Time: 2018-04-08 20:29:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table group_students
# ------------------------------------------------------------

LOCK TABLES `group_students` WRITE;
/*!40000 ALTER TABLE `group_students` DISABLE KEYS */;

INSERT INTO `group_students` (`group_id`, `user_id`)
VALUES
	(44,47),
	(44,48),
	(44,49),
	(44,50),
	(44,51),
	(45,40),
	(45,41),
	(45,42),
	(45,43),
	(45,44),
	(46,30),
	(46,31),
	(46,32),
	(46,33),
	(46,34),
	(46,39),
	(47,20),
	(47,21),
	(47,22),
	(47,23),
	(47,24),
	(47,25),
	(49,84);

/*!40000 ALTER TABLE `group_students` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table groups
# ------------------------------------------------------------

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;

INSERT INTO `groups` (`id`, `group_name`, `starting_date`, `archived`)
VALUES
	(43,'Class 5','2016-07-24 00:00:00',1),
	(44,'Class 6','2016-09-25 00:00:00',1),
	(45,'Class 7','2016-11-06 00:00:00',1),
	(46,'Class 8','2017-01-29 00:00:00',1),
	(47,'Class 9','2017-03-12 00:00:00',1),
	(48,'Class 10','2017-05-21 00:00:00',1),
	(49,'Class 11','2017-07-30 00:00:00',0),
	(53,'Class 12','2017-10-07 22:00:00',0),
	(54,'Class13','2017-11-18 23:00:00',0),
	(55,'Class14','2018-01-13 23:00:00',0),
	(56,'Class15','2018-03-17 23:00:00',0);

/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table modules
# ------------------------------------------------------------

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;

INSERT INTO `modules` (`id`, `module_name`, `display_name`, `added_on`, `default_duration`, `sort_order`, `git_url`, `git_owner`, `git_repo`, `color`, `optional`)
VALUES
	(1,'Angular JS',NULL,'2017-02-28 18:25:16',3,1000,'https://github.com/HackYourFuture/','HackYourFuture','angular','#375e97',1),
	(2,'HTML-CSS',NULL,'2017-02-28 18:25:56',3,0,'https://github.com/HackYourFuture/HTML-CSS','HackYourFuture','HTML-CSS','#4897D8',0),
	(3,'JavaScript 1',NULL,'2017-02-28 18:26:27',3,1,'https://github.com/HackYourFuture/','HackYourFuture','JavaScript','#ffDB5C',0),
	(4,'JavaScript 2',NULL,'2017-02-28 18:26:41',3,2,'https://github.com/HackYourFuture/','HackYourFuture','JavaScript','#FA6E59',0),
	(5,'JavaScript 3',NULL,'2017-02-28 18:26:49',3,3,'https://github.com/HackYourFuture/','HackYourFuture','JavaScript','#F8A055',0),
	(6,'Node.js',NULL,'2017-02-28 18:27:21',3,4,'https://github.com/HackYourFuture/','HackYourFuture','Node.js','#fa5995',0),
	(7,'Databases',NULL,'2017-02-28 18:27:50',3,5,'https://github.com/HackYourFuture/','HackYourFuture','databases','#d88948',0),
	(8,'Project',NULL,'2017-02-28 18:28:09',6,7,'https://github.com/HackYourFuture/','HackYourFuture','Project','#be59fa',0),
	(9,'Holiday',NULL,'2017-03-06 14:35:26',1,1000,NULL,NULL,NULL,'#d9d9d9',1),
	(10,'Hackathon',NULL,'2017-03-06 14:36:22',1,1000,NULL,NULL,NULL,'#b0b0b0',1),
	(11,'JavaScript Extra',NULL,'2017-05-11 14:34:16',3,1000,'https://github.com/HackYourFuture/',NULL,'JavaScrript','#ffbb6b',1),
	(12,'React',NULL,'2017-05-29 07:58:47',5,6,'https://github.com/HackYourFuture/React',NULL,'React','#59e5fa',0),
	(13,'Project presentations',NULL,'2017-05-29 12:01:38',1,8,NULL,NULL,NULL,'#d368ff',0),
	(14,'Hardware workshop',NULL,'2017-05-29 12:01:38',1,1000,NULL,NULL,NULL,'#b0b0b0',1),
	(15,'Resume training',NULL,'2017-05-29 12:33:17',1,9,NULL,NULL,NULL,'#bca4f6',0),
	(16,'Prep (technical) interviews','Interviews','2017-05-29 12:33:17',2,10,NULL,NULL,NULL,'#bca4f6',0),
	(17,'React 2',NULL,'2017-07-30 11:04:40',3,1000,'https://github.com/HackYourFuture/React2',NULL,'React2','#008cff',1),
	(18,'Catch up',NULL,'2017-10-11 09:20:39',1,1000,NULL,NULL,NULL,'#007dff',1);

/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table running_modules
# ------------------------------------------------------------

LOCK TABLES `running_modules` WRITE;
/*!40000 ALTER TABLE `running_modules` DISABLE KEYS */;

INSERT INTO `running_modules` (`id`, `module_id`, `group_id`, `duration`, `position`, `teacher1_id`, `teacher2_id`, `description`)
VALUES
	(106,2,43,3,0,NULL,NULL,NULL),
	(107,3,43,3,1,NULL,NULL,NULL),
	(108,4,43,3,2,NULL,NULL,NULL),
	(109,5,43,3,3,NULL,NULL,NULL),
	(110,1,43,3,4,NULL,NULL,NULL),
	(111,6,43,6,5,NULL,NULL,NULL),
	(112,7,43,3,8,NULL,NULL,NULL),
	(113,8,43,6,9,NULL,NULL,NULL),
	(146,9,43,2,7,NULL,NULL,NULL),
	(149,10,43,1,6,NULL,NULL,NULL),
	(163,2,44,3,0,NULL,NULL,NULL),
	(164,3,44,3,1,NULL,NULL,NULL),
	(165,4,44,3,2,NULL,NULL,NULL),
	(166,5,44,3,3,NULL,NULL,NULL),
	(167,10,44,1,4,NULL,NULL,NULL),
	(168,9,44,2,5,NULL,NULL,NULL),
	(169,1,44,3,6,NULL,NULL,NULL),
	(170,6,44,3,7,NULL,NULL,NULL),
	(171,7,44,3,8,NULL,NULL,NULL),
	(172,8,44,3,9,NULL,NULL,NULL),
	(173,10,44,1,10,NULL,NULL,NULL),
	(174,8,44,3,11,NULL,NULL,NULL),
	(751,2,45,3,0,NULL,NULL,NULL),
	(752,3,45,3,1,NULL,NULL,NULL),
	(753,10,45,1,2,NULL,NULL,NULL),
	(754,9,45,2,3,NULL,NULL,NULL),
	(755,4,45,3,4,NULL,NULL,NULL),
	(756,5,45,3,5,NULL,NULL,NULL),
	(757,1,45,3,6,NULL,NULL,NULL),
	(758,6,45,3,7,NULL,NULL,NULL),
	(759,10,45,1,8,NULL,NULL,NULL),
	(760,7,45,3,9,NULL,NULL,NULL),
	(761,8,45,7,10,NULL,NULL,NULL),
	(762,13,45,1,11,NULL,NULL,NULL),
	(763,9,45,1,12,NULL,NULL,NULL),
	(764,15,45,1,13,NULL,NULL,NULL),
	(765,16,45,2,14,NULL,NULL,NULL),
	(913,2,47,3,0,NULL,NULL,NULL),
	(914,10,47,1,1,NULL,NULL,NULL),
	(915,3,47,3,2,NULL,NULL,NULL),
	(916,4,47,3,3,NULL,NULL,NULL),
	(917,5,47,3,4,NULL,NULL,NULL),
	(918,6,47,2,5,NULL,NULL,NULL),
	(919,9,47,1,6,NULL,NULL,NULL),
	(920,6,47,1,7,NULL,NULL,NULL),
	(921,12,47,3,8,NULL,NULL,NULL),
	(922,17,47,3,9,NULL,NULL,NULL),
	(923,14,47,1,10,NULL,NULL,NULL),
	(924,7,47,3,11,NULL,NULL,NULL),
	(925,8,47,6,12,NULL,NULL,NULL),
	(926,13,47,1,13,NULL,NULL,NULL),
	(1007,2,46,3,0,NULL,NULL,NULL),
	(1008,3,46,3,1,NULL,NULL,NULL),
	(1009,4,46,3,2,NULL,NULL,NULL),
	(1010,10,46,1,3,NULL,NULL,NULL),
	(1011,5,46,3,4,NULL,NULL,NULL),
	(1012,11,46,3,5,NULL,NULL,NULL),
	(1013,6,46,3,6,NULL,NULL,NULL),
	(1014,12,46,2,7,NULL,NULL,NULL),
	(1015,9,46,1,8,NULL,NULL,NULL),
	(1016,12,46,1,9,NULL,NULL,NULL),
	(1017,17,46,3,10,NULL,NULL,NULL),
	(1018,7,46,3,11,NULL,NULL,NULL),
	(1019,14,46,1,12,NULL,NULL,NULL),
	(1020,8,46,6,13,NULL,NULL,NULL),
	(1021,13,46,1,14,NULL,NULL,NULL),
	(1560,2,49,3,0,NULL,NULL,NULL),
	(1561,14,49,1,1,NULL,NULL,NULL),
	(1562,3,49,3,2,NULL,NULL,NULL),
	(1563,4,49,3,3,NULL,NULL,NULL),
	(1564,5,49,3,4,NULL,NULL,NULL),
	(1565,6,49,3,5,NULL,NULL,NULL),
	(1566,7,49,3,6,NULL,NULL,NULL),
	(1567,12,49,2,7,NULL,NULL,NULL),
	(1568,9,49,2,8,NULL,NULL,NULL),
	(1569,12,49,3,9,NULL,NULL,NULL),
	(1570,8,49,6,10,NULL,NULL,NULL),
	(1571,13,49,1,11,NULL,NULL,NULL),
	(1647,2,48,3,0,NULL,NULL,NULL),
	(1648,3,48,2,1,NULL,NULL,NULL),
	(1649,9,48,1,2,NULL,NULL,NULL),
	(1650,3,48,1,3,NULL,NULL,NULL),
	(1651,4,48,3,4,NULL,NULL,NULL),
	(1652,5,48,3,5,NULL,NULL,NULL),
	(1653,14,48,1,6,NULL,NULL,NULL),
	(1654,6,48,3,7,NULL,NULL,NULL),
	(1655,7,48,3,8,NULL,NULL,NULL),
	(1656,18,48,1,9,NULL,NULL,NULL),
	(1657,12,48,5,10,NULL,NULL,NULL),
	(1658,8,48,5,11,NULL,NULL,NULL),
	(1659,9,48,2,12,NULL,NULL,NULL),
	(1660,8,48,1,13,NULL,NULL,NULL),
	(1661,13,48,1,14,NULL,NULL,NULL),
	(2071,2,54,3,0,NULL,NULL,NULL),
	(2072,3,54,2,1,NULL,NULL,NULL),
	(2073,9,54,2,2,NULL,NULL,NULL),
	(2074,3,54,1,3,NULL,NULL,NULL),
	(2075,4,54,3,4,NULL,NULL,NULL),
	(2076,5,54,3,5,NULL,NULL,NULL),
	(2077,6,54,3,6,NULL,NULL,NULL),
	(2078,7,54,2,7,NULL,NULL,NULL),
	(2079,9,54,1,8,NULL,NULL,NULL),
	(2080,7,54,1,9,NULL,NULL,NULL),
	(2081,12,54,5,10,NULL,NULL,NULL),
	(2082,9,54,1,11,NULL,NULL,NULL),
	(2083,8,54,6,12,NULL,NULL,NULL),
	(2084,13,54,1,13,NULL,NULL,NULL),
	(2085,16,54,2,14,NULL,NULL,NULL),
	(2086,2,53,3,0,NULL,NULL,NULL),
	(2087,3,53,3,1,NULL,NULL,NULL),
	(2088,4,53,3,2,NULL,NULL,NULL),
	(2089,5,53,2,3,NULL,NULL,NULL),
	(2090,9,53,2,4,NULL,NULL,NULL),
	(2091,5,53,1,5,NULL,NULL,NULL),
	(2092,6,53,3,6,NULL,NULL,NULL),
	(2093,7,53,3,7,NULL,NULL,NULL),
	(2094,12,53,5,8,NULL,NULL,NULL),
	(2095,9,53,1,9,NULL,NULL,NULL),
	(2096,8,53,6,10,NULL,NULL,NULL),
	(2097,9,53,1,11,NULL,NULL,NULL),
	(2098,13,53,1,12,NULL,NULL,NULL),
	(2099,16,53,2,13,NULL,NULL,NULL),
	(2154,2,55,3,0,NULL,NULL,NULL),
	(2155,3,55,3,1,NULL,NULL,NULL),
	(2156,4,55,3,2,NULL,NULL,NULL),
	(2157,5,55,2,3,NULL,NULL,NULL),
	(2158,9,55,1,4,NULL,NULL,NULL),
	(2159,5,55,1,5,NULL,NULL,NULL),
	(2160,6,55,3,6,NULL,NULL,NULL),
	(2161,7,55,2,7,NULL,NULL,NULL),
	(2162,9,55,1,8,NULL,NULL,NULL),
	(2163,7,55,1,9,NULL,NULL,NULL),
	(2164,12,55,5,10,NULL,NULL,NULL),
	(2165,8,55,6,11,NULL,NULL,NULL),
	(2166,13,55,1,12,NULL,NULL,NULL),
	(2167,16,55,2,13,NULL,NULL,NULL),
	(2296,2,56,2,0,NULL,NULL,NULL),
	(2297,9,56,1,1,NULL,NULL,NULL),
	(2298,2,56,1,2,NULL,NULL,NULL),
	(2299,3,56,3,3,NULL,NULL,NULL),
	(2300,4,56,2,4,NULL,NULL,NULL),
	(2301,9,56,1,5,NULL,NULL,NULL),
	(2302,4,56,1,6,NULL,NULL,NULL),
	(2303,5,56,3,7,NULL,NULL,NULL),
	(2304,6,56,3,8,NULL,NULL,NULL),
	(2305,7,56,3,9,NULL,NULL,NULL),
	(2306,12,56,5,10,NULL,NULL,NULL),
	(2307,8,56,6,11,NULL,NULL,NULL),
	(2308,13,56,1,12,NULL,NULL,NULL),
	(2309,15,56,1,13,NULL,NULL,NULL),
	(2310,16,56,2,14,NULL,NULL,NULL);

/*!40000 ALTER TABLE `running_modules` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table students_history
# ------------------------------------------------------------

LOCK TABLES `students_history` WRITE;
/*!40000 ALTER TABLE `students_history` DISABLE KEYS */;

INSERT INTO `students_history` (`group_id`, `running_module_id`, `user_id`, `date`, `attendance`, `homework`)
VALUES
	(44,174,47,'2016-11-06',0,0),
	(44,174,47,'2017-04-08',0,0),
	(44,174,47,'2017-04-15',0,0),
	(44,174,47,'2017-04-22',0,0),
	(44,174,48,'2016-09-24',0,0),
	(44,174,48,'2017-04-08',0,0),
	(44,174,48,'2017-04-15',0,0),
	(44,174,48,'2017-04-22',0,0),
	(44,174,49,'2016-09-24',0,0),
	(44,174,49,'2017-04-08',0,0),
	(44,174,49,'2017-04-15',0,0),
	(44,174,49,'2017-04-22',0,0),
	(44,174,50,'2016-09-24',0,0),
	(44,174,50,'2017-04-08',0,0),
	(44,174,50,'2017-04-15',0,0),
	(44,174,50,'2017-04-22',0,0),
	(44,174,51,'2016-09-24',0,0),
	(44,174,51,'2017-04-08',0,0),
	(44,174,51,'2017-04-15',0,0),
	(44,174,51,'2017-04-22',0,0),
	(44,174,52,'2016-09-24',0,0),
	(44,174,52,'2017-04-08',0,0),
	(44,174,52,'2017-04-15',0,0),
	(44,174,52,'2017-04-22',0,0),
	(44,174,53,'2016-09-24',0,0),
	(44,174,53,'2017-04-08',0,0),
	(44,174,53,'2017-04-15',0,0),
	(44,174,53,'2017-04-22',0,0),
	(44,174,54,'2016-09-24',0,0),
	(44,174,54,'2017-04-08',0,0),
	(44,174,54,'2017-04-15',0,0),
	(44,174,54,'2017-04-22',0,0),
	(44,174,55,'2016-09-24',0,0),
	(44,174,55,'2017-04-08',0,0),
	(44,174,55,'2017-04-15',0,0),
	(44,174,55,'2017-04-22',0,0),
	(44,174,56,'2016-09-24',0,0),
	(44,174,56,'2017-04-08',0,1),
	(44,174,56,'2017-04-15',0,0),
	(44,174,56,'2017-04-22',0,0);

/*!40000 ALTER TABLE `students_history` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `full_name`, `access_token`, `role`, `register_date`, `slack_username`, `freecodecamp_username`, `email`, `mobile`)
VALUES
	(20,'','Yaser Shomaf',NULL,'student','2017-04-19 18:02:34','@yasersomaf','fcc07c99b24','yasershomaf@gmail.com',NULL),
	(21,'','Elie Sacali',NULL,'student','2017-04-19 18:02:34','@elie','eliesakali','eliesacali@gmail.com',NULL),
	(22,'','Essam Alsaloum',NULL,'student','2017-04-19 18:02:34','@mojlbhr','fcc25d6cb43','es.alsaloum@gmail.com',NULL),
	(23,'','George Mamar',NULL,'student','2017-04-19 18:02:34','@georgem','gmamar','gmamar1@gmail.com',NULL),
	(24,'','Ashraf Khaddam',NULL,'student','2017-04-19 18:02:34','@ashrafkh','ashrafkh','ashrafkh1@gmail.com',NULL),
	(25,'','Aiham Bitar',NULL,'student','2017-04-19 18:02:34','@abitar','','aiham_bitar@hotmail.com',NULL),
	(26,'','Hameed ah Alhowidi',NULL,'student','2017-04-19 18:02:34','@hameed','ahalhowidi','ah.alhowidi@gmail.com',NULL),
	(27,'','Nour Saffour',NULL,'student','2017-04-19 18:02:34','@nsaffour','fcc86037877','nouralnajjar81@gmail.com',NULL),
	(28,'','M.Thabet Qaterji',NULL,'student','2017-04-19 18:02:34','@thabet','mthabetq','thabetqaterji91@gmail.com',NULL),
	(29,'abuodh','Abdulrahman Hussni',NULL,'student','2017-04-19 18:02:34','@abuodh','fcc92252714','abuodh@hotmail.com',NULL),
	(30,'jalal75','Jalal Alnadeem',NULL,'student','2017-04-19 18:02:34','@jalal','jalal75','jalal.alnadeem@gmail.com',NULL),
	(31,'','Muhammad Alo',NULL,'student','2017-04-19 18:02:34','@muhammadalo','fcc63e27c82','muhammadalo37@gmail.com',NULL),
	(32,'khinaowi','Khalid Hinawi',NULL,'student','2017-04-19 18:02:34','@khinaowi','khinaowi','khinaowi@hotmail.com',NULL),
	(33,'AwsIdris','Aws Idris',NULL,'student','2017-04-19 18:02:34','@awsidris','awsidris','awsidris@gmail.com',NULL),
	(34,'Ali-Barakat','Ali Barakat',NULL,'student','2017-04-19 18:02:34','@alibarakat','ali-barakat','barakat-ali@live.com',NULL),
	(35,'mozi1996','Mustafa Ezzi',NULL,'student','2017-04-19 18:02:34','@mostafa1996','fccdde22b17','mosrafaazy@gmail.com',NULL),
	(36,'MhdAnasAlrz','Anas Mohamad Hlehel',NULL,'student','2017-04-19 18:02:34','@anas_alrz','mhdanasalrz','mhd.anas.alrz@hotmail.com',NULL),
	(37,'borazan-taja','Jad Kaddour',NULL,'student','2017-04-19 18:02:34','@jad','borazan-taja','kaddour.jad@gmail.com',NULL),
	(38,'massoodbarsa','Amir Shakiba',NULL,'student','2017-04-19 18:02:34','@massoodbarsa','massoodbarsa','amir.shakiba1980@gmail.com',NULL),
	(39,'Odai-kakhi','Uday Kakhi',NULL,'student','2017-04-19 18:02:34','@odaikakhi','odai-kakhi','odaikakhi@gmail.com',NULL),
	(40,'ekhamis','Eyad Khamis',NULL,'student','2017-04-19 18:02:34','@ekhamis','','ekhamis@gmail.com',NULL),
	(41,'msheikhalard','Malek Sheikh Al Ard',NULL,'student','2017-04-19 18:02:34','@m.sheikhalard','','malek.sheikhalard@gmail.com',NULL),
	(42,'','Nabil Hinnawi',NULL,'student','2017-04-19 18:02:34','@nabilhinnawi','','nabilhinnawi@yahoo.com',NULL),
	(43,'ruteeb','Somur Ruteeb',NULL,'student','2017-04-19 18:02:34','@s.ruteeb','','s.ruteeb@gmail.com',NULL),
	(44,'saadali21','Saad Ronida',NULL,'student','2017-04-19 18:02:34','@s-ali21','','saadronida@gmail.com',NULL),
	(45,'suhaib81','Suhaib Bulbul',NULL,'student','2017-04-19 18:02:34','@suhaib','','suhaib81@gmail.com',NULL),
	(46,'AbdulRahmanDbes','Adbul Raman',NULL,'student','2017-04-19 18:02:34','@abdulrahmandbes','','abdulrahmandbes@gmail.com',NULL),
	(47,'m0o0tasem','Almoatasem Bllah Alahmad Albelikh',NULL,'student','2017-04-19 18:02:34','@al.mo0tasem','','mu.albalikh@hotmail.com',NULL),
	(48,'MLabash','Moaaz Labsh',NULL,'student','2017-04-19 18:02:34','@m.labash','fccf44cbd5b','mo3ath_lbsh@hotmail.com',NULL),
	(49,'shadialhakimi','Shadi Alhakimi',NULL,'student','2017-04-19 18:02:34','@shadialhakimi','','shadi_15_5@hotmail.com',NULL),
	(50,'','Mohanad Dabool',NULL,'student','2017-04-19 18:02:34','@mohanad.dabool','','mohanad.dabool1@gmail.com',NULL),
	(51,'yousifAlneamy','Yousif Alneamy',NULL,'student','2017-04-19 18:02:34','@yousif','','yousif.aladdin@gmail.com',NULL),
	(52,'amjad83m','Amjad Muhammad ',NULL,'student','2017-04-19 18:02:34','@amjad83m','amjad83m','amjad83m@hotmail.com',NULL),
	(53,'engmohannad','Mohannad Alobaid',NULL,'student','2017-04-19 18:02:34','@engmohannad','fcc9191bd06','eng_mohalobaid@yahoo.com',NULL),
	(54,'eix007','Anas Alabtah',NULL,'student','2017-04-19 18:02:34','@anas.alabtah','eix007','anas.alabtah@gmail.com',NULL),
	(55,'','Ehab M Omaro',NULL,'student','2017-04-19 18:02:34','@omaro86','fcc9617682f','omaro-86@hotmail.com',NULL),
	(56,'malekkn','Malek Kanaan',NULL,'student','2017-04-19 18:02:34','@malekkn','malekkn','malek.kanaan@outlook.com',NULL),
	(57,'rashidabdo','2017-07-24',NULL,'student','2017-04-19 18:02:34','@rashid_abdo','','rasheed.abdo@hotmail.com',NULL),
	(58,'','ML Jammeh',NULL,'student','2017-04-19 18:02:34','@mljammeh','','laminkanilai@gmail.com',NULL),
	(59,'aboRoma','Jack Sacali ',NULL,'student','2017-04-19 18:02:34','@aboroma','aboroma','jacksacali@gmail.com',NULL),
	(60,'','Saikat Barua',NULL,'student','2017-04-19 18:02:34','@saikat852','','derozio.bd@gmail.com',NULL),
	(61,'hasanshahoud','Hasan Shahoud',NULL,'student','2017-04-19 18:02:34','@hasan_shahoud','hasanshahoud','hasansh343@gmail.com',NULL),
	(62,'fade0991','Fadi',NULL,'student','2017-04-19 18:02:34','@fadi91','fade0991','fedo.dedo91@yahoo.com',NULL),
	(63,'majdiali','Majdi ali',NULL,'student','2017-04-19 18:02:34','@majdiali76','','majdi107@gmail.com',NULL),
	(64,'beto0o0o','Bahaa Eldereie',NULL,'student','2017-04-19 18:02:34','@beto0o','','bahaa.aldeiri@gmail.com',NULL),
	(65,'','Mohamad alkhen',NULL,'student','2017-04-19 18:02:34','@md.alkhen','','m.jabri86@yahoo.com',NULL),
	(66,'','Mahmud Jabri',NULL,'student','2017-04-19 18:02:34','@mahmud','','m.jabri86@yahoo.com',NULL),
	(67,'remarcmij','Jim Cramer','085c76b37e02bd61ab9d516b77465c1b3c04a63f','teacher','2017-04-26 15:01:15',NULL,NULL,'remarcmij@gmail.com',NULL),
	(68,'mkruijt','Maartje Kruijt','c5ce94adc47acdb185ec8c9c6750eaa7e0be4d82','teacher','2017-05-28 14:18:30',NULL,NULL,'maartjekruijt@hotmail.com',NULL),
	(69,'egbert','egbert','4525e7b6346baf4209a960179a904b2687774394','guest','2017-05-29 16:44:23',NULL,NULL,'egbertveenstra@gmail.com',NULL),
	(70,'dine','Ariadne Gomes','c02628650dd39978edf03d49ca1006ee7ca4ce2d','guest','2017-05-30 10:36:57',NULL,NULL,NULL,NULL),
	(71,'AhmadKabakibi','Ahmad Kabakibi','696f4ddfeb23f3215fa8139823f9b640f57d8773','guest','2017-05-30 10:47:38',NULL,NULL,'ahmadkbakibi@gmail.com',NULL),
	(72,'hruy28','Hruy Weldemichael','36a826026b108fea2a6cf011b2683ce0c099c90c','guest','2017-06-18 13:57:31',NULL,NULL,'hruyw@yahoo.com',NULL),
	(73,'daanaerts','Daan Aerts','9706d5accd588a270b653d448004b568c746a354','guest','2017-06-20 13:33:57',NULL,NULL,'daanaerts@gmail.com',NULL),
	(74,'chklueter','Christopher Klueter','b04196b582598aa8b8a1f1b3919cde08ba5ff7f8','guest','2017-09-11 07:05:43',NULL,NULL,NULL,NULL),
	(75,'ammarkasem2016','Ammar Kasem','d0eb331a0128d07a3ec278e342443e9268111752','guest','2017-10-17 07:24:12',NULL,NULL,NULL,NULL),
	(76,'gijscor','Gijs C ','24fa4cd1a2f4ffbf20648cff8e54868f7b4d2b7c','guest','2017-10-17 09:01:21',NULL,NULL,NULL,NULL),
	(77,'ashrafkhaddam','Ashraf khaddam','596f1917fcdf44d8fc871f1dab92c767dc8af030','guest','2017-11-09 10:32:40',NULL,NULL,NULL,NULL),
	(78,'isaachinman','Isaac Hinman','95acdcc924bc3955ca83bc4c3184db75cc5d4a5c','guest','2017-11-14 12:24:56',NULL,NULL,'isaac@isaachinman.com',NULL),
	(79,'maarten2424','Maarten Vleugels','a9b9827cad4339c5e0ca6d20d2097cf03984777f','guest','2018-01-28 12:06:44',NULL,NULL,NULL,NULL),
	(80,'pesh12','Enes','f80f7116a32f35776b4e9277d6ba1196e7bbe827','guest','2018-01-28 12:10:01',NULL,NULL,NULL,NULL),
	(81,'Elias011','Elias Shikh Alshabab','61692548a7426e09c3f542649718df0ae7e65c7a','guest','2018-02-01 22:20:08',NULL,NULL,'elias.shkshb1991@gmail.com',NULL),
	(82,'JiDarwish',NULL,'15ae1dc60a6159ec966b99b78d09bcf87e5fbaf9','guest','2018-02-04 14:04:18',NULL,NULL,NULL,NULL),
	(83,'yousefallaban','Yousef Allaban','4a166f021da7ad5256cced258e039143b7b84c3b','guest','2018-02-11 15:27:22',NULL,NULL,'yousefallaban@gmail.com',NULL),
	(84,'aminmahrami','Mohamad Amin Mahrami','f85cebb2a63b1c1c59889dd4d96b1fd340ccd91c','student','2018-02-18 13:47:28',NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
