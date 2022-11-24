DROP DATABASE IF EXISTS chatUser;
CREATE DATABASE chatUser;
CREATE USER IF NOT EXISTS 'gongu'@'%' IDENTIFIED BY 'asdf1234';
GRANT ALL PRIVILEGES ON chatUser.* TO 'gongu'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE chatUser;

CREATE TABLE User (
	nickname		VARCHAR(20) 	NOT NULL	PRIMARY KEY,
    password		VARCHAR(20)		NOT NULL,
    email       	VARCHAR(20)		NOT NULL
);

CREATE TABLE Room (
    roomId          INT             NOT NULL    AUTO_INCREMENT,
    roomName        VARCHAR(20)     NOT NULL,
    nickname        VARCHAR(20)     NOT NULL,
    createdAt       TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(roomId),
    FOREIGN KEY(nickname) references User(nickname) on update cascade
);

CREATE TABLE Chat (
    chatId          INT             NOT NULL    AUTO_INCREMENT,
    roomId          INT             NOT NULL,
    nickname        VARCHAR(20)     NOT NULL,
    content         VARCHAR(200),
    imagePath       VARCHAR(300),    
    createdAt       TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(chatId),
    FOREIGN KEY(roomId) references Room(roomId),
    FOREIGN KEY(nickname) references User(nickname) on update cascade
);

CREATE TABLE Member (
    roomId          INT             NOT NULL,
    nickname        VARCHAR(20)     NOT NULL,
    createdAt       TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(roomId, nickname),
    FOREIGN KEY(roomId) references Room(roomId),
    FOREIGN KEY(nickname) references User(nickname) on update cascade
);

INSERT INTO User VALUES('admin', 'asdf1234', 'admin@gmail.com');
INSERT INTO User VALUES('john', 'asdf1234', 'john@gmail.com');
INSERT INTO User VALUES('jake', 'asdf1234', 'jake@gmail.com');
INSERT INTO User VALUES('shin', 'asdf1234', 'shin@gmail.com');
INSERT INTO User VALUES('park', 'asdf1234', 'park@gmail.com');
