import React, { useEffect, useState } from 'react';
import { useWrap } from '~/context/wrap';
import { packageResultApi } from '~/apiBase/package/package-result';
import FilterColumn from '~/components/Tables/FilterColumn';
import Link from 'next/link';
import { Checkbox, Modal, Tooltip, Popconfirm, message } from 'antd';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, FormOutlined, RedoOutlined } from '@ant-design/icons';
import LayoutBase from '~/components/LayoutBase';
import ExpandTable from '~/components/ExpandTable';
import PackageResultExpand from '~/components/Global/Package/PackageResult/PackageResultExpand';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';

const TakeMarking = (props) => {
	const { loadingMarking, userID, onFetchTaking, dataRow } = props;
	const { showNoti } = useWrap();
	const [visible, setVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [isChecked, setIsChecked] = useState(false);

	const handleTaking = async () => {
		let dataSumbit = {
			ID: dataRow.ID,
			TeacherID: userID,
			Enable: true
		};
		setConfirmLoading(true);
		try {
			let res = await packageResultApi.update(dataSumbit);
			if (res.status == 200) {
				showNoti('success', 'Nhận chấm bài thành công');
				onFetchTaking && onFetchTaking();
				setVisible(false);
			} else {
				setIsChecked(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsChecked(false);
			setConfirmLoading(false);
		}
	};

	const onChange_acceptMarking = (e) => {
		showPopconfirm();
		const checked = e.target.checked;
		if (checked) {
			setIsChecked(checked);
		}
	};
	const showPopconfirm = () => {
		setVisible(true);
	};

	const handleOk = () => {
		setConfirmLoading(true);
		handleTaking();
	};

	const handleCancel = () => {
		setVisible(false);
		setIsChecked(!isChecked);
	};

	return (
		<>
			<Popconfirm
				placement="top"
				title="Xác nhận chấm bài này?"
				visible={visible}
				onConfirm={handleOk}
				okText="Yes"
				cancelText="No"
				okButtonProps={{ loading: confirmLoading }}
				onCancel={handleCancel}
			>
				<Checkbox checked={isChecked} onChange={onChange_acceptMarking}></Checkbox>
			</Popconfirm>
		</>
	);
};

const PackageResultTeacher = () => {
	let listFieldFilter = {
		pageIndex: 1,
		fromDate: null,
		toDate: null,
		StudentID: null,
		SetPackageDetailID: null,
		isDone: null,
		StudentName: null
	};
	const sortOption = [
		{
			dataSort: {
				sortType: null
			},
			value: 1,
			text: 'Mới cập nhật'
		},
		{
			dataSort: {
				sortType: true
			},
			value: 2,
			text: 'Từ dưới lên'
		}
	];
	const [loadingMarking, setLoadingMarking] = useState(false);
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ISetPackageResult[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [textHeader, setTextHeader] = useState('Danh sách bài tập');
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		StudentID: null,
		SetPackageDetailID: null,
		isDone: null,
		StudentName: null,
		TeacherID: null,
		isFixPaid: null,
		StatusID: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'StudentID',
			title: 'Học viên',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'SetPackageDetailID',
			title: 'Bộ đề',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'StatusID',
			title: 'Trạng thái',
			col: 'col-12',
			type: 'select',
			optionList: [
				{
					value: 1,
					title: 'Đã nộp bài'
				},
				{
					value: 2,
					title: 'Đang chấm bài'
				},
				{
					value: 3,
					title: 'Đã chấm bài'
				},
				{
					value: 4,
					title: 'Đang chấm bài lại'
				},
				{
					value: 5,
					title: 'Đã chấm bài lại'
				}
			],
			value: null
		},

		{
			name: 'date-range',
			title: 'Ngày tạo',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await packageResultApi.getAll(todoApi);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));

			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const onSearch = (data) => {
		setCurrentPage(1);
		setTodoApi({
			...listTodoApi,
			StudentName: data
		});
	};

	const handleReset = () => {
		setCurrentPage(1);
		setTodoApi(listTodoApi);
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber
		});
	};

	// --------------- HANDLE SORT ----------------------
	const handleSort = (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
	};

	// -------------- HANDLE TAKING -----------------

	const setDataFunc = (name, data) => {
		dataFilter.every((item, index) => {
			if (item.name == name) {
				item.optionList = data;
				return false;
			}
			return true;
		});
		setDataFilter([...dataFilter]);
	};

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
		console.log('List Filter: ', listFilter);
		let newListFilter = { ...listFieldFilter };
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 });
	};

	// --- Chờ xử lí ---
	const handleWaitingMarking = () => {
		if (userInformation) {
			setTextHeader('Bài tập chờ xử lí');
			setTodoApi({
				...listTodoApi,
				isDone: false,
				TeacherID: userInformation.UserInformationID
			});
			setCurrentPage(1);
		} else {
			showNoti('danger', 'Chờ chút bạn đang thao tác quá nhanh');
		}
	};

	// --- Hiển thị những bài đã chấm ---
	const handleShowMarked = () => {
		if (userInformation) {
			setTextHeader('Bài tập đã chấm');
			setTodoApi({
				...listTodoApi,
				StatusID: 3,
				TeacherID: userInformation.UserInformationID
			});
			setCurrentPage(1);
		} else {
			showNoti('danger', 'Chờ chút bạn đang thao tác quá nhanh');
		}
	};

	const handleShowNotMarked = () => {
		if (userInformation) {
			setTextHeader('Bài tập chưa có giáo viên chấm');
			setTodoApi({
				...listTodoApi,
				StatusID: 2,
				TeacherID: 0
			});
		} else {
			showNoti('danger', 'Chờ chút bạn đang thao tác quá nhanh');
		}
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'StudentName',
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-blue">{text}</p>
		},

		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (text, data) =>
				data.TeacherID === userInformation.UserInformationID ? (
					<Link
						href={{
							pathname: '/package/package-result-teacher/detail/[slug]',
							query: { slug: `${data.ID}`, teacherMarking: data.TeacherID, packageResultID: data.ID }
						}}
					>
						<a href="#" className="font-weight-black">
							{text}
						</a>
					</Link>
				) : (
					<p className="font-weight-black">{text}</p>
				)
		},
		{
			title: 'Level',
			dataIndex: 'SetPackageLevel',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		// {
		// 	title: 'Hình thức',
		// 	dataIndex: 'ExamTopicTypeName',
		// 	render: (text) => <p className="font-weight-black">{text}</p>
		// },
		{
			title: 'Giáo viên chấm bài',
			dataIndex: 'TeacherName',
			render: (text, data) => (
				<p
					className="font-weight-blue"
					style={{ color: data.TeacherID == userInformation?.UserInformationID ? '#205286' : '#dd4667' }}
				>
					{text}
				</p>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isDone',
			render: (type) => (
				<>
					{type == true && <span className="tag green">Đã chấm xong</span>}
					{type == false && <span className="tag gray">Chưa chấm xong</span>}
				</>
			)
		},
		{
			title: 'Yêu cầu chấm bài',
			dataIndex: 'isFixPaid',
			align: 'center',
			render: (type, data) => (
				<>
					{(data.StatusID == 3 || data.StatusID == 5 || data.StatusID == 1) && (
						<Tooltip title="Chưa yêu cầu chấm">
							<CloseOutlined className="delete custom" />
						</Tooltip>
					)}
					{(data.isFixPaid || data.isReevaluate) &&
						(data.StatusID == 2 ? (
							<Tooltip title="Yêu cầu chấm bài">
								<CheckOutlined className="success custom" />
							</Tooltip>
						) : (
							data.StatusID == 4 && (
								<Tooltip title="Yêu cầu chấm bài lại">
									<RedoOutlined className="success custom" />
								</Tooltip>
							)
						))}
				</>
			)
		},
		{
			title: 'Nhận chấm bài',
			align: 'center',
			render: (data) =>
				!data.TeacherID &&
				(data.isFixPaid || data.isReevaluate) && (
					<TakeMarking
						loadingMarking={loadingMarking}
						userID={userInformation.UserInformationID}
						onFetchTaking={() => setTodoApi({ ...todoApi })}
						dataRow={data}
					/>
				)
		},

		{
			render: (data) => (
				<>
					{data.TeacherID === userInformation.UserInformationID && (data.StatusID == 2 || data.StatusID == 4) && (
						<Link
							href={{
								pathname: '/package/package-result-teacher/detail/[slug]',
								query: { slug: `${data.ID}`, teacherMarking: data.TeacherID, packageResultID: data.ID, type: 'examination' }
							}}
						>
							<Tooltip title="Chấm bài ngay">
								<button className="btn btn-icon edit">
									<FormOutlined />
								</button>
							</Tooltip>
						</Link>
					)}

					{/* {data.isFixPaid && <PackagePickTeacher dataRow={data} dataTeacher={dataTeacher} onFetchData={onFetchData} />} */}
				</>
			)
		}
	];

	const expandedRowRender = (data, index) => {
		return (
			<>
				<PackageResultExpand infoID={data.ID} />
			</>
		);
	};

	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				loading={isLoading}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="basic-header"
				TitlePage={textHeader}
				dataSource={dataSource}
				columns={columns}
				TitleCard={
					<>
						<button className="light btn btn-warning" onClick={handleShowNotMarked}>
							Chưa có ai chấm
						</button>
						<button className="light btn btn-secondary ml-2" onClick={handleShowMarked}>
							Đã chấm
						</button>
						<button className="light btn btn-danger ml-2" onClick={handleWaitingMarking}>
							Chờ xử lí
						</button>
					</>
				}
				Extra={
					<div className="extra-table">
						<FilterBase
							dataFilter={dataFilter}
							handleFilter={(listFilter: any) => handleFilter(listFilter)}
							handleReset={handleReset}
						/>

						<SortBox dataOption={sortOption} handleSort={(value) => handleSort(value)} />
					</div>
				}
				expandable={{ expandedRowRender }}
			/>
		</>
	);
};

PackageResultTeacher.layout = LayoutBase;
export default PackageResultTeacher;
