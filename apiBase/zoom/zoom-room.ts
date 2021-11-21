import { instance } from '~/apiBase/instance';

const url = '/api/ZoomRoomSchedule/';
export const zoomRoomApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IZoomRoom[]>>(url, {
			params
		});
	},
	// Lấy theo id
	getById(id: number) {
		return instance.get<IApiResultData<IZoomRoom>>(`${url}${id}`);
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data) {
		return instance.put(url, data);
	},
	// Xóa data
	delete(data) {
		return instance.put(url, data);
	},
	// Tạo phòng
	createRoom(scheduleID: number) {
		return instance.post(`api/CreateRoom/${scheduleID}`);
	},
	// Đóng phòng
	closeRoom(scheduleID: number) {
		return instance.put(`api/CloseRoom/${scheduleID}`);
	},
	getRecord(scheduleID: number) {
		return instance.get<IApiResultData<IZoomRecord[]>>(`api/GetRecording/${scheduleID}`);
	}
};
