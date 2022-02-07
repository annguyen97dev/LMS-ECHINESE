import { Card, DatePicker, Radio, Select, Skeleton } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';

const StatisticalTotalLessonOfTeacher = (props) => {
	const [dataSource, setDataSource] = useState<IStatTotalLessonOfTeacher[]>();
	const { pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [filters, setFilters] = useState({
		pageSize: pageSize,
		pageIndex: 1,
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1
	});
	const [typeView, setTypeView] = useState(1);

	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex
		});
	};

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await statisticalApi.getStatisticalTotalLessonsOfTeacher(filters);
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
		{ title: 'Tổng số bài giảng', width: 180, dataIndex: 'TotalLesson' },
		{ title: 'Email', width: 150, dataIndex: 'Email' },
		{ title: 'Số điện thoại', width: 150, dataIndex: 'Mobile' }
	];

	const handleChangeDate = (value) => {
		if (typeView == 1) {
			setFilters({ ...filters, month: Number(moment(value).format('MM')), year: Number(moment(value).format('YYYY')) });
		} else if (typeView == 2) {
			setFilters({ ...filters, month: 0, year: Number(moment(value).format('YYYY')) });
		}
	};

	const renderExtra = () => {
		if (typeView == 1) {
			return (
				<>
					<DatePicker onChange={handleChangeDate} picker="month" className="mr-2" style={{ width: 130 }} />
				</>
			);
		} else if (typeView == 2) {
			return (
				<>
					<DatePicker onChange={handleChangeDate} picker="year" className="mr-2" style={{ width: 130 }} />
				</>
			);
		}
	};

	const onChange = (event) => {
		setTypeView(event.target.value);
	};

	const extra = () => {
		return (
			<>
				{renderExtra()}
				<Radio.Group onChange={onChange} optionType="button" buttonStyle="solid" value={typeView}>
					<Radio.Button value={1}>Tháng</Radio.Button>
					<Radio.Button value={2}>Năm</Radio.Button>
				</Radio.Group>
			</>
		);
	};

	const renderTable = () => {
		return (
			<PowerTable
				loading={isLoading}
				totalPage={totalPage}
				dataSource={dataSource}
				getPagination={getPagination}
				columns={columns}
				Extra={
					<>
						<h4 style={{ textTransform: 'uppercase' }}>Thông kê số lớp dạy của giáo viên</h4>
					</>
				}
				TitleCard={extra()}
			/>
		);
	};

	return (
		<>
			{isLoading.type === 'GET_ALL' && isLoading.status == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">{renderTable()}</div>
				</div>
			)}
		</>
	);
};

export default StatisticalTotalLessonOfTeacher;
