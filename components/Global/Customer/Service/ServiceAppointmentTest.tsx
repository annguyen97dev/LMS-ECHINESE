import moment from 'moment';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { branchApi, studentApi, testCustomerApi, examTopicApi, packageExaminerApi, teacherApi } from '~/apiBase';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import NotiModal from '~/components/Elements/NotiModal/NotiModal';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import TestAddExam from '~/components/Global/Customer/Service/TestAddExam';
import TestCustomerForm from '~/components/Global/Customer/Service/TestCustomerForm';
import LayoutBase from '~/components/LayoutBase';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import TestCustomerPoint from '~/components/Global/Customer/Service/TestCustomerPoint';
import ExamAppointmentPoint from '../../ExamAppointment/ExamAppointmentPoint';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import Link from 'next/link';

let pageIndex = 1;

let listFieldSearch = {
	pageIndex: 1,
	FullNameUnicode: null
};

let listFieldFilter = {
	pageIndex: 1,
	BranchID: null, // lọc
	UserInformationID: null,
	Status: null,
	AppointmentDate: null
};

const dataOption = [
	{
		dataSort: {
			sort: 2,
			sortType: true
		},
		text: 'Tên A - Z '
	},
	{
		dataSort: {
			sort: 2,
			sortType: false
		},
		text: 'Tên Z - A'
	},

	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Ngày hẹn A - Z'
	},
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Ngày hẹn Z - A'
	}
];

// -- FOR DIFFERENT VIEW --
interface optionObj {
	title: string;
	value: number;
}

interface studentObj {
	title: string;
	value: number;
	counselorsName: string;
}

interface listDataForm {
	Branch: Array<optionObj>;
	Student: Array<studentObj>;
	Teacher: Array<optionObj>;
}

const listApi = [
	{
		api: branchApi,
		text: 'Trung tâm',
		name: 'Branch'
	},
	{
		api: studentApi,
		text: 'Học viên',
		name: 'Student'
	},
	{
		api: teacherApi,
		text: 'Giáo viên',
		name: 'Teacher'
	}
];

export default function ServiceAppointmentTest(props) {
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Branch: [],
		Student: [],
		Teacher: []
	});
	const [dataExam, setDataExam] = useState<IExamTopic[]>([]);
	const [currentDay, setCurrentDate] = useState(null);
	const [isOpenNoti, setisOpenNoti] = useState(false);
	const [userID, setUserID] = useState(null);

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ITestCustomer[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		FullNameUnicode: null,
		BranchID: null, // lọc
		UserInformationID: null,
		Status: null,
		AppointmentDate: null
	};
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// ------ LIST FILTER -------
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'BranchID',
			title: 'Trung tâm',
			col: 'col-md-12 col-12',
			type: 'select',
			optionList: null, // Gọi api xong trả data vào đây
			value: null
		},

		{
			name: 'Status',
			title: 'Trạng thái',
			col: 'col-md-12 col-12',
			type: 'select',
			optionList: [
				{
					title: 'Chưa test',
					value: 0
				},
				{
					title: 'Đang chấm bài test',
					value: 1
				},
				{
					title: 'Chưa đăng kí khóa học',
					value: 2
				},
				{
					title: 'Đã đăng kí khóa học',
					value: 3
				},
				{
					title: 'Đã hủy hẹn test',
					value: 4
				}
			],
			value: null
		},
		{
			name: 'AppointmentDate',
			title: 'Ngày hẹn test',
			col: 'col-md-12 col-12',
			type: 'date-single',
			value: null
		},
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

	const [dataTeacher, setDataTeacher] = useState([]);

	// Get list teacher
	const getListTeacher = async () => {
		// setLoadingTeacher(true);
		try {
			let res = await packageExaminerApi.getAll({
				selectAll: true
			});

			if (res.status === 200) {
				let newData = res.data.data.map((item) => ({
					title: item.TeacherName,
					value: item.TeacherID
				}));
				setDataTeacher(newData);
			}
		} catch (error) {
			console.log('Error Get List Teacher: ', error.message);
		} finally {
			// setLoadingTeacher(true);
		}
	};

	const makeNewData = (data, name) => {
		let newData = null;
		switch (name) {
			case 'Branch':
				newData = data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));
				setDataFunc('BranchID', newData);
				break;

			case 'Student':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID,
					counselorsName: item.CounselorsName == null ? '' : item.CounselorsName
				}));

				break;
			case 'Teacher':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));

				break;
			default:
				break;
		}

		return newData;
	};

	const getDataTolist = (data: any, name: any) => {
		let newData = makeNewData(data, name);

		Object.keys(listDataForm).forEach(function (key) {
			if (key == name) {
				listDataForm[key] = newData;
			}
		});
		setListDataForm({ ...listDataForm });
	};

	// ----------- GET DATA EXAM ------------
	const getDataExam = async () => {
		try {
			let res = await examTopicApi.getAll({
				selectAll: true,
				type: 1
			});
			if (res.status === 200) {
				setDataExam(res.data.data);
			}
		} catch (error) {
			console.log('Error Exam: ', error.message);
		}
	};

	// ----------- GET DATA SOURCE ---------------
	const getDataAll = (arrApi) => {
		arrApi.forEach((item, index) => {
			(async () => {
				let res = null;
				try {
					if (item.name == 'Counselors') {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							RoleID: 6,
							StatusID: 0,
							Enable: true
						});
					} else {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							Enable: true
						});
					}

					res.status == 200 && getDataTolist(res.data.data, item.name);

					res.status == 204 && console.log(item.text + ' Không có dữ liệu');
				} catch (error) {
					// showNoti('danger', error.message);
					console.log(error);
				} finally {
				}
			})();
		});
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await testCustomerApi.getAll(todoApi);
			if (res.status == 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
				//@ts-ignore
				// setTestDate(moment(res.data.data.AppointmentDate).format('DD/MM/YYYY HH:mm'));
			}
			res.status == 204 && setDataSource([]);
		} catch (error) {
			error.status == 500 ? showNoti('danger', 'Đường truyền mạng không ổn định') : showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// ------ SET DATA FUN ------
	const setDataFunc = (name, data) => {
		dataFilter.every((item, index) => {
			if (item.name == name) {
				item.optionList = data;
				return false;
			}
			return true;
		});
		setDataFilter([...dataFilter]);
	};

	// ---------------- AFTER SUBMIT -----------------
	const afterPost = (mes) => {
		// showNoti("success", mes);
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// ----------------- ON SUBMIT --------------------
	const _onSubmit = async (dataSubmit: any) => {
		// console.log('Data submit: ', dataSubmit);
		// console.log('List data form: ', listDataForm);
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		let res = null;

		try {
			if (dataSubmit.ID) {
				res = await testCustomerApi.update(dataSubmit);

				if (res.status == 200) {
					// let newDataSource = [...dataSource];
					// newDataSource.splice(indexRow, 1, {
					// 	...dataSubmit,
					// 	FullNameUnicode: listDataForm.Student.find((item) => item.value == dataSubmit.UserInformationID).title,
					// 	BranchName: listDataForm.Branch.find((item) => item.value == dataSubmit.BranchID).title,
					// 	TeacherName: listDataForm.Teacher.find((item) => item.value == dataSubmit.TeacherID).title
					// });
					// setDataSource(newDataSource);
					setTodoApi({ ...todoApi });
					showNoti('success', res.data.message);
				}
			} else {
				res = await testCustomerApi.add(dataSubmit);
				res?.status == 200 && afterPost(res.data.message);
			}
		} catch (error) {
			console.log('error: ', error);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}

		return res;
	};

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
		let newListFilter = { ...listFieldFilter };
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 });
	};

	// --------------- HANDLE SORT ----------------------
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
	};

	// ------------ ON SEARCH -----------------------

	const checkField = (valueSearch, dataIndex) => {
		let newList = { ...listFieldSearch };
		Object.keys(newList).forEach(function (key) {
			if (key != dataIndex) {
				if (key != 'pageIndex') {
					newList[key] = null;
				}
			} else {
				newList[key] = valueSearch;
			}
		});

		return newList;
	};

	const onSearch = (valueSearch, dataIndex) => {
		let clearKey =
			dataIndex == 'FullNameUnicode'
				? { FullNameUnicode: valueSearch }
				: dataIndex == 'Mobile'
				? { Mobile: valueSearch }
				: { Email: valueSearch };

		setTodoApi({
			...todoApi,
			...clearKey
		});
	};

	// HANDLE RESET
	const resetListFieldSearch = () => {
		Object.keys(listFieldSearch).forEach(function (key) {
			if (key != 'pageIndex') {
				listFieldSearch[key] = null;
			}
		});
	};

	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1), resetListFieldSearch();
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);

		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageIndex
		});
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	useEffect(() => {
		getDataAll(listApi);
		getDataExam();

		// Get current date
		let currentdate = new Date();
		let datetime =
			currentdate.getDate() +
			'/' +
			(currentdate.getMonth() + 1) +
			'/' +
			currentdate.getFullYear() +
			' ' +
			currentdate.getHours() +
			':' +
			currentdate.getMinutes();

		setCurrentDate(datetime);
	}, []);

	useEffect(() => {
		if (userInformation) {
			setUserID(userInformation.UserInformationID);
		}
	}, [userInformation]);

	const moveToTest = (e, data) => {
		e.preventDefault();

		let testDate = moment(data.AppointmentDate).format('DD/MM/YYYY') + ' ' + data.Time;
		console.log('Test DAte: ', testDate);
		if (currentDay < testDate) {
			setisOpenNoti(true);
		} else {
			router.push('');
		}
	};

	const expandedRowRender = (record) => {
		// return record.Note ? record.Note : "Không có ghi chú";
		// return (
		// 	<>
		// 		<div className="box-note mt-2">
		// 			<h6 className="d-block text-underline">Ghi chú:</h6>
		// 			<p>{record.Note}</p>
		// 		</div>
		// 		<TestCustomerPoint ID={record.ID} />
		// 	</>
		// );
		return (
			<>
				<p style={{ fontWeight: 500 }} className="mt-3 mb-2">
					Ghi chú
				</p>
				<p>{record.Note}</p>
				<ExamAppointmentPoint infoID={record.ID} userID={record.UserInformationID} />
			</>
		);
	};

	const onUpdateData = () => {
		setTodoApi({ ...todoApi });
	};

	const columns = [
		{
			width: 200,
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			fixed: 'left',
			render: (a) => <p className="font-weight-primary">{a}</p>,
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text')
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			fixed: 'left',
			render: (a) => <p className="font-weight-primary">{a}</p>,
			...FilterColumn('Email', onSearch, handleReset, 'text')
		},
		{
			title: 'SDT',
			dataIndex: 'Mobile',
			fixed: 'left',
			render: (a) => <p className="font-weight-primary">{a}</p>,
			...FilterColumn('Mobile', onSearch, handleReset, 'text')
		},
		{
			width: 170,
			title: 'Trung tâm',
			dataIndex: 'BranchName',

			render: (a) => <p className="font-weight-black">{a}</p>
		},
		{
			width: 170,
			title: 'Đề test',
			dataIndex: 'ExamTopicnName',
			render: (text, data: any) => (
				<Link
					href={{
						pathname: `/question-bank/exam-list/exam-detail/${data.ExamTopicID}`
					}}
				>
					<a href="" className="font-weight-link">
						{text}
					</a>
				</Link>
			)
		},
		{
			title: 'Ngày hẹn',
			dataIndex: 'AppointmentDate',
			render: (date: any) => moment(date).format('DD/MM/YYYY')
		},
		{
			width: 100,
			title: 'Giờ hẹn',
			dataIndex: 'Time',
			align: 'center'
		},
		{
			width: 170,
			title: 'Giáo viên chấm bài',
			dataIndex: 'TeacherName'
		},
		{
			width: 170,
			title: 'Tư vấn viên',
			dataIndex: 'CounselorsName'
		},

		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			align: 'center',

			filters: [
				{
					text: 'Chưa test',
					value: 0
				},
				{
					text: 'Đang chấm bài',
					value: 1
				},
				{
					text: 'Chờ đăng kí khóa học',
					value: 2
				},
				{
					text: 'Đã đăng kí khóa học',
					value: 3
				},
				{
					text: 'Đã hủy hẹn test',
					value: 4
				}
			],
			onFilter: (value, record) => record.Status === value,
			render: (status) => {
				return (
					<>
						{status == 0 && <span className="tag red">Chưa test</span>}
						{status == 1 && <span className="tag blue">Đang chấm bài</span>}
						{status == 2 && <span className="tag yellow">Chờ đăng kí khóa học</span>}
						{status == 3 && <span className="tag green">Đã đăng kí </span>}
						{status == 4 && <span className="tag gray">Đã hủy hẹn test</span>}
						{/* {apmReg == 1 ? (
              <span className="tag blue">Chưa đăng kí khóa học</span>
            ) : apmReg == 2 ? (
              <span className="tag green">Đã đăng kí khóa học</span>
            ) : (
              <span className="tag red">Chưa test</span>
            )} */}
					</>
				);
			}
		},
		{
			title: '',
			render: (text, data, index) => (
				<div onClick={(e) => e.stopPropagation()}>
					<TestCustomerForm
						getIndex={() => setIndexRow(index)}
						index={index}
						rowData={data}
						rowID={data.ID}
						listData={listDataForm}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}
						dataExam={dataExam}
					/>
					<TestAddExam dataExam={dataExam} dataRow={data} onFetchData={() => setTodoApi({ ...todoApi })} />
					{data.Status == 0 && <CancelTest onUpdateData={onUpdateData} dataRow={data} />}
				</div>
			)
		}
	];

	return (
		<>
			<NotiModal
				isOpen={isOpenNoti}
				isCancel={() => setisOpenNoti(false)}
				isOk={() => setisOpenNoti(false)}
				content="Chưa đến giờ làm đề test"
			/>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="DS khách hẹn test"
				// TitleCard={
				//   <StudentAdviseForm
				//     listData={listDataForm}
				//     isLoading={isLoading}
				//     _onSubmit={(data: any) => _onSubmit(data)}
				//   />
				// }
				dataSource={dataSource}
				columns={columns}
				Extra={
					<div className="extra-table">
						<FilterBase
							dataFilter={dataFilter}
							handleFilter={(listFilter: any) => handleFilter(listFilter)}
							handleReset={handleReset}
						/>
						<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
					</div>
				}
				expandable={{ expandedRowRender }}
			/>
		</>
	);
}
ServiceAppointmentTest.layout = LayoutBase;

const CancelTest = (props) => {
	const { onUpdateData, dataRow } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		let dataSubmit = {
			ID: dataRow.ID,
			Status: 4
		};
		setLoading(true);

		try {
			let res = await testCustomerApi.update(dataSubmit);
			if (res.status == 200) {
				showNoti('success', 'Hủy lịch hẹn test thành công!');
				setIsModalVisible(false);
				onUpdateData && onUpdateData();
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<Tooltip title="Hủy lịch hẹn">
				<button className="btn btn-icon delete" onClick={showModal}>
					<CloseOutlined />
				</button>
			</Tooltip>
			<Modal
				title={
					<button className="btn btn-icon delete">
						<QuestionCircleOutlined />
					</button>
				}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okButtonProps={{ loading: loading }}
			>
				<p style={{ fontWeight: 500 }}>Bạn muốn hủy lịch hẹn test của học viên này?</p>
			</Modal>
		</>
	);
};
