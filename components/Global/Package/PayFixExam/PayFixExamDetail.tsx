import React, { useEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { priceFixExamApi, payFixExamApi, studentApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import PowerTable from '~/components/PowerTable';
import { numberWithCommas } from '~/utils/functions';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PayFixExamForm from './PayFixExamForm';
import SortBox from '~/components/Elements/SortBox';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import { useRouter } from 'next/router';
import AcceptPaid from './AcceptPaid';
import NestedTable from '~/components/Elements/NestedTable';

const PayFixExam = (props) => {
	// const router = useRouter();
	// const { slug } = router.query;
	// console.log('SLUG: ', slug);
	const { studentID, level, onUpdateData, role } = props;
	let listFieldFilter = {
		pageIndex: 1,
		StudentID: null,
		SetPackageLevel: null
	};
	const dataOption = [
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
			name: 'SetPackageLevel',
			title: 'Level',
			col: 'col-md-12 col-12',
			type: 'select',
			optionList: null,
			value: null
		}
	]);
	const [dataStudent, setDataStudent] = useState([]);
	const [dataLevel, setDataLevel] = useState([]);
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IPayFixExam[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const listTodoApi = {
		StudentID: studentID,
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		SetPackageLevel: level
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

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

	// GET DATA STUDENT
	const getDataStudent = async () => {
		try {
			let res = await studentApi.getAll({ selectAll: true, Enable: true });
			if (res.status === 200) {
				let newData = res.data.data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				setDataStudent(newData);
				setDataFunc('StudentID', newData);
			}
		} catch (error) {
			console.log('Error Student: ', error.message);
		}
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await payFixExamApi.getAll(todoApi);
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

	// const onUpdateData = (index, dataSubmit) => {
	// 	dataSource.splice(index, 1, dataSubmit);
	// 	setDataSource([...dataSource]);
	// };

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

	const handleAccept = async (ID) => {
		let data = {
			ID: ID,
			Approval: 3,
			Enable: true
		};
		try {
			let res = await payFixExamApi.update(data);
			if (res.status == 200) {
				setTodoApi({ ...todoApi });
				onUpdateData && onUpdateData();
			}
		} catch (error) {}
	};

	const columns = [
		{
			title: 'Level',
			dataIndex: 'SetPackageLevel',
			align: 'center'
		},
		{
			title: 'Số tiền thanh toán',
			dataIndex: 'Paid',
			render: (value) => {
				return <p className="font-weight-black">{numberWithCommas(value)}</p>;
			}
		},
		{
			title: 'Số lượt chấm',
			dataIndex: 'Amount',
			align: 'center'
		},
		{
			title: 'Phương thức thanh toán',
			dataIndex: 'PaymentMethodsName'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Approval',
			render: (type) => {
				return (
					<>
						{type == 1 && <span className="tag red">Chưa thanh toán</span>}
						{type == 2 && <span className="tag yellow">Chờ duyệt</span>}
						{type == 3 && <span className="tag green">Đã duyệt</span>}
					</>
				);
			}
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note'
		},
		{
			title: 'Thanh toán',
			dataIndex: 'DonePaid',
			align: 'center',
			render: (type) => (
				<>
					{type == false && <CloseOutlined className="delete custom" />}
					{type == true && <CheckOutlined className="success custom" />}
				</>
			)
		},

		{
			align: 'center',

			render: (text, data, index) => (
				<>{role == 1 && data.Approval == 2 && <AcceptPaid handleAccept={() => handleAccept(data.ID)} />}</>
			)
		}
	];

	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	useEffect(() => {
		getDataStudent();
		getDataLevel();
	}, []);

	return (
		<>
			<NestedTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage=""
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
			/>
		</>
	);
};

export default PayFixExam;
