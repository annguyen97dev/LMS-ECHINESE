type IPaymentMethod = IBaseApi<{
	ID: string;
	PaymentLogo: string;
	transferpayment: string;
	PaymentCode: string;
	PaymentName: string;
}>;
type IPaymentMethodConfig = IBaseApi<{
	PaymentName: string;
	PaymentCode: string;
}>;
