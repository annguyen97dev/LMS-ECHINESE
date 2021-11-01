import React, { useEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import { Select } from 'antd';
import { numberWithCommas } from '~/utils/functions';
import { studentApi } from './../../../apiBase/customer/student/student-list';
import PowerTable from '~/components/PowerTable';
import { courseOfStudentPriceApi } from '~/apiBase/customer/parents/courses-of-student-price';
import ExpandTable from '~/components/ExpandTable';

const CourseOfStudentPrice = () => {
	const [dataSource, setDataSource] = useState<ICourseOfStudentPrice[]>();
	const [students, setStudents] = useState<IStudent[]>();
	const { showNoti, pageSize, userInformation } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [studentID, setStudentID] = useState(null);
	const [loading, setLoading] = useState({
		type: '',
		loading: false
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
		pageIndex: 1,
		pageSize: pageSize,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		CourseID: null,
		FullNameUnicode: null,
		UserInformationID: studentID
	};

	const [todoApi, setTodoApi] = useState(params);

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			render: (price, record) => <p className="font-weight-blue">{price}</p>
		},
		{
			title: 'Trung tâm',
			dataIndex: 'PayBranchName',
			render: (price, record) => <p className="font-weight-blue">{price}</p>
		},
		{
			title: 'Trả trước',
			dataIndex: 'Paid',
			render: (price, record) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Học phí nợ',
			dataIndex: 'MoneyInDebt',
			render: (price, record) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Học phí',
			dataIndex: 'Price',
			render: (price, record) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Trạng thái thanh toán',
			dataIndex: 'DonePaid',
			render: (price, record) => {
				return record.DonePaid ? <p className="tag green">Đã thanh toán xong</p> : <p className="tag red">Chưa thanh toán xong</p>;
			}
		},
		{
			title: 'Phương pháp thanh toán',
			dataIndex: 'PaymentMethodsName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
			render: (price, record) => <p>{price}</p>
		}
	];

	const { Option } = Select;

	const getStudents = async () => {
		setLoading({
			type: 'GET_ALL',
			loading: true
		});
		try {
			let res = await studentApi.getAll(studentParams);
			console.log(res.data.data[0]);
			if (res.status === 200) {
				setStudents(res.data.data);
				setTodoApi({ ...todoApi });
				setStudentID({ ID: res.data.data[0].UserInformationID, index: 0 });
			}
			if (res.status == 204) {
				showNoti('danger', 'Không có dữ liệu');
			}
		} catch (error) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				loading: false
			});
		}
	};

	const getCoursesOfStudentPrice = async () => {
		setLoading({
			type: 'GET_ALL',
			loading: true
		});
		try {
			let res = await courseOfStudentPriceApi.getAll(todoApi);
			if (res.status == 200) {
				setDataSource(res.data.data);
				console.log(res.data.data);
			}
			if (res.status == 204) {
				setDataSource([]);
			}
		} catch (error) {
			console.log(error.message);
		} finally {
			setLoading({
				type: 'GET_ALL',
				loading: false
			});
		}
	};

	useEffect(() => {
		getStudents();
	}, [userInformation]);

	useEffect(() => {
		getCoursesOfStudentPrice();
	}, [studentID]);

	const onChangeStudentID = (value) => {
		console.log(value);
		setTodoApi({ ...todoApi, UserInformationID: value });
		setStudentID(value);
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: currentPage
		});
	};

	const expandColumns = [
		{
			title: 'Môn học',
			dataIndex: 'CourseName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Loại lớp học',
			dataIndex: 'TypeCourseName',
			render: (price, record) => <p className="font-weight-blue">{price}</p>
		}
	];

	const expandedRowRender = (record) => {
		return <PowerTable columns={expandColumns} dataSource={record.Course} />;
	};

	return (
		<>
			<ExpandTable
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
				expandable={{
					expandedRowRender
				}}
			/>
		</>
	);
};
CourseOfStudentPrice.layout = LayoutBase;
export default CourseOfStudentPrice;