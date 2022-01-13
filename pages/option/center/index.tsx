import { Switch, Tooltip } from 'antd';
// import FilterTable from "~/components/Global/CourseList/FilterTable";
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { Eye } from 'react-feather';
import { areaApi, branchApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import CenterForm from '~/components/Global/Option/CenterForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';

// let pageIndex = 1;

let listFieldSearch = {
	pageIndex: 1,
	branchCode: null,
	branchName: null
};

const dataOption = [
	{
		dataSort: {
			sort: 1,
			sortType: false
		},
		text: 'Mã giảm dần'
	},
	{
		dataSort: {
			sort: 1,
			sortType: true
		},
		text: 'Mã tăng dần'
	},
	{
		dataSort: {
			sort: 2,
			sortType: false
		},
		text: 'Tên giảm dần'
	},
	{
		dataSort: {
			sort: 2,
			sortType: true
		},
		text: 'Tên tăng dần '
	}
];

const Center = () => {
	const [center, setCenter] = useState<IBranch[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataArea, setDataArea] = useState<IArea[]>(null);
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		branchCode: null,
		branchName: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// -------------- GET DATA CENTER ----------------
	const getDataCenter = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await branchApi.getAll(todoApi);
			res.status == 200 && (setCenter(res.data.data), setTotalPage(res.data.totalRow));
			res.status == 204 && showNoti('danger', 'Không có dữ liệu') && setCenter([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	//GET DATA AREA
	const getAllArea = () => {
		(async () => {
			try {
				const res = await areaApi.getAll({
					pageIndex: 1,
					pageSize: 9999
				});
				res.status == 200 && setDataArea(res.data.data);
			} catch (err) {
				showNoti('danger', err);
			}
		})();
	};

	// ---------------- AFTER SUBMIT -----------------
	const afterPost = (mes) => {
		showNoti('success', mes);
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
				res = await branchApi.update(dataSubmit);

				if (res.status == 200) {
					let newDataSource = [...center];
					newDataSource.splice(indexRow, 1, dataSubmit);
					setCenter(newDataSource);
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
			try {
				res = await branchApi.add(dataSubmit);
				res?.status == 200 && afterPost(res.data.message);
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

	// ----------------- TURN OF ------------------------
	const changeStatus = async (checked: boolean, idRow: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		let dataChange = {
			ID: idRow,
			Enable: checked
		};

		try {
			let res = await branchApi.update(dataChange);
			res.status == 200 && setTodoApi({ ...todoApi });
		} catch (error) {
			showNoti('danger', error.Message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		// pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageNumber
		});
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

	// -------------- CHECK FIELD ---------------------
	const checkField = (valueSearch, dataIndex) => {
		let newList = { ...listFieldSearch };
		Object.keys(newList).forEach(function (key) {
			console.log('key: ', key);
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

	// ------------ ON SEARCH -----------------------
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

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataCenter();
	}, [todoApi]);

	useEffect(() => {
		getAllArea();
	}, []);

	const columns = [
		{
			title: 'Mã trung tâm',
			width: 150,
			dataIndex: 'BranchCode',
			// ...FilterColumn("BranchCode"),
			...FilterColumn('branchCode', onSearch, handleReset, 'text')
		},

		{
			title: 'Tên trung tâm',
			dataIndex: 'BranchName',
			width: 150,
			...FilterColumn('branchName', onSearch, handleReset, 'text')
		},
		{ title: 'Địa chỉ', width: 150, dataIndex: 'Address' },
		{
			title: 'Số điện thoại',
			width: 150,
			dataIndex: 'Phone'
		},
		{
			title: 'Email',
			dataIndex: 'Email'
		},
		{
			title: 'Trạng thái',
			width: 100,
			dataIndex: 'Enable',
			render: (Enable, record) => (
				<>
					<Switch
						checkedChildren="Hiện"
						unCheckedChildren="Ẩn"
						checked={Enable}
						size="default"
						onChange={(checked) => changeStatus(checked, record.ID)}
					/>
				</>
			)
		},
		{
			width: 100,
			render: (text, data, index) => (
				<>
					<Link
						href={{
							pathname: '/option/center/rooms-detail/[slug]',
							query: { slug: `${data.ID}` }
						}}
					>
						<Tooltip title="Xem phòng">
							<button className="btn btn-icon">
								<Eye />
							</button>
						</Tooltip>
					</Link>

					<Tooltip title="Cập nhật trung tâm">
						<CenterForm
							dataArea={dataArea}
							getIndex={() => setIndexRow(index)}
							index={index}
							branchId={data.ID}
							rowData={data}
							isLoading={isLoading}
							_onSubmit={(data: any) => _onSubmit(data)}
						/>
					</Tooltip>
				</>
			)
		}
	];

	return (
		<Fragment>
			<PowerTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Danh sách trung tâm"
				TitleCard={<CenterForm dataArea={dataArea} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />}
				dataSource={center}
				columns={columns}
				Extra={
					<div className="extra-table">
						<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
					</div>
				}
			/>
		</Fragment>
	);
};
Center.layout = LayoutBase;
export default Center;
