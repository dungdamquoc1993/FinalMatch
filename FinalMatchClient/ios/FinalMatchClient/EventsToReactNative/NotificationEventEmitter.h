//
//  NotificationEventEmitter.h
//  FinalMatchForSupplier
//
//  Created by Nguyen Duc Hoang on 3/4/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#include "EventNames.h"

NS_ASSUME_NONNULL_BEGIN

@interface NotificationEventEmitter : RCTEventEmitter <RCTBridgeModule>
+ (id)shared;//thuoc tinh static
@end

NS_ASSUME_NONNULL_END
