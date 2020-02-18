USE FinalMatch;

DROP PROCEDURE IF EXISTS updateOrderStatus;
--pending, accepted, cancelled, completed, missed
DELIMITER //
CREATE PROCEDURE updateOrderStatus(
    status VARCHAR(100),
    orderId INTEGER,    
)
BEGIN
UPDATE Orders SET Orders.status = status WHERE id = orderId;
SELECT * FROM Orders WHERE id = orderId;
END;
DELIMITER ;