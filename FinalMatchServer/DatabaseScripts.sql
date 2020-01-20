USE FinalMatch;
   

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

SELECT checkTokenCustomer("e32d56b313183bdadc431eaacabef218X", "afff4a72ee4e5c04038d922b5fea4e76");

SELECT COUNT(*) INTO numberOfCustomers FROM Customer 
    WHERE Customer.tokenKey =  
   	AND Customer.customerId = customerId
   	AND Customer.isActive = 1;
   
SELECT * FROM Customer;
