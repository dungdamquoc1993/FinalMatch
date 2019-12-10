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
    latitude FLOAT DEFAULT 0.0,
    longitude FLOAT DEFAULT 0.0,
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
CREATE VIEW viewSupplierPlayerService AS
SELECT Supplier.*, PlayerService.* FROM Supplier 
INNER JOIN PlayerService 
ON Supplier.id=PlayerService.supplierId 
ORDER BY Supplier.id;
SELECT * FROM viewSupplierPlayerService WHERE id=1;
DROP VIEW viewSupplierPlayerService;
--Trước khi vào PlayerService, kiểm tra xem supplier đã đăng ký "dịch vụ cầu thủ" chưa ?
SELECT COUNT(*) FROM PlayerService WHERE supplierId=1;
--Sân bóng
DROP TABLE Stadium;
CREATE TABLE IF NOT EXISTS Stadium (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    type INTEGER DEFAULT 0,
    name VARCHAR(300) NOT NULL,
    longitude FLOAT DEFAULT 0.0,
    latitude FLOAT DEFAULT 0.0,
    address TEXT,
    phoneNumber VARCHAR(300),
    supplierId INTEGER
);
--Màn hình Đăng ký sân bóng, bấm nút Submit:
--Nếu free: có lat,long, ko có số đt
INSERT INTO Stadium(name, type, longitude, latitude,address, phoneNumber, supplierId)
VALUES("Hang Day", 1, 105.832909, 21.030134, "", "", 1);
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
CREATE TABLE IF NOT EXISTS Order (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(120) DEFAULT, 
    supplierId INTEGER
);

