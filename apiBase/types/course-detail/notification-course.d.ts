type INotificationCourse = IBaseApi<{
  NotificationID: number;
  NotificationTitle: string;
  NotificationContent: string;
  CourseID: number;
  BranchID: number;
  BranchName: string;
  RoleID: number;
  RoleName: string;
  IsSendMail: boolean;
  AllRole: boolean;
  AllBranch: boolean;
}>;
