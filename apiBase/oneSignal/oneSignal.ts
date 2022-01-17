import { instance } from '../instance';

const url = '/api/Update_OneSignal_DeviceID';
export const oneSignalAPI = {
	update(ID) {
		return instance.put(url + `?oneSignal_deviceId=${ID}`);
	}
};
