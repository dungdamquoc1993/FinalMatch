USE FinalMatch;

select * from Orders o ;
UPDATE Orders SET status = 'completed' WHERE dateTimeEnd < NOW();

CALL getDate();
SELECT tokenKey FROM Customer c WHERE customerId ='47c9165c5bfb03689260a8f230e45589'