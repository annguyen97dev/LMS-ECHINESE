import React, { Fragment, useEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { Form, Input, Select, Card, Switch, Spin } from 'antd';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { branchApi, courseApi, programApi, studentApi, studyTimeApi } from '~/apiBase';
import moment from 'moment';
import { courseRegistrationApi } from '~/apiBase/customer/student/course-registration';
import StudentExamOfServices from '~/components/Global/RegisterCourse/StudentExamOfServices';
import { studentExamServicesApi } from '~/apiBase/customer/student/student-exam-services';
import RegOpenClass from '~/components/Global/RegisterCourse/RegOpenClass';
import RegCoursePayment from '~/components/Global/RegisterCourse/RegCoursePayment';
import RegCourse from '~/components/Global/RegisterCourse/RegCourse';
import { courseStudentPriceApi } from '~/apiBase/customer/student/course-student-price';
import CreateCustomer from './../../../components/Global/RegisterCourse/CreateCustomer';
import OverStudentConfirmBox from '~/components/Global/RegisterCourse/OverStudentConfirmBox';

const now = new Date();

const RegisterCourse = (props: any) => {
	const { Option } = Select;
	const [option, setOption] = useState(null);
	const [form] = Form.useForm();
	const { showNoti, userInformation } = useWrap();
	const [loading, setLoading] = useState(false);
	const [userAll, setUserAll] = useState<IStudent[]>();
	const [userDetail, setUserDetail] = useState<IStudent>();
	const [isLoading, setIsLoading] = useState(false);
	const [isContract, setIsContract] = useState(false);
	const [courseOverStudent, setCourseOverStudent] = useState([]);
	const [courseOverStudentClone, setCourseOverStudentClone] = useState([]);
	const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
	const [dataSubmit, setDataSubmit] = useState(null);
	const [isFetchDataCourses, setIsFetchDataCourses] = useState(false);

	const fetchDataUser = () => {
		(async () => {
			try {
				const res = await studentApi.getAll({
					pageIndex: 1,
					pageSize: 99999
				});
				//@ts-ignore
				res.status == 200 && setUserAll(res.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	useEffect(() => {
		fetchDataUser();
	}, []);

	const onChange = (value) => {
		setOption(value);
	};

	const handleChangeUser = (value) => {
		setIsLoading(true);
		(async () => {
			try {
				const _detail = await studentApi.getWithID(value);
				//@ts-ignore
				_detail.status == 200 &&
					(setUserDetail(_detail.data.data), form.setFieldsValue({ UserInformationID: _detail.data.data.UserInformationID }));
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading(false);
			}
		})();

		console.log('userDetail: ', userDetail);
	};

	const onSubmit = async (data: any) => {
		setDataSubmit(data);
		setLoading(true);
		if (option == 1) {
			try {
				let res = await studentExamServicesApi.add({
					...data,
					UserInformationID: userDetail.UserInformationID
				});
				showNoti('success', res?.data.message);
				setLoading(false);
				form.resetFields();
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		}

		if (option == 2) {
			try {
				let res = await courseRegistrationApi.add(data);
				showNoti('success', res?.data.message);
				setLoading(false);
				form.resetFields();
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		}

		if (option == 3) {
			if (typeof data.Course != 'undefined') {
				data.Course = data.Course.toString();
			} else {
				data.Course = '';
			}

			console.log('data.PayDate: ', data.PayDate);

			if (courseOverStudent && courseOverStudent.length > 0) {
				setVisibleModalConfirm(true);
				setCourseOverStudent(null);
			} else {
				setLoading(true);
				try {
					let res = await courseStudentPriceApi.add({
						...data,
						isContract: isContract,
						PayDate: data.PayDate == undefined ? now : data.PayDate
					});
					if (res.status === 200) {
						showNoti('success', res?.data.message);
						setLoading(false);
						setVisibleModalConfirm(false);
						form.resetFields();
						setIsFetchDataCourses(!isFetchDataCourses);
					}
				} catch (error) {
					showNoti('danger', error.message);
					setLoading(false);
				} finally {
					setLoading(false);
				}
			}
		}
	};

	return (
		<div className="container-fluid">
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<OverStudentConfirmBox
					visibleModalConfirm={visibleModalConfirm}
					setVisibleModalConfirm={setVisibleModalConfirm}
					courseOverStudent={courseOverStudent}
					setCourseOverStudent={setCourseOverStudent}
					courseOverStudentClone={courseOverStudentClone}
					onSubmit={(dataSubmit) => onSubmit(dataSubmit)}
					dataSubmit={dataSubmit}
					isLoading={isLoading}
				/>
				<div className="row">
					<div className="col-6">
						<Card
							title="Thông tin cá nhân"
							extra={
								userInformation &&
								(userInformation.RoleID === 1 ||
									userInformation.RoleID === 5 ||
									userInformation.RoleID === 2 ||
									userInformation.RoleID === 6 ||
									userInformation.RoleID === 7) && <CreateCustomer fetchDataUser={() => fetchDataUser()} />
							}
						>
							{/* Button create student for admin, manager, academic, seller, teacher */}
							<div className="row">
								<div className="col-md-6 col-12">
									<Form.Item label="Loại đăng ký">
										<Select onChange={onChange} className="style-input w-100" placeholder="Đăng ký học">
											<Option value={1}>Đăng ký đợt thi</Option>
											<Option value={2}>Đăng ký mở lớp</Option>
											<Option value={3}>Đăng ký khóa học</Option>
											<Option value={4}>Thanh toán</Option>
										</Select>
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Có hơp đồng">
										<Switch onChange={(value) => setIsContract(value)} disabled={option != 3 ? true : false} />
									</Form.Item>
								</div>
							</div>
							{/*  */}
							{/*  */}
							<Spin spinning={isLoading}>
								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item
											name="UserInformationID"
											label="Email"
											rules={[
												{
													required: true,
													message: 'Vui lòng điền đủ thông tin!'
												}
											]}
										>
											<Select
												className="style-input"
												showSearch
												optionFilterProp="children"
												defaultValue={userDetail ? userDetail.UserInformationID : ''}
												onChange={(value) => handleChangeUser(value)}
											>
												{userAll?.map((item, index) => (
													<Option key={index} value={item.UserInformationID}>
														{item.Email}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Họ và tên">
											<Select
												className="style-input"
												showSearch
												optionFilterProp="children"
												value={userDetail ? userDetail.UserInformationID : ''}
												onChange={(value) => handleChangeUser(value)}
											>
												{userAll?.map((item, index) => (
													<Option key={index} value={item.UserInformationID}>
														{item.FullNameUnicode}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
								{/*  */}
								{/*  */}
								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Ngày sinh">
											<Input
												readOnly={true}
												className="style-input"
												value={userDetail ? moment(userDetail.DOB).format('DD/MM/YYYY') : ''}
											/>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="SĐT">
											<Select
												className="style-input"
												showSearch
												optionFilterProp="children"
												value={userDetail ? userDetail.UserInformationID : ''}
												onChange={(value) => handleChangeUser(value)}
											>
												{userAll?.map((item, index) => (
													<Option key={index} value={item.UserInformationID}>
														{item.Mobile}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
								{/*  */}
								{/*  */}
								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Tỉnh/Thành phố">
											<Input readOnly={true} className="style-input" value={userDetail ? userDetail.AreaName : ''} />
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Tư vấn viên">
											<Input
												className="style-input"
												readOnly={true}
												//@ts-ignore
												value={userDetail ? userDetail.CounselorsName : ''}
											/>
										</Form.Item>
									</div>
								</div>
								{/*  */}
								{/*  */}
								{/* <div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Phường xã">
											<Input readOnly={true} value={userDetail ? userDetail.WardName : ''} className="style-input" />
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Địa chỉ - Mô tả">
											<Input
												readOnly={true}
												value={
													userDetail
														? `${userDetail.HouseNumber ? userDetail.HouseNumber : ''} ${
																userDetail.Address ? userDetail.Address : ''
														  }`
														: ''
												}
												className="style-input"
											/>
										</Form.Item>
									</div>
								</div> */}
								{/*  */}
								{/*  */}
								{/* <div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="CMND">
											<Input readOnly={true} value={userDetail ? userDetail.CMND : ''} className="style-input" />
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Nơi cấp">
											<Input
												readOnly={true}
												value={userDetail ? userDetail.CMNDRegister : ''}
												className="style-input"
											/>
										</Form.Item>
									</div>
								</div> */}
								{/*  */}
								{/*  */}
								{/* <div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Ngày cấp">
											<Input
												readOnly={true}
												value={userDetail?.CMNDDate ? moment(userDetail.CMNDDate).format('DD/MM/YYYY') : ''}
												className="style-input"
											/>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Công việc">
											<Input readOnly={true} className="style-input" value={userDetail ? userDetail.JobName : ''} />
										</Form.Item>
									</div>
								</div> */}
								{/*  */}
								{/*  */}
								<div className="row">
									{/* <div className="col-md-6 col-12">
										<Form.Item label="Người nhà, liên hệ">
											<Input
												className="style-input"
												readOnly={true}
												value={userDetail ? userDetail.ParentsNameOf : ''}
											/>
										</Form.Item>
									</div> */}
									{/* <div className="col-md-6 col-12">
										<Form.Item label="Tư vấn viên">
											<Input
												className="style-input"
												readOnly={true}
												//@ts-ignore
												value={userDetail ? userDetail.CounselorsName : ''}
											/>
										</Form.Item>
									</div> */}
								</div>
								{/*  */}
								{/*  */}
								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Nguồn khách">
											<Input
												readOnly={true}
												className="style-input"
												value={userDetail ? userDetail.SourceInformationName : ''}
											/>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Mục đích học">
											<Input
												readOnly={true}
												className="style-input"
												value={userDetail ? userDetail.AcademicPurposesName : ''}
											/>
										</Form.Item>
									</div>
								</div>
							</Spin>
						</Card>
					</div>
					<div className="col-6">
						{option == 1 && (
							<StudentExamOfServices userID={userDetail ? userDetail.UserInformationID : null} loading={loading} />
						)}
						{option == 2 && <RegOpenClass userID={userDetail ? userDetail.UserInformationID : null} loading={loading} />}
						{option == 3 && (
							<RegCourse
								userID={userDetail ? userDetail.UserInformationID : null}
								setCourseOverStudent={setCourseOverStudent}
								courseOverStudent={courseOverStudent}
								setCourseOverStudentClone={setCourseOverStudentClone}
								isFetchDataCourses={isFetchDataCourses}
							/>
						)}
						{option == 4 && <RegCoursePayment userID={userDetail ? userDetail.UserInformationID : null} />}
					</div>
				</div>
			</Form>
		</div>
	);
};
RegisterCourse.layout = LayoutBase;

export default RegisterCourse;
