type IApiResult<T = any> = {
  createAcc: T;
  message: string;
  totalRow: number;
  TotalRow: number;
};

type IApiResultData<T = any> = {
  data: T;
  message: string;
  totalRow: number;
};

type IApiResultAcc<T = any> = {
  acc: T;
  message: string;
  totalRow: number;
};

type IBaseApi<T> = {
  Enable: boolean;
  CreatedOn: string;
  CreatedBy: string;
  ModifiedOn: string;
  ModifiedBy: string;
} & T;
