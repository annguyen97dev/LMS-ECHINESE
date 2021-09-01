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
				<TabPane tab="Transcript Course" key="1">
					{activeTab === 1 && <TranscriptCourse />}
				</TabPane>
				<TabPane tab="Transcript Each Subject" key="2">
					{activeTab === 2 && <TranscriptSubject />}
				</TabPane>
			</Tabs>
		</div>
	);
};
export default Transcript;
