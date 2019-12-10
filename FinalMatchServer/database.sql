CREATE database FinalMatch;
USE FinalMatch;
DROP TABLE Supplier;
CREATE TABLE IF NOT EXISTS Supplier (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(300) NOT NULL ,
    password VARCHAR(400) NOT NULL ,
    phoneNumber VARCHAR(300) UNIQUE,
    dateOfBirth DATE,
    facebookId VARCHAR(300) DEFAULT '',    
    email VARCHAR(250) UNIQUE,
    userType VARCHAR(150) DEFAULT 'default',
    point POINT,
    radius FLOAT DEFAULT 0.0,
    isActive INTEGER DEFAULT 1,
    tokenKey VARCHAR(500)    
);
delimiter //
CREATE TRIGGER tSupplier BEFORE INSERT ON Supplier
 FOR EACH ROW BEGIN
   DECLARE numLength INT;
   SET numLength = (SELECT LENGTH(NEW.password));

   IF (numLength < 2) THEN
     signal sqlstate '45000' set message_text = "Password must be > 2 characters";     
   END IF;
END;//
delimiter ;
DROP TRIGGER tSupplier;

DESCRIBE Supplier;
--Register a default supplier
INSERT INTO Supplier(name, password, phoneNumber, dateOfBirth, email)
VALUES("Hoang", "xxx", "12345", '1979-10-25', 'hoang@gmail.com');
--FAke suppliers
INSERT INTO Supplier(name, password, phoneNumber, dateOfBirth, email, point, radius)
VALUES("Hoang1", "xxx", "12345", '1979-10-25', 'hoang@gmail.com',  ST_GeomFromText('POINT(20.995370 105.807250)'), 11000);

--sao truc mao meo

INSERT INTO Supplier(name, password, phoneNumber, dateOfBirth, email, point, radius)
VALUES("Hoang2", "xxx", "123456", '1979-10-25', 'hoang1@gmail.com',  ST_GeomFromText('POINT(20.994407 105.806877)'), 11000);

--Vinmec

INSERT INTO Supplier(name, password, phoneNumber, dateOfBirth, email, point, radius)
VALUES("Hoang3", "xxx", "123457", '1979-10-25', 'hoang2@gmail.com',  ST_GeomFromText('POINT(20.993817 105.867659)'), 11000);
--108 Le TRong Tan

INSERT INTO Supplier(name, password, phoneNumber, dateOfBirth, email, point, radius)
VALUES("Hoang4", "xxx", "123458", '1979-10-25', 'hoang3@gmail.com',  ST_GeomFromText('POINT(20.998066 105.829462)'), 11000);

--Cửu Việt, Châu Quỳ

INSERT INTO Supplier(name, password, phoneNumber, dateOfBirth, email, point, radius)
VALUES("Hoang5", "xxx", "123459", '1979-10-25', 'hoang4@gmail.com',  ST_GeomFromText('POINT(21.008068 105.939789)'), 11000);
--Trung Hoa, Cau Giay

INSERT INTO Supplier(name, password, phoneNumber, dateOfBirth, email, point, radius)
VALUES("Hoang6", "xxx", "1234510", '1979-10-25', 'hoang5@gmail.com',  ST_GeomFromText('POINT(21.014102 105.802116)'), 11000);

--meters
SELECT 100000*ST_Distance(POINT(20.991267,105.812368),POINT(20.990314,105.815973));
SELECT 100000*GLength(LineStringFromWKB(LineString(POINT(20.991267,105.812368), POINT(20.990314,105.815973))));
--tu 322 NGuyen TRai den 5 diem con lai

DELIMITER //
DROP PROCEDURE IF EXISTS getSupplierAroundOrder //
CREATE PROCEDURE getSupplierAroundOrder(orderRadius FLOAT, lat FLOAT, lon FLOAT)
SELECT
  name,phoneNumber, radius,
  dateOfBirth, facebookId, email, userType,
  X(point) AS "latitude",
  Y(point) AS "longitude",
  (
    GLength(
      LineStringFromWKB(
        LineString(
          point, 
          POINT(lat, lon)
        )
      )
    )
  ) * 100000
  AS distance
FROM Supplier HAVING distance <= radius + orderRadius;
//
DELIMITER ;
call getSupplierAroundOrder(10000, 20.9959819, 105.8097244);
--Login default supplier
SELECT * FROM Supplier WHERE email="hoang@gmail.com" AND password="xxx";
UPDATE Supplier SET tokenKey="xx12345" WHERE email="hoang@gmail.com" AND password="xxx";
--signout default supplier
UPDATE Supplier SET tokenKey="" WHERE email="hoang@gmail.com" AND password="xxx";

SELECT * FROM Supplier;
--Register/login a facebook supplier
DROP FUNCTION loginFacebook;
delimiter //
CREATE FUNCTION loginFacebook(facebookId VARCHAR(300), email VARCHAR(300), name VARCHAR(250)) RETURNS VARCHAR(500)
BEGIN
    DECLARE numberOfSuppliers INT;
    SELECT COUNT(*) INTO numberOfSuppliers FROM Supplier WHERE Supplier.facebookId = facebookId;
    IF (numberOfSuppliers > 0) THEN
        BEGIN
            SET @myToken = createToken();
            UPDATE Supplier SET tokenKey=@myToken WHERE Supplier.facebookId = facebookId;            
            RETURN @myToken;
        END;
    ELSE
        BEGIN
            INSERT INTO Supplier(facebookId, name, email)
            VALUES(facebookId, name, email);
            SET @myToken = createToken();
            UPDATE Supplier SET tokenKey=@myToken WHERE Supplier.facebookId = facebookId;            
            RETURN @myToken;
        END;
    END IF;
END; //                                 
delimiter ;
SET @tokenKey=loginFacebook("fb112", "fb11@gmail.com", "Nguyen Van A");
SELECT @tokenKey;
--create token
DROP FUNCTION createToken;
delimiter //
CREATE FUNCTION createToken() RETURNS VARCHAR(500)
BEGIN
    DECLARE token VARCHAR(500);
    select concat( 
    char(round(rand()*1)+38),char(round(rand()*0)+50),
    char(round(rand()*1)+97),char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*1)+38),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*1)+38),
    char(round(rand()*1)+97),
    char(round(rand()*1)+38),
    char(round(rand()*25)+97),
    char(round(rand()*1)+58),
    char(round(rand()*1)+97),
    char(round(rand()*25)+97),
    char(round(rand()*1)+38),
    char(round(rand()*1)+97),
    char(round(rand()*1)+38),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*1)+58),
    char(round(rand()*1)+97)
) into token;
    RETURN token;
END; //   
delimiter ;
SET @myToken = createToken();
SELECT @myToken;
--Màn hình "Đăng ký dịch vụ"
CREATE TABLE IF NOT EXISTS PlayerService (    
    playerName VARCHAR(300) NOT NULL ,
    position VARCHAR(10) NOT NULL ,
    supplierId INTEGER
);
--Màn hình PlayerService, khi bấm Submit(2 câu lênh):
INSERT INTO PlayerService(playerName, position, supplierId)
VALUES("Nguyen Van A", "1001", 1);
UPDATE Supplier SET phoneNumber = "0912356" 
WHERE id=1;
--Trước khi vào PlayerService, lấy số điện thoại của supplier, lat, lon ?

DROP VIEW viewSupplierPlayerService;
CREATE VIEW viewSupplierPlayerService AS
SELECT 
Supplier.id as supplierId,
Supplier.name as name,
Supplier.password as password,
Supplier.phoneNumber as phoneNumber,
Supplier.dateOfBirth as dateOfBirth,
Supplier.facebookId as facebookId,
Supplier.email as email,
Supplier.userType as userType,
Supplier.geoPoint as geoPoint,
Supplier.radius as radius,
Supplier.isActive as isActive,
Supplier.tokenKey as tokenKey,
PlayerService.playerName as playerName,
PlayerService.position as position
FROM Supplier 
INNER JOIN PlayerService 
ON Supplier.id=PlayerService.supplierId 
ORDER BY Supplier.id;

SELECT * FROM viewSupplierPlayerService;

DROP VIEW viewSupplierServices;
CREATE VIEW viewSupplierServices AS

SELECT viewSupplierPlayerService.*, 
RefereeeService.refereeName FROM viewSupplierPlayerService
INNER JOIN RefereeeService 
ON viewSupplierPlayerService.supplierId=RefereeeService.supplierId
ORDER BY RefereeeService.supplierId;

SELECT * FROM viewSupplierServices;

--Trước khi vào PlayerService, kiểm tra xem supplier đã đăng ký "dịch vụ cầu thủ" chưa ?
SELECT COUNT(*) FROM PlayerService WHERE supplierId=1;
--Màn hình "Đăng ký dv trong tai"
CREATE TABLE IF NOT EXISTS RefereeeService (    
    refereeName VARCHAR(300) NOT NULL ,    
    supplierId INTEGER
);
INSERT INTO RefereeeService(refereeName, supplierId)
VALUES("trong tai A", 1);

--Sân bóng
DROP TABLE Stadium;
CREATE TABLE IF NOT EXISTS Stadium (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    type INTEGER DEFAULT 0,
    name VARCHAR(300) NOT NULL,
    point POINT,
    address TEXT,
    phoneNumber VARCHAR(300),
    supplierId INTEGER
);
--Màn hình Đăng ký sân bóng, bấm nút Submit:
--Nếu free: có lat,long, ko có số đt
INSERT INTO Stadium(name, type, point,address, phoneNumber, supplierId)
VALUES("Hang Day", 1, ST_GeomFromText('POINT(105.832909 21.030134)'), "", "", 1);
--Test lat, long:
select X(point) as "latitude", Y(point) AS "longitude" from Stadium;
--Kiểm tra xem supplier có bao nhiêu dịch vụ sân bóng
SELECT COUNT(*) FROM Stadium WHERE supplierId=1;
--Customer
https://maps.googleapis.com/maps/api/geocode/json?address=Thanh%20Xuan,%20Ha%20Noi&key=AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0
--Đơn hàng = Order
DROP TABLE Order;
--status: "pending", "confirmed", "completed", "cancelled", 
--"completed" = currentDAte > date
--"missing"="confirmed" với thằng khác => phải xử lý local storage trong RN
--Nhap vi tri: VD: Quan Thnh Xuan, Hanoi
--https://maps.googleapis.com/maps/api/geocode/json?address=Quan TX, Hanoi&key=AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0


DROP TABLE Orders;
CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    customerId VARCHAR(400),
    supplierId INTEGER,
    point POINT NOT NULL,
    status VARCHAR(120) DEFAULT "pending", 
    createdDate DATETIME(6) DEFAULT NOW(),
    dateTimeStart DATETIME,    
    dateTimeEnd DATETIME
);
ALTER TABLE Orders ADD UNIQUE unique_index(customerId, supplierId, dateTimeStart, dateTimeEnd);

DROP TRIGGER tCheckTime;
delimiter //
CREATE TRIGGER tCheckTime BEFORE INSERT ON Orders
 FOR EACH ROW BEGIN
    IF (NEW.dateTimeStart < NEW.createdDate OR TIMESTAMPDIFF(MINUTE,NEW.dateTimeStart, NEW.dateTimeEnd) < 180) THEN
     signal sqlstate '45000' set message_text = "dateTimeStart, dateTimeEnd error in range";     
   END IF;
END;//
delimiter ;

--Test insert data
INSERT INTO Orders(customerId, supplierId, point, dateTimeStart, dateTimeEnd)
VALUES('d62d7eb43ab45ee725f82080d4586c52', 1, ST_GeomFromText('POINT(105.832909 21.030134)'), '2019-12-07 16:00:00', '2019-12-07 19:00:00');

SELECT TIMESTAMPDIFF(MINUTE,dateTimeStart, dateTimeEnd) as "diff" FROM Orders;
--Chat = conversations
DROP TABLE Conversations;
CREATE TABLE IF NOT EXISTS Conversations (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    orderId INTEGER,
    sms TEXT,
    senderId VARCHAR(400),
    createdDate DATETIME(6) DEFAULT NOW(),
    seen BOOLEAN DEFAULT FALSE
);
--Customer
DROP TABLE Customer;
CREATE TABLE IF NOT EXISTS Customer (
    customerId VARCHAR(400) PRIMARY KEY,
    name VARCHAR(300) NOT NULL ,
    password VARCHAR(400) NOT NULL ,
    phoneNumber VARCHAR(300) UNIQUE,    
    facebookId VARCHAR(300) DEFAULT '',        
    email VARCHAR(250) UNIQUE,    
    userType VARCHAR(150) DEFAULT 'default',        
    isActive INTEGER DEFAULT 1,
    tokenKey VARCHAR(500)    
);
--ALTER TABLE Customer MODIFY customerId DEFAULT md5(UUID());
delimiter //
CREATE TRIGGER tCreateCustomerId BEFORE INSERT ON Customer
    FOR EACH ROW 
    SET NEW.customerId = md5(UUID());//    
delimiter ;


INSERT INTO Customer(name, password, phoneNumber, facebookId, email, userType)
VALUES("hoang A", "12345", "12355522", "323424", "hoang1@gmail.com", "facebook");

INSERT INTO Conversations(orderId, sms, senderId) 
VALUES(1, "Chao ban", '1');
INSERT INTO Conversations(orderId, sms, senderId) 
VALUES(1, "ok ban khoe khong ?", 'd62d7eb43ab45ee725f82080d4586c52');
SELECT * FROM Conversations WHERE orderId=1;

UPDATE Conversations SET Conversations.seen = TRUE
WHERE orderId = 1;

SELECT Orders.id as orderId, 
Orders.customerId as customerId,
Orders.supplierId as supplierId,
X(Orders.point) as latitude,
Y(Orders.point) as longitude,
Orders.status as status,
Conversations.sms as sms,
Conversations.senderId as senderId,
Conversations.seen as seen
FROM Conversations
INNER JOIN Orders
ON Conversations.orderId=Orders.id
ORDER BY Conversations.createdDate DESC;

--Notifications 









