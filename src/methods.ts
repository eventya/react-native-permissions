import type {Contract} from './contract';
import {RESULTS} from './results';
import {
  checkLocationAccuracy,
  openPhotoPicker,
  requestLocationAccuracy,
} from './unsupportedMethods';

const openSettings: Contract['openSettings'] = async () => {};

const check: Contract['check'] = () => {
  return RESULTS.UNAVAILABLE;
};

const request: Contract['request'] = async () => {
  return RESULTS.UNAVAILABLE;
};

const checkNotifications: Contract['checkNotifications'] = async () => {
  return {status: RESULTS.UNAVAILABLE, settings: {}};
};

const checkMultiple: Contract['checkMultiple'] = (permissions) => {
  const output: Record<string, string> = {};

  for (const permission of permissions) {
    output[permission] = RESULTS.UNAVAILABLE;
  }

  return output as ReturnType<Contract['checkMultiple']>;
};

const requestMultiple: Contract['requestMultiple'] = async (permissions) => {
  return checkMultiple(permissions);
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
  requestNotifications: checkNotifications,
};
