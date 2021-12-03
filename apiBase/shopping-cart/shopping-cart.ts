import { instance } from '~/apiBase/instance';

const url = '/api/Cart/';

class ShoppingCartApi {
	getAll = () => instance.get<IApiResultData<IShoppingCart[]>>(url + 'GetCartDetailOfUser', {});

	update = (data) => instance.put('/api/Cart/Update', data);

	applyDiscount = (data) => instance.post('/api/Order/ApplyDiscount', data);

	// add = (data: IPayRoll) => instance.post(url, data);

	// update = (data: IPayRoll) => instance.put(url, data, {});

	update = (data: any) => instance.put(url + 'Update', data, {});

	// closingSalarDate = () => instance.get<IApiResultData<IClosingSalarDate[]>>('/api/ClosingSalarDate');

	// changClosingSalarDate = (data: IClosingSalarDate) => instance.put('/api/ClosingSalarDate', data, {});

	checkoutMomo = (data) => instance.post('/api/Order/PaymentWithMoMo', data);

	checkoutPaypal = (data) => instance.post('/api/Order/PaymentWithPaypal', data);
	
	checkoutCash = (data) => instance.post('/api/Order/CashPayment', data);

	getOrderID = (data) => instance.post('/api/Order/LoadOrder', data);
}

export const shoppingCartApi = new ShoppingCartApi();
