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

SELECT Orders.id as orderId, 
Orders.customerId as customerId,
Orders.supplierId as supplierId,
X(Orders.point) as latitude,
Y(Orders.point) as longitude,
Orders.status as status,
Conversations.sms as sms,
Conversations.senderId as senderId,
Conversations.seen as seen
FROM Conversations
INNER JOIN Orders
ON Conversations.orderId=Orders.id
ORDER BY Conversations.createdDate DESC;
