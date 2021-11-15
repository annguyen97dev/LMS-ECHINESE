import { instance } from '~/apiBase/instance';

class ScoreOfStudentApi {
	getAppointment = (Params: any) =>
		instance.get<IApiResultData<IScoreAppointment[]>>('/api/ExamAppointmentResult', {
			params: Params
		});
	getCourseExam = (Params: any) =>
		instance.get<IApiResultData<IScoreCourseExam[]>>('/api/CourseExamresult', {
			params: Params
		});
	getSetPakage = (Params: any) =>
		instance.get<IApiResultData<IScoreSetPakage[]>>('/api/SetPackageResult', {
			params: Params
		});
}

export const scoreOfStudentApi = new ScoreOfStudentApi();
