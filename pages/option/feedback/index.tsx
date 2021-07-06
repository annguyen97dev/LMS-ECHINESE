import React from 'react';
import SortBox from '~/components/Elements/SortBox';
import FeedBackForm from '~/components/Global/Option/FeedBackForm';
import FilterFeedbackTable from '~/components/Global/Option/FilterTable/FilterFeedbackTable';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {data} from '../../../lib/option/dataOption2';
const FeedBackList = () => {
	const columns = [
		{title: 'Role', dataIndex: 'role', ...FilterColumn('role')},
		{title: 'Feedback', dataIndex: 'services'},
		{title: 'Modified By', dataIndex: 'modBy', ...FilterColumn('modBy')},
		{
			title: 'Modified Date',
			dataIndex: 'modDate',
			// ...FilterDateColumn("modDate"),
		},

		{
			render: () => (
				<>
					<FeedBackForm showIcon={true} />
				</>
			),
		},
	];

	return (
		<PowerTable
			addClass="basic-header"
			TitlePage="Feedback category"
			TitleCard={<FeedBackForm showAdd={true} />}
			dataSource={data}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterFeedbackTable />
					<SortBox />
				</div>
			}
		/>
	);
};
FeedBackList.layout = LayoutBase;
export default FeedBackList;
