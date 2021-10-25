type IPayFixExam = IBaseApi<{
	ID: number;
	StudentID: number;
	StudentName: string;
	PriceFixExam: number;
	SetPackageLevel: number;
	Amount: number;
	Price: number;
	Paid: number;
	PaymentMethodsID: number;
	PaymentMethodsName: string;
	DonePaid: boolean;
	Note: string;
	Approval: number;
	ApprovalName: string;
}>;
