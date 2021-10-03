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

	const newDataRow = useMemo(() => {
		return revenueList.map((r: ISalerRevenue) => ({
			name: r.SaleCampaignName,
			revenue: r.Revenue,
			customers: r.CustomersNumber,
			invoice: r.InvoiceNumber,
		}));
	}, [revenueList]);

	return (
		<Card
			title={<h4>BIỂU ĐỒ TỔNG KẾT DOANH THU</h4>}
			style={{borderRadius: 20}}
		>
			<ResponsiveContainer width="100%" height={280}>
				<ComposedChart
					data={newDataRow}
					margin={{top: 10, right: 0, left: -15, bottom: 0}}
				>
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<CartesianGrid stroke="#f5f5f5" />
					<Bar
						dataKey="revenue"
						name="Doanh thu theo chiến dịch"
						barSize={20}
						fill="#82ca9d"
					/>
					{/* <Line
						type="monotone"
						name="Số khách hàng"
						dataKey="customers"
						stroke="#003366"
					/>
					<Line
						type="monotone"
						name="Số hóa đơn"
						dataKey="invoice"
						stroke="#0080FF"
					/> */}
				</ComposedChart>
			</ResponsiveContainer>
		</Card>
	);
}

export default SalerRevenueChart;
