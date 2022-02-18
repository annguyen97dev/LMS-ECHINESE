import { Form, Input, Modal } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { IVideoCategoryLevel } from '~/apiBase/types/video-category-level/video-category-level';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import { RotateCcw, Trash } from 'react-feather';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import ModalTypeVideoCourse from '~/components/VideoCourse/ModalTypeVideoCourse';

export interface IConfigTypeVideoCourseProps {}

const ConfigTypeVideoCourse = (props: IConfigTypeVideoCourseProps) => {
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [dataSource, setDataSource] = useState<IVideoCategoryLevel[]>();
	const { showNoti, userInformation, pageSize } = useWrap();

	const [typeOfModal, setTypeOfModal] = useState('');
	const [filters, setFilters] = useState({
		pageSize: pageSize,
		pageIndex: 1
	});

	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex
		});
	};

	const columns = [
		{ title: 'ID', width: 100, dataIndex: 'ID' },
		{ title: 'Tên loại', width: 150, dataIndex: 'CategoryName' },
		{ title: 'Người tạo', width: 150, dataIndex: 'CreatedBy' },
		{ title: 'Ngày tạo', width: 150, dataIndex: 'CreatedOn', render: (date) => <span>{moment(date).format('DD-MM-YYYY')}</span> },
		{
			title: '',
			width: 100,
			dataIndex: 'Action',
			render: (text, data) => (
				<>
					<ModalTypeVideoCourse
						typeOfModal="adit"
						onFetchData={() => {
							setFilters({ ...filters });
						}}
						dataItem={data}
					/>
					<DeleteTableRow text="loại video này" title="Xóa loại video" handleDelete={() => handleDeleteTypeOfVideo(data)} />
				</>
			)
		}
	];

	const handleDeleteTypeOfVideo = async (data) => {
		try {
			let res = await VideoCourseCategoryApi.add({ ID: data.ID, CategoryName: data.CategoryName, Enable: false });
			if (res.status === 200) {
				showNoti('success', 'Xóa thành công!');
				getAllType();
			}
		} catch (error) {}
	};

	const getAllType = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await VideoCourseCategoryApi.getAll({ pageSize: pageSize, pageIndex: 1 });
			if (res.status === 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	useEffect(() => {
		getAllType();
	}, [filters]);

	return (
		<>
			<PowerTable
				loading={isLoading}
				totalPage={totalPage}
				dataSource={dataSource}
				getPagination={getPagination}
				columns={columns}
				TitleCard={
					<>
						<ModalTypeVideoCourse
							typeOfModal="add"
							onFetchData={() => {
								setFilters({ ...filters });
							}}
						/>
					</>
				}
				Extra={<h5>Danh sách loại video</h5>}
			/>
		</>
	);
};

ConfigTypeVideoCourse.layout = LayoutBase;
export default ConfigTypeVideoCourse;
