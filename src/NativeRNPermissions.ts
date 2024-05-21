import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

type NotificationsResponse = {
  status: Object;
  settings: Object;
};

export interface Spec extends TurboModule {
  getConstants(): {available: string[]};
  check(permission: string): string;
  checkLocationAccuracy(): Promise<string>;
  checkMultiple(permissions: string[]): Object;
  checkNotifications(): Promise<NotificationsResponse>;
  openPhotoPicker(): Promise<boolean>;
  openSettings(): Promise<void>;
  request(permission: string): Promise<string>;
  requestLocationAccuracy(purposeKey: string): Promise<string>;
  requestMultiple(permissions: string[]): Promise<Object>;
  requestNotifications(options: string[]): Promise<NotificationsResponse>;
  shouldShowRequestRationale(permission: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNPermissions');
