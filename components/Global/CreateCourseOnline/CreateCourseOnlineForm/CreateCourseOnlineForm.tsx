import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Spin } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import { numberWithCommas } from '~/utils/functions';
import { optionCommonPropTypes } from '~/utils/proptypes';

const CreateCourseOnlineForm = (props) => {
	const {
		isUpdate,
		isLoading,
		//
		optionListForForm,
		//
		handleGetCourse,
		handleFetchProgramByGrade,
		handleGetValueBeforeFetchCurriculum,
		handleGetValueBeforeFetchTeacher
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		GradeID: yup.number().nullable().required('Bạn không được để trống'),
		ProgramID: yup.number().nullable().required('Bạn không được để trống'),
		TeacherID: yup.number().nullable().required('Bạn không được để trống'),
		CurriculumID: yup.number().nullable().required('Bạn không được để trống'),
		StartDay: yup.string().required('Bạn không được để trống'),
		Price: yup.string().required('Bạn không được để trống'),
		SalaryOfLesson: yup.string().required('Bạn không được để trống'),
		CourseName: yup.string(),
		TimeCourse: yup.array().of(
			yup.object().shape({
				DaySelected: yup.number().nullable().required('Bạn không được để trống'),
				StudyTimeID: yup.number().nullable().required('Bạn không được để trống')
			})
		)
	});
	const defaultValuesInit = {
		BranchID: null,
		GradeID: null,
		ProgramID: null,
		TeacherID: null,
		CurriculumID: null,
		StartDay: moment().format('YYYY/MM/DD'),
		Price: '',
		SalaryOfLesson: '',
		CourseName: '',
		TimeCourse: [{ DaySelected: null, StudyTimeID: null }]
	};
	const form = useForm<ICOCreateForm>({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'TimeCourse'
	});
	const createCourseSwitchFunc = (data) => {
		switch (isUpdate) {
			case false:
				if (!handleGetCourse) return;
				handleGetCourse(data).then((res) => {
					if (res) {
						closeModal();
						form.reset({ ...defaultValuesInit });
					}
				});
				break;
			default:
				break;
		}
	};
	// ONCHANGE OF GRADE FIELD
	const checkHandleFetchProgramByGrade = (value) => {
		if (!handleFetchProgramByGrade) return;
		form.setValue('ProgramID', undefined);
		handleFetchProgramByGrade(value);
	};
	// ONCHANGE STUDY TIME AND PROGRAM
	const checkHandleGetValueBeforeFetchCurriculum = (key: string, value: number) => {
		if (!handleGetValueBeforeFetchCurriculum) return;
		form.setValue('CurriculumID', undefined);
		handleGetValueBeforeFetchCurriculum(key, value);
	};
	// ONCHANGE PROGRAM AND BRANCH
	const checkHandleGetValueBeforeFetchTeacher = (key: string, value: number) => {
		if (!handleGetValueBeforeFetchTeacher) return;
		form.setValue('TeacherID', undefined);
		handleGetValueBeforeFetchTeacher(key, value);
	};

	return (
		<>
			<button type="button" className="btn btn-warning" onClick={openModal}>
				Thông tin khóa học
			</button>
			<Modal style={{ top: 25 }} title="Thông tin khóa học" visible={isModalVisible} footer={null} width={800} onCancel={closeModal}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(createCourseSwitchFunc)}>
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="BranchID"
									label="Trung Tâm"
									placeholder="Chọn trung tâm"
									isRequired
									optionList={optionListForForm.branchList}
									isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
									onChangeSelect={(value) => {
										checkHandleGetValueBeforeFetchTeacher('BranchID', value);
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="GradeID"
									label="Khối học"
									isRequired
									placeholder="Chọn khối học"
									isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
									optionList={optionListForForm.gradeList}
									onChangeSelect={checkHandleFetchProgramByGrade}
								/>
							</div>
							<div className="col-12">
								<div className="more-revenue">
									<PlusCircle
										size="20px"
										className="add"
										onClick={() => {
											append({ DaySelected: null, StudyTimeID: null });
										}}
										style={{
											right: 0
										}}
									/>
									<Form.Item label="Khung thời gian" required>
										<div className="more-revenue-list" style={{ maxHeight: 'inherit' }}>
											{fields.map((item, index) => {
												const timeCourse = form.watch('TimeCourse');

												const disabledDaySelectedList = timeCourse.map((obj) => obj.DaySelected).filter(Boolean);

												const time =
													timeCourse[0]?.StudyTimeID &&
													optionListForForm.studyTimeList.find((opt) => opt.value === timeCourse[0]?.StudyTimeID)
														?.options.Time;

												const disabledStudyTimeList =
													time && timeCourse.length >= 2
														? optionListForForm.studyTimeList
																.filter((opt) => opt.options.Time !== time)
																.map((opt) => opt.value)
														: [];
												return (
													<div className="more-revenue-item" key={item.id}>
														<div className="row">
															<div className="col-md-6 col-12">
																<SelectField
																	form={form}
																	name={`TimeCourse.${index}.DaySelected`}
																	isRequired
																	label="Thứ"
																	placeholder="Chọn thứ"
																	optionList={optionListForForm.dayOfWeek}
																	optionDisabledList={disabledDaySelectedList}
																	isDynamicField
																/>
															</div>
															<div className="col-md-6 col-12">
																<SelectField
																	form={form}
																	name={`TimeCourse.${index}.StudyTimeID`}
																	isRequired
																	label="Ca"
																	placeholder="Chọn ca học"
																	isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
																	optionList={optionListForForm.studyTimeList}
																	onChangeSelect={(value) => {
																		checkHandleGetValueBeforeFetchCurriculum('StudyTimeID', value);
																	}}
																	optionDisabledList={disabledStudyTimeList}
																	isDynamicField
																/>
															</div>
														</div>
														<MinusCircle
															size="20px"
															className="remove"
															onClick={() => {
																remove(index);
															}}
														/>
													</div>
												);
											})}
										</div>
									</Form.Item>
								</div>
							</div>

							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="ProgramID"
									isRequired
									label="Chương trình học"
									isLoading={isLoading.type === 'GradeID' && isLoading.status}
									placeholder="Chọn chương trình học"
									optionList={optionListForForm.programList}
									onChangeSelect={(value) => {
										const price = optionListForForm.programList.find((p) => p.value === value)?.options.Price || 0;
										form.setValue('Price', numberWithCommas(price));
										checkHandleGetValueBeforeFetchCurriculum('ProgramID', value);
										checkHandleGetValueBeforeFetchTeacher('ProgramID', value);
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="CurriculumID"
									label="Giáo trình"
									isRequired
									isLoading={isLoading.type === 'ProgramID' && isLoading.status}
									placeholder="Chọn giáo trình"
									optionList={optionListForForm.curriculumList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="TeacherID"
									label="Giáo viên"
									isRequired
									isLoading={isLoading.type === 'ProgramID' && isLoading.status}
									placeholder="Chọn giáo viên"
									optionList={optionListForForm.teacherList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<DateField form={form} name="StartDay" label="Ngày mở" isRequired placeholder="Chọn ngày mở" />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="Price"
									label="Giá khóa học"
									isRequired
									placeholder="Nhập giá khóa học"
									handleFormatCurrency={numberWithCommas}
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="SalaryOfLesson"
									label="Lương/buổi"
									isRequired
									placeholder="Nhập lương/buổi học"
									handleFormatCurrency={numberWithCommas}
								/>
							</div>
							<div className="col-6">
								<InputTextField
									form={form}
									name="MaximumStudent"
									label="Số học viên tối đa (mặc định 20)"
									placeholder="Nhập số học viên tối đa trong lớp"
								/>
							</div>
							<div className="col-6">
								<InputTextField
									form={form}
									name="CourseName"
									label="Tên khóa học"
									placeholder="[Trung tâm][Chương trình học][Giáo trình][Ca học] - Ngày học"
								/>
							</div>
							<div className="col-md-12 col-12 mt-3 " style={{ textAlign: 'center' }}>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Xem Lịch
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};
CreateCourseOnlineForm.propTypes = {
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	//
	optionListForForm: PropTypes.shape({
		branchList: optionCommonPropTypes,
		studyTimeList: optionCommonPropTypes,
		gradeList: optionCommonPropTypes,
		programList: optionCommonPropTypes,
		teacherList: optionCommonPropTypes,
		dayOfWeek: optionCommonPropTypes,
		curriculumList: optionCommonPropTypes,
		userInformationList: optionCommonPropTypes
	}),
	//
	handleGetCourse: PropTypes.func,
	handleFetchDataByBranch: PropTypes.func,
	handleFetchProgramByGrade: PropTypes.func,
	handleGetValueBeforeFetchCurriculum: PropTypes.func,
	handleGetValueBeforeFetchTeacher: PropTypes.func
};
CreateCourseOnlineForm.defaultProps = {
	isUpdate: false,
	isLoading: { type: '', status: false },
	//
	optionListForForm: {
		branchList: [],
		studyTimeList: [],
		gradeList: [],
		programList: [],
		teacherList: [],
		dayOfWeek: [],
		curriculumList: [],
		userInformationList: []
	},
	//
	handleGetCourse: null,
	handleFetchDataByBranch: null,
	handleFetchProgramByGrade: null,
	handleGetValueBeforeFetchCurriculum: null,
	handleGetValueBeforeFetchTeacher: null
};
export default CreateCourseOnlineForm;
