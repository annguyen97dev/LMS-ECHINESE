import {Input, Select} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {rollUpApi} from '~/apiBase/course-detail/roll-up';
import PowerTable from '~/components/PowerTable';
import {useDebounce} from '~/context/useDebounce';
import {useWrap} from '~/context/wrap';

RollUp.propTypes = {
	courseID: PropTypes.number,
};
interface IStudentRollUp {
	ID: number;
	CourseID: number;
	StudentID: number;
	StudentName: string;
	Mobile: string;
	Email: string;
	AcademicName: string;
	DayOff: number;
	Warning: boolean;
	RollUpID: number;
	BranchID: number;
	CourseScheduleID: number;
	Note: string;
	StatusID: number;
	StatusName: string;
	LearningStatusID: number;
	LearningStatusName: string;
}
type TypeDataRollUp = {
	RollUp: IRollUp[];
	ScheduleList: IOptionCommon[];
	StudentList: IStudentRollUp[];
};
function RollUp(props) {
	const {courseID} = props;
	const {showNoti} = useWrap();
	const [dataRollUp, setDataRollUp] = useState<TypeDataRollUp>({
		RollUp: [],
		ScheduleList: [],
		StudentList: [],
	});
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {Option} = Select;
	const rollUpStatusOptionList = [
		{value: 0, title: '---Chọn trạng thái---'},
		{title: 'Có mặt', value: 1},
		{title: 'Vắng có phép', value: 2},
		{title: 'Vắng không phép', value: 3},
		{title: 'Đi muộn', value: 4},
		{title: 'Về sớm', value: 5},
		{title: 'Nghỉ lễ', value: 6},
	];
	const leaningStatusOptionList = [
		{value: 0, title: '---Chọn học lực---'},
		{title: 'Giỏi', value: 1},
		{title: 'Khá', value: 2},
		{title: 'Trung bình', value: 3},
		{title: 'Kém', value: 4},
		{title: 'Theo dõi đặc biệt', value: 5},
		{title: 'Có cố gắng', value: 6},
		{title: 'Không cố gắng', value: 7},
		{title: 'Không nhận xét', value: 8},
	];
	// FILTER
	const [filters, setFilters] = useState({
		pageSize: 10,
		pageIndex: 1,
		CourseID: courseID,
		CourseScheduleID: 0,
		StudentID: 0,
	});
	const getPagination = (pageNumber: number) => {
		setFilters({
			...filters,
			pageIndex: pageNumber,
		});
	};
	const onSelectCourseSchedule = (CourseScheduleID: number) => {
		setFilters({
			...filters,
			CourseScheduleID,
		});
	};
	const onChangeValue = async (
		key: string,
		vl: number | string | boolean,
		idx: number
	) => {
		try {
			const newStudentList = [...dataRollUp.StudentList];
			const student: IStudentRollUp = {
				...newStudentList[idx],
				[key]: vl,
			};
			let dataChange = {
				BranchID: dataRollUp.ScheduleList[1].options.BranchID,
				CourseID: filters.CourseID,
				CourseScheduleID: filters.CourseScheduleID,
				StudentID: student.StudentID,
				StatusID: student.StatusID,
				LearningStatusID: student.LearningStatusID,
				Note: student.Note,
				Warning: student.Warning,
				[key]: vl,
			};
			let res = await rollUpApi.update([dataChange]);
			if (res.status === 200) {
				newStudentList.splice(idx, 1, student);
				setDataRollUp({...dataRollUp, StudentList: newStudentList});
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	const debounceOnChangeValue = useDebounce(onChangeValue, 500, []);
	const getRollUpList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await rollUpApi.getAll(filters);
			if (res.status === 200) {
				const {RollUp, ScheduleList, StudentList, TotalRow} = res.data;
				const fmScheduleList = ScheduleList.map((item, index) => {
					const date = moment(item.StartTime).format('DD/MM/YYYY');
					const startTime = moment(item.StartTime).format('HH:mm');
					const endTime = moment(item.EndTime).format('HH:mm');
					return {
						value: item.ID,
						title: `${
							item.RoomName ? `[${item.RoomName}]` : ''
						}[${date}] ${startTime} - ${endTime}`,
						options: {
							BranchID: item.BranchID,
						},
					};
				});
				const fmStudentList = StudentList.map((s) => {
					const studentRollUp = RollUp.find((r) => r.StudentID === s.StudentID);
					const moreInfo = {
						RollUpID: studentRollUp?.ID || 0,
						BranchID: studentRollUp?.BranchID || 0,
						CourseScheduleID: studentRollUp?.CourseScheduleID || 0,
						Note: studentRollUp?.Note || '',
						StatusID: studentRollUp?.StatusID || 0,
						StatusName: studentRollUp?.StatusName || '',
						LearningStatusID: studentRollUp?.LearningStatusID || 0,
						LearningStatusName: studentRollUp?.LearningStatusName || '',
					};
					return {
						...s,
						...moreInfo,
					};
				});
				setDataRollUp({
					RollUp,
					ScheduleList: [
						{value: 0, title: '---Chọn ca học---'},
						...fmScheduleList,
					],
					StudentList: filters.CourseScheduleID ? fmStudentList : [],
				});
				setTotalPage(TotalRow);
			}
			if (res.status === 204) {
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
		getRollUpList();
	}, [filters]);
	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'StudentName',
			render: (text) => <p className="font-weight-blue">{text}</p>,
		},
		{
			title: 'Điểm danh',
			dataIndex: 'StatusID',
			render: (status: number, item: IStudentRollUp, idx: number) => {
				return (
					<Select
						key={item.RollUpID}
						style={{width: 200}}
						value={status}
						className="style-input"
						onChange={(vl) => debounceOnChangeValue('StatusID', vl, idx)}
					>
						{rollUpStatusOptionList.map((o, idx) => (
							<Option key={idx} value={o.value}>
								{o.title}
							</Option>
						))}
					</Select>
				);
			},
		},
		{
			title: 'Học lực',
			dataIndex: 'LearningStatusID',
			render: (status: number, item: IStudentRollUp, idx) => {
				return (
					<Select
						key={item.RollUpID}
						style={{width: 200}}
						value={status}
						className="style-input"
						onChange={(vl) =>
							debounceOnChangeValue('LearningStatusID', vl, idx)
						}
					>
						{leaningStatusOptionList.map((o, idx) => (
							<Option key={idx} value={o.value}>
								{o.title}
							</Option>
						))}
					</Select>
				);
			},
		},
		{
			title: 'Đánh giá',
			dataIndex: 'Note',
			render: (note: string, item: IStudentRollUp, idx) => {
				return (
					<Input
						key={item.RollUpID}
						defaultValue={note}
						style={{width: 200}}
						placeholder="Nhập đánh giá"
						className="style-input"
						allowClear={true}
						onChange={(e) => debounceOnChangeValue('Note', e.target.value, idx)}
					/>
				);
			},
		},
		{
			title: 'Cảnh cáo',
			dataIndex: 'Warning',
			align: 'center',
			render: (warning, item: IStudentRollUp, idx) => {
				return (
					<Checkbox
						disabled={warning}
						checked={warning}
						onChange={(e) =>
							debounceOnChangeValue('Warning', e.target.checked, idx)
						}
					/>
				);
			},
		},
	];
	return (
		<PowerTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			dataSource={dataRollUp.StudentList}
			columns={columns}
			TitleCard={
				<div className="d-flex align-items-center">
					<div className="">
						<b>Ca học:</b>
					</div>
					<div>
						<Select
							defaultValue={0}
							style={{width: 280, paddingLeft: 20, marginBottom: 0}}
							className="style-input"
							onChange={onSelectCourseSchedule}
						>
							{dataRollUp.ScheduleList.map((o, idx) => (
								<Option key={idx} value={o.value}>
									{o.title}
								</Option>
							))}
						</Select>
					</div>
				</div>
			}
		/>
	);
}
export default RollUp;
