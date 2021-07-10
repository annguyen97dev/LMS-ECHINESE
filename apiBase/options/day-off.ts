import {instance} from '../instance';

const dayOffApi = {
	// getAll(params = {}) {
	// 	const url = '/products';
	// 	return axiosClient.get(url, {
	// 		params,
	// 	});
	// },
	// get(id) {
	// 	const url = `/products/${id}`;
	// 	return axiosClient.get(url);
	// },
	// add(data) {
	// 	const url = '/products';
	// 	return axiosClient.post(url, data);
	// },
	// update(data) {
	// 	const url = `/products/${data.id}`;
	// 	return axiosClient.patch(url, data);
	// },
	// remove(id) {
	// 	const url = `/products/${id}`;
	// 	return axiosClient.delete(url);
	// },

	// Lấy tất cả data có phân trang
	getAll(pageSize: number, pageIndex: number) {
		const url = '/api/DayOff/GetAll';
		return instance.get<IApiResultData<IDayOff[]>>(url, {
			params: {
				pageSize: pageSize,
				pageIndex: pageIndex,
			},
		});
	},
	// // Search branch code
	// searchBranchCode(code: number) {
	// 	instance.get<IApiResultData<IBranch[]>>('/api/Branch/GetAll', {
	// 		params: {
	// 			branchCode: code,
	// 		},
	// 	});
	// },

	// // Search branch code
	// searchBranchName(name: string) {
	// 	instance.get<IApiResultData<IBranch[]>>('/api/Branch/GetAll', {
	// 		params: {
	// 			branchName: name,
	// 		},
	// 	});
	// },

	// // Lấy chi tiết data theo ID
	// getByID(id: number) {
	// 	instance.get<IApiResultData<IBranch>>(`/api/Branch/GetById`, {
	// 		params: {
	// 			id: id,
	// 		},
	// 	});
	// },

	// // Cập nhật trạng thái ẩn/hiện
	// changeStatus(id: number) {
	// 	instance.put<IApiResultData<IBranch[]>>(`/api/Branch/Hide/${id}`);
	// },

	// Thêm mới data
	add(data: IDayOff) {
		const url = '/api/DayOff/insert';
		return instance.post(url, data);
	},

	// // Cập nhật data
	// update(data: IBranch) {
	// 	instance.put('/api/Branch/Update', data, {});
	// },
	// Xóa data
	delete(id: number) {
		const url = `/api/DayOff/Hide/${id}`;
		return instance.put(url);
	},
};
export default dayOffApi;
