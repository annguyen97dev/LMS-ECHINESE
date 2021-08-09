type IRefunds = IBaseApi<{
    ID: number,
    BranchID: number,
    BranchName: string,
    UserInformationID: number,
    FullNameUnicode: string,
    Mobile: number,
    Price: number,
    StatusID: number,
    StatusName: string,
    Reason: string,
    RefundsDetail: [],
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
  }>;
  