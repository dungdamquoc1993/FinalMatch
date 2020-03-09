//
//  NotificationEventEmitter.m
//  FinalMatchForSupplier
//
//  Created by Nguyen Duc Hoang on 3/4/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "NotificationEventEmitter.h"

@implementation NotificationEventEmitter
RCT_EXPORT_MODULE();
+ (id)shared {
    static NotificationEventEmitter *sharedObject = nil;
    @synchronized(self) {
      if (sharedObject == nil) {
        sharedObject = [[self alloc] init];
      }
    }
    return sharedObject;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[kEventPressNotification];
}


@end
