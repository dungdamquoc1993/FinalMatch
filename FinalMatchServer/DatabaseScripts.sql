USE FinalMatch;
   
CREATE TABLE IF NOT EXISTS Temp (
    content VARCHAR(500),
    createdDate DATETIME
);

SELECT  * FROM Temp order by createdDate DESC limit 1;

SELECT  * FROM  Supplier s ;

SELECT * FROM viewSupplierServices
JOIN Supplier 
WHERE supplierId in (11,7,5);
