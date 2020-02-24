USE FinalMatch;


SELECT  * FROM viewOrdersSupplierCustomer;

DROP VIEW viewOrdersSupplierCustomer;

CREATE VIEW viewOrdersSupplierCustomer AS
SELECT 
Orders.id as orderId,
Orders.typeRole as typeRole,
X(Orders.point) as orderLatitude,
Y(Orders.point) as orderLongitude,
Orders.status as orderStatus,
Orders.createdDate as createdDate,
Orders.dateTimeStart as dateTimeStart, 
Orders.dateTimeEnd as dateTimeEnd,

Supplier.id as supplierId,
Supplier.name as supplierName,
Supplier.phoneNumber as supplierPhoneNumber,
Supplier.dateOfBirth as supplierDateOfBirth,
Supplier.email as supplierEmail,
X(Supplier.point) as supplierLatitude,
Y(Supplier.point) as supplierLongitude,
Supplier.address as supplierAddress,
Supplier.radius as supplierRadius,
Supplier.avatar as supplierAvatar,

Customer.customerId as customerId,
Customer.avatar as customerAvatar,
Customer.name as customerName,
Customer.phoneNumber as customerPhoneNumber,
Customer.email as customerEmail

FROM Orders
INNER JOIN Supplier ON CONVERT(Orders.supplierId, CHAR) = CONVERT(Supplier.id, CHAR) 
INNER JOIN Customer ON CONVERT(Orders.customerId, CHAR) = CONVERT(Customer.customerId, CHAR);

CALL getDate();
SELECT tokenKey FROM Customer c WHERE customerId ='47c9165c5bfb03689260a8f230e45589'