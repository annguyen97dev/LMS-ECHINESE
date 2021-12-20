import { instance } from '~/apiBase/instance';

const url = '/api/Cart/';

class ShoppingCartApi {
	getAll = () => instance.get<IApiResultData<IShoppingCart[]>>(url + 'GetCartDetailOfUser', {});

	update = (data) => instance.put('/api/Cart/Update', data);

	applyDiscount = (data) => instance.post('/api/Order/ApplyDiscount', data);

	checkoutMomo = (data) => instance.post('/api/Order/PaymentWithMoMo', data);

	checkoutPaypal = (data) => instance.post('/api/Order/PaymentWithPaypal', data);

	checkoutCash = (data) => instance.post('/api/Order/CashPayment', data);

	getOrderID = (data) => instance.post('/api/Order/LoadOrder', data);

	getOrderDetail = (data) => instance.get(`/api/order/orderdetail/${data}`);
}

export const shoppingCartApi = new ShoppingCartApi();
