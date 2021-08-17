type ITeacherCourseSchedule = IBaseApi<{
  ID: number;
  CourseID: number;
  CourseName: string;
  SubjectID: number;
  SubjectName: string;
  StudyTimeID: number;
  StudyTimeName: string;
  Time: number;
  BranchID: number;
  BranchName: string;
  RoomID: number;
  RoomName: string;
  Date: string;
  TeacherID: number;
  TeacherName: string;
  Attendance: boolean;
}>;
