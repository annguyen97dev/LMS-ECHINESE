import { instance } from '~/apiBase/instance';

const url = '/api/ExamTopic';
class ExamTopicApi {
	getAll = (todoApi: object) => instance.get(url, { params: todoApi });
}

export const examTopicApi = new ExamTopicApi();
