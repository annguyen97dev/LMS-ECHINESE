import {instance} from '~/apiBase/instance';

const url = '/api/TimeLine';

class TimelineApi {
	getByCourseID = (id: number) =>
		instance.get<IApiResultData<ITimeLine[]>>(`${url}/${id}`);

	add = (data) => instance.post(url, data);
}

export const timelineApi = new TimelineApi();
