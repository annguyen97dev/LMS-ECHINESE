type IGroupNewsFeed = IBaseApi<{
    ID: number,
    Name: string,
    BackGround: string,
    Administrators: number,
    FullNameUnicode: string,
    CourseID: number,
    CourseName: string,
    BranchID: number,
    BranchName: string,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
}>;