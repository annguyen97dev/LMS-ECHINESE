type INotification = IBaseApi<{
    NotificationID: number,
    AllRole: boolean,
    AllBranch: boolean
    NotificationTitle: string,
    NotificationContent: string,
    CourseID: number,
    BranchID: string,
    BranchName: string,
    RoleID: string,
    RoleName: string,
    IsSendMail: boolean,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
  }>;