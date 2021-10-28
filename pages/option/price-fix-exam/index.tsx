import React, { useEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { priceFixExamApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import PowerTable from '~/components/PowerTable';
import PriceFixExamForm from '~/components/Global/Option/PriceFixExam/PriceFixExamForm';
import { numberWithCommas } from '~/utils/functions';

const PriceFixExam = () => {
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IPriceFixExam[]>([]);
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
		pageIndex: currentPage
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await priceFixExamApi.getAll(todoApi);
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

	const onFetchData = () => {
		setCurrentPage(1);
		setTodoApi(listTodoApi);
	};

	const onUpdateData = (index, dataSubmit) => {
		dataSource.splice(index, 1, dataSubmit);
		setDataSource([...dataSource]);
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber
		});
	};

	const columns = [
		{
			title: 'Level',
			dataIndex: 'SetPackageLevel',

			render: (level) => {
				// return <p className="font-weight-black">{(level == 1 && 'Dễ') || (level == 2 && 'Trung bình') || (level == 3 && 'Khó')}</p>;
				return <p className="font-weight-black">{level}</p>;
			}
		},
		{
			title: 'Giá',
			dataIndex: 'Price',
			render: (text) => {
				return <p className="font-weight-black">{numberWithCommas(text)}</p>;
			}
		},
		{
			render: (text, data, index) => (
				<PriceFixExamForm dataRow={data} onUpdateData={(dataSubmit) => onUpdateData(index, dataSubmit)} />
			)
		}
	];

	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	return (
		<>
			<PowerTable
				Size="table-super-small"
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Giá mua lượt chấm"
				TitleCard={<PriceFixExamForm onFetchData={onFetchData} />}
				dataSource={dataSource}
				columns={columns}
				// Extra={
				// 	<div className="extra-table">
				// 		<FilterProgram handleReset={handleReset} dataLevel={dataLevel} handleFilter={(value: any) => handleFilter(value)} />
				// 		<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
				// 	</div>
				// }
			/>
		</>
	);
};

PriceFixExam.layout = LayoutBase;
export default PriceFixExam;
