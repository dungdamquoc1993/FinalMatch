//
//  MainViewController.m
//  FinalMatchForSupplier
//
//  Created by Nguyen Duc Hoang on 3/1/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "MainViewController.h"

@interface MainViewController ()

@end

@implementation MainViewController
- (void)handleAuthorizationAppleIDButtonPress{
  if (@available(iOS 13.0, *)) {
    ASAuthorizationAppleIDProvider *appleIDProvider = [ASAuthorizationAppleIDProvider new];
    ASAuthorizationAppleIDRequest *request =  [appleIDProvider createRequest];
    request.requestedScopes = @[ASAuthorizationScopeFullName, ASAuthorizationScopeFullName];
    ASAuthorizationController *authorizationController = [[ASAuthorizationController alloc] initWithAuthorizationRequests: @[request]];
    //
    authorizationController.delegate = self;
    authorizationController.presentationContextProvider = self;
    [authorizationController performRequests];
        
  } else {
    // Fallback on earlier versions
  }
  
}
- (ASPresentationAnchor)presentationAnchorForAuthorizationController:(ASAuthorizationController *)controller {
  return self.view.window;
}
- (void)authorizationController:(ASAuthorizationController *)controller didCompleteWithError:(NSError *)error {
  
}
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
      
}

@end

