import { instance } from '~/apiBase/instance';

class StatisticalApi {
	// Lấy tất cả data
	getStatisticalTotal = (params) =>
		instance.get<IApiResultData<IStatistical>>('/api/StatisticalTotal', {
			params
		});
	getStatisticalRevenueYear = (params) => instance.get<IApiResultData<IStatRevenueYear[]>>('/api/StatisticalRevenueYear', { params });
	getStatisticalRevenueMonth = (params) => instance.get<IApiResultData<IStatRevenueMonth[]>>('/api/StatisticalRevenueMonth', { params });
	getStatisticalRevenueDay = (params) => instance.get<IApiResultData<IStatRevenueDay[]>>('/api/StatisticalRevenueDay', { params });
	getStatisticalStudentYear = (params) => instance.get<IApiResultData<IStatStudentYear[]>>('/api/StatisticalStudentYear', { params });
	getStatisticalStudentMonth = (params) => instance.get<IApiResultData<IStatStudentMonth[]>>('/api/StatisticalStudentMonth', { params });
	getStatisticalStudentDay = (params) => instance.get<IApiResultData<IStatStudentDay[]>>('/api/StatisticalStudentDay', { params });
	getStatisticalRate = (params) =>
		instance.get<IApiResultData<IStatRate[]>>('/api/StatisticalRale', {
			params
		});
	getStatisticalCourse = () => instance.get<IApiResultData<IStatCourse[]>>('/api/StatisticalCourse/2021', {});

	getAverageAgeOfStudent = () => instance.get<IApiResultData<IStatAverageAgeOfStudent[]>>('/api/StudentsAgeStatistical', {});
	getPercentOfStudentByArea = () => instance.get<IApiResultData<IStatPercentStudentByArea[]>>('/api/StudentOfAreaStatistical', {});
	getPercentOfStudentBySource = () =>
		instance.get<IApiResultData<IStatPercentStudentBySource[]>>('/api/StudentOfSourceInformationStatistical', {});
	getStatisticalCoursePurchases = () => instance.get<IApiResultData<IStatCoursePurchased[]>>('/api/StatisticalCourse', {});
	getStatisticalJobOfStudent = () => instance.get<IApiResultData<IStatJobOfStudent[]>>('/api/StudentOfJobStatistical', {});
	getStatisticalSalaryOfStaff = (params) => instance.get<IApiResultData<IStatSalaryOfStaff[]>>('/api/SalaryStatistical', { params });
	getStatisticalRankTeacherByLessons = (params) =>
		instance.get<IApiResultData<IStatRankTeacherByLessons[]>>('/api/StatisticalTeacher', { params });
	getStatisticalTotalLessonsOfTeacher = (params) =>
		instance.get<IApiResultData<IStatTotalLessonOfTeacher[]>>('/api/StatisticalTotalLesson_Teacher', { params });
	getStatisticalRateVideoCourse = () => instance.get<IApiResultData<IStatRate[]>>('/api/EvaluateVideoCourse', {});
}

export const statisticalApi = new StatisticalApi();
