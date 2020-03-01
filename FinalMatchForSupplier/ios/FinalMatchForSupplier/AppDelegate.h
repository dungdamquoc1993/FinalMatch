/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * <string name="facebook_app_id">501150603831653</string>
  <string name="fb_login_protocol_scheme">fb501150603831653</string>
 *  Exception 'fb501150603831653 is not registered as a URL scheme. Please add it in your Info.plist' was thrown while invoking logInWithPermissions on target FBLoginManager with params (
         (
         "public_profile",
         email
     ),
     1782,
     1783
 )
 callstack: (
   0   CoreFoundation                      0x00007fff23c7127e __exceptionPreprocess + 350
   1   libobjc.A.dylib                     0x00007fff513fbb20 objc_exception_throw + 48
   2   FinalMatchForSupplier               0x000000010766a334 +[FBSDKInternalUtility validateURLSchemes] + 404
   3   FinalMatchForSupplier               0x00000001076af2ce -[FBSDKLoginManager logInParametersWithPermissions:serverConfiguration:] + 110
   4   FinalMatchForSupplier               0x00000001076afd0e -[FBSDKLoginManager logIn] + 94
   5   FinalMatchForSupplier               0x00000001076afad5 -[FBSDKLoginManager logInWithPermissions:handler:] + 325
   6   FinalMatchForSupplier               0x00000001076adcb8 -[FBSDKLoginManager logInWithPermissions:fromViewController:handler:] + 232
   7   FinalMatchForSupplier               0x0000000107ac13b6 -[RCTFBSDKLoginManager logInWithPermissions:resolver:rejecter:] + 262
   8   CoreFoundation                      0x00007fff23c7820c __invoking___ + 140
   9   CoreFoundation                      0x00007fff23c753af -[NSInvocation invoke] + 319
   10  CoreFoundation                      0x00007fff23c75684 -[NSInvocation invokeWithTarget:] + 68
   11  FinalMatchForSupplier               0x000000010787abe2 -[RCTModuleMethod invokeWithBridge:module:arguments:] + 2658
   12  FinalMatchForSupplier               0x000000010787ed17 _ZN8facebook5reactL11invokeInnerEP9RCTBridgeP13RCTModuleDatajRKN5folly7dynamicE + 791
   13  FinalMatchForSupplier               0x000000010787e823 _ZZN8facebook5react15RCTNativeModule6invokeEjON5folly7dynamicEiENK3$_0clEv + 131
   14  FinalMatchForSupplier               0x000000010787e799 ___ZN8facebook5react15RCTNativeModule6invokeEjON5folly7dynamicEi_block_invoke + 25
   15  libdispatch.dylib                   0x0000000108c58dd4 _dispatch_call_block_and_release + 12
   16  libdispatch.dylib                   0x0000000108c59d48 _dispatch_client_callout + 8
   17  libdispatch.dylib                   0x0000000108c67de6 _dispatch_main_queue_callback_4CF + 1500
   18  CoreFoundation                      0x00007fff23bd4049 __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__ + 9
   19  CoreFoundation                      0x00007fff23bceca9 __CFRunLoopRun + 2329
   20  CoreFoundation                      0x00007fff23bce066 CFRunLoopRunSpecific + 438
   21  GraphicsServices                    0x00007fff384c0bb0 GSEventRunModal + 65
   22  UIKitCore                           0x00007fff48092d4d UIApplicationMain + 1621
   23  FinalMatchForSupplier               0x00000001075bf8d0 main + 112
   24  libdyld.dylib                       0x00007fff5227ec25 start + 1
 )

 RCTFatal
 facebook::react::invokeInner(RCTBridge*, RCTModuleData*, unsigned int, folly::dynamic const&)
 facebook::react::RCTNativeModule::invoke(unsigned int, folly::dynamic&&, int)::$_0::operator()() const
 invocation function for block in facebook::react::RCTNativeModule::invoke(unsigned int, folly::dynamic&&, int)
 _dispatch_call_block_and_release
 _dispatch_client_callout
 _dispatch_main_queue_callback_4CF
 __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__
 __CFRunLoopRun
 CFRunLoopRunSpecific
 GSEventRunModal
 UIApplicationMain
 main
 start

 */

#import <React/RCTBridgeDelegate.h>
@import UIKit;

@import Firebase;
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
