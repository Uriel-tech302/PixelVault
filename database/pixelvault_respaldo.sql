-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: pixelvault_limpio
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `biblioteca_items`
--

DROP TABLE IF EXISTS `biblioteca_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biblioteca_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `juego_id` bigint NOT NULL,
  `plataforma_id` bigint NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'JUGANDO',
  `horas_jugadas` decimal(7,1) NOT NULL DEFAULT '0.0',
  `ultima_sesion` date DEFAULT NULL,
  `puntuacion` tinyint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_biblioteca_usuario_juego_plataforma` (`usuario_id`,`juego_id`,`plataforma_id`),
  KEY `fk_biblioteca_juego` (`juego_id`),
  KEY `fk_biblioteca_plataforma` (`plataforma_id`),
  KEY `idx_biblioteca_usuario_estado` (`usuario_id`,`estado`),
  CONSTRAINT `fk_biblioteca_juego` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`id`),
  CONSTRAINT `fk_biblioteca_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`),
  CONSTRAINT `fk_biblioteca_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_biblioteca_estado` CHECK ((`estado` in (_utf8mb4'JUGANDO',_utf8mb4'COMPLETADO',_utf8mb4'ABANDONADO'))),
  CONSTRAINT `ck_biblioteca_horas` CHECK ((`horas_jugadas` >= 0)),
  CONSTRAINT `ck_biblioteca_puntuacion` CHECK (((`puntuacion` is null) or (`puntuacion` between 1 and 5)))
) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biblioteca_items`
--

LOCK TABLES `biblioteca_items` WRITE;
/*!40000 ALTER TABLE `biblioteca_items` DISABLE KEYS */;
INSERT INTO `biblioteca_items` VALUES (19,10,10,1,'JUGANDO',85.0,'2026-11-23',5,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(20,10,11,1,'JUGANDO',40.5,'2026-11-21',5,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(21,10,12,2,'COMPLETADO',110.0,'2026-10-10',5,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(22,10,13,1,'ABANDONADO',6.0,'2026-06-27',2,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(23,10,14,5,'COMPLETADO',30.2,'2026-11-04',4,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(24,11,1,4,'COMPLETADO',52.0,'2026-11-14',5,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(25,11,4,4,'COMPLETADO',18.5,'2026-10-30',5,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(26,11,8,4,'JUGANDO',8.0,'2026-11-22',4,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(27,11,2,4,'JUGANDO',95.0,'2026-11-23',5,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(28,11,7,4,'COMPLETADO',9.1,'2026-09-15',4,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(29,12,9,1,'COMPLETADO',11.4,'2026-05-08',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(30,12,15,1,'COMPLETADO',22.0,'2026-10-20',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(31,12,6,1,'JUGANDO',210.0,'2026-11-23',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(32,12,5,1,'ABANDONADO',12.3,'2026-09-05',3,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(33,12,3,1,'COMPLETADO',55.5,'2026-11-09',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(34,13,10,3,'COMPLETADO',130.0,'2026-11-06',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(35,13,12,3,'ABANDONADO',20.0,'2026-08-16',3,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(36,13,11,3,'JUGANDO',15.0,'2026-11-20',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(37,13,8,3,'COMPLETADO',10.5,'2026-09-25',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(38,13,14,3,'JUGANDO',7.7,'2026-11-18',NULL,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(39,14,2,5,'COMPLETADO',140.0,'2026-11-15',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(40,14,1,5,'JUGANDO',30.0,'2026-11-22',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(41,14,4,5,'COMPLETADO',12.0,'2026-10-15',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(42,14,15,5,'ABANDONADO',4.0,'2026-08-06',2,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(43,14,13,5,'JUGANDO',14.0,'2026-11-19',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(44,15,3,2,'COMPLETADO',70.0,'2026-11-02',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(45,15,5,2,'COMPLETADO',35.0,'2026-10-22',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(46,15,7,2,'COMPLETADO',8.0,'2026-07-27',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(47,15,9,2,'ABANDONADO',2.5,'2026-01-28',2,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(48,15,10,2,'JUGANDO',60.0,'2026-11-23',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(49,16,14,1,'COMPLETADO',75.0,'2026-11-12',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(50,16,11,1,'COMPLETADO',150.0,'2026-10-27',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(51,16,6,1,'ABANDONADO',18.0,'2026-08-26',3,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(52,16,12,1,'JUGANDO',45.0,'2026-11-21',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(53,16,1,1,'COMPLETADO',40.0,'2026-10-05',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(54,17,15,1,'JUGANDO',9.0,'2026-11-22',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(55,17,13,1,'COMPLETADO',28.0,'2026-09-20',5,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(56,17,2,1,'ABANDONADO',5.0,'2026-07-07',3,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(57,17,4,1,'JUGANDO',6.5,'2026-11-17',4,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(58,17,8,1,'ABANDONADO',4.0,'2026-05-28',2,'2026-11-24 00:51:21','2026-11-24 00:51:21'),(65,5,1,1,'COMPLETADO',48.2,'2026-11-20',5,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(66,5,2,1,'JUGANDO',120.5,'2026-11-23',5,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(67,5,3,1,'COMPLETADO',62.0,'2026-11-12',5,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(68,5,4,5,'COMPLETADO',14.3,'2026-10-25',4,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(69,5,5,5,'JUGANDO',21.7,'2026-11-22',4,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(70,5,6,1,'ABANDONADO',9.5,'2026-09-25',3,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(71,5,7,1,'COMPLETADO',7.8,'2026-08-26',5,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(72,5,8,2,'ABANDONADO',3.2,'2026-07-27',NULL,'2026-11-24 17:01:48','2026-11-24 17:01:48');
/*!40000 ALTER TABLE `biblioteca_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigos_verificacion`
--

DROP TABLE IF EXISTS `codigos_verificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigos_verificacion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `canal` varchar(10) NOT NULL,
  `proposito` varchar(20) NOT NULL,
  `codigo_hash` char(64) NOT NULL,
  `expira_en` datetime NOT NULL,
  `intentos` tinyint NOT NULL DEFAULT '0',
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cv_usuario_proposito` (`usuario_id`,`proposito`,`usado`),
  CONSTRAINT `fk_cv_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_cv_canal` CHECK ((`canal` in (_utf8mb4'SMS',_utf8mb4'WHATSAPP'))),
  CONSTRAINT `ck_cv_proposito` CHECK ((`proposito` in (_utf8mb4'VERIFICAR_TELEFONO',_utf8mb4'ACCESO',_utf8mb4'RECUPERACION')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigos_verificacion`
--

LOCK TABLES `codigos_verificacion` WRITE;
/*!40000 ALTER TABLE `codigos_verificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `codigos_verificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','schema','SQL','V1__schema.sql',-1537853789,'pixelAdmin','2026-11-20 07:36:12',325,1),(2,'2','perfil telefono','SQL','V2__perfil_telefono.sql',-2126193776,'pixelAdmin','2026-11-20 07:36:12',129,1),(3,'3','seed','SQL','V3__seed.sql',814803994,'pixelAdmin','2026-11-20 07:36:12',8,1),(4,'4','steam sincronizacion','SQL','V4__steam_sincronizacion.sql',1138607666,'pixelAdmin','2026-11-24 22:39:43',69,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generos`
--

DROP TABLE IF EXISTS `generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_generos_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generos`
--

LOCK TABLES `generos` WRITE;
/*!40000 ALTER TABLE `generos` DISABLE KEYS */;
INSERT INTO `generos` VALUES (6,'Accion'),(7,'Aventura'),(9,'Cartas'),(10,'Indie'),(1,'Metroidvania'),(3,'Plataformas'),(8,'Puzle'),(2,'Roguelike'),(5,'RPG'),(4,'Simulador de granja');
/*!40000 ALTER TABLE `generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `juego_genero`
--

DROP TABLE IF EXISTS `juego_genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `juego_genero` (
  `juego_id` bigint NOT NULL,
  `genero_id` bigint NOT NULL,
  PRIMARY KEY (`juego_id`,`genero_id`),
  KEY `fk_jg_genero` (`genero_id`),
  CONSTRAINT `fk_jg_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jg_juego` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `juego_genero`
--

LOCK TABLES `juego_genero` WRITE;
/*!40000 ALTER TABLE `juego_genero` DISABLE KEYS */;
INSERT INTO `juego_genero` VALUES (1,1),(5,1),(3,2),(5,2),(14,2),(4,3),(8,3),(2,4),(7,5),(10,5),(11,5),(12,5),(13,5),(3,6),(8,6),(10,6),(6,7),(9,7),(12,7),(15,7),(9,8),(15,8),(14,9),(1,10),(2,10),(4,10),(6,10),(7,10),(13,10);
/*!40000 ALTER TABLE `juego_genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `juegos`
--

DROP TABLE IF EXISTS `juegos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `juegos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text,
  `anio_lanzamiento` smallint DEFAULT NULL,
  `desarrollador` varchar(100) DEFAULT NULL,
  `portada_url` varchar(255) DEFAULT NULL,
  `steam_app_id` int DEFAULT NULL,
  `creado_por` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_juegos_steam_app_id` (`steam_app_id`),
  KEY `fk_juegos_creado_por` (`creado_por`),
  KEY `idx_juegos_titulo` (`titulo`),
  CONSTRAINT `fk_juegos_creado_por` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `juegos`
--

LOCK TABLES `juegos` WRITE;
/*!40000 ALTER TABLE `juegos` DISABLE KEYS */;
INSERT INTO `juegos` VALUES (1,'Hollow Knight',NULL,2017,'Team Cherry','https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg',367520,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(2,'Stardew Valley',NULL,2016,'ConcernedApe','https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg',413150,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(3,'Hades',NULL,2020,'Supergiant Games','https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg',1145360,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(4,'Celeste',NULL,2018,'Maddy Makes Games','https://cdn.cloudflare.steamstatic.com/steam/apps/504230/library_600x900.jpg',504230,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(5,'Dead Cells',NULL,2018,'Motion Twin','https://cdn.cloudflare.steamstatic.com/steam/apps/588650/library_600x900.jpg',588650,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(6,'Terraria',NULL,2011,'Re-Logic','https://cdn.cloudflare.steamstatic.com/steam/apps/105600/library_600x900.jpg',105600,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(7,'Undertale',NULL,2015,'Toby Fox','https://cdn.cloudflare.steamstatic.com/steam/apps/391540/library_600x900.jpg',391540,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(8,'Cuphead',NULL,2017,'Studio MDHR','https://cdn.cloudflare.steamstatic.com/steam/apps/268910/library_600x900.jpg',268910,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(9,'Portal 2',NULL,2011,'Valve','https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900.jpg',620,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(10,'Elden Ring',NULL,2022,'FromSoftware','https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg',1245620,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(11,'Baldur\'s Gate 3',NULL,2023,'Larian Studios','https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg',1086940,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(12,'The Witcher 3: Wild Hunt',NULL,2015,'CD PROJEKT RED','https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg',292030,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(13,'Disco Elysium',NULL,2019,'ZA/UM','https://cdn.cloudflare.steamstatic.com/steam/apps/632470/library_600x900.jpg',632470,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(14,'Slay the Spire',NULL,2019,'Mega Crit','https://cdn.cloudflare.steamstatic.com/steam/apps/646570/library_600x900.jpg',646570,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12'),(15,'Outer Wilds',NULL,2019,'Mobius Digital','https://cdn.cloudflare.steamstatic.com/steam/apps/753640/library_600x900.jpg',753640,NULL,'2026-11-20 01:36:12','2026-11-20 01:36:12');
/*!40000 ALTER TABLE `juegos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expira_en` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_prt_token_hash` (`token_hash`),
  KEY `fk_prt_usuario` (`usuario_id`),
  CONSTRAINT `fk_prt_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,5,'29e7615656c462b62f42e9ecb126a0fb36001f82044e5e5fe1024bd97b8eaffc','2026-11-23 07:06:38',1,'2026-11-23 00:36:38'),(2,5,'6706793e2141d01ffebf58f5d2a974088136956b2e01b0ec07675fd0f36d6c62','2026-11-23 07:09:11',1,'2026-11-23 00:39:11'),(3,5,'01471712dc9bc98f435a0a0c779b92b349c4d1bfb1c5ab62bc1a76f7312b3acb','2026-11-23 07:10:44',1,'2026-11-23 00:40:44'),(4,5,'9875df32b7bccfd495ee448eaac059f8c8d8485534bcb8630dd821a997d39f29','2026-11-23 07:12:31',1,'2026-11-23 00:42:31'),(5,5,'c6dc4be736dda4d42cbb9e2b806e9610657ec84170f59c8697f8dee79c055324','2026-11-23 07:13:53',1,'2026-11-23 00:43:53'),(6,5,'d4e9142b22872fc812161fd0c0987879ea749ffc185b0f1929d95f710c59f4ea','2026-11-23 14:38:56',1,'2026-11-23 08:08:56'),(7,5,'4cafca9bb44d6a90d151f136cbfdddeca4c7ee83d8043cc566e216475ef204fc','2026-11-23 14:41:53',1,'2026-11-23 08:11:53'),(8,5,'9cab6b208e8d8508ad5c2d765b163ca2201c23834642259b0b2d50afeb90e285','2026-11-23 15:14:57',1,'2026-11-23 08:44:57'),(9,5,'ca14b91ecd76dfa7c5070e9c340cb992dbd8bc59d0b5b636df307121ebd4db02','2026-11-23 15:18:31',0,'2026-11-23 08:48:31');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plataformas`
--

DROP TABLE IF EXISTS `plataformas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plataformas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_plataformas_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plataformas`
--

LOCK TABLES `plataformas` WRITE;
/*!40000 ALTER TABLE `plataformas` DISABLE KEYS */;
INSERT INTO `plataformas` VALUES (4,'Nintendo Switch'),(1,'PC'),(2,'PlayStation 5'),(5,'Steam Deck'),(3,'Xbox Series X/S');
/*!40000 ALTER TABLE `plataformas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `biblioteca_item_id` bigint NOT NULL,
  `texto` varchar(2000) NOT NULL,
  `contiene_spoilers` tinyint(1) NOT NULL DEFAULT '0',
  `visibilidad` varchar(10) NOT NULL DEFAULT 'PRIVADA',
  `oculta` tinyint(1) NOT NULL DEFAULT '0',
  `moderada_por` bigint DEFAULT NULL,
  `moderada_en` datetime DEFAULT NULL,
  `motivo_moderacion` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_resenas_item` (`biblioteca_item_id`),
  KEY `fk_resenas_moderador` (`moderada_por`),
  KEY `idx_resenas_publicas` (`visibilidad`,`oculta`),
  CONSTRAINT `fk_resenas_item` FOREIGN KEY (`biblioteca_item_id`) REFERENCES `biblioteca_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resenas_moderador` FOREIGN KEY (`moderada_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ck_resenas_visibilidad` CHECK ((`visibilidad` in (_utf8mb4'PRIVADA',_utf8mb4'PUBLICA')))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (6,19,'Explorar el mundo abierto es un placer, aunque algunos jefes son brutales.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(7,22,'Muy buena escritura, pero no logré engancharme con el ritmo.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(8,25,'Difícil pero justo. El final de la montaña me emocionó mucho.',1,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(9,27,'Perfecto para relajarse en la portátil. Ya perdí la cuenta de las horas.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(10,30,'Mejor no saber nada antes de jugarlo. Descubrir el misterio vale totalmente la pena.',1,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(11,29,'Los acertijos con portales son geniales y el humor es excelente.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(12,35,'Me cansó la cantidad de misiones secundarias.',0,'PRIVADA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(13,39,'Mi juego de cabecera. Cada estación trae algo nuevo que hacer.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(14,46,'Corto, pero cada decisión importa. Recomendado jugarlo dos veces.',1,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(15,49,'Construir un mazo que funcione es muy satisfactorio.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(16,50,'Las decisiones tienen peso real en la historia. Una joya.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(17,55,'Un RPG distinto a todo lo demás: puro diálogo y personajes memorables.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 00:51:20','2026-11-24 00:51:20'),(18,58,'Contenido de prueba que fue ocultado por moderación.',0,'PUBLICA',1,8,'2026-11-24 00:51:20','Contenido inapropiado (reseña de demostración)','2026-11-24 00:51:20','2026-11-24 00:51:20'),(19,65,'Una obra maestra del género. El mundo de Hallownest se siente enorme y cada rincón guarda algo.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(20,67,'Cada intento se siente distinto y la historia avanza con cada muerte. Muy adictivo.',0,'PUBLICA',0,NULL,NULL,NULL,'2026-11-24 17:01:48','2026-11-24 17:01:48'),(21,70,'Lo dejé a medias, se me hizo muy largo. Quizá lo retome.',0,'PRIVADA',0,NULL,NULL,NULL,'2026-11-24 17:01:48','2026-11-24 17:01:48');
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','Administra el catalogo, los usuarios y las resenas'),(2,'MODERADOR','Modera las resenas'),(3,'USUARIO','Usuario con biblioteca y resenas propias');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens_revocados`
--

DROP TABLE IF EXISTS `tokens_revocados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens_revocados` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `jti` varchar(40) NOT NULL,
  `expira_en` datetime NOT NULL,
  `revocado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tokens_revocados_jti` (`jti`),
  KEY `idx_tokens_revocados_expira` (`expira_en`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens_revocados`
--

LOCK TABLES `tokens_revocados` WRITE;
/*!40000 ALTER TABLE `tokens_revocados` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens_revocados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `telefono_verificado` tinyint(1) NOT NULL DEFAULT '0',
  `avatar_url` varchar(255) DEFAULT NULL,
  `steam_id` varchar(20) DEFAULT NULL,
  `rol_id` bigint NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `steam_ultima_sincronizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_email` (`email`),
  UNIQUE KEY `uq_usuarios_username` (`username`),
  UNIQUE KEY `uq_usuarios_steam_id` (`steam_id`),
  KEY `fk_usuarios_rol` (`rol_id`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (5,'usuario','usuario@pixelvault.com','$2a$10$VreVBlL.H41cgTdSuSa7XODs7eedj1l2CIvfQj5H5aEHlPhhC9BUO',NULL,0,NULL,NULL,3,1,'2026-11-22 20:45:26','2026-11-25 02:51:17',NULL),(7,'admin','admin@pixelvault.com','$2a$10$IrR/Ifhn9uUoBFmAoSrt/OK8BSMbfl36cUcvTzuMeVbHCePTM4R.C',NULL,0,NULL,NULL,1,1,'2026-11-23 08:46:59','2026-11-23 08:46:59',NULL),(8,'moderador','moderador@pixelvault.com','$2a$10$Yb5pJJ/qX6U6nQcE5SIBve6WeAv/O5ASM77gCGM6URCn.a0fQnmm2',NULL,0,NULL,NULL,2,1,'2026-11-23 08:46:59','2026-11-23 08:46:59',NULL),(10,'jugador01','jugador01@pixelvault.com','$2a$10$Qj6Mc6evM59JgkXzIOe5eeakExHNXrqkisubH0alCI1MdOsSlEUlG',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL),(11,'jugador02','jugador02@pixelvault.com','$2a$10$zGf4RXO9f3..x7YeU8cGWOPlbraQa0m2GJmIQQAx0igoE91I4bA2W',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL),(12,'jugador03','jugador03@pixelvault.com','$2a$10$Xo/zuTmrsbjKo2fAnNnkbOVPgtlMMoRM./0TtR1Y/EvAlj.1Vl.a6',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL),(13,'jugador04','jugador04@pixelvault.com','$2a$10$2iz2S8vPrLVtE9wQqMfkke4PDHUdFMCkrmslPP/4vY70oSojnZRTi',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL),(14,'jugador05','jugador05@pixelvault.com','$2a$10$.iJd.NsZgeRRxMD3LSGHnuUGOgfEZssOx.VWJs6axtLa.ZOq2SR5K',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL),(15,'jugador06','jugador06@pixelvault.com','$2a$10$zmQSyea5DsOOersQU7wUv.oknwDmL4SydCTz1bXnTS6hpwP6OTYYq',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL),(16,'jugador07','jugador07@pixelvault.com','$2a$10$Rxbp1fmelayUBEKiDUHZueUsjtTv/0xdcBp3Nlbq7Cq6YEZuBO9c6',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL),(17,'jugador08','jugador08@pixelvault.com','$2a$10$PiUkdqJlOVZSXDMmluUvmu9bLX6c52s/mnbW.g69n/pSojdYodML6',NULL,0,NULL,NULL,3,1,'2026-11-24 00:51:20','2026-11-24 00:51:20',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'pixelvault_limpio'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-25  3:19:39
