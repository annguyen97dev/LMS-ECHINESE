//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip, Select, Spin, Divider, Skeleton, InputNumber } from 'antd';
import { CreditCard, Move, RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { branchApi, courseApi, courseStudentApi, serviceApi, studentChangeCourseApi } from '~/apiBase';
import { courseStudentPriceApi } from '~/apiBase/customer/student/course-student-price';
import SkeletonInput from 'antd/lib/skeleton/Input';

const ChangeCourseForm = React.memo((props: any) => {
	const { Option } = Select;
	const { TextArea } = Input;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { infoId, reloadData, infoDetail, currentPage } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);
	const { setValue } = useForm();
	const [courseStudentPrice, setCourseStudentPrice] = useState(null);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [isLoadingCourseDetail, setIsLoadingCourseDetail] = useState(false);

	const [courseAfter, setCourseAfter] = useState<ICourse[]>();
	const [courseAfterId, setCourseAfterId] = useState();
	const [courseAfterDetail, setCourseAfterDetail] = useState<ICourseDetail>();
	const [requestMoney, setRequestMoney] = useState();
	const [leftMoney, setLeftMoney] = useState();
	const [newMoney, setNewMoney] = useState();

	const fetchDataPrice = () => {
		setIsLoading(true);
		(async () => {
			try {
				const _courseStudentPrice = await courseStudentPriceApi.getDetail(infoDetail.CourseOfStudentPriceID);
				_courseStudentPrice.status == 200 && setCourseStudentPrice(_courseStudentPrice.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading(false);
			}
		})();
	};

	const fetchDataCourseAfter = () => {
		(async () => {
			try {
				const _courseAfter = await courseApi.getAll({
					pageIndex: 1,
					pageSize: 99999
				});
				_courseAfter.status == 200 && setCourseAfter(_courseAfter.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	function handleChangeCourseAfter(idCourseAfter: number) {
		setCourseAfterId(idCourseAfter);
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
		console.log(data);
		setLoading(true);
		if (infoId) {
			try {
				let res = await studentChangeCourseApi.changeCourse({
					...data,
					CourseOfStudentID: infoId
				});
				reloadData(currentPage);
				afterSubmit(res?.data.message);
				form.resetFields();
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		}
	};

	const afterSubmit = (mes) => {
		showNoti('success', mes);
		setLoading(false);
		setIsModalVisible(false);
	};

	useEffect(() => {
		if (isModalVisible) {
			fetchDataPrice();
			fetchDataCourseAfter();
		}
	}, [isModalVisible]);

	useEffect(() => {
		if (isModalVisible == true) {
			fetchDataCourseAfterDetail();
		}
	}, [courseAfterId]);

	useEffect(() => {
		if (isModalVisible == true) {
			setRequestMoney(courseAfterDetail.Price - (courseStudentPrice.Paid + courseStudentPrice.Reduced));
		}
	}, [courseAfterDetail]);

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsModalVisible(true);
				}}
			>
				<Tooltip title="Chuyển khóa">
					<Move />
				</Tooltip>
			</button>
			<Modal title="Chuyển khóa" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<Divider orientation="center">Thông tin khóa hiện tại</Divider>

						<Spin spinning={isLoading}>
							<div className="row">
								<div className="col-12">
									<Form.Item
										// name="FullNameUnicode"
										label="Học viên"
									>
										<Input disabled={true} className="style-input" readOnly={true} value={infoDetail.FullNameUnicode} />
									</Form.Item>
								</div>
							</div>
							<div className="row">
								<div className="col-12">
									<Form.Item label="Khóa học">
										{/* <Select
                      style={{ width: "100%" }}
                      className="style-input"
                      defaultValue={infoDetail.CourseID}
                      readOnly={true}
                    >
                      <Option value={infoDetail.CourseID}>
                        {infoDetail.CourseName}
                      </Option>
                    </Select> */}
										<Input className="style-input" readOnly={true} value={infoDetail.CourseName} />
									</Form.Item>
								</div>
							</div>

							{courseStudentPrice != null && (
								<>
									<div className="row">
										<div className="col-md-6 col-12">
											<Form.Item label="Giá tiền">
												<Input
													defaultValue={Intl.NumberFormat('ja-JP').format(courseStudentPrice.Price)}
													className="style-input"
													readOnly={true}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item label="Giảm giá">
												<Input
													defaultValue={Intl.NumberFormat('ja-JP').format(courseStudentPrice.Reduced)}
													className="style-input"
													readOnly={true}
												/>
											</Form.Item>
										</div>
									</div>

									<div className="row">
										<div className="col-md-6 col-12">
											<Form.Item label="Đã đóng">
												<Input
													defaultValue={Intl.NumberFormat('ja-JP').format(courseStudentPrice.Paid)}
													className="style-input"
													readOnly={true}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item label="Còn lại">
												<Input
													defaultValue={Intl.NumberFormat('ja-JP').format(courseStudentPrice.MoneyInDebt)}
													className="style-input"
													readOnly={true}
												/>
											</Form.Item>
										</div>
									</div>
								</>
							)}

							<Divider orientation="center">Khóa chuyển đến</Divider>
							{courseAfter != null && (
								<div className="row">
									<div className="col-12">
										<Form.Item name="CourseIDAfter" label="Khóa học chuyển đến">
											<Select
												style={{ width: '100%' }}
												className="style-input"
												onChange={handleChangeCourseAfter}
												placeholder="Chọn khóa học chuyển đến"
											>
												{courseAfter?.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.CourseName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
							)}

							<Spin spinning={isLoadingCourseDetail}>
								<div className="row">
									<div className="col-md-6 col-12">
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

									<div className="col-md-6 col-12">
										<Form.Item label="Số tiền trả thêm">
											<Input
												className="style-input w-100"
												readOnly={true}
												value={requestMoney != null ? Intl.NumberFormat('ja-JP').format(requestMoney) : ''}
											/>
										</Form.Item>
									</div>
								</div>
							</Spin>

							<div className="row">
								<div className="col-12">
									<Form.Item
										name="Paid"
										label="Thanh toán"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
									>
										<InputNumber
											placeholder="Số tiền còn lại cần phải thanh toán"
											className="ant-input style-input w-100"
											formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
											onChange={(value) => setValue('Paid', value)}
										/>
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item name="Commitment" label="Cam kết">
										<TextArea
											className="style-input w-100"
											onChange={(e) => setValue('Commitment', e.target.value)}
											allowClear={true}
										/>
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item name="Note" label="Ghi chú">
										<TextArea
											className="style-input w-100"
											onChange={(e) => setValue('Note', e.target.value)}
											allowClear={true}
										/>
									</Form.Item>
								</div>
							</div>
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

export default ChangeCourseForm;
