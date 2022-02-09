//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip, Select, Spin, Divider, Skeleton, InputNumber, Switch } from 'antd';
import { CreditCard, Move, RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { branchApi, courseApi, courseStudentApi, serviceApi, studentChangeCourseApi } from '~/apiBase';
import { courseStudentPriceApi } from '~/apiBase/customer/student/course-student-price';
import { courseRegistrationApi } from '~/apiBase/customer/student/course-registration';

const CourseRegForm = React.memo((props: any) => {
	const { Option } = Select;
	const [programID, setProgramID] = useState();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { infoId, reloadData, infoDetail, currentPage, listStudent, programList } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);

	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [isLoadingCourseDetail, setIsLoadingCourseDetail] = useState(false);
	const [isAnyCourse, setIsAnyCourse] = useState(true);

	const [courseAfter, setCourseAfter] = useState<ICourse[]>();
	const [courseAfterId, setCourseAfterId] = useState();
	const [courseAfterDetail, setCourseAfterDetail] = useState<ICourseDetail>();
	const [isContract, setIsContract] = useState(false);

	const fetchDataCourseAfter = (programID) => {
		setIsLoading(true);
		(async () => {
			try {
				const _courseAfter = await courseApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					ProgramID: programID
				});
				console.log(_courseAfter.data.data);
				if (_courseAfter.status == 200) {
					setIsAnyCourse(true);
					setCourseAfter(_courseAfter.data.data);
				}
				if (_courseAfter.status == 204) {
					setCourseAfter([]);
					setIsAnyCourse(false);
				}
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading(false);
			}
		})();
	};

	function handleChangeCourseAfter(idCourseAfter: number) {
		setCourseAfterId(idCourseAfter);
	}

	function handleChangeProgram(idProgram) {
		fetchDataCourseAfter(idProgram);
	}

	const fetchDataCourseAfterDetail = () => {
		setIsLoadingCourseDetail(true);
		(async () => {
			try {
				const _courseAfterDetail = await courseApi.getById(courseAfterId);
				_courseAfterDetail.status == 200 && setCourseAfterDetail(_courseAfterDetail.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoadingCourseDetail(false);
			}
		})();
	};

	const onSubmit = async (data: any) => {
		setLoading(true);
		try {
			let res = await courseRegistrationApi.intoCourse({
				...data,
				ListCourseRegistration: listStudent,
				isContract: isContract
			});
			if (res.status == 200) {
				reloadData(currentPage);
				afterSubmit(res?.data.message);
				form.resetFields();
				setCourseAfterDetail(null);
			}
		} catch (error) {
			showNoti('danger', error.message);
			setLoading(false);
		}
	};

	const afterSubmit = (mes) => {
		showNoti('success', mes);
		setLoading(false);
		setIsModalVisible(false);
	};

	const returnNameCourse = (data) => {
		let name = data.CourseName;
		let percent = data.DonePercent.toString() + '% ';
		name = percent + name;
		return name;
	};

	useEffect(() => {
		if (isModalVisible) {
			fetchDataCourseAfter(null);
		}
	}, [isModalVisible]);

	useEffect(() => {
		if (isModalVisible == true) {
			fetchDataCourseAfterDetail();
		}
	}, [courseAfterId]);

	return (
		<>
			<button
				className="btn btn-warning"
				onClick={() => {
					setIsModalVisible(true);
				}}
			>
				Chuyển vào khóa
			</button>
			<Modal title="Chuyển học viên vào khóa học" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<Spin spinning={isLoading}>
							<div className="row">
								<div className="col-12">
									<Form.Item name="isContract" label="Hợp đồng">
										<Switch onChange={() => setIsContract(!isContract)} />
									</Form.Item>
								</div>
							</div>

							{programList != null && (
								<div className="row">
									<div className="col-12">
										<Form.Item name="ProgramID" label="Chương trình học">
											<Select
												style={{ width: '100%' }}
												className="style-input"
												onChange={handleChangeProgram}
												placeholder="Chọn chương trình"
											>
												{programList?.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.ProgramName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
							)}
							{isAnyCourse ? (
								<div className="row ">
									<div className="col-12">
										<Form.Item name="CourseID" label="Khóa học chuyển đến">
											<Select
												style={{ width: '100%' }}
												className="style-input"
												onChange={handleChangeCourseAfter}
												placeholder="Chọn khóa học"
												defaultActiveFirstOption={false}
											>
												{courseAfter != null &&
													courseAfter !== [] &&
													courseAfter?.map((item, index) => (
														<Option key={index} value={item.ID}>
															{returnNameCourse(item)}
														</Option>
													))}
											</Select>
										</Form.Item>
									</div>
								</div>
							) : (
								<div className="mb-4">
									<h5 className="font-weight-primary">Chương trình không có sẵn khóa học</h5>
								</div>
							)}

							<Spin spinning={isLoadingCourseDetail}>
								<div className="row">
									<div className="col-12">
										<Form.Item label="Giá khóa học">
											<Input
												className="style-input w-100"
												readOnly={true}
												value={
													courseAfterDetail != null
														? Intl.NumberFormat('ja-JP').format(courseAfterDetail.Price)
														: ''
												}
											/>
										</Form.Item>
									</div>
								</div>
							</Spin>
						</Spin>

						{/*  */}
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{loading == true && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default CourseRegForm;
