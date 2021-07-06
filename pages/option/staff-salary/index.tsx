import React from 'react';
import SortBox from '~/components/Elements/SortBox';
import FilterStaffSalaryTable from '~/components/Global/Option/FilterTable/FilterStaffSalaryTable';
import StaffSalaryForm from '~/components/Global/Option/StaffSalaryForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {data} from '../../../lib/option/dataOption2';
const StaffSalary = () => {
	const columns = [
		{title: 'Full name', dataIndex: 'staff', ...FilterColumn('staff')},
		{
			title: 'Username',
			dataIndex: 'userNameStaff',
			...FilterColumn('userNameStaff'),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			// ...FilterColumn("email")
		},
		{title: 'Role', dataIndex: 'staffRole', ...FilterColumn('staffRole')},
		{title: 'Salary', dataIndex: 'price'},
		{
			title: 'Type Salary',
			dataIndex: 'typeSalary',
			...FilterColumn('typeSalary'),
		},
		{title: 'Modified By', dataIndex: 'modBy', ...FilterColumn('modBy')},
		{
			title: 'Modified Date',
			dataIndex: 'modDate',
			// ...FilterDateColumn('modDate'),
		},
		{
			render: () => (
				<>
					<StaffSalaryForm showIcon={true} />
				</>
			),
		},
	];

	return (
		<PowerTable
			addClass="basic-header"
			TitlePage="Staff salary"
			TitleCard={<StaffSalaryForm showAdd={true} />}
			dataSource={data}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterStaffSalaryTable />
					<SortBox />
				</div>
			}
		/>
	);
};
StaffSalary.layout = LayoutBase;
export default StaffSalary;
