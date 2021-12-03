import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FeedbackApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import MenuFeedBack from '~/components/FeedBack/Menu/MenuFeedBack';
import ModalCreateFeedback from '~/components/FeedBack/CreateNew/modalCreateFeedback';
import MainFeedback from '~/components/FeedBack/Main/MainFeedback';

const StudentFeedbackList = (props) => {
	const { userInformation, getTitlePage } = useWrap();
	const [currentTab, setCurrentTab] = useState(1);
	const [currentFeedback, setCurrentFeedback] = useState({});
	const [feedbackAll, setFeedbackAll] = useState([]);
	const [feedbackImportan, setFeedbackImportan] = useState([]);
	const [newFeedback, setNewFeedback] = useState([]);
	const [waitingFeedback, setWaitingFeedback] = useState([]);
	const [doneFeedback, setDoneFeedback] = useState([]);
	const [loading, setLoading] = useState(true);

	const [modalCreate, setModalCreate] = useState(false);

	React.useEffect(() => {
		getTitlePage('Phản hồi');
	}, []);

	useLayoutEffect(() => {
		if (userInformation !== null) {
			getAllData();
		}
	}, [userInformation]);

	useLayoutEffect(() => {
		if (feedbackAll.length !== 0) {
			setCurrentFeedback(feedbackAll[0]); // SET DEFAULT ITEM SELECT
			setTypeData();
		}
	}, [feedbackAll]);

	// GET DATA FOCUS STATUS
	const setTypeData = () => {
		let tempNew = [];
		let tempWaiting = [];
		let tempDone = [];

		// 1-Mới gửi, 2-Đang xữ lý, 3-Đã xong
		for (let i = 0; i < feedbackAll.length; i++) {
			if (feedbackAll[i].StatusID === 1) {
				tempNew.push(feedbackAll[i]);
			}
			if (feedbackAll[i].StatusID === 2) {
				tempWaiting.push(feedbackAll[i]);
			}
			if (feedbackAll[i].StatusID === 3) {
				tempDone.push(feedbackAll[i]);
			}
		}

		setNewFeedback(tempNew);
		setWaitingFeedback(tempWaiting);
		setDoneFeedback(tempDone);
	};

	// GET ALL DATA WHEN OPEN
	const getAllData = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20,
			UID: userInformation.UserInformationID
		};
		await getAllFeedBack(temp);
		getDataPrioritized();
		setLoading(false);
	};

	// GET DATA
	const getAllFeedBack = async (param) => {
		try {
			const res = await FeedbackApi.getAll(param);
			res.status == 200 && setFeedbackAll(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	// GET DATA PRIORITIZED
	const getDataPrioritized = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20,
			UID: userInformation.UserInformationID,
			isPrioritized: true
		};
		try {
			const res = await FeedbackApi.getAll(temp);
			res.status == 200 && setFeedbackImportan(res.data.data);
		} catch (error) {}
	};

	// RENDER
	return (
		<div className="row student-fb">
			<div className="col-md-3 col-12">
				<MenuFeedBack
					loading={loading}
					feedbackList={
						currentTab === 1
							? feedbackAll
							: currentTab === 2
							? newFeedback
							: currentTab === 3
							? feedbackImportan
							: currentTab === 4
							? waitingFeedback
							: doneFeedback
					}
					handleClickMenu={(e) => {
						console.log(e);
						setCurrentTab(e);
					}}
					handleClickItem={(e) => {
						console.log(e);
						setCurrentFeedback(e);
					}}
					handleCreateNew={() => {
						setModalCreate(true);
					}}
					allDataLength={{
						all: feedbackAll.length,
						important: feedbackImportan.length,
						new: newFeedback.length,
						waiting: waitingFeedback.length,
						done: doneFeedback.length
					}}
					currentTab={currentTab}
				/>
			</div>
			<div className="col-md-9 col-12">
				<MainFeedback current={currentFeedback} />
			</div>

			<ModalCreateFeedback
				visible={modalCreate}
				onClose={() => {
					setModalCreate(false);
				}}
				created={getAllData}
			/>
		</div>
	);
};

// FeedbackList.layout = LayoutBase;
export default StudentFeedbackList;
