type IApiResult<T = any> = {
  createAcc: T;
  message: string;
<<<<<<< HEAD
  totalRow: number;
  TotalRow: number;
=======
>>>>>>> origin/master
};

type IApiResultData<T = any> = {
  data: T;
  message: string;
<<<<<<< HEAD
  totalRow: number;
  TotalRow: number;
=======
>>>>>>> origin/master
};

type IApiResultAcc<T = any> = {
  acc: T;
  message: string;
<<<<<<< HEAD
  totalRow: number;
  TotalRow: number;
=======
>>>>>>> origin/master
};

type IBaseApi<T> = {
  Enable: boolean;
  CreatedOn: string;
  CreatedBy: string;
  ModifiedOn: string;
  ModifiedBy: string;
  totalRow: number;
} & T;
