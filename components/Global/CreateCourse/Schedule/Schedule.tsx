import { Card } from 'antd';
import React from 'react';

const Schedule = (props) => {
	return (
		<div className="wrap-card-info-course create-course-wrap-modal">
			<Card title="Danh sách các buổi học trống" className="space-top-card">
				<div className="info-course">{props.children}</div>
			</Card>
		</div>
	);
};

export default Schedule;
