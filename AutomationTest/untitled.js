set @x = 'supplier01@gmail.com';
	DELETE FROM Notification WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);		
	DELETE FROM CustomerNotificationTokens WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);	
	DELETE FROM Chat WHERE senderId in (SELECT CONVERT(customerId, CHAR) FROM Customer WHERE email=@x);
	DELETE FROM Orders WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);		
	DELETE FROM Customer WHERE email=@x