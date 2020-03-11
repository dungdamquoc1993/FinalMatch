DROP VIEW IF EXISTS viewSupplierStadium;
CREATE VIEW viewSupplierStadium AS
SELECT 
Supplier.id as supplierId,
Supplier.name as name,
Supplier.avatar as avatar,
Supplier.password as password,
Supplier.phoneNumber as phoneNumber,
Supplier.dateOfBirth as dateOfBirth,
Supplier.facebookId as facebookId,
Supplier.email as email,
Supplier.userType as userType,
Supplier.point as point,
X(Supplier.point) as latitude,
Y(Supplier.point) as longitude,
Supplier.address as address,
Supplier.radius as radius,
Supplier.isActive as isActive,
Supplier.tokenKey as tokenKey,
Stadium.id as stadiumId,
Stadium.stadiumName,
X(Stadium.point) as stadiumLatitude,
Y(Stadium.point) as stadiumLongitude,
Stadium.address as stadiumAddress,
Stadium.phoneNumber as stadiumPhoneNumber
FROM Supplier 
LEFT JOIN Stadium 
ON Supplier.id=Stadium.supplierId 
ORDER BY Supplier.id;

DROP VIEW IF EXISTS viewSupplierPlayerService;
CREATE VIEW viewSupplierPlayerService AS
SELECT 
Supplier.id as supplierId,
Supplier.name as name,
Supplier.avatar as avatar,
Supplier.password as password,
Supplier.phoneNumber as phoneNumber,
Supplier.dateOfBirth as dateOfBirth,
Supplier.facebookId as facebookId,
Supplier.email as email,
Supplier.userType as userType,
Supplier.point as point,
X(point) as latitude,
Y(point) as longitude,
Supplier.address as address,
Supplier.radius as radius,
Supplier.isActive as isActive,
Supplier.tokenKey as tokenKey,
PlayerService.supplierId as playerServiceSupplierId,
PlayerService.id as playerId,
PlayerService.price as playerPrice,
PlayerService.playerName as playerName,
PlayerService.position as position
FROM Supplier 
LEFT JOIN PlayerService 
ON Supplier.id=PlayerService.supplierId 
ORDER BY Supplier.id;


DROP VIEW IF EXISTS viewSupplierRefereeService;
CREATE VIEW viewSupplierRefereeService AS
SELECT 
Supplier.id as supplierId,
Supplier.name as name,
Supplier.avatar as avatar,
Supplier.password as password,
Supplier.phoneNumber as phoneNumber,
Supplier.dateOfBirth as dateOfBirth,
Supplier.facebookId as facebookId,
Supplier.email as email,
Supplier.userType as userType,
Supplier.point as point,
X(point) as latitude,
Y(point) as longitude,
Supplier.address as address,
Supplier.radius as radius,
Supplier.isActive as isActive,
Supplier.tokenKey as tokenKey,
RefereeService.supplierId as refereeServiceSupplierId,
RefereeService.id as refereeId,
RefereeService.price as refereePrice,
RefereeService.refereeName as refereeName
FROM Supplier 
LEFT JOIN RefereeService 
ON Supplier.id=RefereeService.supplierId 
ORDER BY Supplier.id;

DROP VIEW IF EXISTS viewSupplierServices;

CREATE VIEW viewSupplierServices AS
SELECT viewSupplierPlayerService.*, 
RefereeService.id as refereeId,
RefereeService.price as refereePrice,
RefereeService.refereeName FROM viewSupplierPlayerService
LEFT JOIN RefereeService 
ON viewSupplierPlayerService.supplierId=RefereeService.supplierId
ORDER BY RefereeService.supplierId;

DROP VIEW IF EXISTS viewSupplierServicesOrders;

CREATE VIEW viewSupplierServicesOrders AS
SELECT viewSupplierServices.*, 
Orders.id as orderId,
Orders.customerId as customerId,
Orders.point as orderPoint,
Orders.status as status,
Orders.typeRole as typeRole,
Orders.dateTimeStart as dateTimeStart,
Orders.dateTimeEnd as dateTimeEnd
FROM viewSupplierServices
LEFT JOIN Orders 
ON viewSupplierServices.supplierId = Orders.supplierId
ORDER BY Orders.supplierId;


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
PlayerService.price as playerPrice,
RefereeService.price as refereePrice,

Customer.customerId as customerId,
Customer.avatar as customerAvatar,
Customer.name as customerName,
Customer.phoneNumber as customerPhoneNumber,
Customer.email as customerEmail

FROM Orders
INNER JOIN Supplier ON CONVERT(Orders.supplierId, CHAR) = CONVERT(Supplier.id, CHAR) 
INNER JOIN Customer ON CONVERT(Orders.customerId, CHAR) = CONVERT(Customer.customerId, CHAR)
LEFT JOIN PlayerService ON CONVERT(Orders.supplierId, CHAR) = CONVERT(PlayerService.supplierId , CHAR)
LEFT JOIN RefereeService ON CONVERT(Orders.supplierId , CHAR) = CONVERT(RefereeService.supplierId , CHAR);

CREATE VIEW viewChatOrder AS 
SELECT 
Chat.id as chatId,
Chat.orderId as orderId,
Chat.sms as sms,
Chat.senderId as senderId,
Chat.createdDate as createdDate,
Chat.seen as seen,

Orders.customerId as customerId,
Orders.supplierId as supplierId,
Orders.typeRole as typeRole,
X(Orders.point) as orderLatitude,
Y(Orders.point) as orderLongitude,
Orders.status as orderStatus,
Orders.dateTimeStart as dateTimeStart, 
Orders.dateTimeEnd as dateTimeEnd

FROM Chat
LEFT JOIN Orders ON Chat.orderId = Orders.id;



