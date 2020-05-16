DROP PROCEDURE IF EXISTS insertStadium;
delimiter //
CREATE PROCEDURE insertStadium( type INTEGER,
                                stadiumName VARCHAR(300) CHARACTER SET utf8mb4,
                                latitude FLOAT, 
                                longitude FLOAT,
                                address VARCHAR(500) CHARACTER SET utf8mb4,         
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

DROP FUNCTION IF EXISTS checkToken;
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

DROP FUNCTION IF EXISTS checkTokenCustomer;
--Trigger - procedures
delimiter //
CREATE FUNCTION checkTokenCustomer(tokenKey VARCHAR(500), customerId VARCHAR(400)) RETURNS BOOLEAN
BEGIN
    DECLARE numberOfCustomers INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfCustomers FROM Customer WHERE Customer.tokenKey = tokenKey 
                                                        AND Customer.customerId = customerId
                                                        AND Customer.isActive = 1;    
    IF numberOfCustomers > 0 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END; //                           
delimiter ;


delimiter //
DROP TRIGGER IF EXISTS tSupplier;
CREATE TRIGGER tSupplier BEFORE INSERT ON Supplier
 FOR EACH ROW BEGIN
   DECLARE numLength INT;
   SET numLength = (SELECT LENGTH(NEW.password));
   IF (numLength < 2) THEN
     signal sqlstate '45000' set message_text = "Password must be > 2 characters";     
   END IF;
END;//
delimiter ;


DELIMITER //
DROP PROCEDURE IF EXISTS getSupplierAroundOrder //
CREATE PROCEDURE getSupplierAroundOrder(orderRadius FLOAT, lat FLOAT, lon FLOAT)
SELECT
  id as supplierId,
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
  ) * 100
  AS distance
FROM Supplier 
HAVING distance <= radius + orderRadius
ORDER BY distance ASC;
DELIMITER ;

DROP PROCEDURE IF EXISTS getPlayersAroundOrder
DELIMITER //
CREATE PROCEDURE getPlayersAroundOrder(orderRadius FLOAT, lat FLOAT, lon FLOAT, position VARCHAR(1))
SELECT  *,
(
    GLength(
      LineStringFromWKB(
        LineString(
          point, 
          POINT(lat, lon)
        )
      )
    )
  ) * 100 AS distance,
CAST(SUBSTRING(viewSupplierPlayerService.position,position,1) AS UNSIGNED) as positionAt
FROM viewSupplierPlayerService
HAVING distance <= radius + orderRadius 
AND positionAt = 1 
AND playerServiceSupplierId IS NOT NULL
ORDER BY distance ASC;
DELIMITER ;

DROP PROCEDURE IF EXISTS createNewOrder;
--dateTimeStart trong Nodejs phai chuyen het giay va miligiay ve 0, chu y GMT
DELIMITER //
CREATE PROCEDURE createNewOrder(
    customerId VARCHAR(400),
    supplierId INTEGER,
    latitude FLOAT,
    longitude FLOAT,
    typeRole VARCHAR(100),
    dateTimeStart DATETIME    
)
BEGIN
DECLARE numberOfOrders INT DEFAULT 0;
SELECT count(*) INTO numberOfOrders FROM Orders  
WHERE Orders.point = POINT(latitude,longitude) 
        AND Orders.dateTimeStart = dateTimeStart
        AND Orders.typeRole = typeRole;        
IF numberOfOrders = 0 THEN    
    INSERT INTO Orders(customerId, supplierId, point, typeRole, dateTimeStart, dateTimeEnd)
    VALUES(customerId, supplierId, POINT(latitude,longitude), typeRole, dateTimeStart, DATE_ADD(dateTimeStart, INTERVAL 2 HOUR));
END IF;
SELECT * FROM viewOrdersSupplierCustomer WHERE orderLatitude = latitude 
        AND orderLongitude = longitude
        AND viewOrdersSupplierCustomer.dateTimeStart = dateTimeStart
        AND viewOrdersSupplierCustomer.typeRole = typeRole;               
END;
DELIMITER ;

DROP PROCEDURE IF EXISTS updateOrderStatus;
--pending, accepted, cancelled, completed, missed
DELIMITER //
CREATE PROCEDURE updateOrderStatus(
    status VARCHAR(100),
    orderId INTEGER    
)
BEGIN
SELECT 
    Orders.typeRole, 
    Orders.customerId, 
    Orders.supplierId, 
    X(Orders.point), 
    Y(Orders.point), 
    Orders.dateTimeStart, 
    Orders.dateTimeEnd
INTO 
    @typeRole,
    @customerId,
    @supplierId,
    @latitude,
    @longitude,
    @dateTimeStart,
    @dateTimeEnd
FROM Orders
WHERE Orders.id = orderId AND Orders.status = status;

UPDATE Orders SET Orders.status = status WHERE id = orderId;
IF status = 'accepted' THEN
    UPDATE Orders SET Orders.status = 'missed' 
    WHERE Orders.id != orderId
    AND Orders.status = 'pending'
    AND Orders.typeRole = @typeRole
    AND Orders.customerId = @customerId
    AND Orders.supplierId = @supplierId
    AND x(Orders.point) = @latitude
    AND y(Orders.point) = @longitude
    AND Orders.dateTimeStart = @dateTimeStart;    
END IF;
SELECT * FROM viewOrdersSupplierCustomer 
WHERE viewOrdersSupplierCustomer.orderId = orderId;
END;
DELIMITER ;


DROP PROCEDURE IF EXISTS getRefereesAroundOrder //
DELIMITER //
CREATE PROCEDURE getRefereesAroundOrder(orderRadius FLOAT, lat FLOAT, lon FLOAT)
SELECT  *,
(
    GLength(
      LineStringFromWKB(
        LineString(
          point, 
          POINT(lat, lon)
        )
      )
    )
  ) * 100 AS distance
FROM viewSupplierRefereeService
HAVING distance <= radius + orderRadius 
AND refereeServiceSupplierId IS NOT NULL
ORDER BY distance ASC;
DELIMITER ;



viewSupplierPlayerService

--Fake Stadiums
DELETE FROM Stadium WHERE stadiumName LIKE 'Fake%';
INSERT INTO Stadium(type, stadiumName, point, address, phoneNumber, supplierId )
VALUES(1,"Fake1",POINT(20.992832, 105.805872), "Giay Thuong Dinh", "1122", 11),
(0,"Fake2",POINT(20.993029, 105.807216), "Ngan hang A Chau", "2233", 11),
(0,"Fake3",POINT(20.993095, 105.804943), "Nha Nghi Hai Van", "33333", 11),
(1,"Fake4",POINT(20.994061, 105.801735), "Vit Co VAn Dinh", "4444", 11),
(0,"Fake5",POINT(21.037734, 105.834215), "Lang bac", "5555", 11);
--viwuasin
CALL getStadiumsAroundPoint(20.998880, 105.795195, 8);

DELIMITER //
DROP PROCEDURE IF EXISTS getStadiumsAroundPoint; //
--radius = km
CREATE PROCEDURE getStadiumsAroundPoint(latitude FLOAT, longitude FLOAT, radius FLOAT)
SELECT
  id as stadiumId,
  type,
  stadiumName,
  X(point) AS "latitude",
  Y(point) AS "longitude",
  address,
  phoneNumber,
  (
    GLength(
      LineStringFromWKB(
        LineString(
          point, 
          POINT(latitude, longitude)
        )
      )
    )
  ) * 100
  AS distance
FROM Stadium 
HAVING distance <= radius
ORDER BY distance ASC;

DELIMITER ;


--Neu la Player:
SELECT * FROM viewSupplierServices 
WHERE supplierId in (11,7,5) AND viewSupplierServices.position = '0010';
--Neu la Referee:
SELECT * FROM viewSupplierServices 
WHERE supplierId in (11,7,5)


DROP FUNCTION IF EXISTS loginFacebook;
delimiter //
CREATE FUNCTION loginFacebook(facebookId VARCHAR(300), 
    email VARCHAR(300), 
    name VARCHAR(250) CHARACTER SET utf8mb4, 
    avatar VARCHAR(500)) RETURNS VARCHAR(500)
BEGIN
    DECLARE numberOfSuppliers INT;
    DECLARE mySupplierId INT DEFAULT 0; 
    SELECT COUNT(*) INTO numberOfSuppliers FROM Supplier WHERE Supplier.facebookId = facebookId;
    SET @myToken = createToken();
    IF (numberOfSuppliers = 0) THEN
        BEGIN
            INSERT INTO Supplier(facebookId, name, email, avatar, password, userType)
            VALUES(facebookId, name, email, avatar, '11111', 'facebook');                        
        END;            
    END IF;
    UPDATE Supplier SET tokenKey=@myToken WHERE Supplier.facebookId = facebookId;        
    SELECT id INTO mySupplierId FROM Supplier WHERE Supplier.facebookId = facebookId AND tokenKey=@myToken;
    RETURN CONCAT(@myToken, ';', mySupplierId);        
END; //                                 
delimiter ;

DROP FUNCTION IF EXISTS registerSupplier;
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

DROP FUNCTION IF EXISTS loginSupplier;
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

DROP PROCEDURE IF EXISTS registerCustomer;
delimiter //
CREATE PROCEDURE registerCustomer(
    name VARCHAR(300) CHARACTER SET utf8mb4,
    email VARCHAR(250),
    password VARCHAR(400)
)
BEGIN
    DECLARE myToken VARCHAR(500) DEFAULT '';  
    INSERT INTO Customer(name, email, password, userType, isActive)
    VALUES(name, email, md5(password), 'default', 1);
    SET myToken = createToken();
    UPDATE Customer SET tokenKey=myToken WHERE Customer.email = email;    
    SELECT * FROM Customer WHERE Customer.email = email AND Customer.tokenKey=myToken;
END; //                                 
delimiter ;

DROP PROCEDURE IF EXISTS loginCustomer;
delimiter //
CREATE PROCEDURE loginCustomer(    
    email VARCHAR(250),
    password VARCHAR(400)    
)
BEGIN
    DECLARE numberOfCustomers INT DEFAULT 0;
    DECLARE myToken VARCHAR(500) DEFAULT '';
    SELECT count(*) INTO numberOfCustomers FROM Customer  
    WHERE Customer.email = email AND Customer.password = md5(password);
    IF(numberOfCustomers > 0) THEN    
        SET myToken = createToken();
        UPDATE Customer SET tokenKey=myToken WHERE Customer.email = email;    
        SELECT * FROM Customer WHERE Customer.email = email;    
    ELSE
        signal sqlstate '45000' set message_text = "Please check email and password";        
    END IF;
    
END; //                                 
delimiter ;

DROP PROCEDURE IF EXISTS loginFacebookCustomer;
delimiter //
CREATE PROCEDURE loginFacebookCustomer(
    facebookId VARCHAR(300), 
    email VARCHAR(300), 
    name VARCHAR(250) CHARACTER SET utf8mb4,
    avatar VARCHAR(500)) 
BEGIN
    DECLARE numberOfCustomers INT DEFAULT 0;    
    SELECT COUNT(*) INTO numberOfCustomers FROM Customer 
    WHERE Customer.facebookId = facebookId;
    SET @myToken = createToken();
    IF (numberOfCustomers = 0) THEN
        BEGIN
            INSERT INTO Customer(facebookId, name, email, avatar, password, userType)
            VALUES(facebookId, name, email, avatar, '11111', 'facebook');                        
        END;            
    END IF;
    UPDATE Customer SET tokenKey=@myToken, Customer.name = name WHERE Customer.facebookId = facebookId;        
    SELECT * FROM Customer WHERE Customer.facebookId = facebookId AND tokenKey=@myToken;    
END; //                                 
delimiter;

DROP FUNCTION IF EXISTS checkTokenCustomer;
--Trigger - procedures
delimiter //
CREATE FUNCTION checkTokenCustomer(
    tokenKey VARCHAR(500), 
    customerId VARCHAR(400)) RETURNS BOOLEAN
BEGIN
    DECLARE numberOfCustomers INT DEFAULT 0;    
    SELECT COUNT(*) INTO numberOfCustomers FROM Customer 
    WHERE Customer.tokenKey = tokenKey 
    AND Customer.customerId = customerId
    AND Customer.isActive = 1;        
    IF numberOfCustomers > 0 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END; //     
delimiter;


DROP FUNCTION IF EXISTS loginSupplier;
delimiter //

DROP FUNCTION IF EXISTS createToken;
delimiter //
CREATE FUNCTION createToken() RETURNS VARCHAR(500)
BEGIN    
    RETURN MD5(RAND());
END; //   
delimiter ;

DROP PROCEDURE IF EXISTS insertPlayerService;
delimiter //
CREATE PROCEDURE insertPlayerService(playerName VARCHAR(300) CHARACTER SET utf8mb4, 
                                    price FLOAT, 
                                    position VARCHAR(10), 
                                    supplierId INTEGER,
                                    latitude FLOAT, 
                                    longitude FLOAT,
                                    address VARCHAR(500) CHARACTER SET utf8mb4,         
                                    radius FLOAT
                                    ) 
BEGIN    
    DECLARE numberOfPlayerServices INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfPlayerServices FROM PlayerService WHERE PlayerService.supplierId = supplierId;
    IF numberOfPlayerServices > 0 THEN
        signal sqlstate '45000' set message_text = "This supplier has PlayerService already";
    END IF;
    INSERT INTO PlayerService(playerName, price, position, supplierId)
    VALUES(playerName, price, position, supplierId);
    UPDATE Supplier SET Supplier.address = address, 
                    Supplier.radius = radius,
                    Supplier.point = POINT(latitude, longitude)                    
    WHERE Supplier.id = supplierId;
    SELECT * FROM viewSupplierPlayerService WHERE viewSupplierPlayerService.supplierId = supplierId;
END;//
delimiter;

DROP PROCEDURE IF EXISTS insertRefereeService;
delimiter //
CREATE PROCEDURE insertRefereeService(refereeName VARCHAR(300) CHARACTER SET utf8mb4,         
                                    price FLOAT,
                                    phoneNumber VARCHAR(300),
                                    supplierId INTEGER,
                                    dateOfBirth DATE,
                                    latitude FLOAT, 
                                    longitude FLOAT,
                                    address VARCHAR(500) CHARACTER SET utf8mb4,         
                                    radius FLOAT
                                    ) 
BEGIN    
    DECLARE numberOfRefereeServices INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfRefereeServices FROM RefereeService WHERE RefereeService.supplierId = supplierId;
    IF numberOfRefereeServices > 0 THEN
        signal sqlstate '45000' set message_text = "This supplier has RefereeService already";
    END IF;
    INSERT INTO RefereeService(refereeName, price, supplierId)
    VALUES(refereeName, price, supplierId);
    UPDATE Supplier SET Supplier.address = address, 
                    Supplier.phoneNumber = phoneNumber,                    
                    Supplier.radius = radius,
                    Supplier.dateOfBirth = dateOfBirth,
                    Supplier.point = POINT(latitude, longitude)                    
    WHERE Supplier.id = supplierId;
    SELECT * FROM viewSupplierRefereeService WHERE viewSupplierRefereeService.supplierId = supplierId;
END;//
delimiter;


DROP PROCEDURE IF EXISTS updateSettings;
delimiter //
CREATE PROCEDURE updateSettings(supplierId INT,
                                playerPrice FLOAT,
                                refereePrice FLOAT,
                                name VARCHAR(300) CHARACTER SET utf8mb4,
                                avatar VARCHAR(500),
                                dateOfBirth DATE,
                                phoneNumber VARCHAR(300),
                                address VARCHAR(500) CHARACTER SET utf8mb4,         
                                latitude FLOAT,
                                longitude FLOAT,
                                radius FLOAT,
                                playerName VARCHAR(300) CHARACTER SET utf8mb4,
                                position VARCHAR(10),
                                refereeName VARCHAR(300) CHARACTER SET utf8mb4
                                ) 
BEGIN
	DECLARE numberOfServices INT DEFAULT 0;
    UPDATE Supplier SET Supplier.name = name, 
            Supplier.avatar = avatar, 
            Supplier.dateOfBirth = dateOfBirth, 
            Supplier.phoneNumber = phoneNumber,
            Supplier.address = address,
            Supplier.point = POINT(latitude,longitude),
            Supplier.radius = radius
    WHERE Supplier.id = supplierId;
    
    SELECT COUNT(*) INTO numberOfServices FROM PlayerService WHERE PlayerService.supplierId = supplierId;
    IF numberOfServices > 0 THEN
        UPDATE PlayerService SET 
            PlayerService.playerName = playerName,
            PlayerService.price = playerPrice,            
            PlayerService.position = position
        WHERE PlayerService.supplierId = supplierId;    
    END IF;
    SELECT COUNT(*) INTO numberOfServices FROM RefereeService WHERE RefereeService.supplierId = supplierId;
    IF numberOfServices > 0 THEN
        UPDATE RefereeService SET 
            RefereeService.refereeName = refereeName,
            RefereeService.price = refereePrice                        
        WHERE RefereeService.supplierId = supplierId;
    END IF;
    SELECT * FROM Supplier WHERE Supplier.id = supplierId;
END;//
delimiter;

DROP PROCEDURE IF EXISTS insertCustomerNotificationToken;
delimiter //
CREATE PROCEDURE insertCustomerNotificationToken(
                    token VARCHAR(500),
                    customerId VARCHAR(400)) 
BEGIN    
	DECLARE numberOfNotificationTokens INT DEFAULT 0;
    DELETE FROM CustomerNotificationTokens WHERE length(token) < 3;
    SELECT COUNT(*) INTO numberOfNotificationTokens 
    FROM CustomerNotificationTokens 
    WHERE CustomerNotificationTokens.customerId = customerId
           AND CustomerNotificationTokens.token = token;

    IF numberOfNotificationTokens = 0 THEN
        INSERT INTO CustomerNotificationTokens(token, customerId, createdDate)
        VALUES(token, customerId, NOW());        
    END IF;
END;//
delimiter;

DROP PROCEDURE IF EXISTS insertSupplierNotificationToken;
delimiter //
CREATE PROCEDURE insertSupplierNotificationToken(
                    token VARCHAR(500),
                    supplierId INTEGER) 
BEGIN    
	DECLARE numberOfNotificationTokens INT DEFAULT 0;
    DELETE FROM SupplierNotificationTokens WHERE length(token) < 3;
    SELECT COUNT(*) INTO numberOfNotificationTokens 
    FROM SupplierNotificationTokens 
    WHERE SupplierNotificationTokens.supplierId = supplierId
            AND SupplierNotificationTokens.token = token;
    IF numberOfNotificationTokens = 0 THEN
        INSERT INTO SupplierNotificationTokens(token, supplierId, createdDate)
        VALUES(token, supplierId, NOW());        
    END IF;
END;//

const INSERT_NEW_CHAT = "INSERT INTO Chat(orderId, sms, senderId) VALUES(?, ?, ?)"
/*
DROP PROCEDURE IF EXISTS insertNewChat;
delimiter //
CREATE PROCEDURE insertNewChat(
                    orderId INTEGER,
                    sms TEXT,
                    senderId VARCHAR(400))  
BEGIN    
	DECLARE numberOfCChat INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfCChat 
    FROM Chat 
    WHERE Chat.orderId = orderId 
        AND Chat.sms = sms
        AND CONVERT(Chat.senderId, CHAR) = CONVERT(senderId, CHAR);

    IF numberOfCChat = 0 THEN
        INSERT INTO Chat(orderId, sms, senderId) 
        VALUES(orderId, sms, senderId);        
    END IF;
    SELECT * FROM viewChatOrder 
    WHERE viewChatOrder.orderId = orderId 
        AND viewChatOrder.sms = sms
        AND CONVERT(viewChatOrder.senderId, CHAR) = CONVERT(senderId, CHAR);
END;//
*/

DROP PROCEDURE IF EXISTS checkCompletedAndExpiredMatch;
delimiter //
CREATE PROCEDURE checkCompletedAndExpiredMatch()  
BEGIN    
    UPDATE Orders SET status = 'completed' WHERE dateTimeEnd < NOW() AND status = 'accepted';
    UPDATE Orders SET status = 'expired' WHERE dateTimeStart < NOW() AND status = 'pending';
END;//



DROP PROCEDURE IF EXISTS deleteSuppliers;
delimiter //
CREATE PROCEDURE deleteSuppliers(IN emails VARCHAR(1000))  
BEGIN    
    DELETE FROM Notification WHERE supplierId in (SELECT Supplier.id FROM Supplier WHERE FIND_IN_SET(email, emails));
    DELETE FROM PlayerService WHERE supplierId in (SELECT Supplier.id FROM Supplier WHERE FIND_IN_SET(email, emails));
    DELETE FROM RefereeService WHERE supplierId in (SELECT Supplier.id FROM Supplier WHERE FIND_IN_SET(email, emails));
    DELETE FROM Stadium WHERE supplierId in (SELECT Supplier.id FROM Supplier WHERE FIND_IN_SET(email, emails));
    DELETE FROM SupplierNotificationTokens WHERE supplierId in (SELECT Supplier.id FROM Supplier WHERE FIND_IN_SET(email, emails));
    DELETE FROM Orders WHERE supplierId in (SELECT Supplier.id FROM Supplier WHERE FIND_IN_SET(email, emails));
    DELETE FROM Chat WHERE senderId in (SELECT CONVERT(Supplier.id, CHAR) FROM Supplier WHERE FIND_IN_SET(email, emails));
    DELETE FROM Supplier WHERE FIND_IN_SET(email, emails);
END;//
CALL deleteSuppliers('supplier01@gmail.com,supplier02@gmail.com');

DROP PROCEDURE IF EXISTS deleteCustomers;
delimiter //
CREATE PROCEDURE deleteCustomers(IN emails VARCHAR(1000))  
BEGIN    
    DELETE FROM Notification WHERE customerId in (SELECT customerId FROM Customer WHERE FIND_IN_SET(email, emails));        
    DELETE FROM CustomerNotificationTokens WHERE customerId in (SELECT customerId FROM Customer WHERE FIND_IN_SET(email, emails));  
    DELETE FROM Chat WHERE senderId in (SELECT CONVERT(customerId, CHAR) FROM Customer WHERE FIND_IN_SET(email, emails));
    DELETE FROM Orders WHERE customerId in (SELECT customerId FROM Customer WHERE FIND_IN_SET(email, emails));      
    DELETE FROM Customer WHERE FIND_IN_SET(email, emails);
END;//
CALL deleteCustomers('customer01@gmail.com,customer02@gmail.com');


DROP PROCEDURE IF EXISTS transactionRollback;
delimiter //
CREATE PROCEDURE transactionRollback()
BEGIN
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
    END;
END;//

--address to latitude, longitude
https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0


SELECT * FROM Supplier WHERE email IN ('supplier01@gmail.com','supplier02@gmail.com');//





























