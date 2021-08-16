type INewsFeed = IBaseApi<{
    ID: number,
    UserInformationID: number,
    RoleID: number,
    RoleName: string,
    GroupNewsFeedID: number,
    GroupNewsFeedName: string,
    Content: string,
    TypeFile: number,
    NewsFeedFile: [],
    NewsFeedBranch: [],
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
  }>;