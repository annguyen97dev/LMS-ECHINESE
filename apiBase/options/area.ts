import {instance} from '~/apiBase/instance';

class AreaApi {
	// getAll = () => instance.get<IApiResultData<IArea[]>>("/api/Area/GetAll");
	//   post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
	getAll = (params) =>
		instance.get<IApiResultData<IArea[]>>('/api/Area/GetAll', {params});

	// Thêm mới data
	add(data: IArea) {
		const url = '/api/Area/insert';
		return instance.post(url, data);
	}

	// Cập nhật data
	update(data: IArea) {
		const url = `api/Area/update`;
		return instance.put(url, data);
	}
	// Xóa data
	delete(id: number) {
		const url = `/api/Area/Hide/${id}`;
		return instance.put(url);
	}
}

export const areaApi = new AreaApi();
