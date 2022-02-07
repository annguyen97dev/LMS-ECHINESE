import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Collapse, Spin, Popconfirm } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { deleteCourseScheduleApi } from '~/apiBase/deleteCourseSchedule/delete-course-schedule';
import SelectField from '~/components/FormControl/SelectField';
import { useWrap } from '~/context/wrap';
import { optionCommonPropTypes } from '~/utils/proptypes';
const { Panel } = Collapse;

const ScheduleOnlineItem = (props) => {
	const {
		handleChangeStatusSchedule,
		handleChangeValueSchedule,
		reloadData,
		handleAheadSchedule,
		//
		scheduleObj,
		isLoading,
		isUnavailable,
		isEditView,
		isClickAheadSchedule,
		//
		optionTeacherList,
		optionStudyTime,
		//
		saveBeforeAheadSchedule
	} = props;
	// IF NOT OWNER SCHEDULE < LOCK
	const [isLockSchedule, setIsLockSchedule] = useState(false);
	const { userInformation, showNoti, isAdmin } = useWrap();

	const {
		ID,
		eventName,
		Tiet,
		CaID,
		TeacherID,
		// EDIT
		Date,
		TeacherName,
		SubjectName,
		StudyTimeID
	} = scheduleObj;
	const defaultValuesInit = {
		TeacherID: TeacherID,
		StudyTimeID: CaID || StudyTimeID
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
	// CHECK IF VALUE DO NOT IN THE SELECT => CHANGE VALUE TO DEFAULT (0)
	useEffect(() => {
		form.clearErrors();
		if (
			(isLoading.type === 'CHECK_SCHEDULE' || isLoading.type === 'ADD_DATA') &&
			!isLoading.status &&
			Array.isArray(optionTeacherList) &&
			optionTeacherList.length > 0
		) {
			if (isEditView) {
				form.setValue('TeacherID', TeacherID);
			} else {
				form.setValue('TeacherID', optionTeacherList[0].value);
			}
			form.setValue('StudyTimeID', CaID || StudyTimeID);
		}
	}, [scheduleObj, optionTeacherList, isLoading]);

	useEffect(() => {
		setIsLockSchedule(false);
		if (userInformation?.RoleID === 2 && TeacherID !== 0 && TeacherID !== userInformation?.UserInformationID) {
			setIsLockSchedule(true);
		}
	}, [scheduleObj]);

	const onDelete = async () => {
		try {
			const res: any = await deleteCourseScheduleApi.delete(ID);
			reloadData();
			res?.message == 'Thành công !' && showNoti('success', 'Thành công!');
		} catch (error) {
			error?.status === 400 && showNoti('danger', 'Không thành công');
		}
	};

	// console.log('ID: ', ID);

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
						disabled={isLockSchedule}
					/>
					<p className="title">{eventName || `${moment(Date).format('DD/MM')} - ${TeacherName}`}</p>
					<ul className="info-course-list">
						<li>{Tiet?.CurriculumsDetailName || SubjectName}</li>
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
							disabled={isLockSchedule}
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
							disabled={isLockSchedule}
						/>
					</div>

					<div className="col-12 text-right">
						{isEditView && !isClickAheadSchedule && typeof ID === 'number' && saveBeforeAheadSchedule && (
							<>
								{isAdmin && (
									<Popconfirm title="Bạn muốn xóa buổi học này?" onConfirm={onDelete} okText="Yes" cancelText="No">
										<Button className="btn btn-primary" style={{ height: 39 }}>
											Xóa Buổi Học
										</Button>
									</Popconfirm>
								)}

								<button
									className="btn btn-secondary ml-3"
									disabled={(isLoading.type === 'AHEAD_SCHEDULE' && isLoading.status) || isLockSchedule}
									onClick={() => checkHandleAheadSchedule(ID, TeacherID)}
								>
									Lùi buổi học
									{isLoading.type === 'AHEAD_SCHEDULE' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</Panel>
	);
};
ScheduleOnlineItem.propTypes = {
	handleChangeValueSchedule: PropTypes.func,
	handleChangeStatusSchedule: PropTypes.func,
	handleAheadSchedule: PropTypes.func,
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
	isClickAheadSchedule: PropTypes.bool,
	//
	optionTeacherList: optionCommonPropTypes,
	optionStudyTime: optionCommonPropTypes,
	//
	saveBeforeAheadSchedule: PropTypes.bool,
	reloadData: PropTypes.func
};
ScheduleOnlineItem.defaultProps = {
	handleChangeValueSchedule: null,
	handleChangeStatusSchedule: null,
	handleAheadSchedule: null,
	//
	scheduleObj: {},
	isUnavailable: false,
	isEditView: false,
	isLoading: { type: '', status: false },
	isClickAheadSchedule: false,
	//
	optionTeacherList: [],
	optionStudyTime: [],
	//
	saveBeforeAheadSchedule: true,
	reloadData: null
};
export default ScheduleOnlineItem;
