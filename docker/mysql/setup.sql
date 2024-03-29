-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 15. Feb 2021 um 20:12
-- Server-Version: 10.3.27-MariaDB-0+deb10u1
-- PHP-Version: 7.3.19-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `api_creds`
--

CREATE TABLE `api_creds` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `api_creds`
--

INSERT INTO `api_creds` (`id`, `name`, `link`, `password`) VALUES
(1, 'createPayment', 'https://hook.integromat.com/rq89fjoouy985of9qg8tltpjgynnhj3a', 'LHemI@jOaKPrfgg'),
(2, 'processPayment', 'https://hook.integromat.com/jyssa9kqy6gacwuu3g5povhy8u7yqkya', 'jT1d0v3tWN69cK'),
(3, 'handleThankYou', 'https://hook.integromat.com/jyssa9kqy6gacwuu3g5povhy8u7yqkya', 'nOR3Tp5BPabRRqy9f');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `instruction_explanation`
--

CREATE TABLE `instruction_explanation` (
  `explanationID` int(11) NOT NULL,
  `explanation` varchar(255) NOT NULL,
  `arguments` varchar(255) NOT NULL DEFAULT '{"arguments":[]}'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------
INSERT INTO `instruction_explanation` (`explanationID`, `explanation`, `arguments`) VALUES
(1, 'Listen to one of the available joinsounds (0-9).\nIf you want a custom joinsound, dm the bot \"becomeVIP\".', '{\"arguments\":[\"0-9\"]}	'),
(2, 'Set the sound thats being played while you join to your desired sound (0-9).', '{\"arguments\":[\"0-9\"]}	'),
(3, 'To no longer be accompanied by a joinsound :(', '{\"arguments\":[]}	'),
(4, 'Lock your current channel.', '{\"arguments\":[]}	'),
(5, 'Unlock your current channel.', '{\"arguments\":[]}	'),
(6, 'Support the bot and get a custom joinsound! You can also dm the bot \"becomeVIP\".', '{\"arguments\":[]}	'),
(7, 'Simulate yourself joining a channel.', '{\"arguments\":[]}	'),
(8, 'Manually disconnect the bot.', '{\"arguments\":[]}	'),
(9, ' Get some help ;).', '{\"arguments\":[\"page\"]}	'),
(10, 'Show the role that is able to configure the bot.', '{\"arguments\":[]}	'),
(11, 'Set the role that is able to configure the bot.', '{\"arguments\":[\"@role\"]}	'),
(12, 'See the volume at which joinsounds are being played.', '{\"arguments\":[]}	'),
(13, 'Show the role that is given with every reaction role.', '{\"arguments\":[]}	'),
(14, 'See the channel the (pinned) reactionmessage is being fetched from.', '{\"arguments\":[]}	'),
(15, 'Show all the channels, that can talk to the bot. If empty, the bot listens to every channel.', '{\"arguments\":[]}	'),
(16, 'See which channels can be locked.', '{\"arguments\":[]}	'),
(17, 'Change the prefix.', '{\"arguments\":[\"char\"]}	'),
(18, 'Change the alias of the command.', '{\"arguments\":[\"ID\", \"alias\"]}	'),
(19, 'Set the volume at which joinsounds are being played (0-100).', '{\"arguments\":[\"0-100\"]}	'),
(20, 'Change the role that is given with EVERY reaction.', '{\"arguments\":[\"@role\"]}	'),
(21, 'Set the channel, the reaction message is being part of.', '{\"arguments\":[\"#channel\"]}	'),
(22, 'Add a channel, that can talk to the bot.', '{\"arguments\":[\"#channel\"]}	'),
(23, 'Enable people to lock the current voicechannel.', '{\"arguments\":[]}	'),
(24, 'Adding a reaction to the reactionmessage.', '{\"arguments\":[\"Emoji\"]}	'),
(25, 'No longer have a passive role, which is given in pair with EVERY reaction.', '{\"arguments\":[]}	'),
(26, 'Remove the Channel the reactionmessage is being fetched from.', '{\"arguments\":[]}	'),
(27, 'Disable the channel, to talk to the bot.', '{\"arguments\":[\"#channel\"]}	'),
(28, 'Disable people from locking the current voicechannel.', '{\"arguments\":[]}	'),
(29, 'Clear all whitelisted channels.', '{\"arguments\":[]}	'),
(30, 'Make none of the channels of this server lockable.', '{\"arguments\":[]}	');

--
-- Tabellenstruktur für Tabelle `pending_payments`
--

CREATE TABLE `pending_payments` (
  `transID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `server`
--

CREATE TABLE `server` (
  `guildID` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `manageRolle` varchar(255) NOT NULL DEFAULT '{"name":"","id":""}',
  `instructions` varchar(8000) NOT NULL DEFAULT '{"instructions":[{"name":"join","type":"7","security":"0"},{"name":"leave","type":"8","security":"0"},{"name":"setVolume","type":"19","security":"1"},{"name":"volume","type":"12","security":"0"},{"name":"help","type":"9","security":"0"},{"name":"setAlias","type":"18","security":"1"},{"name":"setModRole","type":"11","security":"2"},{"name":"modRole","type":"10","security":"0"},{"name":"setPrefix","type":"17","security":"1"},{"name":"lock","type":"4","security":"0"},{"name":"unlock","type":"5","security":"0"},{"name":"setReactionChannel","type":"21","security":"1"},{"name":"addReaction","type":"24","security":"1"},{"name":"setReactionRole","type":"20","security":"1"},{"name":"reactionRole","type":"13","security":"0"},{"name":"becomeVIP","type":"6","security":"0"},{"name":"whitelist","type":"15","security":"0"},{"name":"whitelistAdd","type":"22","security":"1"},{"name":"whitelistRemove","type":"27","security":"1"},{"name":"whitelistClear","type":"29","security":"1"},{"name":"listen","type":"1","security":"0"},{"name":"setJoinSound","type":"2","security":"0"},{"name":"removeJoinSound","type":"3","security":"0"},{"name":"lockable","type":"16","security":"0"},{"name":"lockableAdd","type":"23","security":"1"},{"name":"lockableRemove","type":"28","security":"1"},{"name":"lockableClear","type":"30","security":"1"},{"name":"reactionChannel","type":"14","security":"0"},{"name":"removeReactionChannel","type":"26","security":"1"},{"name":"removeReactionRole","type":"25","security":"1"}]}',
  `whitelist` varchar(3000) NOT NULL DEFAULT '{"whitelist":[]}',
  `prefix` varchar(255) NOT NULL DEFAULT '.',
  `volume` float NOT NULL DEFAULT 0.2,
  `standartRole` varchar(255) NOT NULL DEFAULT '{"name":"","id":""}',
  `channelReact` varchar(255) NOT NULL DEFAULT '{"name":"","id":""}',
  `lockable` varchar(3000) NOT NULL DEFAULT '{"lockable":[]}'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `server`
--

INSERT INTO `server` (`guildID`, `name`, `avatar`, `manageRolle`, `instructions`, `whitelist`, `prefix`, `volume`, `standartRole`, `channelReact`, `lockable`) VALUES
('792862552879005697', 'TestingArea', 'https://cdn.discordapp.com/icons/792862552879005697/cc0e35aa7d9ec53d31dbabc88542fe8b.webp', '{\"name\":\"\",\"id\":\"\"}', '{\"instructions\":[{\"name\":\"join\",\"type\":\"7\",\"security\":\"0\"},{\"name\":\"leave\",\"type\":\"8\",\"security\":\"0\"},{\"name\":\"setVolume\",\"type\":\"19\",\"security\":\"1\"},{\"name\":\"volume\",\"type\":\"12\",\"security\":\"0\"},{\"name\":\"help\",\"type\":\"9\",\"security\":\"0\"},{\"name\":\"setAlias\",\"type\":\"18\",\"security\":\"1\"},{\"name\":\"setModRole\",\"type\":\"11\",\"security\":\"2\"},{\"name\":\"modRole\",\"type\":\"10\",\"security\":\"0\"},{\"name\":\"setPrefix\",\"type\":\"17\",\"security\":\"1\"},{\"name\":\"lock\",\"type\":\"4\",\"security\":\"0\"},{\"name\":\"unlock\",\"type\":\"5\",\"security\":\"0\"},{\"name\":\"setReactionChannel\",\"type\":\"21\",\"security\":\"1\"},{\"name\":\"addReaction\",\"type\":\"24\",\"security\":\"1\"},{\"name\":\"setReactionRole\",\"type\":\"20\",\"security\":\"1\"},{\"name\":\"reactionRole\",\"type\":\"13\",\"security\":\"0\"},{\"name\":\"becomeVIP\",\"type\":\"6\",\"security\":\"0\"},{\"name\":\"whitelist\",\"type\":\"15\",\"security\":\"0\"},{\"name\":\"whitelistAdd\",\"type\":\"22\",\"security\":\"1\"},{\"name\":\"whitelistRemove\",\"type\":\"27\",\"security\":\"1\"},{\"name\":\"whitelistClear\",\"type\":\"29\",\"security\":\"1\"},{\"name\":\"listen\",\"type\":\"1\",\"security\":\"0\"},{\"name\":\"setJoinSound\",\"type\":\"2\",\"security\":\"0\"},{\"name\":\"removeJoinSound\",\"type\":\"3\",\"security\":\"0\"},{\"name\":\"lockable\",\"type\":\"16\",\"security\":\"0\"},{\"name\":\"lockableAdd\",\"type\":\"23\",\"security\":\"1\"},{\"name\":\"lockableRemove\",\"type\":\"28\",\"security\":\"1\"},{\"name\":\"lockableClear\",\"type\":\"30\",\"security\":\"1\"},{\"name\":\"reactionChannel\",\"type\":\"14\",\"security\":\"0\"},{\"name\":\"removeReactionChannel\",\"type\":\"26\",\"security\":\"1\"},{\"name\":\"removeReactionRole\",\"type\":\"25\",\"security\":\"1\"}]}', '{\"whitelist\":[]}', '.', 0.2, '{\"name\":\"\",\"id\":\"\"}', '{\"name\":\"\",\"id\":\"\"}', '{\"lockable\":[]}');


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `userID` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isVip` tinyint(1) DEFAULT 0,
  `joinsound` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

INSERT INTO 'users' ('userID') SET ('255064680417067019');

--
-- Daten für Tabelle `users`
--

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `api_creds`
--
ALTER TABLE `api_creds`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `instruction_explanation`
--
ALTER TABLE `instruction_explanation`
  ADD PRIMARY KEY (`explanationID`);

--
-- Indizes für die Tabelle `pending_payments`
--
ALTER TABLE `pending_payments`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `transID` (`transID`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- Indizes für die Tabelle `server`
--
ALTER TABLE `server`
  ADD UNIQUE KEY `guildID` (`guildID`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `userID_UNIQUE` (`userID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `api_creds`
--
ALTER TABLE `api_creds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT für Tabelle `instruction_explanation`
--
ALTER TABLE `instruction_explanation`
  MODIFY `explanationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=332;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
