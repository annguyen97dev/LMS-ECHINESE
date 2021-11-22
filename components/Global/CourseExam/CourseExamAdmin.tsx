import { Switch, Tooltip } from 'antd';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { Eye, Tool } from 'react-feather';
import { studentApi } from '~/apiBase';
import { packageDetailApi } from '~/apiBase/package/package-detail';
import { courseExamApi } from '~/apiBase/package/course-exam';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';

import LayoutBase from '~/components/LayoutBase';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import CourseExamDetail from '~/components/Global/CourseExam/CourseExamDetail';

const CourseExamAdmin = () => {
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
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'SDT',
			dataIndex: 'Mobile',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isDone',
			render: (type) => (
				<>
					{type == true && <span className="tag green">Đã chấm tất cả</span>}
					{type == false && <span className="tag gray">Có bài chưa chấm</span>}
				</>
			)
		}

		// {
		// 	title: 'Đề thi',
		// 	dataIndex: 'ExamTopicName',
		// 	render: (text, data) => (
		// 		<Link
		// 			href={{
		// 				pathname: '/package/package-set-result/detail/[slug]',
		// 				query: { slug: `${data.ID}` }
		// 			}}
		// 		>
		// 			<a href="#" className="font-weight-black">
		// 				{text}
		// 			</a>
		// 		</Link>
		// 	)
		// },
		// {
		// 	title: 'Level',
		// 	dataIndex: 'SetPackageLevel',
		// 	render: (text) => <p className="font-weight-black">{text}</p>
		// },
		// {
		// 	title: 'Hình thức',
		// 	dataIndex: 'ExamTopicTypeName',
		// 	render: (text) => <p className="font-weight-black">{text}</p>
		// },
		// {
		// 	title: 'Giáo viên chấm bài',
		// 	dataIndex: 'TeacherName',
		// 	render: (text) => <p className="font-weight-primary">{text}</p>
		// },
		// {
		// 	title: 'Trạng thái chấm bài',
		// 	dataIndex: 'isDone',
		// 	render: (type) => (
		// 		<Fragment>
		// 			{type == true && <span className="tag green">Đã chấm xong</span>}
		// 			{type == false && <span className="tag gray">Chưa chấm xong</span>}
		// 		</Fragment>
		// 	)
		// },

		// {
		// 	render: (data) => (
		// 		<>
		// 			<Link
		// 				href={{
		// 					pathname: '/package/package-set-result/detail/[slug]',
		// 					query: { slug: `${data.ID}` }
		// 				}}
		// 			>
		// 				<Tooltip title="Kết quả bài làm">
		// 					<button className="btn btn-icon">
		// 						<ExclamationCircleOutlined />
		// 					</button>
		// 				</Tooltip>
		// 			</Link>
		// 		</>
		// 	)
		// }
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

	const getDataSetCourseExam = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await courseExamApi.getAllStudent({ ...params, pageIndex: page });
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
		getDataStudent();
		getDataPackageDetail();
	}, []);

	useEffect(() => {
		getDataSetCourseExam(currentPage);
	}, [params]);

	const expandedRowRender = (data, index) => {
		return (
			<>
				<CourseExamDetail studentID={data.UserInformationID} />
			</>
		);
	};

	return (
		<ExpandTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage=""
			dataSource={packageSetResult}
			columns={columns}
			TitleCard={null}
			Extra={
				<div className="extra-table">
					{/* <FilterBase
						dataFilter={dataFilter}
						handleFilter={(listFilter: any) => handleFilter(listFilter)}
						handleReset={handleReset}
					/> */}

					<SortBox dataOption={sortOption} handleSort={(value) => handleSort(value)} />
				</div>
			}
			handleExpand={(data) => setItemDetail(data)}
			expandable={{ expandedRowRender }}
		/>
	);
};
CourseExamAdmin.layout = LayoutBase;
export default CourseExamAdmin;
