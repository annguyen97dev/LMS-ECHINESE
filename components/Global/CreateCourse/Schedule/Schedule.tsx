import {Card} from 'antd';
import React from 'react';

const Schedule = (props) => {
	return (
		<div className="wrap-card-info-course">
			<Card title="Các buổi học" className="space-top-card">
				<div className="info-course">{props.children}</div>
			</Card>
		</div>
	);
};

export default Schedule;
