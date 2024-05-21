import {Alert, AlertButton, Platform} from 'react-native';
import NativeModule from './NativeRNPermissions';
import type {Contract} from './contract';
import type {NotificationsResponse, Permission, PermissionStatus, Rationale} from './types';
import {
  checkLocationAccuracy,
  openPhotoPicker,
  requestLocationAccuracy,
} from './unsupportedMethods';
import {uniq} from './utils';

const POST_NOTIFICATIONS = 'android.permission.POST_NOTIFICATIONS' as Permission;
const USES_LEGACY_NOTIFICATIONS = (Platform.OS === 'android' ? Platform.Version : 0) < 33;

const shouldRequestPermission = async (
  permission: Permission,
  rationale: Rationale | undefined,
): Promise<boolean> => {
  if (rationale == null || !(await NativeModule.shouldShowRequestRationale(permission))) {
    return true;
  }

  if (typeof rationale === 'function') {
    return rationale();
  }

  return new Promise<boolean>((resolve) => {
    const {title, message, buttonPositive, buttonNegative, buttonNeutral} = rationale;
    const buttons: AlertButton[] = [];

    if (buttonNegative) {
      const onPress = () => resolve(false);
      buttonNeutral && buttons.push({text: buttonNeutral, onPress});
      buttons.push({text: buttonNegative, onPress});
    }

    buttons.push({text: buttonPositive, onPress: () => resolve(true)});
    Alert.alert(title, message, buttons, {cancelable: false});
  });
};

const openSettings: Contract['openSettings'] = async () => {
  await NativeModule.openSettings();
};

const check: Contract['check'] = (permission) => {
  return NativeModule.check(permission) as PermissionStatus;
};

const request: Contract['request'] = async (permission, rationale) => {
  const performRequest = await shouldRequestPermission(permission, rationale);

  if (!performRequest) {
    return check(permission);
  }

  const status = (await NativeModule.request(permission)) as PermissionStatus;
  return status;
};

const checkNotifications: Contract['checkNotifications'] = async () => {
  if (USES_LEGACY_NOTIFICATIONS) {
    const response = (await NativeModule.checkNotifications()) as NotificationsResponse;
    return response;
  }

  const status = check(POST_NOTIFICATIONS);
  return {status, settings: {}};
};

const requestNotifications: Contract['requestNotifications'] = async (options, rationale) => {
  if (USES_LEGACY_NOTIFICATIONS) {
    const response = (await NativeModule.requestNotifications(options)) as NotificationsResponse;
    return response;
  }

  const performRequest = await shouldRequestPermission(POST_NOTIFICATIONS, rationale);

  if (!performRequest) {
    const status = check(POST_NOTIFICATIONS);
    return {status, settings: {}};
  }

  const status = await request(POST_NOTIFICATIONS);
  return {status, settings: {}};
};

const checkMultiple: Contract['checkMultiple'] = (permissions) => {
  return NativeModule.checkMultiple(uniq(permissions)) as ReturnType<Contract['checkMultiple']>;
};

const requestMultiple: Contract['requestMultiple'] = (permissions) => {
  return NativeModule.requestMultiple(uniq(permissions)) as ReturnType<Contract['requestMultiple']>;
};

export const methods: Contract = {
  check,
  checkLocationAccuracy,
  checkMultiple,
  checkNotifications,
  openPhotoPicker,
  openSettings,
  request,
  requestLocationAccuracy,
  requestMultiple,
  requestNotifications,
};
