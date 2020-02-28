USE FinalMatch;

SELECT  * FROM Supplier WHERE id = 98;
SELECT * FROM viewOrdersSupplierCustomer WHERE supplierId = 98
AND orderStatus in ('missed', 'pending', 'completed', 'accepted', 'cancelled') ORDER BY createdDate DESC;
  
SELECT * FROM N

SELECT  * FROM Customer c WHERE customerId ='47c9165c5bfb03689260a8f230e45589';
SELECT * from Orders;

SELECT  * FROM viewOrdersSupplierCustomer WHERE orderId =12;

SELECT * FROM Supplier WHERE Supplier.id = 98;


SELECT * FROM viewOrdersSupplierCustomer;