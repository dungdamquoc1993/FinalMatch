USE FinalMatch;

CREATE PROCEDURE insertNewChat(
                    orderId INTEGER,
                    sms TEXT,
                    senderId VARCHAR(400))
BEGIN    
	DECLARE numberOfCChat INT DEFAULT 0;
    SELECT COUNT(*) INTO numberOfCChat 
    FROM Chat 
    WHERE Chat.orderId = orderId 
        AND Chat.sms = sms
        AND ONVERT(Chat.senderId, CHAR) = CONVERT(senderId, CHAR);

    IF numberOfCChat = 0 THEN
        INSERT INTO Chat(orderId, sms, senderId) 
        VALUES(orderId, sms, senderId);        
    END IF;
    SELECT * FROM viewChatOrder 
    WHERE viewChatOrder.orderId = orderId 
        AND viewChatOrder.sms = sms
        AND ONVERT(viewChatOrder.senderId, CHAR) = CONVERT(senderId, CHAR);
END;