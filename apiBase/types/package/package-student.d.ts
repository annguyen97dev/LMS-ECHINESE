type IPackageStudent = IBaseApi<{
	ID: number;
	StudentID: number;
	StudentName: string;
	SetPackageID: number;
	SetPackageName: string;
	SetPackageAvatar: string;
	Level: number;
	Type: number;
	TypeName: string;
	Price: number;
	Paid: number;
	PaymentMethodsID: number; //1: Tiền mặt - 2:Chuyển khoản
	PaymentMethodsName: string;
	DonePaid: boolean;
	Approval: number; // 1: Chưa thanh toán - 2: Chờ duyệt - 3: Đã duyệt
	ApprovalName: string;
	Note: string;
}>;
