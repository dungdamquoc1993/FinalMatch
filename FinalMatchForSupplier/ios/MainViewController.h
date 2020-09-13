//
//  MainViewController.h
//  FinalMatchForSupplier
//
//  Created by Nguyen Duc Hoang on 3/1/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
@import AuthenticationServices;
@import UserNotifications;

NS_ASSUME_NONNULL_BEGIN

@interface MainViewController : UIViewController<ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding>

@end

NS_ASSUME_NONNULL_END
