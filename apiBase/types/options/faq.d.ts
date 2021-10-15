type IFaq = IBaseApi<{
  ID: number;
  Questions: string;
  Answer: string;
  Enable: boolean;
  CreatedOn: string;
  CreatedBy: string;
  ModifiedOn: string;
  ModifiedBy: string;
}>;
