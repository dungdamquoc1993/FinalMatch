/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "MainViewController.h"
#import "NotificationEventEmitter.h"

@implementation AppDelegate
NSString *const kGCMMessageIDKey = @"gcm.message_id";

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //How to send event to RN ?
  //[[NotificationEventEmitter shared] sendEventWithName:kEventPressNotification body:@{"x": @{100}}];
  
  [FIRApp configure];
  [FIRMessaging messaging].delegate = self;
  if ([UNUserNotificationCenter class] != nil) {
    // iOS 10 or later
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
        UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
        requestAuthorizationWithOptions:authOptions
        completionHandler:^(BOOL granted, NSError * _Nullable error) {
          // ...
        }];
  } else {
    // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
  }
  [application registerForRemoteNotifications];
  [self getFCMToken];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"FinalMatchForSupplier"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
    
  self.window.rootViewController = rootViewController;
//  self.window.rootViewController = [[MainViewController alloc] init];
  [self.window makeKeyAndVisible];  
  return YES;
}
-(void)getFCMToken {
  //send test message: https://console.firebase.google.com/project/finalmatch-9f4fe/notification/compose
  [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result,
                                                      NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"Error fetching remote instance ID: %@", error);
    } else {
      //c4qvvWAQ5E9Mtjo4wH7wmG:APA91bGmtDcp3CskbaLekX9WRx4g_kFaKPxw7p4AlrfK37iDRSCzG1Jes0ScYZuzfPEcktpKcBjwLdQHMAoN2rIewf_M6eKwNnSWC2Gvu6LnyfrkLbgkXdb3-lSi0DAMnwRlhWuhbUvZ
      //failed: f6uIeuKi8kj9jO9pq1Xh2p:APA91bFzMEaIIwbVHSscER1lRdC…Hmz3-Z2csGPyBEg9BV1P47aAfjCsG4aStUdcjSb5iLS2Ejh8A
      NSLog(@"Remote instance ID token: %@", result.token);
      //Luu local,ko gửi event nữa
      //Bên RN, khi nào login/register xong,HOẶC thì lấy local này + supplierid/customerId gửi lên DB
      [[NSUserDefaults standardUserDefaults] setObject:result.token forKey: @"notificationToken"];
      [[NSUserDefaults standardUserDefaults] synchronize];
    }
  }];
}
// [START receive_message]
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  //Neu dang o background, ham nay ko goi  
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
    [self pushLocalNotification: [userInfo valueForKey:@"title"]
    message: [userInfo valueForKey:@"body"]];
  }
  // Print full message.
  NSLog(@"%@", userInfo);
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
    fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
    [self pushLocalNotification: [userInfo valueForKey:@"title"]
    message: [userInfo valueForKey:@"body"]];
  }

  // Print full message.
  NSLog(@"%@", userInfo);

  completionHandler(UIBackgroundFetchResultNewData);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
           didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void (^)(void))completionHandler {
  NSDictionary *userInfo = response.notification.request.content.userInfo;
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }

  // Print full message.
  NSLog(@"%@", userInfo);

  if ([response.notification.request.content.categoryIdentifier isEqualToString:@"TIMER_EXPIRED"]) {
        // Handle the actions for the expired timer.
    if ([response.actionIdentifier isEqualToString:@"SNOOZE_ACTION"]) {
            // Invalidate the old timer and create a new one. . .
    } else if ([response.actionIdentifier isEqualToString:@"STOP_ACTION"]) {
            // Invalidate the timer. . .
    }
  }
  completionHandler();
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center 
        willPresentNotification:(UNNotification *)notification 
        withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSDictionary *userInfo = notification.request.content.userInfo;
  // Print message ID.
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  // Print full message.
  NSLog(@"%@", userInfo);
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

-(void)pushLocalNotification:(NSString *)title message:(NSString *)message {
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  UNAuthorizationOptions options = UNAuthorizationOptionAlert + UNAuthorizationOptionSound+ UNAuthorizationOptionBadge;
  [center requestAuthorizationWithOptions: options
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
//    NSLog(@"granted");
//    NSLog(granted);
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
- (void)applicationDidEnterBackground:(UIApplication *)application {
  
}
// [refresh_token] FCM gui cho App, se chui vao day, co 1 token
- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"FCM registration token: %@", fcmToken);
  
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:
     @"FCMToken" object:nil userInfo:dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Unable to register for remote notifications: %@", error);
}
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"APNs device token retrieved: %@", deviceToken);
  // With swizzling disabled you must set the APNs device token here.
  // [FIRMessaging messaging].APNSToken = deviceToken;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
