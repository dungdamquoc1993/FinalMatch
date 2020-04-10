DROP TRIGGER IF EXISTS tCheckTime;
delimiter //
CREATE TRIGGER tCheckTime BEFORE INSERT ON Orders
 FOR EACH ROW BEGIN
    IF (NEW.dateTimeStart < NEW.createdDate OR TIMESTAMPDIFF(MINUTE,NEW.dateTimeStart, NEW.dateTimeEnd) < 180) THEN
     signal sqlstate '45000' set message_text = "dateTimeStart, dateTimeEnd error in range";     
   END IF;   
END;//
delimiter ;



DROP TRIGGER IF EXISTS tCreateCustomerId;
delimiter //
CREATE TRIGGER tCreateCustomerId BEFORE INSERT ON Customer
    FOR EACH ROW 
    SET NEW.customerId = md5(UUID());//    
delimiter ;




