import React, { useState, useEffect } from 'react';
import { useWrap } from '~/context/wrap';
import PowerTable from '~/components/PowerTable';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import { Skeleton } from 'antd';

const StatisticalRankTeacher = (props) => {
	const [dataSource, setDataSource] = useState<IStatRankTeacherByLessons[]>();
	const { pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [filters, setFilters] = useState({
		pageIndex: 1,
		pageSize: pageSize
	});

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await statisticalApi.getStatisticalRankTeacherByLessons(filters);
			if (res.status === 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setDataSource([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	useEffect(() => {
		getDataSource();
	}, [filters]);

	const columns = [
		{
			title: 'Hạng',
			width: 120,
			dataIndex: 'Trophy',
			render: (text, data) =>
				(data.MyRank === 1 && (
					<img
						style={{ width: 40, height: 40, borderRadius: '100%' }}
						src={data.Avatar.length > 0 ? data.Avatar : '/images/first-place.jpg'}
						alt="trophy img"
					/>
				)) ||
				(data.MyRank === 2 && (
					<img
						style={{ width: 40, height: 40, borderRadius: '100%' }}
						src={data.Avatar.length > 0 ? data.Avatar : '/images/second-place.jpg'}
						alt="trophy img"
					/>
				)) ||
				(data.MyRank === 3 && (
					<img
						style={{ width: 40, height: 40, borderRadius: '100%' }}
						src={data.Avatar.length > 0 ? data.Avatar : '/images/third-place.jpg'}
						alt="trophy img"
					/>
				)) ||
				(data.MyRank > 3 && <p className="pl-3 font-weight-black">{data.MyRank}</p>)
		},
		{
			title: 'Ảnh đại diện',
			width: 120,
			dataIndex: 'Avatar',
			render: (text, data) => (
				<img
					style={{ width: 40, height: 40, borderRadius: '100%' }}
					src={data.Avatar.length > 0 ? data.Avatar : '/images/user.png'}
					alt="avatar img"
				/>
			)
		},
		{ title: 'Họ tên', width: 150, dataIndex: 'FullNameUnicode' },
		{ title: 'Tổng số bài giảng', width: 180, dataIndex: 'TotalLesson' }
	];

	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex
		});
	};

	return (
		<>
			{isLoading.type === 'GET_ALL' && isLoading.status == true ? (
				<div className="col-xl-6 col-12">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<PowerTable
							loading={isLoading}
							totalPage={totalPage}
							dataSource={dataSource}
							getPagination={getPagination}
							columns={columns}
							Extra={
								<>
									<h4 style={{ textTransform: 'uppercase' }}>Thông kê xếp hạng giáo viên</h4>
								</>
							}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRankTeacher;
