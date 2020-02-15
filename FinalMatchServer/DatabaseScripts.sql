USE FinalMatch;

DELIMITER //
DROP PROCEDURE IF EXISTS getPlayerAroundOrder //
CREATE PROCEDURE getPlayerAroundOrder(orderRadius FLOAT, lat FLOAT, lon FLOAT, position VARCHAR(10))
SELECT  *,
(
    GLength(
      LineStringFromWKB(
        LineString(
          point, 
          POINT(lat, lon)
        )
      )
    )
  ) * 100 AS distance
FROM viewSupplierPlayerService
HAVING distance <= radius + orderRadius 
AND position = position 
AND supplierId IS NOT NULL
ORDER BY distance ASC;
DELIMITER ;


SELECT * FROM Supplier s HAVING email = 'hoang@gmail.com';



