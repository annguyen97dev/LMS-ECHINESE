import {instance} from '~/apiBase/instance';

const url = '/api/SetPackageDetail';

class PackageDetailApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ISetPackageDetail[]>>(url, {
			params: Params,
		});

	getDetail = (id: number) =>
		instance.get<IApiResultData<ISetPackageDetail>>(`${url}/${id}`);

	add = (data) => instance.post(url, data);

	update = (data: ISetPackageDetail) => instance.put(url, data, {});
}

export const packageDetailApi = new PackageDetailApi();
