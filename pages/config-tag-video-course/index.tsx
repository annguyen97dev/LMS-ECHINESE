import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { IVideoCategoryLevel } from '~/apiBase/types/video-category-level/video-category-level';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import ModalTypeVideoCourse from '~/components/VideoCourse/ModalTypeVideoCourse';
import { VideoCourseLevelApi, VideoCuorseTag } from '~/apiBase/video-course-store/level';
import ModalLevelVideoCourse from '~/components/VideoCourse/ModalLevelVideo';
import ModalTagVideoCourse from '~/components/VideoCourse/ModalTagVideo';

export interface IConfigTagVideoCourseProps {}

const ConfigTagVideoCourse = (props: IConfigTagVideoCourseProps) => {
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [dataSource, setDataSource] = useState<IVideoTags[]>();
	const { showNoti, pageSize } = useWrap();

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
		{ title: 'Tags', width: 150, dataIndex: 'Name' },
		{ title: 'Người tạo', width: 150, dataIndex: 'CreatedBy' },
		{ title: 'Ngày tạo', width: 150, dataIndex: 'CreatedOn', render: (date) => <span>{moment(date).format('DD-MM-YYYY')}</span> },
		{
			title: '',
			width: 100,
			dataIndex: 'Action',
			render: (text, data) => (
				<>
					<ModalTagVideoCourse
						typeOfModal="adit"
						onFetchData={() => {
							setFilters({ ...filters });
						}}
						dataItem={data}
					/>
					<DeleteTableRow text="cấp độ video này" title="Xóa cấp độ video" handleDelete={() => handleDeleteTypeOfVideo(data)} />
				</>
			)
		}
	];

	const handleDeleteTypeOfVideo = async (data) => {
		try {
			let res = await VideoCuorseTag.add({ ID: data.ID, Name: data.Name, Enable: false });
			if (res.status === 200) {
				showNoti('success', 'Xóa thành công!');
				getAllType();
			}
		} catch (error) {}
	};

	const getAllType = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await VideoCuorseTag.getAll();
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
						<ModalTagVideoCourse
							typeOfModal="add"
							onFetchData={() => {
								setFilters({ ...filters });
							}}
						/>
					</>
				}
				Extra={<h5>Danh sách cấp độ video</h5>}
			/>
		</>
	);
};

ConfigTagVideoCourse.layout = LayoutBase;
export default ConfigTagVideoCourse;
