import {instance} from '~/apiBase/instance';

const url = '/api/District';
class DistrictApi {
	getAll = (params) => instance.get<IApiResultData<IDistrict[]>>(url, {params});
	// Thêm mới data
	add(data: IDistrict) {
		return instance.post(url, data);
	}
	// Cập nhật data
	update(data: IDistrict) {
		return instance.put(url, data);
	}
	// Xóa data
	delete(data: IDistrict) {
		return instance.put(url, data);
	}

	//   post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
	getByArea = (areaID: number) =>
		instance.get<IApiResultData<IDistrict[]>>('/api/District', {
			params: {
				AreaID: areaID,
			},
		});

	//   post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
}

export const districtApi = new DistrictApi();
