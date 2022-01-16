type IOrderProductCart = IBaseApi<{
	ID: number;
	OrderProductID: number;
	ProductID: number;
	ProductName: string;
	Quantity: number;
	Price: number;
	Enable: boolean;
	Image: string;
	CreatedOn: string;
	CreatedBy: string;
	ModifiedOn: string;
	ModifiedBy: string;
}>;
