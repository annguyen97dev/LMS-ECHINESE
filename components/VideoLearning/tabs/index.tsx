import React from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import VideoQuestion from '~/components/VideoLearning/tabs/question';
import VideoInfomation from '~/components/VideoLearning/tabs/video-information';
import VocabularyTab from '~/components/VideoLearning/tabs/vocabulary';
import NotificationTab from './notification';
import { useWrap } from '~/context/wrap';

const { TabPane } = Tabs;

const titlePages = {
	page1: 'Video bài giảng',
	page2: 'Thẻ từ vựng (FlashCard)',
	page3: 'Luyện tập',
	page4: 'Hỏi và đáp',
	page5: 'Ghi chú',
	page6: 'Thông báo'
};

const VideoTabs = (props: any) => {
	const { onEditQuest, dataNotification, createNewNotification, details, onDeleteQuest } = props;
	const { params, dataNote, onCreateNew, onPress, onDelete, onEdit, onPauseVideo, videoRef, dataQA, addNewQuest } = props;

	const { userInformation } = useWrap();

	return (
		<Tabs className="" tabBarStyle={{ paddingLeft: 20, paddingRight: 20 }}>
			<TabPane className="vl-tabs" tab={titlePages.page1} key="1">
				<VideoInfomation params={params} details={details} />
			</TabPane>

			{userInformation !== null && userInformation.RoleID == 3 && (
				<TabPane tab={titlePages.page5} key="3">
					<VocabularyTab
						dataNote={dataNote}
						createNew={(p) => onCreateNew(p)}
						onPress={(p) => onPress(p)}
						onDelete={(p) => onDelete(p)}
						onEdit={(p) => onEdit(p)}
						onPauseVideo={onPauseVideo}
						videoRef={videoRef}
					/>
				</TabPane>
			)}

			<TabPane tab={titlePages.page4} key="5">
				<VideoQuestion onEdit={onEditQuest} onDeleteQuest={onDeleteQuest} params={dataQA} addNew={addNewQuest} />
			</TabPane>

			<TabPane tab={titlePages.page6} key="6">
				<NotificationTab
					dataNotification={dataNotification}
					createNew={(p) => onCreateNew(p)}
					onPress={(p) => onPress(p)}
					onDelete={(p) => onDelete(p)}
					onEdit={(p) => onEdit(p)}
					onPauseVideo={onPauseVideo}
					videoRef={videoRef}
					createNewNotification={createNewNotification}
				/>
			</TabPane>
		</Tabs>
	);
};

export default VideoTabs;
