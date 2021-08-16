type INewsFeedComment = IBaseApi<{
    ID: number,
    UserInformationID: number,
    FullNameUnicode: string,
    NewsFeedID: number,
    CommentContent: string,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
}>;