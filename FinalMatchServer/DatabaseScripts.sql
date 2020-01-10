SELECT * FROM Supplier WHERE id = 44;

SELECT * FROM PlayerService;

SELECT * FROM RefereeService;

DELETE FROM PlayerService WHERE 1 = 1;

DELETE FROM RefereeService WHERE 1 = 1;

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
