USE FinalMatch;
SELECT  * FROM  Supplier where id =37 ;
select * from PlayerService where supplierId = 37;
select * from RefereeService Service where supplierId = 37;
DELETE FROM RefereeService  where supplierId = 37;


SELECT  * FROM  Supplier where id =47 ;
select * from PlayerService where supplierId = 47;
select * from RefereeService Service where supplierId = 47;
DELETE FROM RefereeService  where supplierId = 47;

DROP PROCEDURE IF EXISTS updateSettings;

CALL updateSettings('47',13000,
                                '',
                                'Dzun',
                                '',
                                '1993-01-16',
                                '487619099',
                                'Ngõ 109 - Quan Nhân',
                                21.00627326965332,
                                105.81369018554688,
                                15,
                                'Dzu',
                                '1100',
                                ''
                                ) 
   
                                DROP PROCEDURE IF EXISTS updateSettings;
delimiter //
CREATE PROCEDURE updateSettings(supplierId INT,
                                playerPrice FLOAT,
                                refereePrice FLOAT,
                                name VARCHAR(300) CHARACTER SET utf8mb4,
                                avatar VARCHAR(500),
                                dateOfBirth DATE,
                                phoneNumber VARCHAR(300),
                                address TEXT,
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
END;//
delimiter;
