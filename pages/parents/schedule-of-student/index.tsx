import React, { useState, useEffect } from 'react';
import { studentApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { Select } from 'antd';
import PowerTable from '~/components/PowerTable';
import LayoutBase from '~/components/LayoutBase';
import { scheduleOfStudentApi } from './../../../apiBase/customer/parents/schedule-of-student';
import moment from 'moment';

const ScheduleOfStudent = () => {
	const [dataSource, setDataSource] = useState<IScheduleOfStudent[]>();
	const [students, setStudents] = useState<IStudent[]>();
	const { showNoti, pageSize, userInformation } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [studentID, setStudentID] = useState(null);
	const [loading, setLoading] = useState({
		type: '',
		status: false
	});

	const studentParams = {
		pageSize: pageSize,
		pageIndex: 1,
		sort: null,
		sortType: null,
		FullNameUnicode: null,
		SourceInformationID: null,
		BranchID: null,
		fromDate: null,
		toDate: null,
		ParentsOf: userInformation?.UserInformationID
	};

	const params = {
		StudentID: null,
		StartTime: '2021-06-06',
		EndTime: '2021-11-30'
	};

	const columns = [
		{
			title: 'Tên môn học',
			dataIndex: 'SubjectName',
			width: 100,
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'Title',
			width: 150,
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			width: 150,
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'StartTime',
			width: 150,
			render: (price, record) => <p>{moment(price).format('DD-MM-YYYY, h:mm:ss a')}</p>
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'EndTime',
			width: 150,
			render: (price, record) => <p>{moment(price).format('DD-MM-YYYY, h:mm:ss a')}</p>
		},
		{
			title: 'Tên phòng',
			dataIndex: 'RoomName',
			width: 150,
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Zoom ID',
			dataIndex: 'ZoomRoomID',
			width: 150,
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Mật khẩu Zoom',
			dataIndex: 'ZoomRoomPass',
			width: 150,
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		}
	];

	const [todoApi, setTodoApi] = useState(params);

	const { Option } = Select;

	const getStudents = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await studentApi.getAll(studentParams);
			console.log(res.data.data[0]);
			if (res.status === 200) {
				setStudents(res.data.data);
				setTodoApi({ ...todoApi });
			}
			if (res.status == 204) {
				showNoti('danger', 'Không có dữ liệu');
			}
		} catch (error) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const getStudentSchedule = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await scheduleOfStudentApi.getID(todoApi);
			if (res.status == 200) {
				setDataSource(res.data.data);
			}
			if (res.status == 204) {
				setDataSource([]);
			}
		} catch (error) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		getStudents();
	}, [userInformation]);

	useEffect(() => {
		getStudentSchedule();
	}, [studentID]);

	const onChangeStudentID = (value) => {
		console.log(todoApi);
		setStudentID(value);
		setTodoApi({ ...todoApi, StudentID: value });
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi
		});
	};

	return (
		<>
			<PowerTable
				currentPage={currentPage}
				totalPage={totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={loading}
				addClass="basic-header"
				columns={columns}
				dataSource={dataSource}
				TitlePage="Danh sách công nợ của học viên"
				// TitleCard={}
				Extra={
					<Select
						disabled={false}
						style={{ width: 200 }}
						className="style-input"
						placeholder="Chọn học viên"
						onChange={onChangeStudentID}
						// defaultValue={studentID ? students[studentID.index].FullNameUnicode : ''}
					>
						{students?.map((item, index) => (
							<Option key={index} value={item.UserInformationID}>
								{item.FullNameUnicode}
							</Option>
						))}
					</Select>
				}
			/>
		</>
	);
};

ScheduleOfStudent.layout = LayoutBase;
export default ScheduleOfStudent;
