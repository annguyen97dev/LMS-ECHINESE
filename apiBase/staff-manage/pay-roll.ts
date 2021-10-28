import { instance } from '~/apiBase/instance';

const url = '/api/Payroll';

class PayRollApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IPayRoll[]>>(url, {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<IPayRoll>>(`${url}/${id}`);

	add = (data: IPayRoll) => instance.post(url, data);

	update = (data: IPayRoll) => instance.put(url, data, {});

	closingSalarDate = () => instance.get<IApiResultData<IClosingSalarDate[]>>('/api/ClosingSalarDate');

	changClosingSalarDate = (data: IClosingSalarDate) => instance.put('/api/ClosingSalarDate', data, {});
}

export const payRollApi = new PayRollApi();
