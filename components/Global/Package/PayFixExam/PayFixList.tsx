import React, { useEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { priceFixExamApi, payFixExamApi, studentApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import PowerTable from '~/components/PowerTable';
import { numberWithCommas } from '~/utils/functions';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { payFixListApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import Link from 'next/link';
import { Tooltip } from 'antd';
import { Eye } from 'react-feather';
import ExpandTable from '~/components/ExpandTable';
import PayFixExamDetail from '~/components/Global/Package/PayFixExam/PayFixExamDetail';
import PayFixExamForm from './PayFixExamForm';

const PayFixList = (props) => {
	let listFieldFilter = {
		pageIndex: 1,
		StudentID: null,
		SetPackageLevel: null,
		isApproval: null
	};
	const dataOption = [
		{
			dataSort: {
				sort: 0,
				sortType: true
			},
			text: 'Tên A-Z'
		},
		{
			dataSort: {
				sort: 0,
				sortType: false
			},
			text: 'Tên Z-A'
		},
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			text: 'Level A-Z'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			text: 'Level Z-A'
		}
	];
	// ------ LIST FILTER -------
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'StudentID',
			title: 'Học sinh',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null, // Gọi api xong trả data vào đây
			value: null
		},
		{
			name: 'SetPackageLevel',
			title: 'Level',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'isApproval',
			title: 'Trạng thái',
			col: 'col-md-12 col-12',
			type: 'select',
			optionList: [
				{
					title: 'Đang chờ yêu cầu duyệt',
					value: true
				},
				{
					title: 'Đã duyệt tất cả',
					value: false
				}
			],
			value: null
		}
	]);
	const [role, setRole] = useState(null);
	const [userID, setUserID] = useState(null);
	const [dataLevel, setDataLevel] = useState([]);
	const [dataStudent, setDataStudent] = useState([]);
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IPayFixList[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		StudentID: null,
		SetPackageLevel: null,
		isApproval: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const getDataStudent = async () => {
		try {
			let res = await studentApi.getAll({ pageSize: pageSize, pageIndex: 1 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				setDataFunc('StudentID', newData);
				setDataStudent(newData);
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu học sinh này!');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	// GET DATA LEVEL
	const getDataLevel = async () => {
		try {
			let res = await priceFixExamApi.getAll({ pageSize: 9999, pageIndex: 1 });
			if (res.status == 200) {
				let newData = res.data.data.map((item) => ({
					title: item.SetPackageLevel,
					value: item.ID,
					price: item.Price
				}));
				setDataLevel(newData);
				setDataFunc('SetPackageLevel', newData);
			}
		} catch (error) {
			console.log('Error Level Package: ', error.message);
		}
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await payFixListApi.getAll(todoApi);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));

			res.status == 204 && (showNoti('danger', 'Không có dữ liệu'), setDataSource([]));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const onFetchData = () => {
		setCurrentPage(1);
		setTodoApi(listTodoApi);
	};

	const onUpdateData = (index) => {
		setTodoApi({ ...todoApi });
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber
		});
	};

	// --------------- HANDLE SORT ----------------------
	const handleSort = (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
	};

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

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
		console.log('List Filter: ', listFilter);
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

	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	const expandedRowRender = (data, index) => {
		return <PayFixExamDetail role={role} studentID={data.StudentID} level={data.SetPackageLevel} onUpdateData={onUpdateData} />;
	};

	const columnsStudent = [
		{
			title: 'Level',
			dataIndex: 'SetPackageLevel',
			align: 'center'
		},

		{
			title: 'Tổng số lượt chấm',
			dataIndex: 'Amount',
			align: 'center'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isApproval',
			render: (type) => {
				return (
					<>{type ? <span className="tag yellow">Đang chờ duyệt</span> : <span className="tag green">Đã duyệt tất cả</span>}</>
				);
			}
		}
	];

	const columnsAdmin = [
		{
			title: 'Học sinh',
			dataIndex: 'StudentName'
		},
		{
			title: 'Level',
			dataIndex: 'SetPackageLevel',
			align: 'center'
		},

		{
			title: 'Tổng số lượt chấm',
			dataIndex: 'Amount',
			align: 'center'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isApproval',
			render: (type) => {
				return (
					<>{type ? <span className="tag yellow">Đang chờ duyệt</span> : <span className="tag green">Đã duyệt tất cả</span>}</>
				);
			}
		}
	];

	useEffect(() => {
		if (userInformation) {
			setRole(userInformation.RoleID);
			setUserID(userInformation.UserInformationID);
			if (userInformation.RoleID == 3) {
				setTodoApi({
					...todoApi,
					StudentID: userInformation.UserInformationID
				});
			}
		}
	}, [userInformation]);

	useEffect(() => {
		getDataLevel();
		getDataStudent();
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
	}, []);

	useEffect(() => {
		if (role) {
			getDataSource();
		}
	}, [todoApi, role]);

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage={role == 1 ? 'Danh sách mua lượt chấm' : 'Chi tiết mua lượt chấm'}
				TitleCard={role == 3 && <PayFixExamForm isBuy={true} userID={userID} dataLevel={dataLevel} onUpdateData={onUpdateData} />}
				dataSource={dataSource}
				columns={role == 1 ? columnsAdmin : columnsStudent}
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
};

PayFixList.layout = LayoutBase;
export default PayFixList;
