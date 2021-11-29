import React, { FC, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Card, Progress, Rate, Modal, Input } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { VideoCourseListApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';
import CourseVideoTable from '~/components/CourseVideoTable';

const { TextArea, Search } = Input;

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
						ID: item.ID,
						course: item.VideoCourseID,
						complete: item.Complete + '/' + item.TotalLesson,
						name: item.VideoCourseName
					}
				}}
			>
				{item.ImageThumbnails === '' || item.ImageThumbnails === null ? (
					<img src="/images/logo-final.jpg" />
				) : (
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

let pageIndex = 1;

const VideoCourseList = () => {
	const { userInformation, pageSize, showNoti } = useWrap();

	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [rerender, setRender] = useState('');
	const [loading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(null);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		search: ''
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

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
			getAllArea();
		}
	}, [userInformation]);

	useEffect(() => {
		console.log('data: ', data);
	}, [data]);

	//GET DATA
	const getAllArea = async () => {
		setLoading(true);
		try {
			const res =
				userInformation.RoleID == 1 ? await VideoCourseListApi.getAll(todoApi) : await VideoCourseListApi.getByUser(todoApi);
			res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow));
			setRender(res + '');
		} catch (err) {
			// showNoti("danger", err);
		} finally {
			setLoading(false);
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

	const columnsVideoCourse = [
		{
			title: 'ID',
			dataIndex: 'ID',
			key: 'ID'
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'VideoCourseName',
			key: 'VideoCourseName'
		},
		{
			title: 'Ngày mua',
			dataIndex: 'CreatedOn',
			key: 'CreatedOn'
		},
		{
			title: 'Tên học sinh',
			dataIndex: 'StudentName',
			key: 'StudentName',
			align: 'center'
		},
		{
			title: 'Điện thoại',
			dataIndex: 'Phone',
			key: 'Phone',
			align: 'center'
		},
		{
			title: 'Trạng thái kích hoạt',
			dataIndex: 'StatusName',
			key: 'StatusName',
			align: 'center'
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			key: 'action',
			render: (Action, data, index) => (
				<div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					{/* <Link
						href={{
							// pathname: '/option/program/program-detail/[slug]',
							query: { slug: data.ID }
						}}
					>
						<Tooltip title="Chi tiết chương trình">
							<button className="btn btn-icon" style={{ marginRight: -10, marginLeft: -10 }}>
								<Eye />
							</button>
						</Tooltip>
					</Link> */}

					<div>
						{/* <ModalCreateVideoCourse
							dataLevel={categoryLevel}
							dataCategory={category}
							getIndex={() => {}}
							_onSubmitEdit={(data: any) => updateCourse(data)}
							programID={data.ID}
							rowData={data}
							dataGrade={data}
							showAdd={true}
							isLoading={isLoading}
						/> */}
					</div>
				</div>
			)
		}
	];

	useEffect(() => {
		getAllArea();
	}, [todoApi]);

	// HANDLE SEARCH
	const handleSearch = (e) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			search: e
		};
		(pageIndex = 1), setTodoApi(newTodoApi);
	};

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex
		});
	};

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="row m-0 vc-store_extra-table">
				<div className="row m-0">
					<div className="row m-0 st-fb-100w ">
						<Search
							className="fb-btn-search style-input vc-teach-modal_search"
							size="large"
							placeholder="input search text"
							onSearch={(e) => {
								handleSearch(e);
							}}
						/>
					</div>
				</div>
			</div>
		);
	};

	const expandedRowRender = () => {
		return (
			<>
				<div className="feedback-detail-text" style={{ backgroundColor: 'red' }}>
					asd asd asdqw tw qgasgdas dnb
				</div>
			</>
		);
	};

	return (
		<div className="">
			<p className="video-course-list-title">Khóa Học Video</p>
			<Card title={Extra()} className="video-course-list">
				{userInformation !== null && (
					<>
						{userInformation.RoleID == 1 ? (
							<CourseVideoTable
								totalPage={totalPage && totalPage}
								getPagination={(pageNumber: number) => getPagination(pageNumber)}
								currentPage={pageIndex}
								columns={columnsVideoCourse}
								dataSource={data}
								loading={{ type: 'GET_ALL', status: loading }}
								TitleCard={null}
							/>
						) : (
							<List
								pagination={{
									onChange: getPagination,
									total: totalPage,
									size: 'small',
									current: pageIndex
								}}
								loading={loading}
								itemLayout="horizontal"
								dataSource={data}
								grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
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
						)}
					</>
				)}

				<Modal
					title="Đánh giá"
					visible={showModal}
					onOk={() => {
						setShowModal(false);
						updateRate();
					}}
					confirmLoading={false}
					onCancel={() => {
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
