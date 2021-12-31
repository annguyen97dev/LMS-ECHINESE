import React, { FC, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Card, Progress, Rate, Modal, Input, Tooltip, Popconfirm, message, Spin, Skeleton } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { VideoCourseListApi, DonePayApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';
import CourseVideoTable from '~/components/CourseVideoTable';
import { Filter, Eye, CheckCircle } from 'react-feather';
import { parseToMoney } from '~/utils/functions';
import { EyeOutlined } from '@ant-design/icons';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import moment from 'moment';

const { Search } = Input;

let pageIndex = 1;

const VideoCourseList = () => {
	const { userInformation, pageSize, showNoti, getTitlePage } = useWrap();

	const [data, setData] = useState([]);
	const [showModalDetails, setShowModalDetails] = useState(false);
	const [rerender, setRender] = useState('');
	const [loading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(null);

	const [detailLoading, setDetailLoading] = useState(false);
	const [dataDetails, setDataDetails] = useState([]);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		search: '',
		PaymentStatus: 0
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	useEffect(() => {
		if (userInformation) {
			getAllArea();
			getTitlePage();
			getTitlePage('Danh sách đơn hàng');
		}
	}, [userInformation]);

	//GET DATA
	const getAllArea = async () => {
		setLoading(true);
		try {
			const res = await DonePayApi.getAll(todoApi);
			res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow));
			res.status == 204 && setData([]);
			setRender(res + '');
		} catch (err) {
			showNoti('danger', err);
		} finally {
			setLoading(false);
		}
	};

	const handleDone = async (ID) => {
		setLoading(true);
		try {
			const res = await DonePayApi.update({ ID: ID });
			showNoti('success', 'Thành công');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			getAllArea();
		}
	};

	const getDetails = async (ID) => {
		try {
			const res = await shoppingCartApi.getOrderDetail(ID);
			res.status == 200 && setDataDetails(res.data.data);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setDetailLoading(false);
		}
	};

	const textConfirm = 'Khóa học này đã được thanh toán?';

	const columnsVideoCourse = [
		{
			title: 'Mã',
			dataIndex: 'OrderCode',
			key: 'OrderCode',
			align: 'center'
		},
		{
			title: 'Tên người mua',
			dataIndex: 'FullNameUnicode',
			key: 'FullNameUnicode'
		},
		{
			title: 'Tổng thanh toán',
			dataIndex: 'TotalPayment',
			key: 'TotalPayment',
			align: 'left',
			render: (Action, data, index) => <div>{parseToMoney(data.TotalPayment)}đ</div>
		},
		{
			title: 'Đã thanh toán',
			dataIndex: 'PaidPayment',
			key: 'PaidPayment',
			align: 'left',
			render: (Action, data, index) => <div>{parseToMoney(data.PaidPayment)}đ</div>
		},
		{
			title: 'Giảm giá',
			dataIndex: 'DiscountPrice',
			key: 'DiscountPrice',
			align: 'center',
			render: (Action, data, index) => <div>{parseToMoney(data.DiscountPrice)}đ</div>
		},
		{
			title: 'Ngày mua',
			dataIndex: 'CreatedOn',
			key: 'CreatedOn',
			render: (Action, data, index) => <div>{moment(data.CreatedOn).format('DD/MM/yyyy')}</div>
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
			align: 'center',
			render: (Action, data, index) => (
				<div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					{data.Status == 1 ? (
						<Tooltip title="Xác thực thanh toán">
							<Popconfirm
								placement="right"
								title={textConfirm}
								onConfirm={() => handleDone(data.ID)}
								okText={<div>OK</div>}
								cancelText={<div>Cancel</div>}
								className="customPopconfirm"
							>
								<button onClick={() => console.log(data)} className="btn btn-icon" style={{}}>
									<CheckCircle style={{ color: data.Status == 1 ? '#1cc474' : '#CFD8DC' }} />
								</button>
							</Popconfirm>
						</Tooltip>
					) : (
						<div onClick={() => console.log(data)} className="btn btn-icon" style={{}}>
							<CheckCircle style={{ color: data.Status == 1 ? '#1cc474' : '#CFD8DC' }} />
						</div>
					)}

					<Tooltip title="Xem thông tin">
						<button
							onClick={() => {
								setDetailLoading(true);
								getDetails(data.ID);
								setShowModalDetails(true);
							}}
							className="btn btn-icon"
							style={{}}
						>
							<EyeOutlined />
						</button>
					</Tooltip>
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

	return (
		<div className="">
			<Card title={Extra()} className="video-course-list" style={{ width: '100%' }}>
				{userInformation !== null && (
					<>
						{userInformation.RoleID == 1 && (
							<CourseVideoTable
								totalPage={totalPage && totalPage}
								getPagination={(pageNumber: number) => getPagination(pageNumber)}
								currentPage={pageIndex}
								columns={columnsVideoCourse}
								dataSource={data}
								loading={{ type: 'GET_ALL', status: loading }}
								TitleCard={null}
							/>
						)}
					</>
				)}
			</Card>

			<Modal
				title="Thông tin đơn hàng"
				visible={showModalDetails}
				onOk={() => setShowModalDetails(false)}
				onCancel={() => setShowModalDetails(false)}
				className="modal-vc-details"
				width={700}
			>
				{!detailLoading ? (
					<>
						<List
							dataSource={dataDetails}
							renderItem={(item) => (
								<List.Item>
									<div className="row m-0 item">
										<div className="row m-0 main">
											<img
												className="logo-img"
												src={item.ImageThumbnails === undefined ? '/images/logo-final.jpg' : item.ImageThumbnails}
												alt="logo branch"
												style={{ width: 50, height: 50, borderRadius: 6, marginRight: 10 }}
											/>
											<div className="column">
												<span style={{ fontWeight: 'bold' }}>{item?.VideoCourseName}</span>
												<span>{parseToMoney(item?.VideoCoursePrice)}đ</span>
											</div>
											<div className="column">
												<span style={{ fontWeight: 'bold' }}>Mã kích hoạt</span>
												<span>{item?.ActiveCode}</span>
											</div>
											<span style={{ color: '#dd4667' }}>Số lượng: {parseToMoney(item?.Quantity)}</span>
										</div>
									</div>
								</List.Item>
							)}
						/>
					</>
				) : (
					<Spin />
				)}
			</Modal>
		</div>
	);
};

VideoCourseList.layout = LayoutBase;
export default VideoCourseList;
