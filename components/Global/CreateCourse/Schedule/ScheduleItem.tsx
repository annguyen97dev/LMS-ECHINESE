import {yupResolver} from '@hookform/resolvers/yup';
import {Collapse} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
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
	const {ID, eventName, Tiet, CaID} = scheduleObj;

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

	useEffect(() => {
		let {RoomID, TeacherID, CaID} = scheduleObj;
		form.setValue('StudyTimeID', CaID);
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
								// remove schedule to unavailable list
								// add schedule to available list
								checkHandleChangeStatusSchedule(scheduleObj, 2);
							} else {
								// remove schedule to available list
								// add schedule to unavailable list
								checkHandleChangeStatusSchedule(scheduleObj, 1);
							}
						}}
						checked={isUpdate}
					/>
					<p className="title">{eventName}</p>
					<ul className="info-course-list">
						<li>{Tiet.CurriculumsDetailName}</li>
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
	scheduleObj: PropTypes.shape({}),
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
