USE FinalMatch;
   

                            

SELECT checkTokenCustomer("e32d56b313183bdadc431eaacabef218", "afff4a72ee4e5c04038d922b5fea4e76");

SELECT COUNT(*) INTO numberOfCustomers FROM Customer 
    WHERE Customer.tokenKey =  
   	AND Customer.customerId = customerId
   	AND Customer.isActive = 1;
   
SELECT * FROM Customer;
