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

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    self.view.backgroundColor = [UIColor redColor];
    UIButton *btnSendNotification = [[UIButton alloc]
                                     initWithFrame: CGRectMake(0, 0, 200, 100)];
  [btnSendNotification setTitle:@"An vao day" forState: UIControlStateNormal];
  [self.view addSubview:btnSendNotification];
  
  [btnSendNotification addTarget:self action:@selector(btnSend:) forControlEvents:(UIControlEventTouchUpInside)];
      
}
-(void)btnSend:(id)event {
  [self pushLocalNotification:@"xx" message: @"yyy"];
}

-(void)pushLocalNotification:(NSString *)title message:(NSString *)message {
  
}

@end

