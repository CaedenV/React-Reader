CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(20) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `pic` text,
  `favGenre` text,
  `nowRead` varchar(15) DEFAULT NULL,
  `online` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_UNIQUE` (`id`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `books` (
  `id` varchar(15) NOT NULL,
  `cover` text NOT NULL,
  `title` text NOT NULL,
  `author` text NOT NULL,
  `pubDate` date NOT NULL,
  `genre` text NOT NULL,
  `desc` longtext NOT NULL,
  `avgRating` double DEFAULT '0',
  `rateCount` int DEFAULT '0',
  `prevRate` double DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookId_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `friendusers` (
  `friendUsersId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `friendId` int NOT NULL,
  PRIMARY KEY (`friendUsersId`),
  UNIQUE KEY `friendUsersId_UNIQUE` (`friendUsersId`),
  UNIQUE KEY `userId_UNIQUE` (`userId`),
  UNIQUE KEY `friendId_UNIQUE` (`friendId`),
  CONSTRAINT `friendFriend` FOREIGN KEY (`friendId`) REFERENCES `users` (`id`),
  CONSTRAINT `friendUserMain` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notifs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int DEFAULT NULL,
  `receiverId` int NOT NULL,
  `notifRead` tinyint NOT NULL DEFAULT '0',
  `book` json DEFAULT NULL,
  `friendRequest` json DEFAULT NULL,
  `message` text,
  `notifType` enum('sys','friend','book') NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `sender_idx` (`senderId`),
  KEY `receiver_idx` (`receiverId`),
  CONSTRAINT `receiver` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`),
  CONSTRAINT `sender` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookId` varchar(15) NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(20) NOT NULL,
  `text` text NOT NULL,
  `userName` varchar(20) NOT NULL,
  `postedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviewId_UNIQUE` (`id`),
  KEY `revUser_idx` (`userName`),
  CONSTRAINT `revUser` FOREIGN KEY (`userName`) REFERENCES `users` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `favbooks` (
  `favBookId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `bookId` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `bookRank` tinyint unsigned DEFAULT '5',
  PRIMARY KEY (`favBookId`),
  UNIQUE KEY `favBookId_UNIQUE` (`favBookId`),
  KEY `user_idx` (`userId`),
  KEY `book_idx` (`bookId`),
  CONSTRAINT `favUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `favbooks_chk_1` CHECK ((`bookRank` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ownedbooks` (
  `ownedId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `bookId` varchar(15) NOT NULL,
  `bookAdds` json DEFAULT NULL,
  `bookExp` datetime DEFAULT NULL,
  `bookLoans` tinyint unsigned DEFAULT '0',
  PRIMARY KEY (`ownedId`),
  UNIQUE KEY `ownedId_UNIQUE` (`ownedId`),
  KEY `ownedUser_idx` (`userId`),
  KEY `bookOwned_idx` (`bookId`),
  CONSTRAINT `bookOwned` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`),
  CONSTRAINT `ownedUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_bookLoans` CHECK ((`bookLoans` between 0 and 8))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `wishedbooks` (
  `wishedId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `bookId` varchar(15) NOT NULL,
  PRIMARY KEY (`wishedId`),
  UNIQUE KEY `wishedId_UNIQUE` (`wishedId`),
  KEY `wishedUser_idx` (`userId`),
  KEY `wishedBook_idx` (`bookId`),
  CONSTRAINT `wishedBook` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`),
  CONSTRAINT `wishedUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bookadds` (
  `addsId` int NOT NULL AUTO_INCREMENT,
  `ownedBookId` varchar(15) NOT NULL,
  `location` varchar(45) DEFAULT NULL,
  `fontSize` int DEFAULT NULL,
  `style` json DEFAULT NULL,
  `comments` json DEFAULT NULL,
  PRIMARY KEY (`addsId`),
  UNIQUE KEY `ownedBookId_UNIQUE` (`ownedBookId`),
  UNIQUE KEY `addsId_UNIQUE` (`addsId`),
  KEY `addsOrigin_idx` (`ownedBookId`),
  CONSTRAINT `addsOrigin` FOREIGN KEY (`ownedBookId`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Holds a user''s personalized book alterations -- such as progress, font size, styles, comments'