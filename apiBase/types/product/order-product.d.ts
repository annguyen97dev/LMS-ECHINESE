type IOrderProduct = IBaseApi<{
    StudentID: number,
    StudentID: number,
    StudentName: string,
    Avatar: string,
    TotalPrice: number,
    PayBranchID: number,
    PaymentMethodsID: number,
    PaymentMethodsName: string,
    StatusID: number,
    StatusName: string,
    isConfirm: boolean,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string,
    OrderProductDetail: IOrderProductDetail
}>;
