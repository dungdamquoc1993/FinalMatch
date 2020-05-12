USE FinalMatch;

--3 cus: id: x1,x2,x3
--3 supplier 111, 222, 333

DELETE FROM Orders WHERE customerId IN ('x1','x2','x3');
DELETE FROM Orders WHERE supplierId IN (111,222,333);


SET @@time_zone = '+00:00';
CALL createNewOrder('x1',111,888,999,'player','2021-05-01 16:40:00');
CALL createNewOrder('x1',222,888,999,'player','2021-05-01 16:40:00');
CALL createNewOrder('x1',333,888,999,'player','2021-05-01 16:40:00');

CALL createNewOrder('c1',111,888,999,'referee','2021-05-05 12:00:00');
CALL createNewOrder('c2',111,888,999,'referee','2021-05-05 12:00:00');
CALL createNewOrder('c3',111,888,999,'referee','2021-05-06 12:00:00');


select * from viewChatOrder;
SELECT  * FROM Supplier s ;
CALL createNewOrder('x2',111,888,999,'referee','2021-05-01 16:40:00');

SELECT * FROM Orders WHERE customerId IN ('x1','x2','x3') OR supplierId IN (111,222,333);
DELETE FROM Orders WHERE id=82;

SELECT * FROM Orders;
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
SET @dateTimeEnd = DATE_ADD(dateTimeStart, INTERVAL 2 HOUR);
SELECT count(*) INTO numberOfOrders FROM Orders  
WHERE Orders.point = POINT(latitude,longitude) 
        AND 
        	(
        		(Orders.dateTimeStart BETWEEN DATE_SUB(dateTimeStart, INTERVAL 2 HOUR) AND @dateTimeEnd AND Orders.status IN ('accepted')) 
        		AND
        		(Orders.customerId = customerId AND Orders.status = 'accepted') 
        	);
        	       	
IF numberOfOrders = 0 THEN    
    INSERT INTO Orders(customerId, supplierId, point, typeRole, dateTimeStart, dateTimeEnd)
    VALUES(customerId, supplierId, POINT(latitude,longitude), typeRole, dateTimeStart, @dateTimeEnd);
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

CALL updateOrderStatusFromSupplier('accepted', 72);
DESCRIBE Orders ;

SELECT chatId,supplierId , customerId, senderId FROM viewChatOrder 
WHERE CONVERT(viewChatOrder.supplierId, CHAR) = CONVERT('47c9165c5bfb03689260a8f230e45589', CHAR) 
OR CONVERT(viewChatOrder.customerId, CHAR) = CONVERT('47c9165c5bfb03689260a8f230e45589', CHAR) 
ORDER BY viewChatOrder.createdDate;

SELECT * from viewChatOrder WHERE senderId = '47c9165c5bfb03689260a8f230e45589';

SELECT * FROM 

