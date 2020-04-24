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

ALTER TABLE RefereeService MODIFY COLUMN 
refereeName VARCHAR(300) CHARACTER SET utf8mb4 NOT NULL;


CREATE TABLE IF NOT EXISTS Stadium (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    type INTEGER DEFAULT 0,
    stadiumName VARCHAR(300) NOT NULL,
    point POINT,
    address VARCHAR(500) NOT NULL UNIQUE,
    phoneNumber VARCHAR(300),
    supplierId INTEGER
);

ALTER TABLE Stadium MODIFY COLUMN 
stadiumName VARCHAR(300) CHARACTER SET utf8mb4 NOT NULL;
ALTER TABLE Stadium MODIFY COLUMN 
address VARCHAR(500) CHARACTER SET utf8mb4 NOT NULL UNIQUE;

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
--status: pending, accepted, cancelled, completed, missed(1 cllient request nhieu supplier, 1 supplier dong y, )
--Khi nao cho dat: pending, cancelled, missed
ALTER TABLE Orders ADD UNIQUE unique_index(customerId, supplierId, dateTimeStart, dateTimeEnd);

CREATE TABLE IF NOT EXISTS Chat (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    orderId INTEGER,
    sms TEXT,
    senderId VARCHAR(400),
    createdDate DATETIME DEFAULT NOW(),
    seen BOOLEAN DEFAULT FALSE
);

ALTER TABLE Chat MODIFY COLUMN 
sms TEXT CHARACTER SET utf8mb4 NOT NULL;

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

ALTER TABLE Customer MODIFY COLUMN 
name VARCHAR(300) CHARACTER SET utf8mb4 NOT NULL;

CREATE TABLE IF NOT EXISTS PlayerService (    
    playerName VARCHAR(300) NOT NULL ,
    position VARCHAR(10) NOT NULL ,
    supplierId INTEGER UNIQUE
);
ALTER TABLE PlayerService MODIFY COLUMN 
playerName VARCHAR(300) CHARACTER SET utf8mb4 NOT NULL;

CREATE TABLE IF NOT EXISTS Temp (
    content VARCHAR(500),
    createdDate DATETIME
);
CREATE TABLE IF NOT EXISTS CustomerNotificationTokens (
    token VARCHAR(500),
    customerId VARCHAR(400),
    createdDate DATETIME
);
CREATE TABLE IF NOT EXISTS SupplierNotificationTokens (
    token VARCHAR(500),
    supplierId INTEGER,
    createdDate DATETIME
);
CREATE TABLE IF NOT EXISTS Notification (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    supplierId INTEGER,
    customerId VARCHAR(400),
    titleEnglish VARCHAR(300),
    bodyEnglish VARCHAR(500),
    titleVietnamese VARCHAR(300),
    bodyVietnamese VARCHAR(500),    
    orderId INTEGER,        
    createdDate DATETIME DEFAULT NOW()    
);
ALTER TABLE Notification MODIFY COLUMN 
titleVietnamese VARCHAR(300) CHARACTER SET utf8mb4;

ALTER TABLE Notification MODIFY COLUMN 
bodyVietnamese VARCHAR(500) CHARACTER SET utf8mb4;



  --PENDING: "pending", 
  --ACCEPTED: "accepted", 
  --CANCELLED:"cancelled", 
  --COMPLETED: "completed", 
  --MISSED: "missed"