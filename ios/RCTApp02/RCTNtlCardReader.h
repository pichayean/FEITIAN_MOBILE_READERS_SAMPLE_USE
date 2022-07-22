//
//  RCTNtlCardReader.h
//  RCTApp01
//
//  Created by Pichayean Yensiri on 18/7/2565 BE.
//

#ifndef RCTNtlCardReader_h
#define RCTNtlCardReader_h


#endif /* RCTNtlCardReader_h */

#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "ReaderInterface.h"
@interface RCTNtlCardReader : NSObject <RCTBridgeModule,ReaderInterfaceDelegate>

+ (NSString *)moduleName;

- (void)cardInterfaceDidDetach:(BOOL)attached;

- (void)didGetBattery:(NSInteger)battery;

- (void)findPeripheralReader:(NSString *)readerName;

- (void)readerInterfaceDidChange:(BOOL)attached bluetoothID:(NSString *)bluetoothID;

@end
