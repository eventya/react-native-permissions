import NativeModule from './NativeRNPermissions';
import type {Contract} from './contract';
import {RESULTS} from './results';
import type {LocationAccuracy, NotificationsResponse, PermissionStatus} from './types';
import {uniq} from './utils';

let available: string[] | undefined = undefined;

const isAvailable = (permission: string): boolean => {
  if (available == null) {
    const constants = NativeModule.getConstants();
    available = constants.available;
  }

  return available.includes(permission);
};

const openPhotoPicker: Contract['openPhotoPicker'] = async () => {
  await NativeModule.openPhotoPicker();
};

const openSettings: Contract['openSettings'] = async () => {
  await NativeModule.openSettings();
};

const check: Contract['check'] = (permission) => {
  return isAvailable(permission)
    ? (NativeModule.check(permission) as PermissionStatus)
    : RESULTS.UNAVAILABLE;
};

const request: Contract['request'] = async (permission) => {
  if (!isAvailable(permission)) {
    return RESULTS.UNAVAILABLE;
  }

  const status = (await NativeModule.request(permission)) as PermissionStatus;
  return status;
};

const checkLocationAccuracy: Contract['checkLocationAccuracy'] = async () => {
  const accuracy = (await NativeModule.checkLocationAccuracy()) as LocationAccuracy;
  return accuracy;
};

const requestLocationAccuracy: Contract['requestLocationAccuracy'] = async ({purposeKey}) => {
  const accuracy = (await NativeModule.requestLocationAccuracy(purposeKey)) as LocationAccuracy;
  return accuracy;
};

const checkNotifications: Contract['checkNotifications'] = async () => {
  const response = (await NativeModule.checkNotifications()) as NotificationsResponse;
  return response;
};

const requestNotifications: Contract['requestNotifications'] = async (options) => {
  const response = (await NativeModule.requestNotifications(options)) as NotificationsResponse;
  return response;
};

const checkMultiple: Contract['checkMultiple'] = (permissions) => {
  const output: Record<string, string> = {};

  for (const permission of uniq(permissions)) {
    output[permission] = check(permission);
  }

  return output as ReturnType<Contract['checkMultiple']>;
};

const requestMultiple: Contract['requestMultiple'] = async (permissions) => {
  const output: Record<string, string> = {};

  for (const permission of uniq(permissions)) {
    output[permission] = await request(permission);
  }

  return output as Awaited<ReturnType<Contract['requestMultiple']>>;
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
