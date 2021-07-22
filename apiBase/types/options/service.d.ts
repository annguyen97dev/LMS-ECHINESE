type IService = IBaseApi<{
  ID: number;
  ServiceName: string;
  DescribeService: string;
  SupplierServicesID: number;
  SupplierServicesName: string;
  PersonInChargeOfServicesID: number;
  PersonInChargeOfServicesName: string;
  Status: number;
  StatusName: string;
  Enable: boolean;
  CreatedOn: string;
  CreatedBy: string;
  ModifiedOn: string;
  ModifiedBy: string;
  map: Function;
}>;
