import { instance } from '~/apiBase/instance';

const url = '/api/SetPackageResult';

class PackageResultApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ISetPackageResult[]>>(url, {
			params: Params
		});

	getAllStudent = (Params: any) =>
		instance.get<IApiResultData<any>>('/api/SetPackageResultGetStudentExistResult', {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<ISetPackageResult>>(`${url}/${id}`);

	add = (data: ISetPackageResult) => instance.post(url, data);

	update = (data: any) => instance.put(url, data, {});

	// tự động chia đều giáo viên chấm bài

	updateTeacher = () => instance.put('/api/UpdateTeacherOfSetPackageResult');
}

export const packageResultApi = new PackageResultApi();
