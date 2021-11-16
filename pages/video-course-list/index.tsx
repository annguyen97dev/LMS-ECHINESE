import React, { FC, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Card, Progress, Rate, Modal, Input } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { VideoCourseListApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';

const { TextArea } = Input;
const videoThumnail = 'https://cdn.tgdd.vn//GameApp/-1//cach-tao-thay-doi-thumbnail-hinh-thu-nho-cho-video-su-kien-thumb-800x450.jpg';

const ItemVideo = ({ item, onRate }) => {
	const [rerender, setRender] = useState('');

	useEffect(() => {
		setRender(item);
	}, [item]);

	return (
		<div className="video-course-list__item">
			<Link
				href={{
					pathname: '/video-learning',
					query: {
						course: item.ID,
						complete: item.Complete + '/' + item.TotalLesson,
						name: item.VideoCourseName
					}
				}}
			>
				{item.ImageThumbnails === '' || item.ImageThumbnails === null ? (
					<img src="/images/logo-final.jpg" />
				) : (
					// <img src={videoThumnail} />
					<img src={item.ImageThumbnails} />
				)}
			</Link>

			<div className="p-3 video-course-list__item__content">
				<Link
					href={{
						pathname: '/video-learning',
						query: {
							course: item.ID,
							complete: item.Complete + '/' + item.TotalLesson,
							name: item.VideoCourseName
						}
					}}
				>
					<a className="title in-2-line">{item.VideoCourseName}</a>
				</Link>

				<>
					<Progress
						className="text-process"
						percent={(item.Complete / item.TotalLesson) * 100} // 10 - CHANGE TO TOTALESSION
						status="active"
					/>

					<div className="pr-3 pl-3 pt-3 row rate-container">
						<Rate className="rate-start" disabled value={item.RatingNumber} />

						<a
							onClick={() => {
								onRate(item);
								// updateRate();
							}}
							className="none-selection btn-rate "
						>
							Đánh giá
						</a>
					</div>
				</>
			</div>
		</div>
	);
};

const VideoCourseList = () => {
	const { userInformation } = useWrap();

	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [rerender, setRender] = useState('');

	const [state, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'ID':
					return {
						...prevState,
						ID: action.ID
					};
				case 'RatingNumber':
					return {
						...prevState,
						RatingNumber: action.RatingNumber
					};
				case 'RatingComment':
					return {
						...prevState,
						RatingComment: action.RatingComment
					};
			}
		},
		{
			ID: '',
			RatingNumber: 0,
			RatingComment: ''
		}
	);

	useEffect(() => {
		if (userInformation) {
			console.log('User: ', userInformation);
			getAllArea();
		}
	}, [userInformation]);

	useEffect(() => {
		console.log('data: ', data);
	}, [data]);

	//GET DATA
	const getAllArea = async () => {
		try {
			const res =
				userInformation.RoleID == 1
					? await VideoCourseListApi.getAll(userInformation.UserInformationID)
					: await VideoCourseListApi.getByUser(userInformation.UserInformationID);
			res.status == 200 && setData(res.data.data);
			setRender(res + '');
		} catch (err) {
			// showNoti("danger", err);
		}
	};

	//GET DATA
	const updateRate = async () => {
		let temp = {
			ID: state.ID,
			RatingNumber: state.RatingNumber,
			RatingComment: state.RatingComment
		};
		try {
			await VideoCourseListApi.update(temp);
		} catch (err) {
			// showNoti("danger", err);
		}

		getAllArea();
	};

	return (
		<div className="">
			<p className="video-course-list-title">Khóa Học Video</p>
			<Card className="video-course-list">
				<List
					itemLayout="horizontal"
					dataSource={data}
					grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
					renderItem={(item) => (
						<ItemVideo
							onRate={(p) => {
								dispatch({
									type: 'ID',
									ID: p.ID
								});
								dispatch({
									type: 'RatingNumber',
									RatingNumber: p.RatingNumber
								});
								dispatch({
									type: 'RatingComment',
									RatingComment: p.RatingComment
								});
								setShowModal(true);
							}}
							item={item}
						/>
					)}
				/>

				<Modal
					title="Đánh giá"
					visible={showModal}
					onOk={() => {
						//
						setShowModal(false);
						updateRate();
					}}
					confirmLoading={false}
					onCancel={() => {
						//
						setShowModal(false);
					}}
				>
					<Rate
						value={parseInt(state.RatingNumber)}
						onChange={(e) => {
							console.log('change: ', e);
							dispatch({ type: 'RatingNumber', RatingNumber: e });
						}}
					/>

					<TextArea
						value={state.RatingComment}
						onChange={(p) => {
							dispatch({
								type: 'RatingComment',
								RatingComment: p.target.value
							});
						}}
						rows={4}
						className="mt-4"
					/>
				</Modal>
			</Card>
		</div>
	);
};
VideoCourseList.layout = LayoutBase;

export default VideoCourseList;
