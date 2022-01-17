type IProduct = IBaseApi<{
	CreatedBy: string;
	CreatedOn: string;
	ModifiedBy: string;
	ModifiedOn: string;
	Description: string;
	Enable: boolean;
	ID: number;
	ImageOfProducts: array;
	ListedPrice: number;
	Name: string;
	Price: number;
	ProductTypeID: number;
	Quantity: number;
}>;
