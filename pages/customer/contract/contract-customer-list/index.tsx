import { Switch, Tooltip } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Eye } from 'react-feather';
import { contractCustomerListApi, courseApi } from '~/apiBase';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
ContractList.layout = LayoutBase;
export default function ContractList() {
	const [contractCustomerList, setContractCustomerList] = useState<IContractCustomerList[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'CourseID',
			title: 'Khóa học',
			col: 'col-12',
			type: 'select',
			optionList: [],
			value: null
		},
		{
			name: 'Accept',
			title: 'Trạng thái',
			col: 'col-12',
			type: 'select',
			optionList: [
				{
					title: 'Đã duyệt',
					value: true
				},
				{
					title: 'Chờ duyệt duyệt',
					value: false
				}
			],
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

	let pageIndex = 1;

	// SORT
	const dataOption = [
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 3,
			text: 'Tên giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 4,
			text: 'Tên tăng dần '
		}
	];

	// PARAMS SEARCH
	let listField = {
		FullNameUnicode: ''
	};

	let listFieldFilter = {
		pageIndex: 1,
		fromDate: null,
		toDate: null,
		CourseID: null,
		Accept: null
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		FullNameUnicode: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const setDataFunc = (name, data) => {
		if (Object.keys(data).length > 0) {
			dataFilter.every((item, index) => {
				if (item.name == name) {
					item.optionList = data;
					return false;
				}
				return true;
			});
			setDataFilter([...dataFilter]);
		} else {
			// setDataCourse(dataCourse);
		}
	};

	// GET DATA TABLE
	const fetchContractCustomerList = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await contractCustomerListApi.getAll(todoApi);
				if (res.status == 204) {
					setContractCustomerList([]);
				}
				if (res.status == 200) {
					console.log(res.data.data);
					setContractCustomerList(res.data.data);
					if (res.data.data.length < 1) {
						handleReset();
					}
					setTotalPage(res.data.totalRow);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};

	// ON SEARCH
	const compareField = (valueSearch, dataIndex) => {
		let newList = null;
		Object.keys(listField).forEach(function (key) {
			console.log('key: ', key);
			if (key != dataIndex) {
				listField[key] = '';
			} else {
				listField[key] = valueSearch;
			}
		});
		newList = listField;
		return newList;
	};

	// GET DATA COURSE
	const getDataCourse = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await courseApi.getAll({ selectAll: true });
				if (res.status == 204) {
					showNoti('danger', 'Không có dữ liệu');
				}
				console.log(res.data.data);
				if (res.status == 200) {
					const newData = res.data.data.map((item) => ({
						title: item.CourseName,
						value: item.ID
					}));
					setDataFunc('CourseID', newData);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};

	useEffect(() => {
		getDataCourse();
	}, []);

	useEffect(() => {
		fetchContractCustomerList();
	}, [todoApi]);

	const onSearch = (valueSearch, dataIndex) => {
		let clearKey = compareField(valueSearch, dataIndex);
		setTodoApi({
			...todoApi,
			...clearKey
		});
	};

	// HANDLE RESET
	const handleReset = () => {
		setActiveColumnSearch('');
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
		console.log('List Filter when submit: ', listFilter);

		let newListFilter = { ...listFieldFilter };
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setTodoApi({ ...todoApi, ...newListFilter, pageIndex: 1 });
	};
	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			//   ...listFieldSearch,
			pageIndex: pageIndex,
			pageSize: pageSize
		});
	};
	// HANDLE SORT
	const handleSort = async (option) => {
		console.log('Show option: ', option);

		let newTodoApi = {
			...listTodoApi,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setCurrentPage(1);
		setTodoApi(newTodoApi);
	};
	// CHANGE STATUS
	const onChangeStatus = async (checked: boolean, idRow: number, idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let dataChange = {
				ID: idRow,
				Accept: checked
			};
			let res = await contractCustomerListApi.update(dataChange);
			if (res.status === 200) {
				const newContractCustomer = [...contractCustomerList];
				const newPackage = { ...contractCustomerList[idx], Accept: checked };
				newContractCustomer.splice(idx, 1, newPackage);
				setContractCustomerList(newContractCustomer);
			}
		} catch (error) {
			showNoti('danger', error.Message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const columns = [
		{
			title: 'Học viên',
			width: 140,
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			className: activeColumnSearch === 'ID' ? 'active-column-search' : '',
			render: (a) => <p className="font-weight-primary">{a}</p>
		},
		{
			title: 'Khóa học',
			width: 200,
			dataIndex: 'CourseName'
		},
		{
			title: 'Chương trình',
			width: 120,
			dataIndex: 'ProgramName'
		},
		{
			title: 'Bắt đầu',
			width: 120,
			dataIndex: 'StartDay',
			render: (a) => <p>{a ? moment(a).format('DD/MM/YYYY') : ''}</p>
		},
		{
			title: 'Kết thúc',
			width: 120,
			dataIndex: 'EndDay',
			render: (a) => <p>{a ? moment(a).format('DD/MM/YYYY') : ''}</p>
		},
		{
			title: 'Ngày tạo',
			width: 120,
			dataIndex: 'CreatedOn',
			render: (a) => <p>{moment(a).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Chấp nhận',
			width: 120,
			dataIndex: 'Accept',
			render: (Accept, record: IContractCustomerList, idx) => (
				<Switch
					checkedChildren="Có"
					unCheckedChildren="Không"
					checked={record.Accept}
					size="default"
					onChange={(checked) => onChangeStatus(checked, record.ID, idx)}
				/>
			)
		},
		{
			title: '',
			width: 120,
			render: (record) => (
				<>
					<Link
						href={{
							pathname: '/customer/contract/contract-customer-list/contract-customer-detail/[slug]',
							query: { slug: record.ID }
						}}
					>
						<Tooltip title="Xem chi tiết">
							<a className="btn btn-icon view">
								<Eye />
							</a>
						</Tooltip>
					</Link>
				</>
			)
		}
	];

	return (
		<PowerTable
			loading={isLoading}
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Danh sách học viên có hợp đồng"
			// TitleCard={<StudyTimeForm showAdd={true} />}
			dataSource={contractCustomerList}
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
		/>
	);
}
