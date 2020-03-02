//
//  NotificationModule.m
//  FinalMatchForSupplier
//
//  Created by Nguyen Duc Hoang on 3/2/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "NotificationModule.h"

@interface NotificationModule ()

@end

@implementation NotificationModule
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(pushLocalNotification:(NSString *)title message:(NSString *)message) {
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  UNAuthorizationOptions options = UNAuthorizationOptionAlert + UNAuthorizationOptionSound;
  [center requestAuthorizationWithOptions: options
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted == NO) {
      NSLog(@"Something went wrong");
    }
  }];
  UNMutableNotificationContent *content = [UNMutableNotificationContent new];
  content.title = title;
  content.body = message;
  content.sound = [UNNotificationSound defaultSound];
  
  NSDate *date = [[NSDate new] dateByAddingTimeInterval:2];
  
  NSDateComponents *triggerDate = [[NSCalendar currentCalendar]
                                   components:NSCalendarUnitYear +
                                   NSCalendarUnitMonth + NSCalendarUnitDay +
                                   NSCalendarUnitHour + NSCalendarUnitMinute +
                                   NSCalendarUnitSecond fromDate:date];
  
  UNCalendarNotificationTrigger *trigger = [UNCalendarNotificationTrigger
                                            triggerWithDateMatchingComponents:triggerDate
                                            repeats:NO];
  NSString *uuidString = [[NSUUID new] UUIDString];
  UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:uuidString
                                                                        content:content trigger:trigger];

  [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"Something went wrong: %@",error);
    }
  }];
}

@end
