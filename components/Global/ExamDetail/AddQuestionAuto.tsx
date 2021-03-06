import React, { useContext, useEffect, useState } from 'react';
import { Modal, Spin, Form } from 'antd';
import QuestionCreate from '../QuestionBank/QuestionCreate';
import ExamDetail, { useExamDetail } from '~/pages/question-bank/exam-list/exam-detail/[slug]';
import { examDetailApi, examTopicApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import { Zap } from 'react-feather';

let returnSchema = {};
let schema = null;

const AddQuestionAuto = (props) => {
	const { dataExam, onFetchData, examTopicID } = props;
	const { onAddQuestion, listQuestionAddOutside, listQuestionID } = useExamDetail();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [visibleConfirm, setVisibleConfirm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti } = useWrap();
	const [countShowConfirm, setCountShowConfirm] = useState(0);

	console.log('Data Exam: ', dataExam);
	// console.log("Exam ID: ", examTopicID);

	const showModalConfirm = () => {
		setVisibleConfirm(true);
	};

	const showModalCreateQuestion = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// ON SUBMIT DATA
	const onSubmit = async (data) => {
		delete data.CurriculumName;
		data.NumberQuestions = parseInt(data.NumberQuestions);
		data.Point = parseFloat(data.Point);

		setIsLoading(true);
		try {
			let res = await examDetailApi.createAuto(data);
			if (res.status == 200) {
				let listQuestion = [];
				res.data.data.forEach((item, index) => {
					listQuestion.push({
						type: item.Type,
						Point: item.Point,
						ExerciseOrExerciseGroupID: item.ExerciseOrExerciseGroupID
					});
				});
				addQuestionToExam(listQuestion);
			}
		} catch (error) {
			showNoti('danger', error.message);
			setIsLoading(false);
		}
	};

	// ADD QUESTION TO EXAM
	const addQuestionToExam = async (listQuestion) => {
		try {
			let res = await examDetailApi.add({
				ExamTopicID: examTopicID,
				ExerciseOrExerciseGroup: listQuestion
			});
			if (res.status == 200) {
				showNoti('success', 'Th??m c??u h???i th??nh c??ng');
				form.reset(defaultValuesInit);
				onFetchData && onFetchData();
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsModalVisible(false);
			setIsLoading(false);
		}
	};

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		ExamTopicID: null, //C??i n??y ch??? ????? ki???m tra xem ????? n??y ???? ??c t???o hay ch??a
		CurriculumID: null, //Tr?????ng h???p t???o cho ????? h???n test th?? nh???p Curriculum = 0
		CurriculumName: null,
		Level: undefined, //C???p ????? mu???n th??m
		Type: undefined, //Lo???i c??u mu???n th??m
		SkillID: undefined, //K??? n??ng mu???n th??m
		Point: null, //??i???m s??? t?????ng c??u - N???u b??? tr???ng m???c ?????nh l?? 1
		NumberQuestions: null //S??? l?????ng c??u mu???n th??m
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Level':
					returnSchema[key] = yup.mixed().required('B???n kh??ng ???????c ????? tr???ng');
					break;
				case 'Type':
					returnSchema[key] = yup.mixed().required('B???n kh??ng ???????c ????? tr???ng');
					break;
				case 'SkillID':
					returnSchema[key] = yup.mixed().required('B???n kh??ng ???????c ????? tr???ng');
					break;
				case 'Point':
					returnSchema[key] = yup.mixed().required('B???n kh??ng ???????c ????? tr???ng');
					break;
				case 'CurriculumName':
					if (dataExam?.Type !== 1) {
						returnSchema[key] = yup.mixed().required('B???n kh??ng ???????c ????? tr???ng');
					}
					break;
				default:
					// if (dataExam?.Type !== 1) {
					// 	returnSchema[key] = yup.mixed().required('B???n kh??ng ???????c ????? tr???ng');
					// }

					return;
					break;
			}
		});

		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		if (dataExam) {
			form.setValue('CurriculumID', dataExam.CurriculumID);
			form.setValue('CurriculumName', dataExam.CurriculumName);
			form.setValue('ExamTopicID', examTopicID);
			form.setValue('SkillID', [1, 2, 3, 4]);
		}
	}, [dataExam]);

	return (
		<>
			<button
				className="btn btn-warning d-block w-100 text-center mb-2"
				onClick={
					countShowConfirm < 1
						? listQuestionID.length > 0
							? showModalConfirm
							: showModalCreateQuestion
						: showModalCreateQuestion
				}
			>
				<div className="d-flex align-item-center w-100">
					<Zap className="mr-2" style={{ width: '18px' }} />
					T???o nhanh
				</div>
			</button>
			<Modal
				title="Ch?? ??!"
				visible={visibleConfirm}
				onCancel={() => setVisibleConfirm(false)}
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={() => setVisibleConfirm(false)}>
							H???y
						</button>
						<button
							className="btn btn-primary"
							onClick={() => {
								setVisibleConfirm(false);
								showModalCreateQuestion();
								setCountShowConfirm(countShowConfirm + 1);
							}}
						>
							?????ng ??
						</button>
					</div>
				}
			>
				<p style={{ fontWeight: 500 }}>
					To??n b??? c??u h???i trong ????? s??? b??? x??a sau khi t???o danh s??ch m???i. <br />
					B???n c?? mu???n ti???p t???c?
				</p>
			</Modal>
			<Modal
				width={'50%'}
				title="T???o c??u h???i t??? ?????ng"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				className=""
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={handleCancel}>
							????ng
						</button>
						<button className="btn btn-primary" onClick={form.handleSubmit(onSubmit)}>
							L??u
							{isLoading && <Spin className="loading-base" />}
						</button>
					</div>
				}
			>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<div className="row">
						<div className="col-md-6 col-12">
							<InputTextField disabled={true} form={form} name="CurriculumName" label="Gi??o tr??nh" />
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								mode="multiple"
								form={form}
								name="Level"
								label="C???p ?????"
								optionList={[
									{
										title: 'D???',
										value: 1
									},
									{
										title: 'Trung b??nh',
										value: 2
									},
									{
										title: 'Kh??',
										value: 3
									}
								]}
							/>
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								mode="multiple"
								form={form}
								name="Type"
								label="Lo???i c??u mu???n th??m"
								optionList={[
									{
										title: 'Ch???n m???t',
										value: 1
									},
									{
										title: 'Ch???n nhi???u',
										value: 4
									},
									{
										title: 'K??o th???',
										value: 2
									},
									{
										title: '??i???n t???',
										value: 3
									},
									{
										title: 'Gh??p ????p ??n',
										value: 5
									},
									{
										title: 'T??? lu???n',
										value: 6
									},
									{
										title: 'N??i',
										value: 7
									}
								]}
							/>
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								mode="multiple"
								form={form}
								name="SkillID"
								label="K?? n??ng"
								optionList={[
									{
										title: 'Nghe',
										value: 1
									},
									{
										title: 'N??i',
										value: 2
									},
									{
										title: '?????c',
										value: 3
									},
									{
										title: 'Vi???t',
										value: 4
									}
								]}
							/>
						</div>
						<div className="col-md-6 col-12">
							<InputTextField form={form} name="Point" label="??i???m t???ng c??u" />
						</div>
						<div className="col-md-6 col-12">
							<InputTextField form={form} name="NumberQuestions" label="S??? l?????ng c??u" />
						</div>
						<div className="col-12 d-none">
							<div className="text-center">
								<button className="btn btn-primary" type="submit">
									L??u
									{isLoading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default AddQuestionAuto;
