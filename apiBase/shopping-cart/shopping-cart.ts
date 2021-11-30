import { instance } from '~/apiBase/instance';

const url = '/api/Cart/GetCartDetailOfUser';

class ShoppingCartApi {
	getAll = () => instance.get<IApiResultData<IShoppingCart[]>>(url, {});

	// getDetail = (id: number) => instance.get<IApiResultData<IPayRoll>>(`${url}/${id}`);

	// add = (data: IPayRoll) => instance.post(url, data);

	// update = (data: IPayRoll) => instance.put(url, data, {});

	// closingSalarDate = () => instance.get<IApiResultData<IClosingSalarDate[]>>('/api/ClosingSalarDate');

	// changClosingSalarDate = (data: IClosingSalarDate) => instance.put('/api/ClosingSalarDate', data, {});

	checkoutMomo = (data) => instance.post('/api/Order/PaymentWithMoMo', data);

	checkoutPaypal = (data) => instance.post('/api/Order/PaymentWithPaypal', data);

	getOrderID = (data) => instance.post('/api/Order/LoadOrder', data);
}

export const shoppingCartApi = new ShoppingCartApi();
