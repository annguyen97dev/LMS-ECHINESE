import { Avatar, Card, Drawer, Empty, Rate, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useWrap } from '~/context/wrap';
import { FeedbackApi } from '~/apiBase';
import ReactHtmlParser from 'react-html-parser';
import EditorSimple from '~/components/Elements/EditorSimple';
import { FeedbackReplyApi } from '~/apiBase/feed-back/feedback-reply';

MainFeedback.propTypes = {
	allDataLength: PropTypes.object,
	feedbackMenu: PropTypes.array,
	feedbackList: PropTypes.array,
	currentItem: PropTypes.string,
	handleClickItem: PropTypes.func,
	handleClickMenu: PropTypes.func,
	handleCreateNew: PropTypes.func,

	current: PropTypes.object
};

MainFeedback.defaultProps = {
	allDataLength: {},
	feedbackMenu: [],
	feedbackList: [],
	currentItem: '',
	handleClickItem: null,
	handleClickMenu: null,
	handleCreateNew: null,

	current: {}
};

export const ButtonImportant = ({ status }: { status: boolean }) => {
	return (
		<>
			{!status ? (
				<span className="">
					Đánh dấu ưu tiên
					<i className="ml-2 far m-0 fa-star st-fb-star-important" />
				</span>
			) : (
				<i className="fas m-0 fa-star st-fb-star-important"></i>
			)}
		</>
	);
};

function MainFeedback(props) {
	const { current, handleClickItem, feedbackList, currentItem, feedbackMenu, handleClickMenu, handleCreateNew, allDataLength } = props;

	const { showNoti, userInformation } = useWrap();
	const [currentInfomation, setCurrentInfomation] = useState({ CreatedBy: '', Rate: 0, Title: '', ContentFeedBack: '' });
	const [isImportant, setImportant] = useState(false);
	const [reply, setReply] = useState([]);
	const [isReset, setReset] = useState(false);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getCurrentInfo(current.ID);
		getReply(current.ID);
		setImportant(current.isPrioritized !== null ? current.isPrioritized : false);
	}, [current]);

	// CONVERT DATE TO  DD-MM-YYYY
	const getNum = (num) => {
		return num > 9 ? num : '0' + num;
	};
	const getDateString = (date) => {
		let nDate = new Date(date);
		return getNum(nDate.getDate()) + '-' + getNum(nDate.getMonth() + 1) + '-' + nDate.getFullYear();
	};

	const setFeedbackImportant = async () => {
		setImportant(!isImportant);
	};

	// CALL API UPDATE
	const updateCurrentFeedback = async (param) => {
		try {
			const res = await FeedbackApi.update(param);
			getCurrentInfo(current.ID);
		} catch (error) {}
	};

	// GET INFO OF SELECTED FEEDBACK ITEM
	const getCurrentInfo = async (param) => {
		try {
			const res = await FeedbackApi.getByID(param);
			res.status == 200 && setCurrentInfomation(res.data.data);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	// GET DATA REPLY OF SELECTED FEEDBACK
	const getReply = async (param) => {
		setReset(true);
		try {
			const res = await FeedbackReplyApi.getByFeedbackID(param);
			res.status == 200 && setReply(res.data.data);
			setReset(false);
		} catch (error) {}
	};

	// ADD DATA REPLY TO SELECTED FEEDBACK
	const addReply = async () => {
		setReset(true);
		let temp = {
			FeedbackID: current.ID,
			Content: content
		};
		try {
			const res = await FeedbackReplyApi.add(temp);
			// res.status == 200 && setReply(res.data.data);
			getReply(current.ID);
		} catch (error) {}
		setReset(false);
	};

	// HANDLE RATE
	const onChangeRate = (e) => {
		const temp = {
			ID: current.ID,
			Rate: e
		};
		updateCurrentFeedback(temp);
	};

	console.log(current);

	// RENDER
	return (
		<Card loading={loading} className="p-2 student-fb__wrap-main st-fb-empty wrap-fb-menu" bordered={false}>
			{current.ID !== undefined ? (
				<div className="fb-height-100">
					<div className="card-newsfeed-wrap__label">
						<div className="m-feedback st-fb-100w">
							<div className="row m-0 mb-3 st-fb-rsb st-fb-100w  m-feedback__head">
								<div className="st-fb-column">
									<span className="m-feedback__name">{currentInfomation.CreatedBy}</span>
									<span className="m-feedback__date">{getDateString(current.CreatedOn)}</span>
								</div>

								<div style={{ flex: 1 }} />

								<div className="st-fb-column st-fb-flex-end">
									<Rate onChange={onChangeRate} value={currentInfomation.Rate} className="st-fb-star m-0" />

									{/* {userInformation !== null && (
								<span
									onClick={() => {
										const temp = {
											ID: current.ID,
											isPrioritized: !isImportant
										};
										setFeedbackImportant();
										updateCurrentFeedback(temp);
									}}
								>
									{current.UID === userInformation.UserInformationID && <ButtonImportant status={isImportant} />}
								</span>
							)} */}
								</div>
							</div>
						</div>
					</div>

					<div className="m-feedback__main mt-4 st-fb-100w">
						<div className="row m-0 st-fb-100w st-fb-rsb">
							<span className="m-feedback__name">{currentInfomation.Title}</span>
							<span className="m-feedback__date">{current.TypeName}</span>
						</div>
						<span className="m-feedback__content">{ReactHtmlParser(currentInfomation.ContentFeedBack)}</span>
					</div>

					<hr />

					<div className="card-newsfeed fv-main-sc">
						{current.StatusID !== 3 && (
							<>
								<EditorSimple
									handleChange={(value) => {
										setContent(value);
									}}
									isTranslate={false}
									isReset={isReset}
									questionContent={content}
									height={150}
								/>

								<div className="row wrap-vocab__create-new__button-group">
									<Tooltip title="Thêm ghi chú">
										<button onClick={() => addReply()} className="btn ml-3 mt-3 btn-primary">
											<i className="fas fa-plus-circle mr-2"></i>Thêm nhận xét
										</button>
									</Tooltip>
								</div>
							</>
						)}
						<ul className="m-feedback__list-group-nf">
							{reply.map((item, index) => (
								<li key={index} className={currentItem === item.ID ? 'active' : ''} onClick={() => {}}>
									<div className="row m-0 student-fb__i-fb">
										{item.Avatarr !== null && item.Avatar !== '' ? (
											<Avatar size={36} className="student-fb__i-avt mr-3" src={userInformation.Avatar} />
										) : (
											<Avatar
												size={36}
												className="student-fb__i-avt mr-3"
												src={<img src="/images/user.png" alt="" />}
											/>
										)}
										<div className="st-fb-colum st-fb-fw">
											<div className="row m-0 st-fb-rsb">
												<span className="student-fb__i-name">{item.FullName}</span>
												<span className="student-fb__i-name">{getDateString(item.CreateDate)}</span>
											</div>
											<span className="student-fb__i-r-content">{ReactHtmlParser(item.Content)}</span>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			) : (
				<Empty />
			)}
		</Card>
	);
}

export default MainFeedback;
