type IDiscount = IBaseApi<{
    ID: number,
    DiscountCode: string,
    Discount: number,
    DiscountType: number,
    Status: number,
    StatusName: string,
    Note: string,
    DeadLine: string,
    Quantity: number,
    QuantityLeft: number,
    Enable: true,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
}>;