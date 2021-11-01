import { Switch, Tooltip } from 'antd';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { Eye, Tool } from 'react-feather';
import { packageExaminerApi, studentApi } from '~/apiBase';
import { packageDetailApi } from '~/apiBase/package/package-detail';
import { packageResultApi } from '~/apiBase/package/package-result';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import PackagePickTeacher from '~/components/Global/Package/PackageResult/PackagePickTeacher';
import PackageResultExpand from '~/components/Global/Package/PackageResult/PackageResultExpand';
import PackageResultUpdateTeacher from '~/components/Global/Package/PackageResult/PackageResultUpdateTeacher';
import LayoutBase from '~/components/LayoutBase';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { teacherApi } from '~/apiBase';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';

const PackageSetResult = () => {
	const [dataTeacher, setDataTeacher] = useState([]);

	// Get list teacher
	const getListTeacher = async () => {
		// setLoadingTeacher(true);
		try {
			let res = await packageExaminerApi.getAll({
				selectAll: true
			});

			if (res.status === 200) {
				let newData = res.data.data.map((item) => ({
					title: item.TeacherName,
					value: item.TeacherID
				}));
				setDataTeacher(newData);
			}
		} catch (error) {
			console.log('Error Get List Teacher: ', error.message);
		} finally {
			// setLoadingTeacher(true);
		}
	};

	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			StudentName: data
		});
	};

	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
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
			render: (text, data) => (
				<Link
					href={{
						pathname: '/package/package-set-result/detail/[slug]',
						query: { slug: `${data.ID}` }
					}}
				>
					<a href="#" className="font-weight-black">
						{text}
					</a>
				</Link>
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
			render: (text) => <p className="font-weight-blue">{text}</p>
		},
		{
			title: 'Trạng thái chấm bài',
			dataIndex: 'isDone',
			render: (type) => (
				<Fragment>
					{type == true && <span className="tag green">Đã chấm xong</span>}
					{type == false && <span className="tag gray">Chưa chấm xong</span>}
				</Fragment>
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
			render: (data) => (
				<>
					<Link
						href={{
							pathname: '/package/package-set-result/detail/[slug]',
							query: { slug: `${data.ID}` }
						}}
					>
						<Tooltip title="Kết quả bộ đề chi tiết">
							<button className="btn btn-icon">
								<ExclamationCircleOutlined />
							</button>
						</Tooltip>
					</Link>
					{(data.StatusID == 2 || data.StatusID == 4) && (
						<PackagePickTeacher dataRow={data} dataTeacher={dataTeacher} onFetchData={onFetchData} />
					)}
				</>
			)
		}
	];
	const [currentPage, setCurrentPage] = useState(1);
	const [itemDetail, setItemDetail] = useState();

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
			name: 'isDone',
			title: 'Trạng thái chấm bài',
			col: 'col-12',
			type: 'select',
			optionList: [
				{
					value: true,
					title: 'Đã chấm xong'
				},
				{
					value: false,
					title: 'Chưa chấm xong'
				}
			],
			value: null
		},
		// {
		// 	name: 'ExamTopicType',
		// 	title: 'Hình thức',
		// 	col: 'col-12',
		// 	type: 'select',
		// 	optionList: [
		// 		{
		// 			value: 1,
		// 			title: 'Trắc nghiệm'
		// 		},
		// 		{
		// 			value: 2,
		// 			title: 'Tự luận'
		// 		}
		// 	],
		// 	value: null
		// },
		{
			name: 'date-range',
			title: 'Ngày tạo',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

	const handleFilter = (listFilter) => {
		console.log('List Filter when submit: ', listFilter);

		let newListFilter = {
			pageIndex: 1,
			fromDate: null,
			toDate: null,
			StudentID: null,
			SetPackageDetailID: null,
			isDone: null,
			StudentName: null,
			ExamTopicType: null
		};
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setParams({ ...listParamsDefault, ...newListFilter, pageIndex: 1 });
	};

	const handleSort = async (option) => {
		setParams({
			...listParamsDefault,
			sortType: option.title.sortType
		});
	};

	const { showNoti, pageSize } = useWrap();
	const listParamsDefault = {
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
		ExamTopicType: null
	};
	const [params, setParams] = useState(listParamsDefault);
	const [totalPage, setTotalPage] = useState(null);
	const [packageSetResult, setPackageSetResult] = useState<ISetPackageResult[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

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

	const getDataStudent = async () => {
		try {
			let res = await studentApi.getAll({ pageSize: pageSize, pageIndex: 1 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				setDataFunc('StudentID', newData);
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu học sinh này!');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	const getDataPackageDetail = async () => {
		try {
			let res = await packageDetailApi.getAll({
				pageSize: 99999,
				pageIndex: 1
			});
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.SetPackageName,
					value: item.ID
				}));
				setDataFunc('SetPackageDetailID', newData);
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu bộ đề này!');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	useEffect(() => {
		getDataStudent();
		getDataPackageDetail();
		getListTeacher();
	}, []);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const onFetchData = () => {
		setParams({
			...params
		});
	};

	const getDataSetPackageResult = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await packageResultApi.getAll({ ...params, pageIndex: page });
				//@ts-ignore
				res.status == 200 && setPackageSetResult(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
					setParams(listParamsDefault);
					setPackageSetResult([]);
				} else setTotalPage(res.data.totalRow);
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

	useEffect(() => {
		getDataSetPackageResult(currentPage);
	}, [params]);

	const expandedRowRender = (data, index) => {
		return (
			<Fragment>
				<PackageResultExpand infoID={data.ID} />
			</Fragment>
		);
	};

	return (
		<ExpandTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="KẾT QUẢ BỘ ĐỀ"
			dataSource={packageSetResult}
			columns={columns}
			TitleCard={
				<>
					<PackageResultUpdateTeacher
						reloadData={(firstPage) => {
							setCurrentPage(1);
							getDataSetPackageResult(firstPage);
						}}
					/>
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
			handleExpand={(data) => setItemDetail(data)}
			expandable={{ expandedRowRender }}
		/>
	);
};
PackageSetResult.layout = LayoutBase;
export default PackageSetResult;
