import { instance } from '~/apiBase/instance';

const url = '/api/LearningNeeds';

class LearningNeeds {
	getAll = (Params: object) => instance.get<IApiResultData<ILearningNeeds[]>>(url, { params: Params });
	insert = (data) => instance.post(url, data);
	update = (data) => instance.put(url, data);
}

export const learningNeeds = new LearningNeeds();
