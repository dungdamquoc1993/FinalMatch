DROP PROCEDURE IF EXISTS insertStadium;
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
FROM Supplier HAVING distance <= radius + orderRadius;//
DELIMITER ;

DROP FUNCTION IF EXISTS loginFacebook;
delimiter //
CREATE FUNCTION loginFacebook(facebookId VARCHAR(300), email VARCHAR(300), name VARCHAR(250), avatar VARCHAR(500)) RETURNS VARCHAR(500)
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

DROP FUNCTION IF EXISTS createToken;
delimiter //
CREATE FUNCTION createToken() RETURNS VARCHAR(500)
BEGIN    
    RETURN MD5(RAND());
END; //   
delimiter ;

DROP PROCEDURE IF EXISTS insertPlayerService;
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

DROP PROCEDURE IF EXISTS insertRefereeService;
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

DROP PROCEDURE IF EXISTS updateSettings;
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

































