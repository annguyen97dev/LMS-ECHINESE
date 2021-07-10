type IService = IBaseApi<{
    ID: number,
    ServiceName: string,
    DescribeService: string,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
  }>;