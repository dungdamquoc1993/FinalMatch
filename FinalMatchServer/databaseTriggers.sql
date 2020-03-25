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

DROP TRIGGER tCheckMaxPriceBeforeInsertPlayerService;
delimiter //
CREATE TRIGGER tCheckMaxPriceBeforeInsertPlayerService BEFORE INSERT ON PlayerService
FOR EACH ROW 
BEGIN
	IF NEW.price > 150000 THEN
    	SET NEW.price = 150000;
        signal sqlstate '45000' set message_text = "Maximum price is 150000";     
    END IF;
END
delimiter ;

DROP TRIGGER tCheckMaxPriceBeforeUpdatePlayerService;
delimiter //
CREATE TRIGGER tCheckMaxPriceBeforeUpdatePlayerService BEFORE UPDATE ON PlayerService
FOR EACH ROW 
BEGIN
	IF NEW.price > 150000 THEN
    	SET NEW.price = 150000;
        signal sqlstate '45000' set message_text = "Maximum price is 150000";     
    END IF;
END
delimiter ;

DROP TRIGGER tCheckMaxPriceBeforeInsertRefereeService;
delimiter //
CREATE TRIGGER tCheckMaxPriceBeforeInsertRefereeService BEFORE INSERT ON RefereeService
FOR EACH ROW 
BEGIN
	IF NEW.price > 150000 THEN
    	SET NEW.price = 150000;
        signal sqlstate '45000' set message_text = "Maximum price is 150000";     
    END IF;
END
delimiter ;

DROP TRIGGER tCheckMaxPriceBeforeUpdateRefereeService;
delimiter //
CREATE TRIGGER tCheckMaxPriceBeforeUpdateRefereeService BEFORE UPDATE ON RefereeService
FOR EACH ROW 
BEGIN
	IF NEW.price > 150000 THEN
    	SET NEW.price = 150000;
        signal sqlstate '45000' set message_text = "Maximum price is 150000";     
    END IF;
END
delimiter ;



