import { instance } from '~/apiBase/instance';

class OrderProductDetail {
	getByToken = () => instance.get<IApiResultData<IOrderProductCart[]>>('/api/OrderProductDetail/GetByToken');
	insert = (data) => instance.post('/api/OrderProductDetail', data);
	update = (data) => instance.put('/api/OrderProductDetail', data);
	cancelOrder = () => instance.post('/api/OrderProductDetail_CancelOrder');
}

export const orderProductDetail = new OrderProductDetail();
