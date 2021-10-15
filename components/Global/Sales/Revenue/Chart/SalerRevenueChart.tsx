import {Card} from 'antd';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import {numberWithCommas} from '~/utils/functions';

SalerRevenueChart.propTypes = {
	revenueList: PropTypes.arrayOf(
		PropTypes.shape({
			ID: PropTypes.number,
			CounselorsID: PropTypes.number,
			CounselorsName: PropTypes.string,
			Revenue: PropTypes.number,
			InvoiceNumber: PropTypes.number,
			CustomersNumber: PropTypes.number,
			SaleCampaignID: PropTypes.number,
			SaleCampaignName: PropTypes.string,
		})
	),
};
SalerRevenueChart.defaultProps = {
	revenueList: {},
};
function SalerRevenueChart(props) {
	const {revenueList} = props;
	return (
		<Card
			title={<h4>BIỂU ĐỒ TỔNG KẾT DOANH THU</h4>}
			style={{borderRadius: 20}}
		>
			<ResponsiveContainer width="100%" height={280}>
				<ComposedChart
					data={revenueList}
					margin={{top: 10, right: 0, left: 40, bottom: 0}}
				>
					<XAxis dataKey="SaleCampaignName" />
					<YAxis tickFormatter={(value) => numberWithCommas(value)} />
					<Tooltip formatter={(value) => numberWithCommas(value)} />
					<Legend />
					<CartesianGrid stroke="#f5f5f5" />
					<Bar
						dataKey="CustomersNumber"
						name="Số khách hàng"
						barSize={20}
						fill="#003366"
						stackId="col"
					/>
					<Bar
						dataKey="InvoiceNumber"
						name="Số hóa đơn"
						barSize={20}
						fill="#0080FF"
						stackId="col"
					/>
					<Bar
						dataKey="Revenue"
						name="Doanh thu theo chiến dịch"
						barSize={20}
						fill="#dd4667"
						stackId="col"
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</Card>
	);
}

export default React.memo(SalerRevenueChart);
