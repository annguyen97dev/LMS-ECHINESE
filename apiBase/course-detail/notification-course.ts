import {instance} from '~/apiBase/instance';

const url = '/api/NotificationCourse';

class NotificationCourseApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<INotificationCourse[]>>(url, {
			params: Params,
		});

	add = (data) => instance.post(url, data);
}

export const notificationCourseApi = new NotificationCourseApi();
