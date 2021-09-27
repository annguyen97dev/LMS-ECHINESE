type IVoucher = IBaseApi<{
	ID: number;
	BranchID: number;
	BranchName: string;
	UserInformationID: number;
	FullNameUnicode: string;
	Mobile: number;
	Price: number;
	Reason: string;
	Qrcode: string;
	CounselorsID: number;
	CounselorsName: string;
}>;
