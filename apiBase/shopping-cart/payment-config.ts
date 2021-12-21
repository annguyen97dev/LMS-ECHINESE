import { instance } from '~/apiBase/instance';
class PaymentConfig {
	getAll = () => instance.get<IApiResultData<IPaymentMethod[]>>('/api/paymentconfiguration/getall', {});
	getPaymentConfig = () => instance.get<IApiResultData<IPaymentMethodConfig[]>>('/api/paymentconfiguration/getpaymentconfiguration', {});
	uploadLogo = (file) => {
		let fData = new FormData();
		fData.append('File', file);
		return instance.post('/api/paymentconfiguration/uploadlogo', fData);
	};
}

export const paymentConfig = new PaymentConfig();
