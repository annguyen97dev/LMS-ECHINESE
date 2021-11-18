import React from 'react';
import 'antd/dist/antd.css';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { parseToMoney } from '~/utils/functions';
import { Eye } from 'react-feather';
import ModalCreateVideoCourse from '../modal-create-video-course';

const columnsVideoCourse = [
	{
		title: 'Tên khóa học',
		dataIndex: 'VideoCourseName',
		key: 'VideoCourseName'
	},
	{
		title: 'Ngày tạo',
		dataIndex: 'CreatedOn',
		key: 'CreatedOn'
	},
	{
		title: 'Số lượng video',
		dataIndex: 'TotalVideoCourseSold',
		key: 'TotalVideoCourseSold',
		align: 'center'
	},
	{
		title: 'Giá gốc',
		dataIndex: 'OriginalPrice',
		key: 'OriginalPrice',
		render: (value) => <span className="vc-store_table_custom_value">{parseToMoney(value)}</span>
	},
	{
		title: 'Giá bán',
		dataIndex: 'SellPrice',
		key: 'SellPrice',
		render: (value) => <span className="vc-store_table_custom_value">{parseToMoney(value)}</span>
	},
	{
		title: 'Doanh thu',
		dataIndex: 'RevenueEachVideoCourse',
		key: 'RevenueEachVideoCourse',
		render: (value) => <span className="vc-store_table_custom_value">{parseToMoney(value)}</span>
	},
	{
		title: 'Thao tác',
		dataIndex: 'Action',
		key: 'action',
		render: (Action, data) => (
			<>
				<Link
					href={{
						pathname: '/option/program/program-detail/[slug]',
						query: { slug: data.ID }
					}}
				>
					<Tooltip title="Chi tiết chương trình">
						<button className="btn btn-icon">
							<Eye />
						</button>
					</Tooltip>
				</Link>

				{/* <ModalCreateVideoCourse
					getIndex={() => setIndexRow(index)}
					_onSubmit={(data: any) => _onSubmit(data)}
					programID={data.ID}
					rowData={data}
					dataGrade={dataGrade}
					showAdd={true}
					isLoading={isLoading}
				/> */}
			</>
		)
	}
];

export default columnsVideoCourse;
