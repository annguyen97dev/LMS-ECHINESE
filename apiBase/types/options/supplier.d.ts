type ISupplier = IBaseApi<{
  ID: number;
  SupplierName: string;
  Texcode: number;
  Represent: string;
  NumberOfRepresent: number;
  PersonInChargeID: number;
  PersonInChargeName: string;
  Address: string;
  Introduce: string;
  Enable: boolean;
  CreatedOn: string;
  CreatedBy: string;
  ModifiedOn: string;
  ModifiedBy: string;
  map: Function;
}>;
