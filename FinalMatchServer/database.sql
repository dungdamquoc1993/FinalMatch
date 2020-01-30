CREATE database FinalMatch;
ALTER DATABASE FinalMatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

--ALTER TABLE PlayerService MODIFY playerName NVARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

--ALTER TABLE PlayerService CHANGE playerName playerName VARCHAR(500) CHARACTER SET utf8mb4;

--ALTER TABLE PlayerService CONVERT TO CHARACTER SET utf8;

USE FinalMatch;
CREATE TABLE IF NOT EXISTS Supplier (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(300) NOT NULL DEFAULT '',
    password VARCHAR(400) NOT NULL DEFAULT '',
    phoneNumber VARCHAR(300) UNIQUE,
    dateOfBirth DATE DEFAULT '1990-01-01',
    facebookId VARCHAR(300) DEFAULT '',    
    email VARCHAR(250) UNIQUE,
    userType VARCHAR(150) DEFAULT 'default',
    point POINT,
    address VARCHAR(500) DEFAULT '', 
    radius FLOAT DEFAULT 15.0,
    isActive INTEGER DEFAULT 1,
    tokenKey VARCHAR(500) DEFAULT '',
    avatar VARCHAR(500) DEFAULT ''

);

CREATE TABLE IF NOT EXISTS PlayerService (       
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    price FLOAT,
    playerName VARCHAR(300) NOT NULL ,
    position VARCHAR(10) NOT NULL ,
    supplierId INTEGER UNIQUE    
);
UPDATE PlayerService SET price = 0 WHERE price is NULL;

CREATE TABLE IF NOT EXISTS RefereeService (    
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    price FLOAT,
    refereeName VARCHAR(300) NOT NULL ,    
    supplierId INTEGER
);

CREATE TABLE IF NOT EXISTS Stadium (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    type INTEGER DEFAULT 0,
    stadiumName VARCHAR(300) NOT NULL,
    point POINT,
    address VARCHAR(500) NOT NULL UNIQUE,
    phoneNumber VARCHAR(300),
    supplierId INTEGER
);

CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    typeRole ENUM('player', 'referee') NOT NULL,
    customerId VARCHAR(400),
    supplierId INTEGER,
    point POINT NOT NULL,
    status VARCHAR(120) DEFAULT "pending", 
    createdDate DATETIME DEFAULT NOW(),
    dateTimeStart DATETIME,    
    dateTimeEnd DATETIME
);
ALTER TABLE Orders ADD UNIQUE unique_index(customerId, supplierId, dateTimeStart, dateTimeEnd);

CREATE TABLE IF NOT EXISTS Conversations (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    orderId INTEGER,
    sms TEXT,
    senderId VARCHAR(400),
    createdDate DATETIME DEFAULT NOW(),
    seen BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS Customer (
    customerId VARCHAR(400) PRIMARY KEY,
    avatar VARCHAR(500) DEFAULT '',
    name VARCHAR(300) NOT NULL ,
    password VARCHAR(400) NOT NULL ,
    phoneNumber VARCHAR(300) DEFAULT '',    
    facebookId VARCHAR(300) DEFAULT '',        
    email VARCHAR(250) UNIQUE,    
    userType VARCHAR(150) DEFAULT 'default',        
    isActive INTEGER DEFAULT 1,
    tokenKey VARCHAR(500) DEFAULT ''    
);

CREATE TABLE IF NOT EXISTS PlayerService (    
    playerName VARCHAR(300) NOT NULL ,
    position VARCHAR(10) NOT NULL ,
    supplierId INTEGER UNIQUE
);

CREATE TABLE IF NOT EXISTS Temp (
    content VARCHAR(500),
    createdDate DATETIME
);