import { instance } from '~/apiBase/instance';

const url = '/api/Cart/';

class ShoppingCartApi {
	getAll = () => instance.get<IApiResultData<IShoppingCart[]>>(url + 'GetCartDetailOfUser', {});

	getPaymentStatus = (data) => instance.get(`/api/Order/paymentstatus?paymentcode=${data}`);

	getPaypalStatus = (data) => instance.get(`/api/Order/PaypalPaymentStatus?PayerID=${data.PayerID}&guid=${data.guid}`);
	// getPaypalStatus = (data) => instance.get(`/api/Order/PaypalPaymentStatus?PayerID=${data.PayerID}&guid=${data.guid}`);

	update = (data) => instance.put('/api/Cart/Update', data);

	applyDiscount = (data) => instance.post('/api/Order/ApplyDiscount', data);

	getOrderID = (data) => instance.post('/api/Order/LoadOrder', data);

	getOrderDetail = (data) => instance.get(`/api/order/orderdetail/${data}`);

	getAllCurrency = () => instance.get<IApiResultData<ICurrency[]>>(`/api/Currency/GetAll`);

	updateCurrency = (data) => instance.post('/api/Currency/CreateOrUpdate', data);

	// Phương thức
	checkoutMomo = (data) => instance.post('/api/Order/PaymentWithMoMo', data);

	checkoutPaypal = (data) => instance.post('/api/Order/PaymentWithPaypal', data);

	checkoutCash = (data) => instance.post('/api/Order/CashPayment', data);

	checkoutTransferPayment = (data) => instance.post('/api/Order/TransferPayment', data);

	checkoutPaymentWithOnePay = (data) => instance.post('/api/Order/PaymentWithOnePay', data);
}

export const shoppingCartApi = new ShoppingCartApi();
