-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-05-2023 a las 16:39:48
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_appuntes`
--
CREATE DATABASE IF NOT EXISTS `db_appuntes` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_appuntes`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anuncios`
--

DROP TABLE IF EXISTS `anuncios`;
CREATE TABLE `anuncios` (
  `id_anuncio` int(11) NOT NULL,
  `texto_anuncio` varchar(300) NOT NULL,
  `id_grado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `anuncios`
--

INSERT INTO `anuncios` (`id_anuncio`, `texto_anuncio`, `id_grado`) VALUES
(1, 'Buenas, este es un anuncio de prueba para el grado de ingeniería multimedia.', 1),
(3, 'Proximamente se realizarán las presentaciones de los abp de este año', 1),
(4, 'Anuncio de informatica', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apuntes`
--

DROP TABLE IF EXISTS `apuntes`;
CREATE TABLE `apuntes` (
  `id_apuntes` int(11) NOT NULL,
  `filename` varchar(60) NOT NULL,
  `titlename` varchar(40) NOT NULL,
  `visualizaciones` int(11) NOT NULL,
  `downloads` int(11) NOT NULL,
  `description` varchar(300) NOT NULL,
  `upload_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `user` int(11) NOT NULL,
  `asignatura` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaturas`
--

DROP TABLE IF EXISTS `asignaturas`;
CREATE TABLE `asignaturas` (
  `id_asignatura` int(11) NOT NULL,
  `name` varchar(35) NOT NULL,
  `description` varchar(200) NOT NULL,
  `curso` int(11) NOT NULL,
  `grado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignaturas`
--

INSERT INTO `asignaturas` (`id_asignatura`, `name`, `description`, `curso`, `grado`) VALUES
(1, 'Sonido y musica por computador', '', 3, 1),
(2, 'Gráficos por computador', '', 3, 1),
(3, 'Técnicas avanzadas de gráficos', '', 4, 1),
(4, 'Asignatura 1', '', 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

DROP TABLE IF EXISTS `grados`;
CREATE TABLE `grados` (
  `id_grado` int(11) NOT NULL,
  `grado_name` varchar(50) NOT NULL,
  `grado_description` varchar(300) NOT NULL,
  `cursos` int(11) NOT NULL,
  `id_uni` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`id_grado`, `grado_name`, `grado_description`, `cursos`, `id_uni`) VALUES
(1, 'Grado en Ingenieria Multimedia', 'El titulado en Ingeniería Multimedia es un profesional con sólidos conocimientos en diseño y uso de las tecnologías de soporte, y en el desarrollo de aplicaciones multimedia, siendo capaz de realizar tareas de integración tecnológica.', 4, 1),
(3, 'Grado en Ingeniería Informatica', '', 4, 1),
(5, 'Grado en Ingeniería Informatica', '', 4, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

DROP TABLE IF EXISTS `preguntas`;
CREATE TABLE `preguntas` (
  `id_pregunta` int(11) NOT NULL,
  `texto_pregunta` int(11) NOT NULL,
  `upload_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_apuntes`
--

DROP TABLE IF EXISTS `preguntas_apuntes`;
CREATE TABLE `preguntas_apuntes` (
  `id_pregunta` int(11) NOT NULL,
  `id_apuntes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_asignaturas`
--

DROP TABLE IF EXISTS `preguntas_asignaturas`;
CREATE TABLE `preguntas_asignaturas` (
  `id_pregunta` int(11) NOT NULL,
  `id_asignatura` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

DROP TABLE IF EXISTS `respuestas`;
CREATE TABLE `respuestas` (
  `id_respuesta` int(11) NOT NULL,
  `texto_respuesta` varchar(50) NOT NULL,
  `upload_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `user` int(11) NOT NULL,
  `pregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguir_a_asignatura`
--

DROP TABLE IF EXISTS `seguir_a_asignatura`;
CREATE TABLE `seguir_a_asignatura` (
  `user` int(11) NOT NULL,
  `asignatura` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguir_a_usuario`
--

DROP TABLE IF EXISTS `seguir_a_usuario`;
CREATE TABLE `seguir_a_usuario` (
  `user` int(11) NOT NULL,
  `user_followed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `universities`
--

DROP TABLE IF EXISTS `universities`;
CREATE TABLE `universities` (
  `id_uni` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(200) NOT NULL,
  `logo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `universities`
--

INSERT INTO `universities` (`id_uni`, `name`, `address`, `logo`) VALUES
(1, 'Universidad de Alicante', 'Carr. de San Vicente del Raspeig, s/n, 03690 San Vicente del Raspeig, Alicante', 'none'),
(2, 'Universidad de michigan', 'Michigan', 'Michigan');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `rol` enum('administrador','normal') NOT NULL DEFAULT 'normal',
  `name` varchar(20) NOT NULL,
  `surname` varchar(30) NOT NULL,
  `email` varchar(350) NOT NULL,
  `password` varchar(1024) NOT NULL,
  `register_dateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `lastConexion` datetime NOT NULL,
  `curso` int(11) NOT NULL,
  `uni` int(11) NOT NULL,
  `grado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `anuncios`
--
ALTER TABLE `anuncios`
  ADD PRIMARY KEY (`id_anuncio`),
  ADD KEY `anuncio_del_grado` (`id_grado`);

--
-- Indices de la tabla `apuntes`
--
ALTER TABLE `apuntes`
  ADD PRIMARY KEY (`id_apuntes`),
  ADD KEY `by_user` (`user`),
  ADD KEY `de_asignatura` (`asignatura`);

--
-- Indices de la tabla `asignaturas`
--
ALTER TABLE `asignaturas`
  ADD PRIMARY KEY (`id_asignatura`),
  ADD KEY `del_grado` (`grado`);

--
-- Indices de la tabla `grados`
--
ALTER TABLE `grados`
  ADD PRIMARY KEY (`id_grado`),
  ADD KEY `grado_de_uni` (`id_uni`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `usuario_publicador` (`user_id`);

--
-- Indices de la tabla `preguntas_apuntes`
--
ALTER TABLE `preguntas_apuntes`
  ADD KEY `pregunta_` (`id_pregunta`),
  ADD KEY `apuntes` (`id_apuntes`);

--
-- Indices de la tabla `preguntas_asignaturas`
--
ALTER TABLE `preguntas_asignaturas`
  ADD KEY `preguntas_` (`id_pregunta`),
  ADD KEY `asingatura_` (`id_asignatura`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `respondiendo_a` (`pregunta`),
  ADD KEY `respondedor` (`user`);

--
-- Indices de la tabla `seguir_a_asignatura`
--
ALTER TABLE `seguir_a_asignatura`
  ADD KEY `fk_user_follow_asig` (`user`),
  ADD KEY `fk_asignatura_followed` (`asignatura`);

--
-- Indices de la tabla `seguir_a_usuario`
--
ALTER TABLE `seguir_a_usuario`
  ADD KEY `fk_user_follower` (`user`),
  ADD KEY `fk_user_followed` (`user_followed`);

--
-- Indices de la tabla `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`id_uni`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `mi_grado` (`grado`),
  ADD KEY `mi_uni` (`uni`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `anuncios`
--
ALTER TABLE `anuncios`
  MODIFY `id_anuncio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `apuntes`
--
ALTER TABLE `apuntes`
  MODIFY `id_apuntes` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `asignaturas`
--
ALTER TABLE `asignaturas`
  MODIFY `id_asignatura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `id_grado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id_pregunta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `universities`
--
ALTER TABLE `universities`
  MODIFY `id_uni` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `anuncios`
--
ALTER TABLE `anuncios`
  ADD CONSTRAINT `anuncio_del_grado` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `apuntes`
--
ALTER TABLE `apuntes`
  ADD CONSTRAINT `by_user` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `de_asignatura` FOREIGN KEY (`asignatura`) REFERENCES `asignaturas` (`id_asignatura`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asignaturas`
--
ALTER TABLE `asignaturas`
  ADD CONSTRAINT `del_grado` FOREIGN KEY (`grado`) REFERENCES `grados` (`id_grado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `grados`
--
ALTER TABLE `grados`
  ADD CONSTRAINT `grado_de_uni` FOREIGN KEY (`id_uni`) REFERENCES `universities` (`id_uni`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `usuario_publicador` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntas_apuntes`
--
ALTER TABLE `preguntas_apuntes`
  ADD CONSTRAINT `apuntes` FOREIGN KEY (`id_apuntes`) REFERENCES `apuntes` (`id_apuntes`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pregunta_` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntas_asignaturas`
--
ALTER TABLE `preguntas_asignaturas`
  ADD CONSTRAINT `asingatura_` FOREIGN KEY (`id_asignatura`) REFERENCES `asignaturas` (`id_asignatura`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `preguntas_` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respondedor` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `respondiendo_a` FOREIGN KEY (`pregunta`) REFERENCES `preguntas` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `seguir_a_asignatura`
--
ALTER TABLE `seguir_a_asignatura`
  ADD CONSTRAINT `fk_asignatura_followed` FOREIGN KEY (`asignatura`) REFERENCES `asignaturas` (`id_asignatura`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_follow_asig` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `seguir_a_usuario`
--
ALTER TABLE `seguir_a_usuario`
  ADD CONSTRAINT `fk_user_followed` FOREIGN KEY (`user_followed`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_user_follower` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `mi_grado` FOREIGN KEY (`grado`) REFERENCES `grados` (`id_grado`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mi_uni` FOREIGN KEY (`uni`) REFERENCES `universities` (`id_uni`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
