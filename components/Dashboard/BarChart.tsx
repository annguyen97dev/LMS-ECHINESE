import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select, Card, Radio } from 'antd';
import PropTypes from 'prop-types';

BarChartStatistical.propTypes = {
	title: PropTypes.string,
	dataStatistical: PropTypes.shape({
		title: PropTypes.string,
		value: PropTypes.number,
		ID: PropTypes.number,
		dataKey: PropTypes.string
	}),
	extra: PropTypes.node,
	colorTick: PropTypes.string
};

function BarChartStatistical(props) {
	const { title, dataStatistical, extra, colorTick } = props;

	const formatYAxis = (tickItem) => {
		return new Intl.NumberFormat('de-DE').format(tickItem);
	};

	const formatTooltip = (value, name, props) => {
		return new Intl.NumberFormat('de-DE').format(value);
	};

	const customizedAxisTick = ({ x, y, stroke, payload }) => {
		console.log(payload);
		return (
			<g transform={`translate(${x},${y})`}>
				<text x={0} y={0} dy={16} textAnchor="end" fill="#666">
					{payload.value}
				</text>
			</g>
		);
	};

	return (
		<Card
			title={
				<div>
					<h4 style={{ textTransform: 'uppercase' }}>{dataStatistical[0]?.title}</h4>
				</div>
			}
			style={{ borderRadius: 20 }}
			extra={extra && extra}
		>
			<ResponsiveContainer width="100%" height={280}>
				<BarChart data={dataStatistical} margin={{ top: 10, right: 0, left: 15, bottom: 0 }}>
					<XAxis dataKey="dataKey" />
					<YAxis type="number" tickFormatter={formatYAxis} />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip
						formatter={formatTooltip}
						labelFormatter={(value) => {
							return `${value}`;
						}}
					/>
					<Legend />
					<Bar dataKey="value" fill={colorTick} name={title} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
}

export default BarChartStatistical;
