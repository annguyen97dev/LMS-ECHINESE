type INewsFeedComment = IBaseApi<{
    Avatar: string,
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
    isReply: boolean,
}>;