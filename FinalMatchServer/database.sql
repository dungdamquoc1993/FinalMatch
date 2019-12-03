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
SELECT COUNT(*) FROM Supplier WHERE email="hoang@gmail.com" AND password="xxx";
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