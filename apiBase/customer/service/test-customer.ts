import { instance } from '~/apiBase/instance';

const url = '/api/ExamAppointment/';
class TestCustomerApi {
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<ITestCustomer[]>>(url, {
			params: todoApi
		});

	getWithID = (ID: number) => instance.get<IApiResult<ITestCustomer>>(url + ID);

	add = (data: IStudent) => instance.post(url, data, {});

	update = (data: any) => instance.put(url, data, {});
}

export const testCustomerApi = new TestCustomerApi();
