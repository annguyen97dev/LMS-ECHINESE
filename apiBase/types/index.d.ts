type IApiResult<T = any> = {
  createAcc: T;
  message: string;
};

type IApiResultData<T = any> = {
  data: T;
  message: string;
};

type IApiResultAcc<T = any> = {
  acc: T;
  message: string;
};

type IBaseApi<T> = {
  Enable: boolean;
  CreatedOn: string;
  CreatedBy: string;
  ModifiedOn: string;
  ModifiedBy: string;
} & T;
