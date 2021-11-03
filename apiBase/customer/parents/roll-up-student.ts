import { instance } from '~/apiBase/instance';

class RollUpStudentApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IRollUpStudent[]>>('/api/RollUp', {
			params: Params
		});
}

export const rollUpStudentApi = new RollUpStudentApi();
