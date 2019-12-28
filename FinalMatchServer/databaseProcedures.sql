DROP PROCEDURE insertStadium;
delimiter //
CREATE PROCEDURE insertStadium( type INTEGER,
                                stadiumName VARCHAR(300), 
                                latitude FLOAT, 
                                longitude FLOAT,
                                address VARCHAR(500), 
                                phoneNumber VARCHAR(300), 
                                supplierId INTEGER) 
BEGIN    
    DECLARE numberOfStadiums INT DEFAULT 0;
    DECLARE MAX_STADIUMS INT;
    SET MAX_STADIUMS = 4;    
    IF supplierId = 0 THEN
        signal sqlstate '45000' set message_text = "You must enter supplierId";
    END IF;

    SELECT COUNT(*) INTO numberOfStadiums FROM Stadium WHERE Stadium.supplierId = supplierId;
    IF numberOfStadiums > MAX_STADIUMS THEN
        signal sqlstate '45000' set message_text = "This supplier only has MAX_STADIUMS = 5";
    END IF;
    IF type = 0 AND (latitude = 0 OR longitude = 0) AND address = '' THEN
        signal sqlstate '45000' set message_text = "type = 0 => point, address not null";
    END IF;

    INSERT INTO Stadium(type, stadiumName, point, address, phoneNumber, supplierId)
    VALUES(type, stadiumName, POINT(latitude, longitude), address, phoneNumber, supplierId);        
    SELECT * FROM Stadium WHERE Stadium.supplierId = supplierId;
END;//


DROP VIEW viewSupplierStadium;
CREATE VIEW viewSupplierStadium AS
SELECT 
Supplier.id as supplierId,
Supplier.name as name,
Supplier.avatar as avatar,
Supplier.password as password,
Supplier.phoneNumber as phoneNumber,
Supplier.dateOfBirth as dateOfBirth,
Supplier.facebookId as facebookId,
Supplier.email as email,
Supplier.userType as userType,
Supplier.point as point,
X(Supplier.point) as latitude,
Y(Supplier.point) as longitude,
Supplier.address as address,
Supplier.radius as radius,
Supplier.isActive as isActive,
Supplier.tokenKey as tokenKey,
Stadium.id as stadiumId,
Stadium.stadiumName,
X(Stadium.point) as stadiumLatitude,
Y(Stadium.point) as stadiumLongitude,
Stadium.address as stadiumAddress,
Stadium.phoneNumber as stadiumPhoneNumber
FROM Supplier 
LEFT JOIN Stadium 
ON Supplier.id=Stadium.supplierId 
ORDER BY Supplier.id;

--Trigger - procedures
delimiter //
CREATE FUNCTION checkToken(tokenKey VARCHAR(500), supplierId INT) RETURNS BOOLEAN
BEGIN
    DECLARE numberOfSuppliers, mySupplierId INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfSuppliers FROM Supplier WHERE Supplier.tokenKey = tokenKey;    
    SELECT id INTO mySupplierId from Supplier WHERE Supplier.tokenKey = tokenKey;
    IF numberOfSuppliers > 0 AND mySupplierId = supplierId THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END; //                                 
delimiter ;
--ok tai day
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

DROP FUNCTION registerSupplier;
--select md5("123456") = "e10adc3949ba59abbe56e057f20f883e"
delimiter //
CREATE FUNCTION registerSupplier(email VARCHAR(300), password VARCHAR(400), userType VARCHAR(150)) RETURNS VARCHAR(300)
BEGIN
    DECLARE mySupplierId INT DEFAULT 0;  
    INSERT INTO Supplier(email, password, userType)
    VALUES(email, md5(password), userType);
    SET @myToken = createToken();
    UPDATE Supplier SET tokenKey=@myToken WHERE Supplier.email = email;    
    SELECT id INTO mySupplierId FROM Supplier WHERE Supplier.email = email AND tokenKey=@myToken;
    RETURN CONCAT(@myToken, ';', mySupplierId);           
END; //                                 
delimiter ;
--SELECT registerSupplier("hoang12@gmail.com", "123456", "default") AS tokenKeySupplierId;

DROP FUNCTION loginSupplier;
delimiter //
CREATE FUNCTION loginSupplier(email VARCHAR(300), password VARCHAR(400), userType VARCHAR(150)) RETURNS VARCHAR(300)
BEGIN
    DECLARE numberOfSuppliers, mySupplierId INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfSuppliers FROM Supplier WHERE Supplier.email = email AND Supplier.password = md5(password);
    IF numberOfSuppliers > 0 THEN
        BEGIN
            SET @myToken = createToken();
            UPDATE Supplier SET tokenKey=@myToken WHERE Supplier.email = email;     
            SELECT id INTO mySupplierId FROM Supplier WHERE Supplier.email = email AND tokenKey=@myToken;
            RETURN CONCAT(@myToken, ';', mySupplierId);            
        END;
    ELSE
        signal sqlstate '45000' set message_text = "Please check email and password";
        RETURN ""; 
    END IF;
END;//                              
delimiter ;

--create token
DROP FUNCTION createToken;
delimiter //
CREATE FUNCTION createToken() RETURNS VARCHAR(500)
BEGIN    
    RETURN MD5(RAND());
END; //   
delimiter ;

DROP PROCEDURE insertPlayerService;
delimiter //
CREATE PROCEDURE insertPlayerService(playerName VARCHAR(300), 
                                    position VARCHAR(10), 
                                    supplierId INTEGER,
                                    latitude FLOAT, 
                                    longitude FLOAT,
                                    address TEXT,
                                    radius FLOAT
                                    ) 
BEGIN    
    DECLARE numberOfPlayerServices INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfPlayerServices FROM PlayerService WHERE PlayerService.supplierId = supplierId;
    IF numberOfPlayerServices > 0 THEN
        signal sqlstate '45000' set message_text = "This supplier has PlayerService already";
    END IF;
    INSERT INTO PlayerService(playerName, position, supplierId)
    VALUES(playerName, position, supplierId);
    UPDATE Supplier SET Supplier.address = address, 
                    Supplier.radius = radius,
                    Supplier.point = POINT(latitude, longitude)                    
    WHERE Supplier.id = supplierId;
    SELECT * FROM PlayerService WHERE PlayerService.supplierId = supplierId;
END;//
delimiter;

--ok den day
DROP VIEW viewSupplierPlayerService;
CREATE VIEW viewSupplierPlayerService AS
SELECT 
Supplier.id as supplierId,
Supplier.name as name,
Supplier.avatar as avatar,
Supplier.password as password,
Supplier.phoneNumber as phoneNumber,
Supplier.dateOfBirth as dateOfBirth,
Supplier.facebookId as facebookId,
Supplier.email as email,
Supplier.userType as userType,
Supplier.point as point,
X(point) as latitude,
Y(point) as longitude,
Supplier.address as address,
Supplier.radius as radius,
Supplier.isActive as isActive,
Supplier.tokenKey as tokenKey,
PlayerService.id as playerId,
PlayerService.playerName as playerName,
PlayerService.position as position
FROM Supplier 
LEFT JOIN PlayerService 
ON Supplier.id=PlayerService.supplierId 
ORDER BY Supplier.id;


DROP VIEW viewSupplierRefereeService;
CREATE VIEW viewSupplierRefereeService AS
SELECT 
Supplier.id as supplierId,
Supplier.name as name,
Supplier.avatar as avatar,
Supplier.password as password,
Supplier.phoneNumber as phoneNumber,
Supplier.dateOfBirth as dateOfBirth,
Supplier.facebookId as facebookId,
Supplier.email as email,
Supplier.userType as userType,
Supplier.point as point,
X(point) as latitude,
Y(point) as longitude,
Supplier.address as address,
Supplier.radius as radius,
Supplier.isActive as isActive,
Supplier.tokenKey as tokenKey,
RefereeService.id as refereeId,
RefereeService.refereeName as refereeName
FROM Supplier 
LEFT JOIN RefereeService 
ON Supplier.id=RefereeService.supplierId 
ORDER BY Supplier.id;

DROP VIEW viewSupplierServices;

CREATE VIEW viewSupplierServices AS
SELECT viewSupplierPlayerService.*, 
RefereeService.id as refereeId,
RefereeService.refereeName FROM viewSupplierPlayerService
LEFT JOIN RefereeService 
ON viewSupplierPlayerService.supplierId=RefereeService.supplierId
ORDER BY RefereeService.supplierId;

DROP VIEW viewSupplierServicesOrders;

CREATE VIEW viewSupplierServicesOrders AS
SELECT viewSupplierServices.*, 
Orders.id as orderId,
Orders.customerId as customerId,
Orders.point as orderPoint,
Orders.status as status,
Orders.typeRole as typeRole,
Orders.dateTimeStart as dateTimeStart,
Orders.dateTimeEnd as dateTimeEnd
FROM viewSupplierServices
LEFT JOIN Orders 
ON viewSupplierServices.supplierId = Orders.supplierId
ORDER BY Orders.supplierId;

DROP TRIGGER tCheckTime;
delimiter //
CREATE TRIGGER tCheckTime BEFORE INSERT ON Orders
 FOR EACH ROW BEGIN
    IF (NEW.dateTimeStart < NEW.createdDate OR TIMESTAMPDIFF(MINUTE,NEW.dateTimeStart, NEW.dateTimeEnd) < 180) THEN
     signal sqlstate '45000' set message_text = "dateTimeStart, dateTimeEnd error in range";     
   END IF;
END;//
delimiter ;

delimiter //
CREATE TRIGGER tCreateCustomerId BEFORE INSERT ON Customer
    FOR EACH ROW 
    SET NEW.customerId = md5(UUID());//    
delimiter ;


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

DROP PROCEDURE insertRefereeService;
delimiter //
CREATE PROCEDURE insertRefereeService(refereeName VARCHAR(300),          
                                    phoneNumber VARCHAR(300),
                                    supplierId INTEGER,
                                    dateOfBirth DATE,
                                    latitude FLOAT, 
                                    longitude FLOAT,
                                    address TEXT,
                                    radius FLOAT
                                    ) 
BEGIN    
    DECLARE numberOfRefereeServices INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfRefereeServices FROM RefereeService WHERE RefereeService.supplierId = supplierId;
    IF numberOfRefereeServices > 0 THEN
        signal sqlstate '45000' set message_text = "This supplier has RefereeService already";
    END IF;
    INSERT INTO RefereeService(refereeName, supplierId)
    VALUES(refereeName, supplierId);
    UPDATE Supplier SET Supplier.address = address, 
                    Supplier.phoneNumber = phoneNumber,                    
                    Supplier.radius = radius,
                    Supplier.dateOfBirth = dateOfBirth,
                    Supplier.point = POINT(latitude, longitude)                    
    WHERE Supplier.id = supplierId;
    SELECT * FROM RefereeService WHERE RefereeService.supplierId = supplierId;
END;//
delimiter;

DROP PROCEDURE updateSettings;
--Màn hình RefereeService, sau khi bấm Save
delimiter //
CREATE PROCEDURE updateSettings(supplierId INT,
                                name VARCHAR(300),
                                dateOfBirth DATE,
                                phoneNumber VARCHAR(300),
                                address TEXT,
                                latitude FLOAT,
                                longitude FLOAT,
                                radius FLOAT,
                                playerName VARCHAR(300),
                                position VARCHAR(10),
                                refereeName VARCHAR(300)
                                ) 
BEGIN    
    UPDATE Supplier SET Supplier.name = name, 
            Supplier.dateOfBirth = dateOfBirth, 
            Supplier.phoneNumber = phoneNumber,
            Supplier.address = address,
            Supplier.point = POINT(latitude,longitude),
            Supplier.radius = radius
    WHERE Supplier.id = supplierId;
    
    UPDATE PlayerService SET 
            PlayerService.playerName = playerName,
            PlayerService.position = position
    WHERE PlayerService.supplierId = supplierId;

    UPDATE RefereeService SET 
            RefereeService.refereeName = refereeName            
    WHERE RefereeService.supplierId = supplierId;

END;//
delimiter;

































