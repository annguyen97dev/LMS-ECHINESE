import React, {useEffect, useRef, useState} from 'react';
import {packageExaminerApi, teacherApi} from '~/apiBase';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {numberWithCommas} from '~/utils/functions';
import PackageExaminerForm from './PackageExaminerForm/PackageExaminerForm';
import PackageExaminerSalary from './PackageExaminerForm/PackageExaminerSalary';

function PackageExaminer() {
	const [examinerList, setExaminerList] = useState<IPackageExaminer[]>([]);
	const [teacherList, setTeacherList] = useState<ITeacher[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Tên tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Tên giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Thưởng tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Thưởng giảm dần',
		},
	];
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		TeacherID: null,
		TeacherName: '',
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);

	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex,
		};
		setFilters({
			...filters,
			...refValue.current,
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};
		setFilters({
			...listFieldInit,
			...refValue.current,
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('');
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex);
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			[dataIndex]: valueSearch,
		});
	};
	const fetchTeacherList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await teacherApi.getAll({selectAll: true});
			if (res.status === 200) {
				setTeacherList(res.data.data);
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
		fetchTeacherList();
	}, []);
	const fetchExaminerList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await packageExaminerApi.getAll(filters);
			if (res.status === 200) {
				setExaminerList(res.data.data);
				setTotalPage(res.data.totalRow);
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
		fetchExaminerList();
	}, [filters]);
	// CREATE
	const onCreateExaminer = (idx: number) => {
		return async (examiner: {
			TeacherID: number;
			TeacherName?: string;
			Salary: string;
		}) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true,
				});
				const {TeacherID, Salary} = examiner;
				const newExaminer = {
					TeacherID,
					Salary: parseInt(Salary.replace(/\D/g, '')),
				};
				const res = await packageExaminerApi.add(newExaminer);
				if (res.status === 200) {
					const newTeacherList = [...teacherList];
					const newTeacher = {
						...teacherList[idx],
						isFixSetpacked: true,
					};
					newTeacherList.splice(idx, 1, newTeacher);
					setTeacherList(newTeacherList);
					onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
					showNoti('success', res.data.message);
					return true;
				}
			} catch (error) {
				showNoti('danger', error.Message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false,
				});
			}
		};
	};
	// UPDATE
	const onUpdateExaminer = (idx: number) => {
		return async (examiner: {
			TeacherID: number;
			TeacherName?: string;
			Salary: string;
		}) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true,
				});
				const {TeacherID, Salary} = examiner;
				const newExaminer = {
					TeacherID,
					Salary: parseInt(Salary.replace(/\D/g, '')),
				};
				const res = await packageExaminerApi.update(newExaminer);
				if (res.status === 200) {
					const newExaminerList = [...examinerList];
					newExaminerList.splice(idx, 1, {
						...newExaminerList[idx],
						...newExaminer,
					});
					setExaminerList(newExaminerList);
					showNoti('success', res.data.message);
					return true;
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false,
				});
			}
		};
	};
	// DELETE
	const onDeleteExaminer = (idx: number) => {
		return async () => {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			try {
				const delObj = examinerList[idx];
				const newDelObj = {
					TeacherID: delObj.TeacherID,
					Salary: delObj.Salary,
					Enable: false,
				};
				const res = await packageExaminerApi.delete(newDelObj);
				if (res.status === 200) {
					const newTeacherList = teacherList.map((t) =>
						newDelObj.TeacherID === t.UserInformationID
							? {...t, isFixSetpacked: false}
							: t
					);
					setTeacherList(newTeacherList);
				}

				if (examinerList.length === 1) {
					filters.pageIndex === 1
						? (setFilters({
								...listFieldInit,
								...refValue.current,
								pageIndex: 1,
						  }),
						  setExaminerList([]))
						: setFilters({
								...filters,
								...refValue.current,
								pageIndex: filters.pageIndex - 1,
						  });
					return;
				}
				fetchExaminerList();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false,
				});
			}
		};
	};

	const columns = [
		{
			title: 'Tên giáo viên',
			dataIndex: 'TeacherName',
			...FilterColumn('TeacherName', onSearch, onResetSearch),
			className:
				activeColumnSearch === 'TeacherName' ? 'active-column-search' : '',
		},
		{
			title: 'Thưởng chấm bài',
			dataIndex: 'Salary',
			render: (price) => (!price ? 0 : numberWithCommas(price)),
		},
		{
			title: 'SĐT',
			dataIndex: 'Mobile',
		},
		{
			align: 'center',
			width: 100,
			render: (_, record: IPackageExaminer, idx) => (
				<>
					<PackageExaminerSalary
						isLoading={isLoading}
						isUpdate={true}
						examinerObj={record}
						handleSubmit={onUpdateExaminer(idx)}
					/>
					<DeleteTableRow handleDelete={onDeleteExaminer(idx)} />
				</>
			),
		},
	];

	return (
		<PowerTable
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			loading={isLoading}
			Size="table-small"
			addClass="basic-header"
			dataSource={examinerList}
			columns={columns}
			TitlePage="Danh sách giáo viên chấm bộ đề"
			Extra={
				<div className="extra-table">
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
			TitleCard={
				<PackageExaminerForm
					isLoading={isLoading}
					teacherList={teacherList}
					handleCreateExaminer={onCreateExaminer}
				/>
			}
		/>
	);
}

export default PackageExaminer;
