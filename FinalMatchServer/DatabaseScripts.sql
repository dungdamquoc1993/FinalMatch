USE FinalMatch;

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
    INSERT INTO Orders(customerId, supplierId, point, typeRole, dateimeStart)
    VALUES(customerId, supplierId, POINT(latitude,longitude), typeRole, dateimeStart);
END IF;
SELECT * FROM Orders WHERE Orders.point = POINT(latitude,longitude) 
        AND Orders.dateTimeStart = dateTimeStart
        AND Orders.typeRole = typeRole;        
END;
