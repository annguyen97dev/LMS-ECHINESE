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
				showNoti('success', 'Thêm câu hỏi thành công');
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
		ExamTopicID: null, //Cái này chỉ để kiểm tra xem Đề này đã đc tạo hay chưa
		CurriculumID: null, //Trường hợp tạo cho đề hẹn test thì nhập Curriculum = 0
		CurriculumName: null,
		Level: undefined, //Cấp độ muốn thêm
		Type: undefined, //Loại câu muốn thêm
		SkillID: undefined, //Kỹ năng muốn thêm
		Point: null, //Điểm số tường câu - Nếu bỏ trống mặc định là 1
		NumberQuestions: null //Số lượng câu muốn thêm
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Level':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				case 'Type':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				case 'SkillID':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				case 'Point':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
				case 'CurriculumName':
					if (dataExam?.Type !== 1) {
						returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					}
					break;
				default:
					// if (dataExam?.Type !== 1) {
					// 	returnSchema[key] = yup.mixed().required('Bạn không được để trống');
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
				className="btn btn-warning "
				onClick={
					countShowConfirm < 1
						? listQuestionID.length > 0
							? showModalConfirm
							: showModalCreateQuestion
						: showModalCreateQuestion
				}
			>
				<div className="d-flex align-item-center">
					<Zap className="mr-2" style={{ width: '18px' }} />
					Tạo nhanh
				</div>
			</button>
			<Modal
				title="Chú ý!"
				visible={visibleConfirm}
				onCancel={() => setVisibleConfirm(false)}
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={() => setVisibleConfirm(false)}>
							Hủy
						</button>
						<button
							className="btn btn-primary"
							onClick={() => {
								setVisibleConfirm(false);
								showModalCreateQuestion();
								setCountShowConfirm(countShowConfirm + 1);
							}}
						>
							Đồng ý
						</button>
					</div>
				}
			>
				<p style={{ fontWeight: 500 }}>
					Toàn bộ câu hỏi trong đề sẽ bị xóa sau khi tạo danh sách mới. <br />
					Bạn có muốn tiếp tục?
				</p>
			</Modal>
			<Modal
				width={'50%'}
				title="Tạo câu hỏi tự động"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				className=""
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={handleCancel}>
							Đóng
						</button>
						<button className="btn btn-primary" onClick={form.handleSubmit(onSubmit)}>
							Lưu
							{isLoading && <Spin className="loading-base" />}
						</button>
					</div>
				}
			>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<div className="row">
						<div className="col-md-6 col-12">
							<InputTextField disabled={true} form={form} name="CurriculumName" label="Giáo trình" />
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								mode="multiple"
								form={form}
								name="Level"
								label="Cấp độ"
								optionList={[
									{
										title: 'Dễ',
										value: 1
									},
									{
										title: 'Trung bình',
										value: 2
									},
									{
										title: 'Khó',
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
								label="Loại câu muốn thêm"
								optionList={[
									{
										title: 'Chọn một',
										value: 1
									},
									{
										title: 'Chọn nhiều',
										value: 4
									},
									{
										title: 'Kéo thả',
										value: 2
									},
									{
										title: 'Điền từ',
										value: 3
									},
									{
										title: 'Ghép đáp án',
										value: 5
									},
									{
										title: 'Tự luận',
										value: 6
									},
									{
										title: 'Nói',
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
								label="Kĩ năng"
								optionList={[
									{
										title: 'Nghe',
										value: 1
									},
									{
										title: 'Nói',
										value: 2
									},
									{
										title: 'Đọc',
										value: 3
									},
									{
										title: 'Viết',
										value: 4
									}
								]}
							/>
						</div>
						<div className="col-md-6 col-12">
							<InputTextField form={form} name="Point" label="Điểm từng câu" />
						</div>
						<div className="col-md-6 col-12">
							<InputTextField form={form} name="NumberQuestions" label="Số lượng câu" />
						</div>
						<div className="col-12 d-none">
							<div className="text-center">
								<button className="btn btn-primary" type="submit">
									Lưu
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
