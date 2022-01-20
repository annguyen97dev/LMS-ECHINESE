type IShoppingCart = IBaseApi<{
	ID: number;
	VideoCourseID: number;
	VideoCourseName: string;
	ImageThumbnails: string;
	Price: number;
	Quantity: number;
	ExpiryDays: number;
}>;

type ICurrency = IBaseApi<{
	ID: number;
	CurrencyType: string;
	ExchangeRate: number;
	Enable: boolean;
	CreatedOn: string;
	CreatedBy: string;
	ModifiedOn: string;
	ModifiedBy: string;
}>;

type IStatusPayment = IBaseApi<{
	CardID: number;
	CreatedBy: string;
	CreatedOn: string;
	DiscountID: number;
	DiscountPrice: number;
	Enable: boolean;
	ID: number;
	ModifiedBy: string;
	ModifiedOn: string;
	Note: string;
	OrderCode: string;
	PaidPayment: number;
	PaymentCode: string;
	PaymentDate: string;
	PaymentID: string;
	PaymentName: string;
	Status: number;
	StatusName: string;
	TotalPayment: number;
	UserInformationID: number;
}>;
