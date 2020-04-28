USE FinalMatch;
SELECT  * FROM  Supplier where id =37 ;
SELECT * FROM Stadium WHERE supplierId in (select id from Supplier where email like '%supplier01%');
DELETE FROM Stadium WHERE supplierId in (select id from Supplier where email like '%supplier01%');
SELECT * FROM Stadium;

