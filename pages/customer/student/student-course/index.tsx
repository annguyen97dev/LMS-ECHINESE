import { Tooltip } from 'antd';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { Eye, Info } from 'react-feather';
import { branchApi, courseApi } from '~/apiBase';
import { courseStudentApi } from '~/apiBase/customer/student/course-student';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import ChangeCourseForm from '~/components/Global/Customer/Student/CourseOfStudent/ChangeCourseForm';
import LayoutBase from '~/components/LayoutBase';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import ReserveCourseForm from '~/components/Global/Customer/Student/CourseOfStudent/ReserveCourseForm';
import PowerTable from '~/components/PowerTable';

const CourseStudent = () => {
	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			FullNameUnicode: data
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
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Khóa học',
			dataIndex: 'CourseName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Cảnh báo',
			dataIndex: 'Warning',
			render: (type) => (
				<Fragment>
					{type == true && <span className="tag red">CÓ</span>}
					{type == false && <span className="tag green">KHÔNG</span>}
				</Fragment>
			)
		},
		{
			title: 'Cam kết ',
			dataIndex: 'Commitment'
		},

		{
			render: (data) => (
				<Fragment>
					<Link
						href={{
							pathname: '/customer/student/student-course/student-detail/[slug]',
							query: { slug: data.UserInformationID }
						}}
					>
						<Tooltip title="Xem chi tiết">
							<button className="btn btn-icon">
								<Eye />
							</button>
						</Tooltip>
					</Link>

					<ChangeCourseForm
						infoDetail={data}
						infoId={data.ID}
						reloadData={(firstPage) => {
							getDataCourseStudent(firstPage);
						}}
						currentPage={currentPage}
					/>

					<ReserveCourseForm
						infoDetail={data}
						infoId={data.ID}
						reloadData={(firstPage) => {
							getDataCourseStudent(firstPage);
						}}
						currentPage={currentPage}
					/>
				</Fragment>
			)
		}
	];
	const [currentPage, setCurrentPage] = useState(1);

	const { showNoti, pageSize } = useWrap();

	const listParamsDefault = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		BranchID: null,
		CourseID: null,
		FullNameUnicode: null,
		Combo: null,
		CourseOfStudentPriceID: null
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

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'BranchID',
			title: 'Trung tâm',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'CourseID',
			title: 'Khóa học',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'Combo',
			title: 'Chọn gói',
			col: 'col-12',
			type: 'select',
			optionList: [
				{
					value: true,
					title: 'Gói combo'
				},
				{
					value: false,
					title: 'Gói lẻ'
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
			BranchID: null,
			CourseID: null,
			Combo: null
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

	const [params, setParams] = useState(listParamsDefault);

	const [totalPage, setTotalPage] = useState(null);
	const [courseStudent, setCourseStudent] = useState<ICourseOfStudent[]>([]);
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

	const getDataCenter = async () => {
		try {
			let res = await branchApi.getAll({ pageSize: 99999, pageIndex: 1 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));
				setDataFunc('BranchID', newData);
			}

			res.status == 204 && showNoti('danger', 'Trung tâm Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	const getDataCourse = async () => {
		try {
			let res = await courseApi.getAll({ pageSize: 99999, pageIndex: 1 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.CourseName,
					value: item.ID
				}));
				setDataFunc('CourseID', newData);
			}

			res.status == 204 && showNoti('danger', 'Trung tâm Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	useEffect(() => {
		getDataCenter();
		getDataCourse();
	}, []);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const getDataCourseStudent = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await courseStudentApi.getAll({ ...params, pageIndex: page });
				//@ts-ignore
				res.status == 200 && setCourseStudent(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
					setParams(listParamsDefault);
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
		getDataCourseStudent(currentPage);
	}, [params]);

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="DANH SÁCH HỌC VIÊN TRONG KHÓA"
			dataSource={courseStudent}
			columns={columns}
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
		/>
	);
};
CourseStudent.layout = LayoutBase;
export default CourseStudent;
