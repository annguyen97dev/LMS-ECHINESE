import React, { FC } from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import VideoQuestion from '~/components/VideoLearning/tabs/question';
import VideoInfomation from '~/components/VideoLearning/tabs/video-information';
import VocabularyTab from '~/components/VideoLearning/tabs/vocabulary';
import NotificationTab from './notification';

const { TabPane } = Tabs;

const titlePages = {
	page1: 'Video bài giảng',
	page2: 'Thẻ từ vựng (FlashCard)',
	page3: 'Luyện tập',
	page4: 'Hỏi và đáp',
	page5: 'Ghi chú',
	page6: 'Thông báo'
};

type vType = {
	params: { Title: string; Description: string };
	dataNote: any[];
	onCreateNew: any;
	createNewNotification: any;
	onPress: any;
	onDelete: any;
	onEdit: any;
	onPauseVideo: any;
	dataQA: any[];
	videoRef: { current: { currentTime: '' } };
	addNewQuest: any;
	onEditQuest: any;
	dataNotification: any[];
	details: any;
};

const VideoTabs: FC<vType> = ({
	params,
	dataNote,
	onCreateNew,
	onPress,
	onDelete,
	onEdit,
	onPauseVideo,
	videoRef,
	dataQA,
	addNewQuest,
	onEditQuest,
	dataNotification,
	createNewNotification,
	details
}) => {
	return (
		<Tabs className="" tabBarStyle={{ paddingLeft: 20, paddingRight: 20 }}>
			<TabPane className="vl-tabs" tab={titlePages.page1} key="1">
				<VideoInfomation params={params} details={details} />
			</TabPane>
			{/* <TabPane tab={titlePages.page2} key="2">
				Content of Tab Pane 3
			</TabPane> */}
			<TabPane tab={titlePages.page5} key="3">
				<VocabularyTab
					dataNote={dataNote}
					createNew={(p) => {
						onCreateNew(p);
					}}
					onPress={(p) => {
						onPress(p);
					}}
					onDelete={(p) => {
						onDelete(p);
					}}
					onEdit={(p) => {
						onEdit(p);
					}}
					onPauseVideo={onPauseVideo}
					videoRef={videoRef}
				/>
			</TabPane>
			{/* <TabPane tab={titlePages.page3} key="4">
				Content of Tab Pane 3
			</TabPane> */}
			<TabPane tab={titlePages.page4} key="5">
				<VideoQuestion onEdit={onEditQuest} params={dataQA} addNew={addNewQuest} />
			</TabPane>
			<TabPane tab={titlePages.page6} key="6">
				<NotificationTab
					dataNotification={dataNotification}
					createNew={(p) => {
						onCreateNew(p);
					}}
					onPress={(p) => {
						onPress(p);
					}}
					onDelete={(p) => {
						onDelete(p);
					}}
					onEdit={(p) => {
						onEdit(p);
					}}
					onPauseVideo={onPauseVideo}
					videoRef={videoRef}
					createNewNotification={createNewNotification}
				/>
			</TabPane>
		</Tabs>
	);
};

export default VideoTabs;
