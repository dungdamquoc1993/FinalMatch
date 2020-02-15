USE FinalMatch;

DROP PROCEDURE IF EXISTS getRefereeAroundOrder //
CREATE PROCEDURE getRefereeAroundOrder(orderRadius FLOAT, lat FLOAT, lon FLOAT)
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
FROM viewSupplierRefereeService
HAVING distance <= radius + orderRadius 
AND supplierId IS NOT NULL
ORDER BY distance ASC;

