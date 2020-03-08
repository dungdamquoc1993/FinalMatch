/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeDelegate.h>
@import UIKit;
@import UserNotifications;

@import Firebase;
@interface AppDelegate : UIResponder <UIApplicationDelegate,
UNUserNotificationCenterDelegate,
FIRMessagingDelegate,
RCTBridgeDelegate>


@property (nonatomic, strong) UIWindow *window;

@end
