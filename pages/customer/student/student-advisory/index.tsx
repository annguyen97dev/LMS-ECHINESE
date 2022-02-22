import React, { useState, useEffect } from 'react';
import SortBox from '~/components/Elements/SortBox';
import moment from 'moment';
import FilterColumn from '~/components/Tables/FilterColumn';
import LayoutBase from '~/components/LayoutBase';
import { studentAdviseApi, sourceInfomationApi, areaApi, staffApi, consultationStatusApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import StudentAdviseForm from '~/components/Global/Customer/Student/StudentAdviseForm';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import Link from 'next/link';
import { Tooltip } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import ExpandTable from '~/components/ExpandTable';
import StudentAdvisoryNote from '~/components/Global/Customer/Student/StudentAdvisory/StudentAdvisoryNote';
import StudentAdvisoryMail from '~/components/Global/Customer/Student/StudentAdvisory/StudentAdvisoryMail';
import { learningNeeds } from '~/apiBase/options/learning-needs';

let pageIndex = 1;

let listFieldSearch = {
	pageIndex: 1,
	CustomerName: null
};

let listFieldFilter = {
	pageIndex: 1,
	SourceInformationID: null,
	CounselorsID: null,
	fromDate: null,
	toDate: null,
	CustomerConsultationStatusID: null,
	LearningNeedID: null
};

const dataOption = [
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Tên Z - A'
	},
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Tên A - Z '
	}
];

// -- FOR DIFFERENT VIEW --
interface optionObj {
	title: string;
	value: number;
}

interface listDataForm {
	Area: Array<optionObj>;
	Program: Array<optionObj>;
	SourceInformation: Array<optionObj>;
	Counselors: Array<optionObj>;
	ConsultationStatus: Array<optionObj>;
}

const listApi = [
	{
		api: areaApi,
		text: 'Tỉnh/Tp',
		name: 'Area'
	},
	{
		api: sourceInfomationApi,
		text: 'Nguồn khách hàng',
		name: 'SourceInformation'
	},
	{
		api: staffApi,
		text: 'Tư vấn viên',
		name: 'Counselors'
	},
	{
		api: consultationStatusApi,
		text: 'Tình trạng tư vấn',
		name: 'ConsultationStatus'
	},
	{
		api: learningNeeds,
		text: 'Nhu cầu học',
		name: 'Program'
	}
];

export default function StudentAdvisory() {
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Area: [],
		SourceInformation: [],
		Counselors: [],
		ConsultationStatus: [],
		Program: []
	});
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IStudentAdvise[]>([]);
	const { showNoti, pageSize, isAdmin, userInformation } = useWrap();
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		SourceInformationID: null,
		CounselorsID: null,
		fromDate: null,
		toDate: null,
		isGroup: null
	};
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [listCustomer, setListCustomer] = useState([]);
	const [showCheckbox, setShowCheckbox] = useState(false);
	const [isResetKey, setIsResetKey] = useState(false);

	// ------ LIST FILTER -------
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'SourceInformationID',
			title: 'Nguồn khách',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'CounselorsID',
			title: 'Tư vấn viên',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'CustomerConsultationStatusID',
			title: 'Trạng thái hoạt động',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null
		},
		{
			name: 'LearningNeedID',
			title: 'Nhu cầu học',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null
		},
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

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

	const makeNewData = (data, name) => {
		let newData = null;
		switch (name) {
			case 'Area':
				newData = data.map((item) => ({
					title: item.AreaName,
					value: item.AreaID
				}));

				break;
			case 'Program':
				newData = data.map((item) => ({
					title: item.Name,
					value: item.ID
				}));
				setDataFunc('LearningNeedID', newData);
				break;

			case 'SourceInformation':
				newData = data.map((item) => ({
					title: item.SourceInformationName,
					value: item.SourceInformationID
				}));
				setDataFunc('SourceInformationID', newData);
				break;
			case 'Counselors':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				setDataFunc('CounselorsID', newData);
				break;
			case 'ConsultationStatus':
				newData = data.map((item) => ({
					title: item.Name,
					value: item.ID
				}));
				setDataFunc('CustomerConsultationStatusID', newData);
				break;
			default:
				break;
		}
		console.log('new data', newData);
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

	// ----------- GET DATA SOURCE ---------------
	const getDataStudentForm = (arrApi) => {
		arrApi.forEach((item, index) => {
			(async () => {
				let res = null;
				try {
					if (item.name == 'Counselors') {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							RoleID: 6,
							Enable: true,
							StatusID: 0
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
					console.log(error.message);
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
			let res = await studentAdviseApi.getAll(todoApi);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow), setIsResetKey(true));
			res.status == 204 && setDataSource([]);
			setTimeout(() => {
				setIsResetKey(false);
			}, 200);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// ---------------- AFTER SUBMIT -----------------
	const afterPost = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// ----------------- ON SUBMIT --------------------
	const _onSubmit = async (dataSubmit: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res = null;
		if (dataSubmit.ID) {
			try {
				res = await studentAdviseApi.update(dataSubmit);
				if (res.status == 200) {
					setTodoApi({ ...todoApi });
					showNoti('success', res.data.message);
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
		} else {
			dataSubmit.CounselorsID = 0;
			try {
				res = await studentAdviseApi.add(dataSubmit);
				res?.status == 200 && afterPost();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		}
		return res;
	};

	const checkEmptyData = () => {
		let count = 0;
		let res = false;
		Object.keys(listDataForm).forEach(function (key) {
			if (listDataForm[key].length == 0) {
				count++;
			}
		});
		if (count < 1) {
			res = true;
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
	const onSearch = (valueSearch, dataIndex) => {
		let clearKey =
			dataIndex == 'CustomerName'
				? { CustomerName: valueSearch }
				: dataIndex == 'Number'
				? { Number: valueSearch }
				: { Email: valueSearch };

		setTodoApi({
			...todoApi,
			...clearKey,
			...listFieldFilter
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
			pageIndex: pageIndex
		});
	};

	const resetListCustomer = () => {
		setListCustomer([]);
	};

	// -------- ON SELECT ROW ---------
	const onSelectRow = (selectRow) => {
		let listID = selectRow?.map((item) => item.ID);
		setListCustomer(listID);
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	useEffect(() => {
		userInformation &&
			(userInformation.RoleID === 1 || userInformation.RoleID === 6 || userInformation.RoleID === 5) &&
			getDataStudentForm(listApi);
	}, [userInformation]);

	const expandedRowRender = (data) => {
		return (
			<>
				<StudentAdvisoryNote onFetchData={() => setTodoApi({ ...todoApi })} dataSource={data.Note} userID={data.ID} />
			</>
		);
	};

	const columns =
		userInformation && userInformation?.RoleID !== 10
			? [
					{
						title: 'Mã số',
						dataIndex: 'CustomerCode',
						fixed: 'left',
						render: (CustomerCode) => <p className="font-weight-black">{CustomerCode}</p>
					},
					{
						title: 'Họ tên',
						dataIndex: 'CustomerName',
						...FilterColumn('CustomerName', onSearch, handleReset, 'text'),
						fixed: 'left',
						render: (a) => <p className="font-weight-primary">{a}</p>
					},
					{
						title: 'Số điện thoại',
						dataIndex: 'Number',
						...FilterColumn('Number', onSearch, handleReset, 'text'),
						fixed: 'left',
						render: (a) => <p style={{ width: 130 }}>{a}</p>
					},
					{
						title: 'Email',
						dataIndex: 'Email',
						...FilterColumn('Email', onSearch, handleReset, 'text'),
						fixed: 'left',
						render: (a) => <p style={{ width: 200 }}>{a}</p>
					},
					{
						width: 180,
						title: 'Nhu cầu học',
						dataIndex: 'LearningNeedName'
					},
					{
						width: 150,
						title: 'Nguồn',
						dataIndex: 'SourceInformationName'
					},
					{
						className: 'text-center',
						width: 200,
						title: 'Trạng thái',
						dataIndex: 'CustomerConsultationStatusName',

						render: (text, data) => <p className="font-weight-black">{text}</p>
					},
					{
						width: 150,
						title: 'Tư vấn viên',
						dataIndex: 'CounselorsName',
						render: (CounselorsName) => <p style={{ width: 200 }}>{CounselorsName}</p>
					},
					{
						title: 'Ngày đăng ký',
						dataIndex: 'CreatedOn',
						render: (date) => <p>{moment(date).format('DD/MM/YYYY')}</p>,
						width: 120
					},
					{
						title: '',
						dataIndex: 'CustomerConsultationStatusID',
						width: 135,
						render: (text, data, index) => {
							return (
								<div className="d-flex align-items-center">
									<StudentAdviseForm
										index={index}
										rowData={data}
										rowID={data.ID}
										listData={listDataForm}
										isLoading={isLoading}
										_onSubmit={(data: any) => _onSubmit(data)}
									/>

									<StudentAdvisoryMail
										loadingOutside={isLoading}
										dataSource={dataSource}
										onFetchData={() => setTodoApi({ ...todoApi })}
										dataRow={data}
										listCustomer={listCustomer}
									/>
									{text == 2 && (
										<Link
											href={{
												pathname: '/customer/service/service-info-student/',
												query: { customerID: data.ID }
											}}
										>
											<Tooltip title="Hẹn test">
												<button className="btn btn-icon view">
													<CalendarOutlined />
												</button>
											</Tooltip>
										</Link>
									)}
								</div>
							);
						}
					}
			  ]
			: [
					{
						title: 'Mã số',
						dataIndex: 'CustomerCode',
						fixed: 'left',
						render: (CustomerCode) => <p className="font-weight-black">{CustomerCode}</p>
					},
					{
						title: 'Họ tên',
						dataIndex: 'CustomerName',
						...FilterColumn('CustomerName', onSearch, handleReset, 'text'),
						fixed: 'left',
						render: (a) => <p className="font-weight-primary">{a}</p>
					},
					{
						title: 'Số điện thoại',
						dataIndex: 'Number',
						...FilterColumn('Number', onSearch, handleReset, 'text'),
						fixed: 'left',
						render: (a) => <p style={{ width: 130 }}>{a}</p>
					},
					{
						title: 'Email',
						dataIndex: 'Email',
						...FilterColumn('Email', onSearch, handleReset, 'text'),
						fixed: 'left',
						render: (a) => <p style={{ width: 200 }}>{a}</p>
					},
					{
						width: 180,
						title: 'Nhu cầu học',
						dataIndex: 'LearningNeedName'
					},
					{
						width: 150,
						title: 'Nguồn',
						dataIndex: 'SourceInformationName'
					},
					{
						className: 'text-center',
						width: 200,
						title: 'Trạng thái',
						dataIndex: 'CustomerConsultationStatusName',

						render: (text, data) => <p className="font-weight-black">{text}</p>
					},
					{
						width: 150,
						title: 'Tư vấn viên',
						dataIndex: 'CounselorsName',
						render: (CounselorsName) => <p style={{ width: 200 }}>{CounselorsName}</p>
					},
					{
						title: 'Ngày đăng ký',
						dataIndex: 'CreatedOn',
						render: (date) => <p>{moment(date).format('DD/MM/YYYY')}</p>,
						width: 120
					}
			  ];

	return (
		<ExpandTable
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			loading={isLoading}
			addClass="basic-header"
			TitlePage="Danh sách khách hàng"
			TitleCard={
				<div className="d-flex align-items-center justify-content-end">
					{userInformation && userInformation?.RoleID !== 10 && (
						<>
							<StudentAdvisoryMail
								showCheckBox={() => setShowCheckbox(!showCheckbox)}
								loadingOutside={isLoading}
								dataSource={dataSource}
								onFetchData={() => setTodoApi({ ...todoApi })}
								listCustomer={listCustomer}
								resetListCustomer={() => resetListCustomer()}
							/>
							<StudentAdviseForm
								listData={checkEmptyData && listDataForm}
								isLoading={isLoading}
								_onSubmit={(data: any) => _onSubmit(data)}
							/>
						</>
					)}
				</div>
			}
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
			isSelect={showCheckbox}
			isResetKey={isResetKey}
			onSelectRow={(selectRows) => onSelectRow(selectRows)}
		/>
	);
}
StudentAdvisory.layout = LayoutBase;
