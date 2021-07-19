type IProgram = IBaseApi<{
  ID: number;
  ProgramCode: string;
  ProgramName: string;
  Level: number;
  GradeID: number;
  GradeName: string;
  Price: number;
  Type: number;
  TypeName: string;
  Description: string;
  Enable: boolean;
  CreatedOn: string;
  CreatedBy: string;
  ModifiedOn: string;
  ModifiedBy: string;
}>;
