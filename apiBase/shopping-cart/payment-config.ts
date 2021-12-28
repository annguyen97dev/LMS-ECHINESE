import { instance } from '~/apiBase/instance';
class PaymentConfig {
	getAll = () => instance.get<IApiResultData<IPaymentMethod[]>>('/api/paymentconfiguration/getall', {});
	getPaymentConfig = () => instance.get<IApiResultData<IPaymentMethodConfig[]>>('/api/paymentconfiguration/getpaymentconfiguration', {});
	uploadLogo = (file) => {
		let fData = new FormData();
		fData.append('file', file);
		console.log(fData.get('file'));
		return instance.post('/api/paymentconfiguration/uploadlogo', fData);
	};
	add = (data) => instance.post('/api/paymentconfiguration/insert', data, {});
	update = (data) => instance.put('/api/paymentconfiguration/update', data);
}

export const paymentConfig = new PaymentConfig();
