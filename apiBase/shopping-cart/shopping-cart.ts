import { instance } from '~/apiBase/instance';

const url = '/api/Cart/';

class ShoppingCartApi {
	getAll = () => instance.get<IApiResultData<IShoppingCart[]>>(url + 'GetCartDetailOfUser', {});

	// getDetail = (id: number) => instance.get<IApiResultData<IPayRoll>>(`${url}/${id}`);

	// add = (data: IPayRoll) => instance.post(url, data);

	update = (data: any) => instance.put(url + 'Update', data, {});
}

export const shoppingCartApi = new ShoppingCartApi();
