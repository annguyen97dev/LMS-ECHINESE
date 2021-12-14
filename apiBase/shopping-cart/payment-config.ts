import { instance } from '~/apiBase/instance';
class PaymentConfig {
	getAll = () => instance.get<IApiResultData<IPaymentMethod[]>>('/api/paymentconfiguration/getall', {});
	getPaymentConfig = () => instance.get<IApiResultData<IPaymentMethodConfig[]>>('/api/paymentconfiguration/getpaymentconfiguration', {});
}

export const paymentConfig = new PaymentConfig();
