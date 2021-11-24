import React, { useState } from 'react';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import { List, Typography, Divider, Tooltip } from 'antd';

const CourseDetailsContent = (props) => {
	const { contentData, loading } = props;
	const [isVisible, setIsVisible] = useState(false);

	const handleDelete = () => {
		setIsVisible(false);
	};

	console.log(contentData);

	// SectionModels

	return (
		<div className="vc-details_main">
			<Tooltip title="Xóa"></Tooltip>
			<List
				header={null}
				footer={null}
				dataSource={contentData.SectionModels}
				className="list-content mt-3"
				renderItem={(item) => (
					<List.Item className="item">
						<div>ssasd asss</div>
					</List.Item>
				)}
			/>
		</div>
	);
};

export default CourseDetailsContent;
