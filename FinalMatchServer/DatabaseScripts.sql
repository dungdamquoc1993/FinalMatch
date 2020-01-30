USE FinalMatch;
DROP TABLE Customer;

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

