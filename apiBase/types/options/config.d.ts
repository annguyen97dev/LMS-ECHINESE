type IConfig = IBaseApi<{
    ID: number,
    ConfigContent: string,
    Type: number,
    TypeName: string,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string 
  }>;