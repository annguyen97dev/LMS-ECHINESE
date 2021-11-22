import { Card } from 'antd';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF00FF'];

const RateChart = ({ dataPie, statisticalRate, isLoading }) => {
	const renderListRate = () => {
		return (
			statisticalRate.length &&
			statisticalRate?.map((item, index) => {
				return (
					<div className="pt-2" index={index}>
						<i className="fas fa-circle" style={{ color: COLORS[index] }} />
						<span style={{ paddingLeft: 15, color: '#585858' }}>
							{item.Rate} <i className="fas fa-star" style={{ color: '#D7DF01' }} />{' '}
							{item.Percent !== 'NaN' && item.Percent.toFixed(2)}%
						</span>
					</div>
				);
			})
		);
	};

	return (
		<div>
			<Card
				title={
					<>
						<div>
							<h4>ĐÁNH GIÁ</h4>
						</div>
						<div>Biểu đồ lượt đánh giá tư vấn viên</div>
					</>
				}
				style={{
					borderRadius: 20
				}}
			>
				<div className="row">
					<div className="col-4 col-md-4 col-lg-4">
						<div className="detail-pieChart" style={{ paddingTop: 80 }}>
							{renderListRate()}
						</div>
					</div>
					<div className="col-8 col-md-8 col-lg-8 pl-2">
						<ResponsiveContainer width="117%" height={300}>
							<PieChart>
								<Pie
									dataKey="Percent"
									data={statisticalRate}
									cx="35%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									fill="#003366"
									paddingAngle={5}
								>
									{statisticalRate.map((entry, index) => (
										<Cell key={index} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default RateChart;
