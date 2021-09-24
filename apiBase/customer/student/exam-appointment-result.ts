import {instance} from '~/apiBase/instance';

class ExamAppointmentResult {
	getWithID = (id: number) =>
		instance.get<IApiResultData<IExamAppointmentResult[]>>(
			`/api/ExamAppointmentResult/${id}`
		);

	getWithUserInformationID = (id: number) =>
		instance.get<IApiResultData<IExamAppointmentResult>>(
			`/api/ExamAppointmentResultUserInformationID/${id}`
		);
}

export const examAppointmentResultApi = new ExamAppointmentResult();
