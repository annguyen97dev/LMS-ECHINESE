import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {File} from 'react-feather';
import {courseOfStudentPriceApi, refundsApi} from '~/apiBase';
import PowerTable from '~/components/PowerTable';
import {useWrap} from '~/context/wrap';

const HistoryPayment = (props) => {
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: null,
		status: false,
	});
	const [studentPrice, setStudentPrice] = useState<ICourseOfStudentPrice[]>([]);
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	let pageIndex = 1;

	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		UserInformationID: props.id,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const getCourseOfStudentPrice = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await courseOfStudentPriceApi.getAll(todoApi);
			if (res.status == 200) {
				setStudentPrice(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				showNoti('danger', 'Không tim thấy dữ liệu');
			}
			return res.data.data;
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	// PAGINATION
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex,
		});
	};
	const columns = [
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{
			title: 'Số tiền',
			dataIndex: 'Price',
			render: (a) => {
				return <p>{Intl.NumberFormat('ja-JP').format(a)}</p>;
			},
		},
		{
			title: 'Còn nợ',
			dataIndex: 'MoneyInDebt',
			render: (a) => {
				return (
					<p className="font-weight-blue">
						{Intl.NumberFormat('ja-JP').format(a)}
					</p>
				);
			},
		},
		// { title: "Ghi chú", dataIndex: "service" },
		{
			render: () => (
				<button className="btn btn-icon">
					<File />
				</button>
			),
		},
	];

	useEffect(() => {
		getCourseOfStudentPrice();
	}, [todoApi]);

	return (
		<PowerTable
			loading={isLoading}
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			noScroll
			dataSource={studentPrice}
			columns={columns}
			Extra={<h5>Lịch sử thanh toán</h5>}
		/>
	);
};

const HistoryRefunds = (props) => {
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: null,
		status: false,
	});
	const [refunds, setRefunds] = useState<IRefunds[]>([]);
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	let pageIndex = 1;

	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		UserInformationID: props.id,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const getRefunds = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await refundsApi.getAll(todoApi);
			if (res.status == 200) {
				setRefunds(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				showNoti('danger', 'Không tim thấy dữ liệu');
			}
			return res.data.data;
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	// PAGINATION
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex,
		});
	};
	const columns = [
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{
			title: 'Số tiền hoàn trả',
			dataIndex: 'Price',
			render: (a) => {
				return <p>{Intl.NumberFormat('ja-JP').format(a)}</p>;
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			align: 'center',
			render: (fnStatus) => {
				switch (fnStatus) {
					case 'Chờ duyệt':
						return <span className="tag green">{fnStatus}</span>;
					case 'Không duyệt':
						return <span className="tag red">{fnStatus}</span>;
					case 'Đã duyệt':
						return <span className="tag yellow">{fnStatus}</span>;
						break;
				}
			},
		},
		// {
		//   render: () => (
		//     <button className="btn btn-icon">
		//       <File />
		//     </button>
		//   ),
		// },
	];

	useEffect(() => {
		getRefunds();
	}, [todoApi]);

	return (
		<PowerTable
			loading={isLoading}
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			noScroll
			dataSource={refunds}
			columns={columns}
			Extra={<h5>Lịch sử hoàn tiền</h5>}
		/>
	);
};

const InfoPaymentCard = (props) => {
	const id = props.id;
	const {showNoti} = useWrap();
	const [studentPriceAll, setStudentPriceAll] = useState<
		ICourseOfStudentPrice[]
	>([]);

	let total;
	let arr = [];

	const getCourseOfStudentPriceAll = async () => {
		try {
			let res = await courseOfStudentPriceApi.getAll({
				selectAll: true,
				UserInformationID: id,
			});
			if (res.status == 200) {
				setStudentPriceAll(res.data.data);
			}
			if (res.status == 204) {
				showNoti('danger', 'Không tim thấy dữ liệu');
			}
			return res.data.data;
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	for (let i = 0; i < studentPriceAll.length; i++) {
		arr.push(studentPriceAll[i].MoneyInDebt);
	}
	total = arr.reduce(function (a, b) {
		return a + b;
	}, 0);

	useEffect(() => {
		getCourseOfStudentPriceAll();
	}, [total]);

	return (
		<div className="container-fluid">
			<div className="pt-3">
				<h5>Học phí còn nợ: {Intl.NumberFormat('ja-JP').format(total)}</h5>
			</div>
			<HistoryPayment id={id} />
			<HistoryRefunds id={id} />
		</div>
	);
};
export default InfoPaymentCard;
