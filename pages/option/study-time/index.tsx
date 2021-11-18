import React, { useEffect, useState } from 'react';
import PowerTable from '~/components/PowerTable';

import SortBox from '~/components/Elements/SortBox';
import { Switch } from 'antd';
import StudyTimeForm from '~/components/Global/Option/StudyTimeForm';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import { studyTimeApi } from '~/apiBase';
import FilterStudyTime from '~/components/Global/Option/FilterTable/FilterStudyTime';

let pageIndex = 1;

const dataOption = [
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Time giảm dần'
	},
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Time tăng dần '
	}
];

const StudyTime = () => {
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IStudyTime[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA COURSE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await studyTimeApi.getAll(todoApi);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));
			res.status == 204 && showNoti('danger', 'Không có dữ liệu') && setDataSource([]);
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
				res = await studyTimeApi.update(dataSubmit);

				if (res.status == 200) {
					let newDataSource = [...dataSource];
					newDataSource.splice(indexRow, 1, dataSubmit);
					setDataSource(newDataSource);
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
				res = await studyTimeApi.add(dataSubmit);
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
			let res = await studyTimeApi.update(dataChange);
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

	// HANDLE RESET

	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// -------------- HANDLE FILTER -------------------
	const handleFilter = (value) => {
		console.log('Value in here: ', value);
		setTodoApi({
			...listTodoApi,
			...value
		});
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	const columns = [
		{
			title: 'Ca học',
			dataIndex: 'Name',
			key: 'name'
		},
		{
			title: 'Thời gian',
			dataIndex: 'Time',
			key: 'time'

			// ...FilterColumn("StudyTime")
		},
		{ title: 'Bắt đầu', dataIndex: 'TimeStart' },
		{ title: 'Kết thúc', dataIndex: 'TimeEnd' },
		{
			title: 'Trạng thái',
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
			render: (text, data, index) => (
				<>
					<StudyTimeForm
						getIndex={() => setIndexRow(index)}
						index={index}
						rowData={data}
						rowID={data.ID}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}
					/>
				</>
			)
		}
	];

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex
		});
	};

	return (
		<PowerTable
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			loading={isLoading}
			addClass="basic-header modal-medium table-study-time"
			TitlePage="Danh sách ca học"
			TitleCard={<StudyTimeForm isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />}
			dataSource={dataSource}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterStudyTime handleReset={handleReset} handleFilter={(value: any) => handleFilter(value)} />
					<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
				</div>
			}
		/>
	);
};
StudyTime.layout = LayoutBase;
export default StudyTime;
