import {instance} from '~/apiBase/instance';

const url = '/api/Refunds';

class Refunds {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IRefunds[]>>(url, {
			params: Params,
		});

	getDetail = (id: number) =>
		instance.get<IApiResultData<IRefunds>>(`${url}/${id}`);

	add = (data) => instance.post(url, data);

	update = (data) => instance.put(url, data, {});
}

export const refundsApi = new Refunds();
