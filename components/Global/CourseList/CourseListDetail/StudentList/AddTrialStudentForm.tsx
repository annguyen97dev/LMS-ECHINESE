import { Form, Modal, Select, Spin, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { studentApi, courseDetailApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { rollUpApi } from '~/apiBase/course-detail/roll-up';
import moment from 'moment';
import { courseOfStudentApi } from '~/apiBase/customer/parents/courses-of-student';

const AddTrialStudentForm = (props) => {
	const { CourseID, onFetchData } = props;
	const [visible, setVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const [form] = Form.useForm();
	const { showNoti, pageSize } = useWrap();
	const [filterStudent, setFilterStudent] = useState({ pageindex: 1, pageSize: pageSize });
	const [students, setStudents] = useState<IStudent[]>(null);
	const [scheduleList, setScheduleList] = useState(null);
	const [filtersSchedule, setFiltersSchedule] = useState({
		pageSize: 10,
		pageIndex: 1,
		CourseID: CourseID
	});

	const { Option } = Select;
	const { TextArea } = Input;

	const [params, setParams] = useState({
		CourseID: CourseID,
		UserInformationID: null,
		Note: '',
		TrialStart: null,
		TrialEnd: null
	});

	const getStudents = async () => {
		setIsLoading({ type: 'GET_STUDENT', status: true });
		try {
			let res = await studentApi.getAll(filterStudent);
			if ((res.status = 200)) {
				setStudents(res.data.data);
			}
		} catch (err) {
		} finally {
			setIsLoading({ type: 'GET_STUDENT', status: false });
		}
	};

	const getCourseSchedule = async () => {
		setIsLoading({ type: 'GET_SCHEDULE', status: true });
		try {
			const res = await courseDetailApi.getAll(filtersSchedule);
			if ((res.status = 200)) {
				const fmScheduleList = res.data.data.map((item, index) => {
					const date = moment(item.StartTime).format('DD/MM/YYYY');
					const startTime = moment(item.StartTime).format('HH:mm');
					const endTime = moment(item.EndTime).format('HH:mm');
					return {
						value: item.ID,
						title: `Buổi ${index + 1} [${date}] ${startTime} - ${endTime}`
					};
				});
				setScheduleList(fmScheduleList);
			}
		} catch (err) {
		} finally {
			setIsLoading({ type: 'GET_SCHEDULE', status: false });
		}
	};

	useEffect(() => {
		getStudents();
		getCourseSchedule();
	}, []);

	const handleChangeSelect = (value) => {
		setParams({ ...params, UserInformationID: value });
	};

	const onSelectCourseScheduleStart = () => {};
	const onSelectCourseScheduleEnd = () => {};

	const _onSubmit = async (data) => {
		setIsLoading({ type: 'SUBMIT', status: true });
		try {
			let res = await courseOfStudentApi.createTrial({ ...data, CourseID: CourseID });
			if (res.status == 200) {
				showNoti('success', 'Thêm học viên thành công!');
				setVisible(false);
				form.resetFields();
				onFetchData();
			}
		} catch (err) {
			showNoti('danger', err.message);
		} finally {
			setIsLoading({ type: 'SUBMIT', status: false });
		}
	};

	return (
		<>
			<button
				onClick={() => {
					setVisible(true);
				}}
				className="btn btn-warning"
				type="button"
			>
				Thêm học viên học thử
			</button>

			<Modal
				footer={null}
				onCancel={() => {
					setVisible(false);
				}}
				title="Thêm học viên học thử"
				visible={visible}
			>
				<Form form={form} onFinish={_onSubmit} layout="vertical">
					<div className="row">
						<div className="col-12 mb-3">
							<Form.Item
								label="Email học viên"
								name="UserInformationID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Select
									placeholder="Chọn học viên"
									className="style-input"
									style={{ width: '100%' }}
									onChange={handleChangeSelect}
									size="large"
									showSearch
									filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{students &&
										students.map((item, index) => (
											<Option key={index} value={item.UserInformationID}>
												{item.Email}
											</Option>
										))}
								</Select>
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								label="Email học viên"
								name="TrialStart"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Select
									placeholder="Chọn ngày bắt đầu"
									className="style-input"
									style={{ width: '100%' }}
									onChange={onSelectCourseScheduleStart}
								>
									{scheduleList &&
										scheduleList.map((o, idx) => (
											<Option key={idx} value={o.value}>
												{o.title}
											</Option>
										))}
								</Select>
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								label="Email học viên"
								name="TrialEnd"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Select
									placeholder="Chọn ngày kết thúc"
									className="style-input"
									style={{ width: '100%' }}
									onChange={onSelectCourseScheduleEnd}
								>
									{scheduleList &&
										scheduleList.map((o, idx) => (
											<Option key={idx} value={o.value}>
												{o.title}
											</Option>
										))}
								</Select>
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item label="Ghi chú" name="Note">
								<TextArea rows={4} className="style-input" placeholder="Thêm ghi chú" />
							</Form.Item>
						</div>
						<div className="col-12">
							<button
								type="submit"
								className="btn btn-primary w-100"
								disabled={isLoading.type == 'SUBMIT' && isLoading.status}
							>
								Lưu
								{isLoading.type == 'SUBMIT' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default AddTrialStudentForm;
