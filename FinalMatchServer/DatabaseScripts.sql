USE FinalMatch;
SELECT id, tokenKey FROM Supplier;
DESCRIBE PlayerService;

ALTER TABLE PlayerService DROP CHECK checkMaxPrice;
ALTER TABLE PlayerService ADD CONSTRAINT checkMaxPrice CHECK(price<=150000);

SELECT * from PlayerService;

update PlayerService set price=400000 WHERE supplierId=47;

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
