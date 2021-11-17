import { instance } from '~/apiBase/instance';

const url = '/api/CustomerConsultation/';
class StudentAdviseApi {
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<IStudentAdvise[]>>(url, {
			params: todoApi
		});

	getWithID = (ID: number) => instance.get<IApiResultData<IStudentAdvise>>(url + ID);

	add = (data: IStudent) => instance.post(url, data, {});

	update = (data: any) => instance.put(url, data, {});

	addNote = (data: any) => instance.post('/api/NoteOfCustomer', data, {});

	updateNote = (data: any) => instance.put('/api/NoteOfCustomer', data, {});

	sendEmail = (data: any) => instance.post('/api/SendMailCustomer', data, {});
}

export const studentAdviseApi = new StudentAdviseApi();
