//
//  AsynStorage.m
//  FinalMatchClient
//
//  Created by Nguyen Duc Hoang on 3/9/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "AsyncStorage.h"

@interface AsyncStorage ()

@end

@implementation AsyncStorage

RCT_EXPORT_MODULE();
RCT_REMAP_METHOD(setItem, itemName:(NSString *)itemName
                 value:(NSString *)value
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
  if (standardUserDefaults) {
      [standardUserDefaults setObject:value forKey: itemName];
      [standardUserDefaults synchronize];
  }
  resolve(@"success");
}

RCT_REMAP_METHOD(getItem, itemName:(NSString *)itemName
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
  if (standardUserDefaults) {
    NSString *value = [standardUserDefaults stringForKey: itemName];
    resolve(value == nil ? @"" : value);
  }
}


@end
