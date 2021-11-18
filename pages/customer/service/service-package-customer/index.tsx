import { dataService } from 'lib/customer/dataCustomer';
import React from 'react';
import SortBox from '~/components/Elements/SortBox';
import FilterTable from '~/components/Global/CourseList/FilterTable';
import PaymentService from '~/components/Global/Customer/Service/PaymentService';
import StudyTimeForm from '~/components/Global/Option/StudyTimeForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
CustomerServicePackage.layout = LayoutBase;
export default function CustomerServicePackage() {
	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'nameStudent',
			...FilterColumn('nameStudent'),
			render: (a) => <p className="font-weight-primary">{a}</p>
		},
		{
			title: 'Tên set',
			dataIndex: 'pkgName',
			...FilterColumn('pkgName'),
			render: (a) => <p className="font-weight-black">{a}</p>
		},
		{
			title: 'Giá tiền',
			dataIndex: 'testCost',
			...FilterColumn('testCost'),
			render: (a) => <p className="font-weight-black">{a}</p>
		},
		{
			title: 'Giảm giá',
			dataIndex: 'pkgDiscount',
			...FilterColumn('pkgDiscount')
		},
		{ title: 'Ngày mua', dataIndex: 'apmDate', ...FilterDateColumn('apmDate') },
		{
			title: 'Trạng thái',
			dataIndex: 'pgkPayment',
			render: (pgkPayment) => {
				return (
					<>
						{pgkPayment == 'Đã thanh toán' ? (
							<span className="tag green">{pgkPayment}</span>
						) : (
							<span className="tag red">{pgkPayment}</span>
						)}
					</>
				);
			},
			filters: [
				{
					text: 'Đã thanh toán',
					value: 'Đã thanh toán'
				},
				{
					text: 'Chưa thanh toán',
					value: 'Chưa thanh toán'
				}
			],
			onFilter: (value, record) => record.pgkPayment.indexOf(value) === 0
		},
		{
			title: '',
			render: () => <PaymentService />
		}
	];

	return (
		<PowerTable
			addClass="basic-header"
			TitlePage="Danh sách khách mua bộ đề"
			// TitleCard={<StudyTimeForm showAdd={true} />}
			dataSource={dataService}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterTable />
					<SortBox dataOption={dataService} />
				</div>
			}
		/>
	);
}
