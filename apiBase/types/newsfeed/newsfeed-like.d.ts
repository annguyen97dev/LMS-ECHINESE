type INewsFeedLike = IBaseApi<{
    ID: number,
    UserInformationID: number,
    FullNameUnicode: string,
    NewsFeedID: number,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
}>;