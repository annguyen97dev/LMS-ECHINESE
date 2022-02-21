import { Card } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { branchApi, courseApi, programApi, teacherApi } from '~/apiBase';
import TitlePage from '~/components/Elements/TitlePage';
import CourseListFilterForm from '~/components/Global/CourseList/CourseListFilterForm';
import PowerList from '~/components/Global/CourseList/PowerList';
import { useWrap } from '~/context/wrap';
import { fmSelectArr } from '~/utils/functions';
import CourseListUpdate from './CourseListUpdate';

const statusList = [
	{
		title: 'Sắp diễn ra',
		value: 0
	},
	{
		title: 'Đang diễn ra',
		value: 1
	},
	{
		title: 'Đã đóng',
		value: 2
	}
];
const CourseList = () => {
	const [courseList, setCourseList] = useState<ICourse[]>([]);
	const [courseListAdmin, setCourseListAdmin] = useState<ICourseAdmin[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [isShowUpdate, setIsShowUpdate] = useState(false);
	const [totalPage, setTotalPage] = useState(null);
	const { showNoti, userInformation } = useWrap();
	const [optionListForFilter, setOptionListForFilter] = useState({
		statusList,
		branchList: [],
		programList: []
	});
	const [optionListForUpdate, setOptionListForUpdate] = useState({
		academicList: [],
		teacherLeadList: []
	});
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,

		CourseName: '',
		Status: null,
		BranchID: null,
		ProgramID: null
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10
	});
	const [filters, setFilters] = useState(listFieldInit);
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex
		};
		setFilters({
			...filters,
			...refValue.current
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize
		});
	};
	// ACTION SEARCH
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj
		});
	};
	// FETCH DATA FOR FILTER FORM
	const fetchDataForFilterForm = async () => {
		try {
			const res = await Promise.all([branchApi.getAll({ pageSize: 99999, pageIndex: 1 }), programApi.getAll({ selectAll: true })])
				.then(([branchRes, programRes]) => {
					const newOptionList = {
						branchList: [],
						programList: []
					};
					branchRes.status === 200 && (newOptionList.branchList = fmSelectArr(branchRes.data.data, 'BranchName', 'ID'));
					programRes.status === 200 && (newOptionList.programList = fmSelectArr(programRes.data.data, 'ProgramName', 'ID'));
					setOptionListForFilter({
						...optionListForFilter,
						...newOptionList
					});
				})
				.catch((err) => console.log('fetchDataForFilterForm - PromiseAll:', err));
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	// GET DATA IN FIRST TIME
	const fetchScheduleList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await courseApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setCourseList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const fetchScheduleListAdmin = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await courseApi.getAllFull(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setCourseListAdmin(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		fetchScheduleList();
		fetchScheduleListAdmin();
	}, [filters]);

	// FETCH DATA FOR UPDATE FORM
	const fetchDataForUpdateForm = async (BranchID) => {
		setIsLoading({
			type: 'FETCH_DATA',
			status: true
		});
		try {
			const res = await teacherApi.getAll({ pageSize: 99999 });
			if (res.status === 200) {
				const newTeacherList = [
					{ title: '---Trống---', value: 0 },
					...fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID')
				];
				setOptionListForUpdate({
					...optionListForUpdate,
					teacherLeadList: newTeacherList
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_DATA',
				status: false
			});
		}
	};
	// UPATE COURSE
	const onUpdateCourse = async (obj) => {
		setIsLoading({
			type: 'UPDATE_DATA',
			status: true
		});
		let res;
		try {
			const { BranchID, SalaryOfLesson, ...newObj } = obj;
			res = await courseApi.update({
				...newObj,
				SalaryOfLesson: +SalaryOfLesson.replace(/\D/g, '')
			});
			if (res.status === 200) {
				fetchScheduleList();
				showNoti('Success', 'Cập nhật dữ liệu thành công');
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'UPDATE_DATA',
				status: false
			});
		}
		return res;
	};

	useEffect(() => {
		if (userInformation) {
			const role = userInformation?.RoleID;
			if (role === 1) {
				setIsShowUpdate(true);
			}
			if (role === 1 || role === 5) {
				fetchDataForFilterForm();
			}
		}
	}, [userInformation]);

	return (
		<div className="course-list-page">
			<div className="row">
				<div className="col-12">
					<TitlePage title="Danh sách khóa học" />

					<div className="wrap-table">
						<Card
							title={
								<div className="list-action-table">
									<CourseListFilterForm
										optionList={optionListForFilter}
										handleFilter={onFilter}
										handleResetFilter={onResetSearch}
									/>
								</div>
							}
						>
							<div className="course-list-content">
								<PowerList
									isLoading={isLoading}
									dataSource={
										userInformation && (userInformation.RoleID === 1 || userInformation.RoleID === 2)
											? courseList
											: courseListAdmin
									}
									totalPage={totalPage}
									currentPage={filters.pageIndex}
									getPagination={getPagination}
									setFilters={setFilters}
									filters={filters}
								>
									{isShowUpdate ? (
										<CourseListUpdate
											isLoading={isLoading}
											optionList={optionListForUpdate}
											handleOnUpdateCourse={onUpdateCourse}
											handleFetchDataForUpdateForm={fetchDataForUpdateForm}
										/>
									) : (
										<></>
									)}
								</PowerList>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseList;
