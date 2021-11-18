import React, { useState } from 'react';
import { Table, Card, Tag, Tooltip } from 'antd';

import SearchBox from '~/components/Elements/SearchBox';
import Link from 'next/link';
import PowerTable from '~/components/PowerTable';
import SortBox from '~/components/Elements/SortBox';

import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';

import { Eye, Filter, Search } from 'react-feather';
import LayoutBase from '~/components/LayoutBase';

const dataOption = [
	{
		text: 'Option 1',
		value: 'option 1'
	},
	{
		text: 'Option 2',
		value: 'option 2'
	},
	{
		text: 'Option 3',
		value: 'option 3'
	}
];

const ExerciseCheckList = () => {
	const dataSource = [];

	for (let i = 0; i < 50; i++) {
		dataSource.push({
			key: i,
			ID: '3242',
			Student: 'Hùng Nguyễn',
			Course: '[ZIM – 35 Võ Oanh] - AM - Intermediate, 18/11, 19:00-21:00,',
			RandomLesson: 'Bài random lần thứ: 189',
			Checker: 'An An',
			Status: '',
			Rating: 5,
			Action: ''
		});
	}

	const columns = [
		{
			title: 'ID',
			dataIndex: 'ID',
			key: 'id',
			...FilterColumn('ID')
		},
		{
			title: 'Học viên',
			dataIndex: 'Student',
			key: 'student',
			...FilterColumn('Student'),

			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Khóa học',
			dataIndex: 'Course',
			key: 'course',
			...FilterColumn('Course'),

			render: (text) => <p className="font-weight-black">{text}</p>
		},

		{
			title: 'Người kiểm tra',
			dataIndex: 'Checker',
			key: 'checker',
			...FilterColumn('Checker')
		},

		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			key: 'status',
			filters: [
				{
					text: 'Active',
					value: 'active'
				},
				{
					text: 'Unactive',
					value: 'unactive'
				}
			],
			onFilter: (value, record) => record.Status.indexOf(value) === 0,
			render: (Status) => <span className="tag green">Active</span>
		},
		{
			title: 'Đánh giá',
			dataIndex: 'Rating',
			key: 'rating'
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			key: 'action',
			render: (Action) => (
				<Link
					href={{
						pathname: '/staff/exercise-check-list/[slug]',
						query: { slug: 2 }
					}}
				>
					<a className="btn btn-icon">
						<Tooltip title="Chi tiết">
							<Eye />
						</Tooltip>
					</a>
				</Link>
			)
		}
	];

	return (
		<>
			<PowerTable
				columns={columns}
				dataSource={dataSource}
				TitlePage="Danh sách duyệt bài"
				Extra={
					<div className="extra-table">
						<SortBox dataOption={dataOption} />
					</div>
				}
			/>
		</>
	);
};

ExerciseCheckList.layout = LayoutBase;
export default ExerciseCheckList;
