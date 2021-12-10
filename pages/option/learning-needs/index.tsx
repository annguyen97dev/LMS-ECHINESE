import React, { useEffect, useState } from 'react';
import LearningNeedsForm from '~/components/Global/Option/LearningNeedsForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import { learningNeeds } from './../../../apiBase/options/learning-needs';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';

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

	const handleDeleteRow = async (record) => {
		setIsLoading({ type: 'DELETE', status: true });
		try {
			let res = await learningNeeds.update({ ID: record.ID, Name: record.Name, Enable: false });
			if (res.status == 200) {
				console.log('delete');
				showNoti('success', 'Xóa thành công!');
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'DELETE', status: false });
		}
	};

	const columns = [
		{
			title: 'Nhu cầu học',
			dataIndex: 'Name',
			width: 200,
			render: (text) => {
				return <p className="font-weight-black">{text}</p>;
			}
		},
		{
			title: 'ID',
			dataIndex: 'ID',
			width: 80,
			render: (text) => {
				return <p>{text}</p>;
			}
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			width: 150,
			render: (text) => {
				return <p>{text}</p>;
			}
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			width: 150,
			render: (text, record) => {
				return (
					<>
						<LearningNeedsForm setTodoApi={() => setTodoApi({ ...todoApi })} type="edit" record={record} />
						<LearningNeedsForm setTodoApi={() => setTodoApi({ ...todoApi })} type="deleterow" record={record} />
					</>
				);
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
				TitleCard={<LearningNeedsForm setTodoApi={() => setTodoApi({ ...todoApi })} type="add" />}
			></PowerTable>
		</>
	);
};
LearningNeeds.layout = LayoutBase;
export default LearningNeeds;
