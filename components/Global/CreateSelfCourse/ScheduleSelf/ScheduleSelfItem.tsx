import { yupResolver } from '@hookform/resolvers/yup';
import { Collapse, Spin } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import { optionCommonPropTypes } from '~/utils/proptypes';
const { Panel } = Collapse;

const ScheduleSelfItem = (props) => {
	const {
		handleChangeStatusSchedule,
		handleChangeValueSchedule,
		handleAheadSchedule,
		//
		scheduleObj,
		isLoading,
		isUnavailable,
		isEditView,
		isClickAheadSchedule,
		//
		handleCancelSchedule,
		isCancelSchedule,
		//
		optionTeacherList,
		optionStudyTime
	} = props;
	const { ID, SubjectName, TeacherName, Date, TeacherID, CaID, StudyTimeID } = scheduleObj as ISCSchedule;
	const defaultValuesInit = {
		TeacherID: 0,
		StudyTimeID: 0
	};
	const schema = yup.object().shape({
		StudyTimeID: yup.number().min(1, 'Bạn cần chọn ca học').required('Bạn không được để trống'),
		TeacherID: yup.number().min(1, 'Bạn cần chọn giáo viên').required('Bạn không được để trống')
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
		mode: 'all'
	});

	const checkHandleChangeStatusSchedule = (vl, type) => {
		if (!handleChangeStatusSchedule) return;
		handleChangeStatusSchedule(vl, type);
	};
	const checkHandleChangeValueSchedule = (uid, key, vl) => {
		if (!handleChangeValueSchedule) return;
		handleChangeValueSchedule(uid, key, vl);
	};
	const setSiblingsFieldToDefault = () => {
		form.setValue('TeacherID', 0);
	};
	const checkHandleAheadSchedule = (courseScheduleId: number, teacherId: number) => {
		if (!handleAheadSchedule) return;
		handleAheadSchedule(courseScheduleId, teacherId);
	};
	const checkHandleCancelSchedule = (sch: ISCSchedule) => {
		if (!handleCancelSchedule) return;
		handleCancelSchedule(sch);
	};
	// CHECK IF VALUE DO NOT IN THE SELECT => CHANGE VALUE TO DEFAULT (0)
	useEffect(() => {
		form.clearErrors();
		if (
			(isLoading.type === 'CHECK_SCHEDULE' || isLoading.type === 'ADD_DATA') &&
			!isLoading.status &&
			Array.isArray(optionTeacherList) &&
			optionTeacherList.length > 0 &&
			Array.isArray(optionStudyTime) &&
			optionStudyTime.length > 0
		) {
			if (isEditView) {
				form.setValue('TeacherID', TeacherID);
			} else {
				form.setValue('TeacherID', optionTeacherList[0].value);
			}
			form.setValue('StudyTimeID', CaID || StudyTimeID);
		}
		if (isLoading.type === 'SCHEDULE_INVALID' && isLoading.status) {
			form.setValue('TeacherID', optionTeacherList[0]?.value);
			form.setValue('StudyTimeID', optionStudyTime[0]?.value);
		}
	}, [scheduleObj, optionTeacherList, optionStudyTime, isLoading]);

	return (
		<Panel
			{...props}
			header={
				<div className="info-course-item">
					<Checkbox
						onChange={() => {
							if (isUnavailable) {
								// remove schedule from unavailable list
								// add schedule to available list
								checkHandleChangeStatusSchedule(scheduleObj, 2);
							} else {
								// remove schedule from available list
								// add schedule to unavailable list
								checkHandleChangeStatusSchedule(scheduleObj, 1);
							}
						}}
						checked={isUnavailable}
					/>
					<p className="title">Buổi học tự sắp xếp</p>
					<ul className="info-course-list">
						<li>{SubjectName || 'Tên môn học'}</li>
					</ul>
				</div>
			}
		>
			<div className="info-course-select">
				<div className="row">
					<div className="col-12">
						<SelectField
							form={form}
							name="StudyTimeID"
							placeholder="Chọn ca"
							optionList={optionStudyTime}
							onChangeSelect={(value) => {
								setSiblingsFieldToDefault();
								checkHandleChangeValueSchedule(ID, 'CaID', value);
							}}
						/>
					</div>
					<div className="col-12">
						<SelectField
							form={form}
							name="TeacherID"
							isLoading={isLoading.type === 'CHECK_SCHEDULE' && isLoading.status}
							placeholder="Chọn giáo viên"
							optionList={optionTeacherList}
							onChangeSelect={(value) => {
								if (isEditView) {
									checkHandleChangeValueSchedule(ID, 'TeacherID', value);
								}
							}}
						/>
					</div>
					{isCancelSchedule && (
						<div className="col-12 text-right">
							<button
								className="btn btn-secondary"
								disabled={isLoading.type === 'CANCEL_SCHEDULE' && isLoading.status}
								onClick={() => checkHandleCancelSchedule(scheduleObj)}
							>
								Hủy buổi học
								{isLoading.type === 'CANCEL_SCHEDULE' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					)}
					{/* {isEditView && !isClickAheadSchedule && typeof ID === 'number' && (
						<div className="col-12 text-right">
							<button
								className="btn btn-secondary"
								disabled={isLoading.type === 'AHEAD_SCHEDULE' && isLoading.status}
								onClick={() => checkHandleAheadSchedule(ID, TeacherID)}
							>
								Lùi buổi học
								{isLoading.type === 'AHEAD_SCHEDULE' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					)} */}
				</div>
			</div>
		</Panel>
	);
};
ScheduleSelfItem.propTypes = {
	handleChangeValueSchedule: PropTypes.func,
	handleChangeStatusSchedule: PropTypes.func,
	//
	scheduleObj: PropTypes.shape({
		ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		eventName: PropTypes.string,
		Tiet: PropTypes.shape({
			CurriculumsDetailID: PropTypes.number,
			CurriculumsDetailName: PropTypes.string,
			SubjectID: PropTypes.number
		}),
		TeacherID: PropTypes.number,
		TeacherName: PropTypes.string,
		CaID: PropTypes.number,
		CaName: PropTypes.string,
		StudyTimeID: PropTypes.number,
		SubjectName: PropTypes.string,
		Date: PropTypes.string
	}),
	isUnavailable: PropTypes.bool,
	isEditView: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	//
	handleAheadSchedule: PropTypes.func,
	isClickAheadSchedule: PropTypes.bool,
	//
	handleCancelSchedule: PropTypes.func,
	isCancelSchedule: PropTypes.bool,
	//
	optionTeacherList: optionCommonPropTypes,
	optionStudyTime: optionCommonPropTypes
};
ScheduleSelfItem.defaultProps = {
	handleChangeValueSchedule: null,
	handleChangeStatusSchedule: null,
	//
	scheduleObj: {},
	isUnavailable: false,
	isEditView: false,
	isLoading: { type: '', status: false },
	//
	handleAheadSchedule: null,
	isClickAheadSchedule: false,
	//
	handleCancelSchedule: null,
	isCancelSchedule: false,
	//
	optionTeacherList: [],
	optionStudyTime: []
};
export default ScheduleSelfItem;
