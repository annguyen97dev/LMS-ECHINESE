import { instance } from '../instance'

const url = '/api/ReplyInteractionInVideoCourse/'
export const ReplyInteractionInVideoCourseApi = {
	// Lấy tất cả data
	getAll(ID) {
		return instance.get<IApiResultData<any>>(`${url}GetAll/${ID}`)
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<any>>(`${url}GetByID/${ID}`)
	},
	// Thêm mới data
	add(data) {
		return instance.post(url + 'Insert', data)
	},
	// Cập nhật data
	update(data) {
		return instance.put(url + 'Update', data)
	},
	// Xóa data
	delete(data) {
		return instance.put(url + 'Delete', data)
	}
}
