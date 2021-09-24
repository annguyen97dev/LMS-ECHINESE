import {Tabs} from 'antd';
import React, {useState} from 'react';
import TranscriptCourse from './TranscriptCourse/TranscriptCourse';
import TranscriptSubject from './TranscriptSubject/TranscriptSubject';

const {TabPane} = Tabs;
const Transcript = () => {
	const [activeTab, setActiveTab] = useState(1);
	return (
		<div className="transcript">
			<Tabs
				type="card"
				onChange={(activeKey) => {
					setActiveTab(+activeKey);
				}}
			>
				<TabPane tab="Bảng điểm trung bình" key="1">
					{activeTab === 1 && <TranscriptCourse />}
				</TabPane>
				<TabPane tab="Bảng điểm theo môn" key="2">
					{activeTab === 2 && <TranscriptSubject />}
				</TabPane>
			</Tabs>
		</div>
	);
};
export default Transcript;
