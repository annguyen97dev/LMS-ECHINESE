import { instance } from '~/apiBase/instance';

const url = '/api/PriceFixExam';

class PriceFixExamApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IPriceFixExam[]>>(url, {
			params: Params
		});

	//   getDetail = (id: number) =>
	//     instance.get<IApiResultData<IPaymentMethod>>(`${url}/${id}`);

	add = (data: any) => instance.post(url, data);

	update = (data: any) => instance.put(url, data, {});
}

export const priceFixExamApi = new PriceFixExamApi();
