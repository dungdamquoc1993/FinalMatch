USE FinalMatch;
DROP TABLE Customer;

DESCRIBE Stadium;
SELECT * FROM Stadium s 

DELETE FROM Stadium WHERE stadiumName LIKE 'Fake%';
INSERT INTO Stadium(type, stadiumName, point, address, phoneNumber, supplierId )
VALUES(1,"Fake1",POINT(20.992832, 105.805872), "Giay Thuong Dinh", "1122", 11),
(0,"Fake2",POINT(20.993029, 105.807216), "Ngan hang A Chau", "2233", 11),
(0,"Fake3",POINT(20.993095, 105.804943), "Nha Nghi Hai Van", "33333", 11),
(1,"Fake4",POINT(20.994061, 105.801735), "Vit Co VAn Dinh", "4444", 11),
(0,"Fake5",POINT(21.037734, 105.834215), "Lang bac", "5555", 11);
--viwuasin
CALL getStadiumsAroundPoint(20.998880, 105.795195, 8);



