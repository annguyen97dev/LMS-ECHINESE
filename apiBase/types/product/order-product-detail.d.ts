type IOrderProductDetail = IBaseApi<{
    ID: number;
    ProductID: number;
    Quantity: number;
    Price: number;
    Enable: true;
    CreatedOn: string;
    CreatedBy: string;
    ModifiedOn: string;
    ModifiedBy: string
}>
