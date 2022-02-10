import React, { Fragment, useEffect, useState } from 'react';
import NotificationForm from '~/components/Global/Option/NotificationForm';
import ExpandTable from '~/components/ExpandTable';
import { CheckCircle } from 'react-feather';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import { notificationApi, branchApi } from '~/apiBase';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';

const Notification = () => {
	const [dataTable, setDataTable] = useState([]);
	const [dataBranch, setDataBranch] = useState([]);
	const [dataDelete, setDataDelete] = useState({
		SalaryID: null,
		Enable: null
	});
	const { showNoti, pageSize, handleReloadNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	let pageIndex = 1;

	// SORT
	const dataOption = [
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 3,
			text: 'Tên giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 4,
			text: 'Tên tăng dần '
		}
	];

	// PARAMS SEARCH
	let listField = {
		FullName: ''
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		RoleID: null,
		FullName: null,
		fromDate: null,
		toDate: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA
	const getDataTable = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await notificationApi.getAll(todoApi);
				if (res.status == 204) {
					showNoti('danger', 'Không có dữ liệu');
					handleReset();
					setDataTable([]);
				}
				if (res.status == 200) {
					// if (res.data.data.length < 1) {
					// 	handleReset();
					// }
					setTotalPage(res.data.totalRow);

					const results = res.data.data.map((row, i) => ({
						key: row.NotificationID,
						BranchID: row.BranchID,
						BranchName: row.BranchName,
						CourseID: row.CourseID,
						CreatedBy: row.CreatedBy,
						CreatedOn: row.CreatedOn,
						Enable: row.Enable,
						IsSendMail: row.IsSendMail,
						ModifiedBy: row.ModifiedBy,
						ModifiedOn: row.ModifiedOn,
						NotificationContent: row.NotificationContent,
						NotificationID: row.NotificationID,
						NotificationTitle: row.NotificationTitle,
						RoleID: row.RoleID,
						RoleName: row.RoleName,
						AllRole: row.AllRole,
						AllBranch: row.AllBranch
					}));
					setDataTable(results);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};
	// GET DATA USERINFORMATION
	const getDataBranch = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await branchApi.getAll({ pageSize: 9999, pageIndex: 1 });
				res.status == 200 && setDataBranch(res.data.data);
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};
	// ADD DATA
	const _onSubmit = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		let res = null;
		try {
			res = await notificationApi.add(data);
			res?.status == 200 && (afterPost('Thêm'), handleReloadNoti());
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}

		return res;
	};

	const afterPost = (value) => {
		showNoti('success', `${value} thành công`);
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			//   ...listFieldSearch,
			pageIndex: pageIndex,
			pageSize: pageSize
		});
	};

	// HANDLE RESET
	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// const expandedRowRender = () => {
	//   return (
	//     <div>
	//       Tuần tới đội chuyên môn HN sẽ họp tại tầng 8 CS Thái Hà. Thời gian: 10h
	//       sáng thứ 2 (26/10) Nội dung: Phát triển trong môi trường ZIM và những kĩ
	//       năng cần thiết.
	//     </div>
	//   );
	// };

	// console.log('todoApi: ', todoApi);

	useEffect(() => {
		getDataTable();
		getDataBranch();

		console.log('todoApi: ', todoApi);
	}, [todoApi]);

	const columns = [
		{
			title: 'Date',
			dataIndex: 'ModifiedOn',
			render: (date) => <p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			// ...FilterDateColumn("expires")
		},
		{
			title: 'Role',
			dataIndex: 'RoleName',
			// ...FilterColumn("teacher"),
			render: (role, record, index) => {
				if (record.AllRole) {
					return <span>Tất cả</span>;
				} else if (role) {
					let arr = role.split(',');
					return (
						<div className="list-tag">
							{arr.map((item, i) => (
								<span key={i}>{item}</span>
							))}
						</div>
					);
				}
			}
		},
		{
			title: 'Center',
			dataIndex: 'BranchName',
			render: (BranchName, record, index) => {
				if (record.AllBranch) {
					return <span>Tất cả</span>;
				} else if (BranchName) {
					let arr = BranchName.split(',');
					return (
						<div className="list-tag">
							{arr.map((item, i) => (
								<span key={i}>{item}</span>
							))}
						</div>
					);
				}
			}
			// ...FilterColumn("center")
		},
		{
			title: 'Email',
			dataIndex: 'IsSendMail',
			render: (IsSendMail) => {
				if (IsSendMail) {
					return <CheckCircle color="#06d6a0" />;
				}
			}
		},
		{ title: 'Title', dataIndex: 'NotificationTitle' }
	];

	return (
		<ExpandTable
			loading={isLoading}
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Danh sách thông báo"
			expandable={{
				expandedRowRender: (record) => <p style={{ margin: 0 }}>{ReactHtmlParser(record.NotificationContent)}</p>,
				rowExpandable: (record) => record.NotificationTitle !== 'Not Expandable'
			}}
			TitleCard={
				<NotificationForm showAdd={true} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} dataBranch={dataBranch} />
			}
			dataSource={dataTable}
			columns={columns}
			Extra={
				<div className="extra-table">
					{/* <FilterTable />
          <SortBox /> */}
				</div>
			}
		/>
	);
};
Notification.layout = LayoutBase;
export default Notification;
