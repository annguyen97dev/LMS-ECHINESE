import React, { useEffect, useState } from 'react';
import LearningNeedsForm from '~/components/Global/Option/LearningNeedsForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import { learningNeeds } from './../../../apiBase/options/learning-needs';

const LearningNeeds = () => {
	const { showNoti, pageSize } = useWrap();
	const [dataSource, setDataSource] = useState<ILearningNeeds[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPage, setTotalPage] = useState(null);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [todoApi, setTodoApi] = useState({
		pageIndex: 1,
		pageSize: pageSize
	});

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await learningNeeds.getAll(todoApi);
			if (res.status == 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				setDataSource([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const columns = [
		{
			title: 'Nhu cầu học',
			dataIndex: 'Name',
			render: (text) => {
				return <p className="font-weight-black">{text}</p>;
			}
		},
		{
			title: 'ID',
			dataIndex: 'ID',
			render: (text) => {
				return <p>{text}</p>;
			}
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			render: (text) => {
				return <p>{text}</p>;
			}
		}
	];

	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber,
			pageSize: pageSize
		});
	};

	return (
		<>
			<PowerTable
				loading={isLoading}
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={getPagination}
				dataSource={dataSource}
				columns={columns}
				TitlePage="Bảng nhu cầu học"
				TitleCard={<LearningNeedsForm />}
			></PowerTable>
		</>
	);
};
LearningNeeds.layout = LayoutBase;
export default LearningNeeds;
