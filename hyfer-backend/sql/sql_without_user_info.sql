# Dump of table groups

# ------------------------------------------------------------
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `users` ( `username`, `full_name`, `slack_username`)
VALUES
    ('yousef','Yousef allaban','yousefallaban'),
    
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

# ------------------------------------------------------------
LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` (`id`, `group_name`, `starting_date`, `archived`)
VALUES
    (43,'Class 5','2016-07-24 00:00:00',1),
    (44,'Class 6','2016-09-25 00:00:00',1),
    (45,'Class 7','2016-11-06 00:00:00',0),
    (46,'Class 8','2017-01-29 00:00:00',0),
    (47,'Class 9','2017-03-12 00:00:00',0),
    (48,'Class 10','2017-05-21 00:00:00',0),
    (49,'Class 11','2017-07-30 00:00:00',0);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;
LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` (`id`, `module_name`, `display_name`, `added_on`, `default_duration`, `sort_order`, `git_url`, `git_owner`, `git_repo`, `color`, `optional`)
VALUES
    (1,'Angular JS',NULL,'2017-02-28 18:25:16',3,9,'https://github.com/HackYourFuture/','HackYourFuture','angular','#375e97',0),
    (2,'HTML-CSS',NULL,'2017-02-28 18:25:56',3,0,'https://github.com/HackYourFuture/','HackYourFuture','angular','#4897D8',0),
    (3,'JavaScript 1',NULL,'2017-02-28 18:26:27',3,1,'https://github.com/HackYourFuture/','HackYourFuture','JavaScript','#ffDB5C',0),
    (4,'JavaScript 2',NULL,'2017-02-28 18:26:41',3,2,'https://github.com/HackYourFuture/','HackYourFuture','JavaScript','#FA6E59',0),
    (5,'JavaScript 3',NULL,'2017-02-28 18:26:49',3,3,'https://github.com/HackYourFuture/','HackYourFuture','JavaScript','#F8A055',0),
    (6,'Node.js',NULL,'2017-02-28 18:27:21',3,4,'https://github.com/HackYourFuture/','HackYourFuture','Node.js','#fa5995',0),
    (7,'Databases',NULL,'2017-02-28 18:27:50',3,6,'https://github.com/HackYourFuture/','HackYourFuture','databases','#d88948',0),
    (8,'Project',NULL,'2017-02-28 18:28:09',6,7,'https://github.com/HackYourFuture/','HackYourFuture','Project','#be59fa',0),
    (9,'Holiday',NULL,'2017-03-06 14:35:26',1,1000,NULL,NULL,NULL,'#d9d9d9',1),
    (10,'Hackathon',NULL,'2017-03-06 14:36:22',1,1000,NULL,NULL,NULL,'#b0b0b0',1),
    (11,'JavaScript Extra',NULL,'2017-05-11 14:34:16',3,1000,'https://github.com/HackYourFuture/',NULL,'JavaScrript','#ffbb6b',1),
    (12,'React',NULL,'2017-05-29 07:58:47',3,5,NULL,NULL,NULL,'#59e5fa',0),
    (13,'Project presentations',NULL,'2017-05-29 12:01:38',1,8,NULL,NULL,NULL,'#d368ff',0),
    (14,'Hardware workshop',NULL,'2017-05-29 12:01:38',1,1000,NULL,NULL,NULL,'#b0b0b0',1),
    (15,'Resume training',NULL,'2017-05-29 12:33:17',1,1000,NULL,NULL,NULL,'#bca4f6',0),
    (16,'Prep (technical) interviews','Interviews','2017-05-29 12:33:17',2,1000,NULL,NULL,NULL,'#bca4f6',0);
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;
# Dump of table running_modules
# ------------------------------------------------------------
LOCK TABLES `running_modules` WRITE;
/*!40000 ALTER TABLE `running_modules` DISABLE KEYS */;
INSERT INTO `running_modules` (`id`, `module_id`, `group_id`, `duration`, `position`, `teacher1_id`, `teacher2_id`)
VALUES
    (106,2,43,3,0,NULL,NULL),
    (107,3,43,3,1,NULL,NULL),
    (108,4,43,3,2,NULL,NULL),
    (109,5,43,3,3,NULL,NULL),
    (110,1,43,3,4,NULL,NULL),
    (111,6,43,6,5,NULL,NULL),
    (112,7,43,3,8,NULL,NULL),
    (113,8,43,6,9,NULL,NULL),
    (146,9,43,2,7,NULL,NULL),
    (149,10,43,1,6,NULL,NULL),
    (163,2,44,3,0,NULL,NULL),
    (164,3,44,3,1,NULL,NULL),
    (165,4,44,3,2,NULL,NULL),
    (166,5,44,3,3,NULL,NULL),
    (167,10,44,1,4,NULL,NULL),
    (168,9,44,2,5,NULL,NULL),
    (169,1,44,3,6,NULL,NULL),
    (170,6,44,3,7,NULL,NULL),
    (171,7,44,3,8,NULL,NULL),
    (172,8,44,3,9,NULL,NULL),
    (173,10,44,1,10,NULL,NULL),
    (174,8,44,3,11,NULL,NULL),
    (702,2,48,3,0,NULL,NULL),
    (703,3,48,2,1,NULL,NULL),
    (704,9,48,1,2,NULL,NULL),
    (705,3,48,1,3,NULL,NULL),
    (706,4,48,3,4,NULL,NULL),
    (707,5,48,3,5,NULL,NULL),
    (708,14,48,1,6,NULL,NULL),
    (709,6,48,3,7,NULL,NULL),
    (710,12,48,3,8,NULL,NULL),
    (711,7,48,3,9,NULL,NULL),
    (712,8,48,6,10,NULL,NULL),
    (713,13,48,1,11,NULL,NULL),
    (714,2,49,3,0,NULL,NULL),
    (715,14,49,1,1,NULL,NULL),
    (716,3,49,3,2,NULL,NULL),
    (717,4,49,3,3,NULL,NULL),
    (718,5,49,3,4,NULL,NULL),
    (719,6,49,3,5,NULL,NULL),
    (720,12,49,3,6,NULL,NULL),
    (721,7,49,3,7,NULL,NULL),
    (722,8,49,6,8,NULL,NULL),
    (723,13,49,1,9,NULL,NULL),
    (751,2,45,3,0,NULL,NULL),
    (752,3,45,3,1,NULL,NULL),
    (753,10,45,1,2,NULL,NULL),
    (754,9,45,2,3,NULL,NULL),
    (755,4,45,3,4,NULL,NULL),
    (756,5,45,3,5,NULL,NULL),
    (757,1,45,3,6,NULL,NULL),
    (758,6,45,3,7,NULL,NULL),
    (759,10,45,1,8,NULL,NULL),
    (760,7,45,3,9,NULL,NULL),
    (761,8,45,7,10,NULL,NULL),
    (762,13,45,1,11,NULL,NULL),
    (763,9,45,1,12,NULL,NULL),
    (764,15,45,1,13,NULL,NULL),
    (765,16,45,2,14,NULL,NULL),
    (812,2,47,3,0,NULL,NULL),
    (813,10,47,1,1,NULL,NULL),
    (814,3,47,3,2,NULL,NULL),
    (815,4,47,3,3,NULL,NULL),
    (816,5,47,3,4,NULL,NULL),
    (817,6,47,2,5,NULL,NULL),
    (818,9,47,1,6,NULL,NULL),
    (819,6,47,1,7,NULL,NULL),
    (820,12,47,3,8,NULL,NULL),
    (821,7,47,3,9,NULL,NULL),
    (822,14,47,1,10,NULL,NULL),
    (823,8,47,6,11,NULL,NULL),
    (824,13,47,1,12,NULL,NULL),
    (841,2,46,3,0,NULL,NULL),
    (842,3,46,3,1,NULL,NULL),
    (843,4,46,3,2,NULL,NULL),
    (844,10,46,1,3,NULL,NULL),
    (845,5,46,3,4,NULL,NULL),
    (846,11,46,3,5,NULL,NULL),
    (847,6,46,3,6,NULL,NULL),
    (848,12,46,2,7,NULL,NULL),
    (849,9,46,1,8,NULL,NULL),
    (850,12,46,1,9,NULL,NULL),
    (851,7,46,3,10,NULL,NULL),
    (852,8,46,3,11,NULL,NULL),
    (853,14,46,1,12,NULL,NULL),
    (854,8,46,3,13,NULL,NULL),
    (855,13,46,1,14,NULL,NULL);
/*!40000 ALTER TABLE `running_modules` ENABLE KEYS */;
UNLOCK TABLES;
