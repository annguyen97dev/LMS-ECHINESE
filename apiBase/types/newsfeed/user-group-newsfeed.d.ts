type IUserGroupNewsFeed = IBaseApi<{
    ID: number,
    GroupNewsFeedID: number,
    GroupNewsFeedName: string,
    UserInformationID: number,
    FullNameUnicode: string,
    RoleID: number,
    RoleName: string,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn:string,
    ModifiedBy: string
}>;