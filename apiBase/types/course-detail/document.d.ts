type ICategoryDoc = IBaseApi<{
  ID: number;
  CategoryName: string;
  CurriculumnID: number;
  Enable: boolean;
}>;

type IDocument = IBaseApi<{
  ID: number;
  CategoryID: number;
  DocumentLink: string;
}>;
