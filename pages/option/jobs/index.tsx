import React from 'react';
import PowerTable from '~/components/PowerTable';
import {data} from '../../../lib/option/dataOption2';
import JobForm from '~/components/Global/Option/JobForm';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import SortBox from '~/components/Elements/SortBox';
import FilterTable from '~/components/Global/CourseList/FitlerTable';
import LayoutBase from '~/components/LayoutBase';
import FilterJobTable from '~/components/Global/Option/FilterTable/FilterJobTable';
const JobsList = () => {
	const columns = [
		{title: 'Job', dataIndex: 'job', ...FilterColumn('job')},
		{title: 'Modified By', dataIndex: 'modBy', ...FilterColumn('modBy')},
		{
			title: 'Modified Date',
			dataIndex: 'modDate',
			// ...FilterDateColumn("modDate"),
		},
		{
			render: () => (
				<>
					<JobForm showIcon={true} />
				</>
			),
		},
	];

	return (
		<PowerTable
			addClass="basic-header"
			TitlePage="Jobs list"
			TitleCard={<JobForm showAdd={true} />}
			dataSource={data}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterJobTable />
					<SortBox />
				</div>
			}
		/>
	);
};
JobsList.layout = LayoutBase;
export default JobsList;
