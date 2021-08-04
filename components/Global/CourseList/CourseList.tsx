import {Card} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {branchApi, courseApi, programApi} from '~/apiBase';
import TitlePage from '~/components/Elements/TitlePage';
import CourseListFilterForm from '~/components/Global/CourseList/CourseListFilterForm';
import CourseListFilter from '~/components/Global/CourseList/CourseListFilterForm';
import PowerList from '~/components/Global/CourseList/PowerList';
import LayoutBase from '~/components/LayoutBase';
import {useWrap} from '~/context/wrap';
import {fmSelectArr} from '~/helpers';

const statusList = [
	{
		title: 'Sắp diễn ra',
		value: 0,
	},
	{
		title: 'Đang diễn ra',
		value: 1,
	},
	{
		title: 'Đã đóng',
		value: 2,
	},
];
const CourseList = () => {
	const [courseList, setCourseList] = useState<ICourse[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [optionListForFilter, setOptionListForFilter] = useState({
		statusList,
		branchList: [],
		programList: [],
	});
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,

		CourseName: '',
		Status: null,
		BranchID: null,
		ProgramID: null,
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
	});
	const [filters, setFilters] = useState(listFieldInit);
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		refValue.current = {
			...refValue.current,
			pageIndex,
		};
		setFilters({
			...filters,
			pageIndex,
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// ACTION SEARCH
	const onFilterCourseList = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj,
		});
	};
	// FETCH DATA FOR FILTER FORM
	const fetchDataForFilterForm = async () => {
		try {
			const res = await Promise.all([
				branchApi.getAll({pageSize: 99999, pageIndex: 1}),
				programApi.getAll({selectAll: true}),
			])
				.then(([branchRes, programRes]) => {
					const newOptionList = {
						branchList: [],
						programList: [],
					};
					branchRes.status === 200 &&
						(newOptionList.branchList = fmSelectArr(
							branchRes.data.data,
							'BranchName',
							'ID'
						));
					programRes.status === 200 &&
						(newOptionList.programList = fmSelectArr(
							programRes.data.data,
							'ProgramName',
							'ID'
						));
					setOptionListForFilter({
						...optionListForFilter,
						...newOptionList,
					});
				})
				.catch((err) =>
					console.log('fetchDataForFilterForm - PromiseAll:', err)
				);
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		fetchDataForFilterForm();
	}, []);
	// GET DATA IN FIRST TIME
	const fetchScheduleList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
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
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchScheduleList();
	}, [filters]);
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
										handleFilterCourseList={onFilterCourseList}
										handleResetFilterCourseList={onResetSearch}
									/>
								</div>
							}
						>
							<div className="course-list-content">
								<PowerList
									isLoading={isLoading}
									dataSource={courseList}
									totalPage={totalPage}
									getPagination={getPagination}
								/>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

CourseList.layout = LayoutBase;
export default CourseList;
