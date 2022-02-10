import React, { useLayoutEffect, useState } from 'react';
import { Select, Modal, Popover, Input } from 'antd';
import Link from 'next/link';
import { Filter, Eye, CheckCircle } from 'react-feather';
import { Tooltip } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { FeedbackApi } from '~/apiBase';
import FeedbackTable from '~/components/FeedbackTable';
import { useWrap } from '~/context/wrap';
import StudentFeedbackList from '~/components/FeedBack/student-feed-back';
import { FeedbackCategoryApi } from '~/apiBase/feed-back-category';

const { Search } = Input;

const FeedbackList = () => {
	const [selectedItem, setSelectedItem] = useState({ ID: '' });
	const { userInformation, getTitlePage } = useWrap();
	const [loading, setLoading] = useState(true);

	React.useEffect(() => {
		getTitlePage('Danh sách phản hồi');
	}, []);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		let temp = {
			ID: selectedItem.ID,
			StatusID: 3
		};
		updateData(temp);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const updateData = async (param) => {
		try {
			await FeedbackApi.update(param);
			getAllData();
		} catch (error) {}
	};

	const columns = [
		{
			title: 'Loại phản hồi',
			dataIndex: 'TypeName',
			key: 'TypeName'
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'Title',
			key: 'Title'
		},
		{
			title: 'Người gửi',
			dataIndex: 'CreatedBy',
			key: 'CreatedBy'
		},
		{
			title: 'Tư vấn viên',
			dataIndex: 'ModifiedBy',
			key: 'ModifiedBy'
		},

		{
			title: 'Ngày gửi',
			dataIndex: 'ModifiedOn',
			key: 'ModifiedOn'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			key: 'StatusName',
			align: 'center',
			render: (value, record) => (
				<>
					{record.StatusID == 1 && <span className="tag red">{value}</span>}
					{record.StatusID == 2 && <span className="tag yellow">{value}</span>}
					{record.StatusID == 3 && <span className="tag green">{value}</span>}
				</>
			)
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			key: 'action',
			render: (Action, data) => (
				<div>
					<Tooltip title={data.StatusID === 3 ? 'Đã xử lý' : 'Xong'}>
						<a
							className="btn btn-icon"
							onClick={() => {
								if (data.StatusID !== 3) {
									setSelectedItem(data);
									showModal();
								}
							}}
						>
							<CheckCircle style={{ color: data.StatusID === 3 ? '#CFD8DC' : '#1cc474' }} />
						</a>
					</Tooltip>

					<Tooltip title="Xem chi tiết">
						<Link
							href={{
								pathname: '/feedback/[slug]',
								query: { slug: data.ID }
							}}
						>
							<button className="btn btn-icon">
								<Eye />
							</button>
						</Link>
					</Tooltip>
				</div>
			)
		}
	];

	const [allFeedBackup, setBackup] = useState([]);
	const [allFeedback, setAllFeedback] = useState([]);
	const [categories, setCategories] = useState([]);

	useLayoutEffect(() => {
		if (userInformation) {
			getAllData();
		}
	}, [userInformation]);

	// GET ALL DATA WHEN OPEN
	const getAllData = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20
		};
		const temp2 = {
			pageIndex: 1,
			pageSize: 20,
			TypeID: 3
		};

		await getAllFeedBack(userInformation?.RoleID == 6 ? temp2 : temp);
		getFeedBackCategory();
		setLoading(false);
	};

	// GET ALL DATA WITH FILTER
	const filter = async (ID) => {
		const temp = {
			pageIndex: 1,
			pageSize: 20,
			TypeID: ID
		};
		await getAllFeedBack(temp);
	};

	// GET DATA
	const getAllFeedBack = async (param) => {
		if (userInformation !== null && (userInformation?.RoleID == 1 || userInformation?.RoleID == 6)) {
			try {
				const res = await FeedbackApi.getAll(param);
				res.status == 200 && setAllFeedback(res.data.data);
				res.status == 200 && setBackup(res.data.data);
				res.status == 204 && setAllFeedback([]);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const [isModalVisible, setIsModalVisible] = useState(false);

	let flag = 0;

	const expandedRowRender = () => {
		const { Option } = Select;
		flag++;
		return (
			<>
				<div className="feedback-detail-text">asd asd asdqw tw qgasgdas dnb </div>
			</>
		);
	};

	// GET CATEGORY
	const getFeedBackCategory = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20
		};
		try {
			const res = await FeedbackCategoryApi.getAll(temp);
			res.status == 200 && setCategories(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const onSearch = (t) => {
		console.log(t);
		if (t !== '') {
			let temp = [];
			for (let i = 0; i < allFeedBackup.length; i++) {
				if (allFeedBackup[i].Title.indexOf(t) !== -1) {
					temp.push(allFeedBackup[i]);
				}
			}
			setAllFeedback(temp);
		} else {
			setAllFeedback(allFeedBackup);
		}
	};

	return (
		<>
			{userInformation !== null && (userInformation?.RoleID === 1 || userInformation?.RoleID === 6) && (
				<>
					<Modal title="Xác nhận thông tin" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
						<p>Bạn chắc chắn đã xử lí xong phản hồi</p>
					</Modal>

					<FeedbackTable
						loading={loading}
						columns={columns}
						dataSource={allFeedback}
						// TitlePage="Danh sách phản hồi"
						Extra={
							<div className="extra-table">
								<div className="row m-0 st-fb-100w st-fb-flex-end-row">
									<Search
										className="fb-btn-search style-input vc-teach-modal_search-feedback "
										size="large"
										placeholder="input search text"
										onSearch={() => {}}
										onChange={(e) => {
											onSearch(e.target.value);
										}}
									/>
								</div>

								{userInformation?.RoleID !== 6 && (
									<Popover
										placement="bottomLeft"
										title="Chọn lọc"
										content={
											<div className="st-fb-column fb-f-btn">
												<button
													onClick={() => {
														getAllData();
													}}
													className="btn light fb-i-filter"
												>
													Tất cả
												</button>
												{categories.map((item, index) => (
													<button
														onClick={() => {
															filter(item.ID);
														}}
														className="btn light fb-i-filter"
													>
														{item.Name}
													</button>
												))}
											</div>
										}
										trigger="click"
									>
										<button className="ml-3 btn btn-secondary light fb-btn-filter" onClick={funcShowFilter}>
											<Filter />
										</button>
									</Popover>
								)}
							</div>
						}
					></FeedbackTable>
				</>
			)}

			{userInformation !== null && userInformation?.RoleID !== 1 && userInformation?.RoleID !== 6 && (
				<>
					<StudentFeedbackList />
				</>
			)}
		</>
	);
};

FeedbackList.layout = LayoutBase;
export default FeedbackList;
