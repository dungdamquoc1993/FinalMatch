//
//  NotificationManager.m
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
RCT_EXPORT_METHOD(pushLocalNotification:(NSString *)title message:(NSString *)message)
{
  NSLog(@"Push noti");
}

@end
