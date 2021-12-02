import React, { FC, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Card, Progress, Rate, Modal, Input, Tooltip, Popconfirm, message } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { VideoCourseListApi, DonePayApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';
import CourseVideoTable from '~/components/CourseVideoTable';
import { Filter, Eye, CheckCircle } from 'react-feather';
import { parseToMoney } from '~/utils/functions';

const { Search } = Input;

let pageIndex = 1;

const VideoCourseList = () => {
	const { userInformation, pageSize, showNoti, getTitlePage } = useWrap();

	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [rerender, setRender] = useState('');
	const [loading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(null);

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

			getTitlePage('Khóa học chưa thanh toán');
		}
	}, [userInformation]);

	useEffect(() => {
		console.log('data: ', data);
	}, [data]);

	//GET DATA
	const getAllArea = async () => {
		setLoading(true);
		try {
			const res = await DonePayApi.getAll(todoApi);
			res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow));
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
			key: 'CreatedOn'
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
					<Tooltip title="Xác thực thanh toán">
						<Popconfirm
							placement="right"
							title={textConfirm}
							onConfirm={() => handleDone(data.ID)}
							okText="OK"
							cancelText="Cancel"
						>
							<button
								onClick={() => console.log(data)}
								className="btn btn-icon"
								style={{ marginRight: -10, marginLeft: -10 }}
							>
								<CheckCircle style={{ color: data.Status == 1 ? '#1cc474' : '#CFD8DC' }} />
							</button>
						</Popconfirm>
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
		</div>
	);
};

VideoCourseList.layout = LayoutBase;
export default VideoCourseList;
