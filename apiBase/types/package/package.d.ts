type IPackage = IBaseApi<{
	ID: number;
	Name: string;
	Avatar: string;
	Level: number;
	Type: number;
	TypeName: string;
	Price: number;
	Description: string;
	Approval?: number; // 1: Chưa thanh toán - 2: Chờ duyệt - 3: Đã duyệt
	ApprovalName?: string;
}>;
