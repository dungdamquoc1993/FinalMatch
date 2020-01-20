USE FinalMatch;
   

DROP PROCEDURE IF EXISTS loginFacebookCustomer;
delimiter //
CREATE PROCEDURE loginFacebookCustomer(
    facebookId VARCHAR(300), 
    email VARCHAR(300), 
    name VARCHAR(250), 
    avatar VARCHAR(500)) 
BEGIN
    DECLARE numberOfCustomers INT DEFAULT 0;    
    SELECT COUNT(*) INTO numberOfCustomers FROM Customer 
    WHERE Customer.facebookId = facebookId;
    SET @myToken = createToken();
    IF (numberOfCustomers = 0) THEN
        BEGIN
            INSERT INTO Customer(facebookId, name, email, avatar, password, userType)
            VALUES(facebookId, name, email, avatar, '11111', 'facebook');                        
        END;            
    END IF;
    UPDATE Customer SET tokenKey=@myToken WHERE Customer.facebookId = facebookId;        
    SELECT customerId, facebookId,tokenKey FROM Customer WHERE Customer.facebookId = facebookId AND tokenKey=@myToken;    
END; //                                 
delimiter;
CALL loginFacebookCustomer('11323245', 'ss@gmail.com', '', ''); 
