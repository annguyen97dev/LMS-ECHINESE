import moment from 'moment';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { branchApi, studentApi, testCustomerApi, examTopicApi, examAppointmentResultApi, teacherApi } from '~/apiBase';
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
import ExamAppointmentPoint from '~/components/Global/ExamAppointment/ExamAppointmentPoint';
import { Tooltip } from 'antd';
import { FormOutlined } from '@ant-design/icons';
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

export default function ServiceTestTeacher(props) {
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Branch: [],
		Student: [],
		Teacher: []
	});
	const [dataExam, setDataExam] = useState<IExamTopic[]>([]);
	const [currentDay, setCurrentDate] = useState(null);
	const [isOpenNoti, setisOpenNoti] = useState(false);

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		TeacherID: null
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
					title: 'Chưa đăng kí khóa học',
					value: 1
				},
				{
					title: 'Đã đăng kí khóa học',
					value: 2
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

					res.status == 204 && showNoti('danger', item.text + ' Không có dữ liệu');
				} catch (error) {
					showNoti('danger', error.message);
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
			let res = await examAppointmentResultApi.getAll(todoApi);
			if (res.status == 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
				//@ts-ignore
				// setTestDate(moment(res.data.data.AppointmentDate).format('DD/MM/YYYY HH:mm'));
			}
			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
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
					let newDataSource = [...dataSource];
					newDataSource.splice(indexRow, 1, {
						...dataSubmit,
						FullNameUnicode: listDataForm.Student.find((item) => item.value == dataSubmit.UserInformationID).title,
						BranchName: listDataForm.Branch.find((item) => item.value == dataSubmit.BranchID).title,
						TeacherName: listDataForm.Teacher.find((item) => item.value == dataSubmit.TeacherID).title
					});
					setDataSource(newDataSource);
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
		let clearKey = checkField(valueSearch, dataIndex);

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
		console.log('Todoapi: ', todoApi);
		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageIndex
		});
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		if (userInformation) {
			getDataSource();
		}
	}, [todoApi]);

	useEffect(() => {
		// getDataAll(listApi);
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
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		if (userInformation) {
			setTodoApi({
				...todoApi,
				TeacherID: userInformation.UserInformationID
			});
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
		return (
			<>
				<ExamAppointmentPoint infoID={record.ExamAppointmentID} userID={record.UserInformationID} />
			</>
		);
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',

			render: (a) => <p className="font-weight-blue">{a}</p>,
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text')
		},

		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',

			render: (a) => <p className="font-weight-black">{a}</p>
		},
		{
			title: 'Đề test',
			dataIndex: 'ExamTopicnName',
			render: (text, data: any) => (
				<a href="" className="font-weight-black" onClick={(e) => moveToTest(e, data)}>
					{text}
				</a>
			)
		},
		{
			title: 'Ngày hẹn',
			dataIndex: 'AppointmentDate',
			render: (date: any) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Giờ hẹn',
			dataIndex: 'Time'
		},

		{
			title: 'Tư vấn viên',
			dataIndex: 'CounselorsName'
		},

		{
			title: 'Trạng thái',
			dataIndex: 'isDone',
			align: 'center',

			filters: [
				{
					text: 'Chưa chấm',
					value: false
				},
				{
					text: 'Đã chấm',
					value: true
				}
			],
			onFilter: (value, record) => record.isDone === value,
			render: (type) => (
				<>
					{type == true && <span className="tag green">Đã chấm xong</span>}
					{type == false && <span className="tag gray">Chưa chấm xong</span>}
				</>
			)
		},
		{
			render: (data) => (
				<>
					{data.TeacherID === userInformation.UserInformationID && !data.isDone && (
						<Link
							href={{
								pathname: '/customer/service/service-test-teacher/detail/[slug]',
								query: { slug: `${data.ID}`, teacherMarking: data.TeacherID, packageResultID: data.ID, type: 'test' }
							}}
						>
							<Tooltip title="Chấm bài ngay">
								<button className="btn btn-icon edit">
									<FormOutlined />
								</button>
							</Tooltip>
						</Link>
					)}

					{data.TeacherID === userInformation.UserInformationID && data.isDone && (
						<Link
							href={{
								pathname: '/customer/service/service-test-teacher/detail/[slug]',
								query: { slug: `${data.ID}`, teacherMarking: data.TeacherID, packageResultID: data.ID, type: 'test' }
							}}
						>
							<Tooltip title="Xem chi tiết đề test">
								<button className="btn btn-icon view">
									<FormOutlined />
								</button>
							</Tooltip>
						</Link>
					)}
				</>
			)
		}
	];

	return (
		<>
			{userInformation && (
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
			)}
		</>
	);
}
ServiceTestTeacher.layout = LayoutBase;
