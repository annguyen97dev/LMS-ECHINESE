import {yupResolver} from '@hookform/resolvers/yup';
import {Collapse} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
const {Panel} = Collapse;

//   scheduleObj = {
//     "ID": 1,
//     "eventName": "26/07 - Hữu Minh Teacher 10 [20:00-21:00]-[Phòng 2]",
//     "Color": "orange",
//     "Tiet": {
//         "CurriculumsDetailID": 140,
//         "CurriculumsDetailName": "1: Sinh"
//     },
//     "date": "2021-07-26",
//     "TeacherID": 1060,
//     "TeacherName": "Hữu Minh Teacher 10[20:00-21:00]",
//     "CaID": 5,
//     "CaName": "Ca: 20:00 - 21:00",
//     "RoomID": 32,
//     "RoomName": "Phòng: Phòng 2"
// }
const ScheduleItem = (props) => {
	const {
		handleChangeStatusSchedule,
		handleChangeValueSchedule,
		//
		scheduleObj,
		isLoading,
		isUpdate,
		//
		optionForScheduleList,
		optionStudyTime,
	} = props;
	const {
		ID,
		eventName,
		Tiet,
		CaID,
		// EDIT
		Date,
		TeacherName,
		RoomName,
		SubjectName,
	} = scheduleObj;

	const defaultValuesInit = {
		RoomID: 0,
		TeacherID: 0,
		StudyTimeID: CaID,
	};
	const schema = yup.object().shape({
		StudyTimeID: yup
			.number()
			.min(1, 'Bạn cần chọn ca học')
			.required('Bạn không được để trống'),
		TeacherID: yup
			.number()
			.min(1, 'Bạn cần chọn giáo viên')
			.required('Bạn không được để trống'),
		RoomID: yup
			.number()
			.min(1, 'Bạn cần chọn phòng')
			.required('Bạn không được để trống'),
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
		mode: 'all',
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
		form.setValue('RoomID', 0);
		form.setValue('TeacherID', 0);
	};

	// CHECK IF VALUE DO NOT IN THE SELECT => CHANGE VALUE TO DEFAULT (0)
	useEffect(() => {
		let {ID, RoomID, TeacherID} = scheduleObj;
		const {optionRoomList, optionTeacherList} = optionForScheduleList;
		if (optionRoomList.length > 1 && optionTeacherList.length > 1) {
			if (!optionRoomList.some((o) => o.value === RoomID)) {
				form.setValue('RoomID', 0);
				checkHandleChangeValueSchedule(ID, 'RoomID', 0);
			}
			if (!optionTeacherList.some((o) => o.value === TeacherID)) {
				form.setValue('TeacherID', 0);
				checkHandleChangeValueSchedule(ID, 'TeacherID', 0);
			}
		}
	}, [optionForScheduleList]);

	// SET VALUE TO INPUT IF HAVE DATA
	useEffect(() => {
		let {RoomID, TeacherID, CaID, StudyTimeID} = scheduleObj;
		form.setValue('StudyTimeID', CaID || StudyTimeID);
		form.setValue('RoomID', RoomID || 0);
		form.setValue('TeacherID', TeacherID || 0);
		form.clearErrors();
	}, [scheduleObj]);

	return (
		<Panel
			{...props}
			header={
				<div className="info-course-item">
					<Checkbox
						onChange={() => {
							if (isUpdate) {
								// remove schedule from unavailable list
								// add schedule to available list
								checkHandleChangeStatusSchedule(scheduleObj, 2);
							} else {
								// remove schedule from available list
								// add schedule to unavailable list
								checkHandleChangeStatusSchedule(scheduleObj, 1);
							}
						}}
						checked={isUpdate}
					/>
					<p className="title">
						{eventName ||
							`${moment(Date).format('DD/MM')} - ${TeacherName} - ${RoomName}`}
					</p>
					<ul className="info-course-list">
						<li>{Tiet?.CurriculumsDetailName || SubjectName}</li>
					</ul>
				</div>
			}
		>
			<div className="info-course-select">
				<div className="row">
					<div className="col-6">
						<SelectField
							form={form}
							name="RoomID"
							isLoading={
								isLoading.type === 'CHECK_SCHEDULE' && isLoading.status
							}
							placeholder="Chọn phòng"
							optionList={optionForScheduleList.optionRoomList}
							onChangeSelect={(value) => {
								checkHandleChangeValueSchedule(ID, 'RoomID', value);
							}}
						/>
					</div>
					<div className="col-6">
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
					<div className="col-12 mt-2">
						<SelectField
							form={form}
							name="TeacherID"
							isLoading={
								isLoading.type === 'CHECK_SCHEDULE' && isLoading.status
							}
							placeholder="Chọn giáo viên"
							optionList={optionForScheduleList.optionTeacherList}
							onChangeSelect={(value) => {
								checkHandleChangeValueSchedule(ID, 'TeacherID', value);
							}}
						/>
					</div>
				</div>
			</div>
		</Panel>
	);
};
const optionPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	})
);
ScheduleItem.propTypes = {
	handleChangeValueSchedule: PropTypes.func,
	handleChangeStatusSchedule: PropTypes.func,
	//
	scheduleObj: PropTypes.shape({
		ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		eventName: PropTypes.string,
		Tiet: PropTypes.shape({
			CurriculumsDetailID: PropTypes.number,
			CurriculumsDetailName: PropTypes.string,
			SubjectID: PropTypes.number,
		}),
		TeacherID: PropTypes.number,
		TeacherName: PropTypes.string,
		CaID: PropTypes.number,
		CaName: PropTypes.string,
		RoomID: PropTypes.number,
		RoomName: PropTypes.string,
		StudyTimeID: PropTypes.number,
		SubjectName: PropTypes.string,
		Date: PropTypes.string,
	}),
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	optionForScheduleList: PropTypes.shape({
		optionRoomList: optionPropTypes,
		optionTeacherList: optionPropTypes,
	}),
	optionStudyTime: optionPropTypes,
};
ScheduleItem.defaultProps = {
	handleChangeValueSchedule: null,
	handleChangeStatusSchedule: null,
	//
	scheduleObj: {},
	isUpdate: false,
	isLoading: {type: '', status: false},
	positionInScheduleList: null,
	//
	optionForScheduleList: {
		optionRoomList: [],
		optionTeacherList: [],
	},
	optionStudyTime: [],
};
export default ScheduleItem;
