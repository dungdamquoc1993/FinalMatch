USE FinalMatch;

--3 cus: id: x1,x2,x3
--3 supplier 111, 222, 333

DELETE FROM Orders WHERE customerId IN ('x1','x2','x3');
DELETE FROM Orders WHERE supplierId IN (111,222,333);


SET @@time_zone = '+00:00';
CALL createNewOrder('x1',111,888,999,'referee','2021-05-01 16:40:00');
CALL createNewOrder('x1',222,888,999,'player','2021-05-01 16:40:00');
CALL createNewOrder('x1',333,888,999,'referee','2021-05-01 16:40:00');

CALL createNewOrder('x1',333,888,999,'referee','2021-05-01 18:42:00');

CALL createNewOrder('x2',111,888,999,'referee','2021-05-01 16:40:00');//o4

SELECT * FROM Orders WHERE customerId IN ('x1','x2','x3') OR supplierId IN (111,222,333);


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
        AND Orders.dateTimeStart BETWEEN DATE_SUB(dateTimeStart, INTERVAL 2 HOUR) AND dateTimeEnd 
        AND Orders.status IN ('accepted')
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


DROP PROCEDURE IF EXISTS updateOrderStatusFromSupplier;
delimiter //
CREATE PROCEDURE updateOrderStatusFromSupplier(
    orderStatus VARCHAR(100),
    orderId INTEGER    
)
BEGIN	
    IF orderStatus = 'accepted' THEN
    	BEGIN
	    	UPDATE Orders SET Orders.status = 'accepted' 
	    	WHERE Orders.id = orderId AND Orders.status IN ('pending');
			
	    	SELECT @customerId := Orders.customerId,
	    			@supplierId := Orders.supplierId,
	    			@dateTimeStart := Orders.dateTimeStart,
	    			@typeRole := Orders.typeRole 
	    	FROM Orders WHERE Orders.id = orderId;
	    
	    	UPDATE Orders SET Orders .status = 'missed'
	    	WHERE Orders.customerId = @customerId 
	    			AND Orders.supplierId != @supplierId
	    			AND Orders.typeRole = @typeRole;
    	END;
    END IF;
    
END; //                                 
delimiter ;

CALL updateOrderStatusFromSupplier('accepted', 61);