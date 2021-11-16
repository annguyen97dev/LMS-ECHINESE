import React, { useState } from 'react';
import { Table, Card, Tag, Select, Modal } from 'antd';
import { FormOutlined, EyeOutlined } from '@ant-design/icons';
import TitlePage from '~/components/TitlePage';
import SearchBox from '~/components/Elements/SearchBox';
import Link from 'next/link';
import PowerTable from '~/components/PowerTable';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import FilterBox from '~/components/Elements/FilterBox';
import { Filter, Eye, CheckCircle } from 'react-feather';
import { Tooltip } from 'antd';
import FilterTable from '~/components/Global/TeachHoursList/FilterTable';

import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import LayoutBase from '~/components/LayoutBase';

const TeachHoursCenter = () => {
	const [showFilter, showFilterSet] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const [isModalVisible, setIsModalVisible] = useState(false);

	const expandedRowRender = () => {
		const { Option } = Select;

		return (
			<>
				<div className="feedback-detail-text">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum, explicabo laboriosam. Molestias harum reiciendis quam
					suscipit accusamus id voluptatem doloribus. Consectetur natus voluptatibus et atque quibusdam vero iure reiciendis
					ratione?
				</div>
			</>
		);
	};

	const dataSource = [];

	for (let i = 0; i < 50; i++) {
		dataSource.push({
			key: i,
			Teacher: 'Mr.Bean',
			Status: '',
			Role: 'Manager',
			TypeClass: 'Toeic',
			StudyTime: 5,
			Attendance: 'Text',
			AttendanceNone: 'Text',
			TotalHours: '20',
			DutyTime: '20',
			TotalDutyTime: '22'
		});
	}

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

	const columns = [
		{
			title: 'Giáo viên',
			dataIndex: 'Teacher',
			key: 'teacher',
			...FilterColumn('Teacher'),

			render: (text) => <p className="font-weight-primary">{text}</p>
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
			title: 'Vai trò',
			dataIndex: 'Role',
			key: 'role',
			...FilterColumn('role'),

			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Loại lớp',
			dataIndex: 'TypeClass',
			key: 'typeclass',
			...FilterColumn('TypeClass')
		},

		{
			title: 'Giờ dạy',
			dataIndex: 'StudyTime',
			key: 'studytime'
		},
		{
			title: 'Điểm danh',
			dataIndex: 'Attendance',
			key: 'attendance'
		},
		{
			title: 'Không điểm danh',
			dataIndex: 'AttendanceNone',
			key: 'attendancenone'
		},
		{
			title: 'Tổng giờ',
			dataIndex: 'TotalHours',
			key: 'totalhourss'
		},
		{
			title: 'Giờ trực',
			dataIndex: 'DutyTime',
			key: 'dutytime'
		},
		{
			title: 'Tổng giờ trực',
			dataIndex: 'TotalDutyTime',
			key: 'TotalDutyTime'
		}
	];

	return (
		<>
			<Modal title="Xác nhận thông tin" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<p>Bạn chắc chắn đã xử lí xong phản hồi</p>
			</Modal>
			<ExpandTable
				columns={columns}
				dataSource={dataSource}
				TitlePage="Giờ dạy của giáo viên theo trung tâm"
				Extra={
					<div className="extra-table">
						<FilterTable />
						<SortBox dataOption={dataOption} />
					</div>
				}
				expandable={{ expandedRowRender }}
			></ExpandTable>
		</>
	);
};

TeachHoursCenter.layout = LayoutBase;
export default TeachHoursCenter;
