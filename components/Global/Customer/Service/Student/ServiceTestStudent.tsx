import moment from 'moment';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { branchApi, studentApi, testCustomerApi, examTopicApi } from '~/apiBase';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import NotiModal from '~/components/Elements/NotiModal/NotiModal';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';

import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';

import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import ExamAppointmentPoint from '../../../ExamAppointment/ExamAppointmentPoint';
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
	}
];

export default function ServiceTestStudent(props) {
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Branch: [],
		Student: []
	});
	const [dataExam, setDataExam] = useState<IExamTopic[]>([]);
	const [currentDate, setCurrentDate] = useState<any>(null);
	const [isOpenNoti, setisOpenNoti] = useState(false);
	const [contentNoti, setContentNoti] = useState('');

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
		UserInformationID: userInformation?.UserInformationID,
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
	const [showfirst, setShowFirst] = useState(false);

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
			let res = await testCustomerApi.getAll(todoApi);
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
		console.log('Data submit: ', dataSubmit);
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
						BranchName: listDataForm.Branch.find((item) => item.value == dataSubmit.BranchID).title
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
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		if (userInformation) {
			!showfirst && (setTodoApi({ ...todoApi, UserInformationID: userInformation.UserInformationID }), setShowFirst(true));
		}
	}, [userInformation]);

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

	const moveToTest = (e, data) => {
		e.preventDefault();

		let testDate: any = moment(data.AppointmentDate).format('DD/MM/YYYY') + ' ' + data.Time;

		testDate = new Date(testDate);

		console.log('Test DAte: ', testDate);
		if (new Date(currentDate) < testDate) {
			setisOpenNoti(true);
			setContentNoti('Chưa đến giờ làm bài test');
		} else {
			if (data.Status == 0) {
				router.push({
					pathname: '/exam/exam-review',
					query: {
						examID: data.ExamTopicID,
						packageDetailID: data.ID,
						type: 'test' // Kiểm tra đầu vào
					}
				});
			} else {
				setisOpenNoti(true);
				if (data.Status !== 4) {
					setContentNoti('Bạn đã làm bài test này rồi!');
				} else {
					setContentNoti('Lịch hẹn test của bạn đã bị hủy');
				}
			}
		}
	};

	// const expandedRowRender = (record) => {
	// 	// return record.Note ? record.Note : "Không có ghi chú";
	// 	return (
	// 		<>
	// 			<div className="box-note mt-2">
	// 				<h6 className="d-block text-underline">Ghi chú:</h6>
	// 				<p>{record.Note}</p>
	// 			</div>
	// 			<TestCustomerPoint ID={record.ID} />
	// 		</>
	// 	);
	// };

	const expandedRowRender = (data, index) => {
		return (
			<>
				<ExamAppointmentPoint infoID={data.ID} userID={data.UserInformationID} />
			</>
		);
	};

	const columns = [
		// {
		// 	title: 'Học viên',
		// 	dataIndex: 'FullNameUnicode',

		// 	render: (a) => <p className="font-weight-primary">{a}</p>,
		// 	...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text')
		// },

		{
			title: 'Ngày hẹn',
			dataIndex: 'AppointmentDate',
			render: (date: any) => <p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Giờ hẹn',
			dataIndex: 'Time',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			width: 150,
			title: 'Trung tâm',
			dataIndex: 'BranchName',

			render: (a) => <p className="font-weight-black">{a}</p>
		},
		{
			width: 150,
			title: 'Đề test',
			dataIndex: 'ExamTopicnName',

			render: (text, data: any) =>
				data.ExamTopicID !== 0 && (
					<Tooltip title="Làm đề test">
						<a href="" className="font-weight-link d-flex align-items-center" onClick={(e) => moveToTest(e, data)}>
							<button className="btn btn-icon edit mr-2">
								<EditOutlined />
							</button>
							{text}
						</a>
					</Tooltip>
				)
		},

		{
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
				}
			],
			onFilter: (value, record) => record.Status === value,
			render: (status) => {
				return (
					<>
						{status == 0 && <span className="tag red">Chưa test</span>}
						{status == 1 && <span className="tag blue">Đang chấm bài</span>}
						{status == 2 && <span className="tag yellow">Chờ đăng kí khóa học</span>}
						{status == 3 && <span className="tag green">Đã đăng kí khóa học</span>}
						{status == 4 && <span className="tag gray">Đã hủy hẹn test</span>}
					</>
				);
			}
		},
		{
			title: '',
			render: (text, data, index) => (
				<>
					{data.ExamAppointmentResultID !== 0 && (
						<Link
							href={{
								pathname: '/customer/service/service-test-student/detail/[slug]',
								query: {
									slug: data.ID,
									examID: data.ExamTopicID,
									ExamAppointmentResultID: data.ExamAppointmentResultID
								}
							}}
						>
							<Tooltip title="Chi tiết kết quả đề hẹn test">
								<button className="btn btn-icon">
									<ExclamationCircleOutlined />
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
			<NotiModal isOpen={isOpenNoti} isCancel={() => setisOpenNoti(false)} isOk={() => setisOpenNoti(false)} content={contentNoti} />
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Thông tin hẹn test"
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
ServiceTestStudent.layout = LayoutBase;
