type IVoucher = IBaseApi<{
  ID: number,
  BranchID: number,
  BranchName: string,
  UserInformationID: number,
  FullNameUnicode: string
  Mobile: number,
  Price: number,
  Reason: string,
  Qrcode: string,
  CounselorsID: number,
  CounselorsName: string,
  Enable: boolean,
  CreatedOn: string,
  CreatedBy: string,
  ModifiedOn: string,
  ModifiedBy: string
}>;
  