import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

const CreateCourseForm = (props) => {
	const {
		isUpdate,
		isLoading,
		//
		optionListForForm,
		//
		handleGetCourse,
		handleCheckStudyTime,
		handleFetchDataByBranch,
		handleFetchProgramByGrade,
		handleGetValueBeforeFetchCurriculum,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		UserInformationID: yup
			.number()
			.nullable()
			.required('Bạn không được để trống'),
		RoomID: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 phòng học')
			.required('Bạn không được để trống'),
		StudyTimeID: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 ca học')
			.required('Bạn không được để trống'),
		GradeID: yup.number().nullable().required('Bạn không được để trống'),
		ProgramID: yup.number().nullable().required('Bạn không được để trống'),
		CurriculumID: yup.number().nullable().required('Bạn không được để trống'),
		StartDay: yup.string().required('Bạn không được để trống'),
		DaySelected: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 ngày trong tuần')
			.required('Bạn không được để trống'),
		CourseName: yup.string(),
	});
	const defaultValuesInit = {
		BranchID: null,
		UserInformationID: null,
		RoomID: undefined,
		StudyTimeID: undefined,
		GradeID: null,
		ProgramID: null,
		CurriculumID: null,
		StartDay: moment().format('YYYY/MM/DD'),
		CourseName: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});
	const createCourseSwitchFunc = (data) => {
		switch (isUpdate) {
			case false:
				if (!handleGetCourse) return;
				handleGetCourse(data).then((res) => {
					if (res) {
						closeModal();
						form.reset({...defaultValuesInit});
					}
				});
				break;
			default:
				break;
		}
	};
	// ONCHANGE OF BRANCH FIELD
	const checkHandleFetchUserInformation = (value) => {
		if (!handleFetchDataByBranch) return;
		form.setValue('UserInformationID', undefined);
		form.setValue('RoomID', undefined);
		handleFetchDataByBranch(value);
	};
	// ONCHANGE OF GRADE FIELD
	const checkHandleFetchProgramByGrade = (value) => {
		if (!handleFetchProgramByGrade) return;
		form.setValue('ProgramID', undefined);
		handleFetchProgramByGrade(value);
	};
	// ONCHANGE STUDY TIME AND PROGRAM
	const checkHandleGetValueBeforeFetchCurriculum = (
		key: string,
		value: number
	) => {
		if (!handleGetValueBeforeFetchCurriculum) return;
		form.setValue('CurriculumID', undefined);
		handleGetValueBeforeFetchCurriculum(key, value);
		if (key === 'StudyTimeID' && handleCheckStudyTime) {
			// value = [1, 2, ...];
			handleCheckStudyTime(value);
		}
	};
	return (
		<>
			<button type="button" className="btn btn-warning" onClick={openModal}>
				Thông tin khóa học
			</button>
			<Modal
				// style={{top: 20}}
				title="Thông tin khóa học"
				visible={isModalVisible}
				footer={null}
				width={800}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(createCourseSwitchFunc)}
					>
						<div className="row">
							<div className="col-md-12 col-12">
								<SelectField
									form={form}
									name="BranchID"
									label="Trung Tâm"
									placeholder="Chọn trung tâm"
									optionList={optionListForForm.branchList}
									onChangeSelect={checkHandleFetchUserInformation}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="UserInformationID"
									label="Học vụ"
									placeholder="Chọn học vụ"
									isLoading={isLoading.type === 'BranchID' && isLoading.status}
									optionList={optionListForForm.userInformationList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="RoomID"
									label="Phòng học"
									placeholder="Chọn phòng học"
									mode="multiple"
									isLoading={isLoading.type === 'BranchID' && isLoading.status}
									optionList={optionListForForm.roomList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="StudyTimeID"
									label="Ca học"
									placeholder="Chọn ca học"
									optionList={optionListForForm.studyTimeList}
									mode="multiple"
									onChangeSelect={(value) => {
										checkHandleGetValueBeforeFetchCurriculum(
											'StudyTimeID',
											value
										);
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="GradeID"
									label="Khối học"
									placeholder="Chọn khối học"
									optionList={optionListForForm.gradeList}
									onChangeSelect={checkHandleFetchProgramByGrade}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="ProgramID"
									label="Chương trình học"
									isLoading={isLoading.type === 'GradeID' && isLoading.status}
									placeholder="Chọn chương trình học"
									optionList={optionListForForm.programList}
									onChangeSelect={(value) => {
										checkHandleGetValueBeforeFetchCurriculum(
											'ProgramID',
											value
										);
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="CurriculumID"
									label="Giáo trình"
									isLoading={isLoading.type === 'ProgramID' && isLoading.status}
									placeholder="Chọn giáo trình"
									optionList={optionListForForm.curriculumList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<DateField
									form={form}
									name="StartDay"
									label="Ngày mở"
									placeholder="Chọn ngày mở"
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="DaySelected"
									label="Thứ"
									placeholder="Chọn thứ"
									optionList={optionListForForm.dayOfWeek}
									mode="multiple"
								/>
							</div>
							<div className="col-md-12 col-12">
								<InputTextField
									form={form}
									name="CourseName"
									label="Tên khóa học"
									placeholder="[Trung tâm][Chương trình học][Giáo trình][Ca học] - Ngày học "
								/>
							</div>
							<div
								className="col-md-12 col-12 mt-3 "
								style={{textAlign: 'center'}}
							>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Xem Lịch
									{isLoading.type == 'ADD_DATA' && isLoading.status && (
										<Spin className="loading-base" />
									)}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};
CreateCourseForm.propTypes = {
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	optionListForForm: PropTypes.shape({
		branchList: optionCommonPropTypes,
		studyTimeList: optionCommonPropTypes,
		gradeList: optionCommonPropTypes,
		programList: optionCommonPropTypes,
		dayOfWeek: optionCommonPropTypes,
		curriculumList: optionCommonPropTypes,
		userInformationList: optionCommonPropTypes,
		roomList: optionCommonPropTypes,
	}),
	//
	handleGetCourse: PropTypes.func,
	handleCheckStudyTime: PropTypes.func,
	handleFetchDataByBranch: PropTypes.func,
	handleFetchProgramByGrade: PropTypes.func,
	handleGetValueBeforeFetchCurriculum: PropTypes.func,
};
CreateCourseForm.defaultProps = {
	isUpdate: false,
	isLoading: {type: '', status: false},
	//
	optionListForForm: {
		branchList: [],
		studyTimeList: [],
		gradeList: [],
		programList: [],
		dayOfWeek: [],
		curriculumList: [],
		userInformationList: [],
		roomList: [],
	},
	handleGetCourse: null,
	handleCheckStudyTime: null,
	handleFetchDataByBranch: null,
	handleFetchProgramByGrade: null,
	handleGetValueBeforeFetchCurriculum: null,
};
export default CreateCourseForm;
