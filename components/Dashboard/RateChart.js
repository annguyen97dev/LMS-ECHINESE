import { Card } from 'antd';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF00FF'];

const RateChart = ({ dataPie, statisticalRate, isLoading, type }) => {
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
						{type === 'SELLER' && <div>Biểu đồ lượt đánh giá tư vấn viên</div>}
						{type === 'VIDEO_COURSE' && <div>Biểu đồ đánh giá độ hài lòng với khóa học video</div>}
					</>
				}
				style={{
					borderRadius: 20
				}}
			>
				<div className="row">
					<div className="col-5 col-md-5 col-lg-5">
						<div className="detail-pieChart" style={{ paddingTop: 80 }}>
							{renderListRate()}
						</div>
					</div>
					<div className="col-7 col-md-7 col-lg-7 pl-2">
						<ResponsiveContainer width="117%" height={300}>
							<PieChart>
								<Pie
									dataKey="Percent"
									data={statisticalRate}
									cx="38%"
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
