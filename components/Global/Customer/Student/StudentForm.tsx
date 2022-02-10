import { MailOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Divider, Form, Select, Skeleton, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { districtApi, studentApi, wardApi, studentAdviseApi } from '~/apiBase';
import AvatarBase from '~/components/Elements/AvatarBase';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import TimePickerField from '~/components/FormControl/TimePickerField';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';

const { Option } = Select;
let returnSchema = {};
let schema = null;

interface listData {
	Area: Array<Object>;
	DistrictID: Array<Object>;
	WardID: Array<Object>;
	Job: Array<Object>;
	Branch: Array<Object>;
	Purposes: Array<Object>;
	SourceInformation: Array<Object>;
	Parent: Array<Object>;
	Counselors: Array<Object>;
	Teacher: Array<Object>;
	Exam: Array<Object>;
}

const optionGender = [
	{
		value: 0,
		title: 'Nữ'
	},
	{
		value: 1,
		title: 'Nam'
	},
	{
		value: 2,
		title: 'Khác'
	}
];

const StudentForm = (props) => {
	const { dataRow, listDataForm, _handleSubmit, index, isSubmitOutSide, isHideButton, isSuccess, width, hideReset, haveDefault } = props;
	const router = useRouter();
	const url = router.pathname;
	const { customerID: customerID } = router.query;
	const [isStudentDetail, setIsStudentDetail] = useState(url.includes('student-list') || url.includes('student-detail'));
	const { showNoti, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [imageUrl, setImageUrl] = useState(null);
	const [loadingSelect, setLoadingSelect] = useState({
		status: false,
		name: ''
	});
	const [listData, setListData] = useState<listData>(listDataForm);
	const [isSearch, setIsSearch] = useState(false);
	const [loadingCustomer, setLoadingCustomer] = useState(false);
	const [userAll, setUserAll] = useState<IStudent[]>();
	const [userDetail, setUserDetail] = useState<IStudent>();

	const fetchDataUser = () => {
		(async () => {
			setIsLoading({ type: '', status: true });
			try {
				const res = await studentApi.getAll({
					pageIndex: 1,
					pageSize: 99999
				});
				res.status == 200 && setUserAll(res.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading({ type: '', status: false });
			}
		})();
	};

	// ------------- GET DATA CUSTOMER ---------------
	const getDataCustomer = async () => {
		setLoadingCustomer(true);
		try {
			let res = await studentAdviseApi.getWithID(parseInt(customerID as string));
			if (res.status === 200) {
				handleDataRow(res.data.data);
				fetchDataUserWithMail(res.data.data.Email);
			} else {
				showNoti('error', 'Đường truyền mạng đang không ổn định');
			}
		} catch (error) {
			showNoti('error', 'Đường truyền mạng đang không ổn định');
		} finally {
			setLoadingCustomer(false);
		}
	};

	const fetchDataUserWithMail = (mail) => {
		(async () => {
			try {
				const res = await studentApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					Email: mail
				});
				res.status == 200 && handleChangeUser(res.data.data[0]?.UserInformationID);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	// ------------- ADD data to list --------------
	const makeNewData = (data, name) => {
		let newData = null;
		switch (name) {
			case 'Area':
				newData = data.map((item) => ({
					title: item.AreaName,
					value: item.AreaID
				}));
				break;
			case 'DistrictID':
				newData = data.map((item) => ({
					title: item.DistrictName,
					value: item.ID
				}));
				break;
			case 'WardID':
				newData = data.map((item) => ({
					title: item.WardName,
					value: item.ID
				}));
				break;
			case 'Branch':
				newData = data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));
				break;
			case 'Job':
				newData = data.map((item) => ({
					title: item.JobName,
					value: item.JobID
				}));
				break;
			case 'Purposes':
				newData = data.map((item) => ({
					title: item.PurposesName,
					value: item.PurposesID
				}));
				break;
			case 'Parent':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item?.UserInformationID
				}));
				break;
			case 'SourceInformation':
				newData = data.map((item) => ({
					title: item.SourceInformationName,
					value: item.SourceInformationID
				}));
				break;
			case 'Counselors':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item?.UserInformationID
				}));
				break;
			default:
				break;
		}
		return newData;
	};

	const getDataTolist = (data: any, name: any) => {
		let newData = makeNewData(data, name);
		Object.keys(listData).forEach(function (key) {
			if (key == name) {
				listData[key] = newData;
			}
		});
		setListData({ ...listData });
	};

	//  ----- GET DATA DISTRICT -------
	const getDataWithID = async (ID, name) => {
		let res = null;
		setLoadingSelect({
			status: true,
			name: name
		});
		try {
			switch (name) {
				case 'DistrictID':
					res = await districtApi.getAll({
						AreaID: ID,
						pageIndex: 1,
						pageSize: 9999
					});
					break;
				case 'WardID':
					res = await wardApi.getAll({
						DistrictID: ID,
						pageIndex: 1,
						pageSize: 9999
					});
					break;
				default:
					break;
			}
			res.status == 200 && getDataTolist(res.data.data, name);
			res.status == 204 && console.log(name + ' không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingSelect({
				status: false,
				name: name
			});
		}
	};

	// ----- HANDLE CHANGE - AREA ----------
	const handleChange_select = (value, name) => {
		if (name == 'DistrictID') {
			form.setValue('WardID', null);
			listData.DistrictID = [];
			listData.WardID = [];
			setListData({ ...listData });
		}
		form.setValue(name, null);
		getDataWithID(value, name);
	};

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		ID: null,
		FullNameUnicode: null,
		ChineseName: null,
		LinkFaceBook: null,
		Email: '',
		Mobile: null,
		AreaID: null,
		DistrictID: null,
		WardID: null,
		HouseNumber: null,
		Address: null,
		Avatar: null,
		DOB: null,
		Gender: null,
		CMND: null,
		CMNDDate: null,
		CMNDRegister: null,
		Extension: null,
		Branch: undefined,
		AcademicPurposesID: null,
		JobID: null,
		SourceInformationID: null,
		ParentsOf: null,
		CounselorsID: null,
		AppointmentDate: null,
		ExamAppointmentTime: null,
		ExamAppointmentNote: null,
		StatusID: null,
		StatusName: null,
		ExamTopicID: null,
		TeacherID: null,
		CustomerConsultationID: null,
		Username: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống');
					break;
				case 'Mobile':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;

				case 'Branch':
					returnSchema[key] = yup.array();
				case 'AppointmentDate':
					if (!dataRow) {
						returnSchema[key] = yup.mixed();
					}
					break;
				case 'ExamAppointmentTime':
					if (!dataRow) {
						returnSchema[key] = yup.mixed();
					}
					break;
				case 'CounselorsID':
					if (!dataRow) {
						returnSchema[key] = yup.mixed();
					}
					break;
				case 'FullNameUnicode':
					if (!dataRow) {
						returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					}
					break;
				default:
					break;
			}
		});

		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	// ----------- SUBMI FORM ------------
	const onSubmit = async (data: any) => {
		if (data.Branch) {
			data.Branch = data.Branch.toString();
		}

		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		let res = null;

		try {
			if (data?.UserInformationID) {
				if (isSearch) {
					res = await studentApi.add({ ...data, ID: data?.UserInformationID });
				} else {
					res = await studentApi.update({ ...data, ID: data?.UserInformationID });

					if (res.status == 200) {
						_handleSubmit && _handleSubmit(data, index);
						isSuccess && isSuccess();
					}
				}
			} else {
				res = await studentApi.add({ ...data, ID: data?.UserInformationID });
			}

			res?.status == 200 &&
				(showNoti('success', data?.UserInformationID ? 'Cập nhật học viên thành công' : 'Hẹn test thành công'),
				!dataRow && !isSearch && (form.reset(defaultValuesInit), setImageUrl('')));
		} catch (error) {
			showNoti('danger', error.message);
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	const handleReset = () => {
		form.reset(defaultValuesInit);
		setImageUrl('');
	};

	const handleDataRow = (data) => {
		let arrBranch = [];
		let cloneRowData = { ...data };
		if (cloneRowData.Branch) {
			cloneRowData.Branch.forEach((item, index) => {
				arrBranch.push(item.ID);
			});
			cloneRowData.Branch = arrBranch;
		}
		form.reset(cloneRowData);
		cloneRowData.AreaID && getDataWithID(cloneRowData.AreaID, 'DistrictID');
		cloneRowData.DistrictID && getDataWithID(cloneRowData.DistrictID, 'WardID');
		setImageUrl(cloneRowData.Avatar);
		if (cloneRowData.CustomerName) {
			form.setValue('FullNameUnicode', cloneRowData.CustomerName);
		}
		if (cloneRowData.Number) {
			form.setValue('Mobile', cloneRowData.Number);
		}
		if (cloneRowData.StatusID) {
			form.setValue('StatusID', cloneRowData.StatusID);
		}
	};

	useEffect(() => {
		if (dataRow) {
			handleDataRow(dataRow);
		}
	}, []);

	useEffect(() => {
		if (isSubmitOutSide) {
			let element: HTMLElement = document.getElementsByClassName('btn-submit')[0] as HTMLElement;
			element.click();
		}
	}, [isSubmitOutSide]);

	useEffect(() => {
		if (customerID) {
			fetchDataUser();
			getDataCustomer();
			form.setValue('CustomerConsultationID', 0);
		}
		if (customerID === undefined) {
			fetchDataUser();
		}
	}, []);

	const handleChangeUser = (value) => {
		setIsLoading({
			type: 'SEARCH_EMAIL',
			status: true
		}),
			(async () => {
				try {
					const _detail = await studentApi.getWithID(value);
					_detail.status == 200 &&
						(setUserDetail(_detail.data.data),
						form.setValue('ID', _detail.data.data?.UserInformationID),
						form.setValue('Email', _detail.data.data.Email),
						form.setValue('FullNameUnicode', _detail.data.data.FullNameUnicode));

					_detail?.status == 200 &&
						(form.setValue('CustomerConsultationID', _detail.data.data?.UserInformationID),
						showNoti('success', 'Tìm kiếm thành công'),
						handleDataRow(_detail.data.data),
						setIsSearch(true));
				} catch (err) {
					showNoti('danger', err.message);
				} finally {
					setIsLoading({
						type: 'SEARCH_EMAIL',
						status: false
					});
				}
			})();
	};

	return (
		<>
			<div className="col-12 d-flex justify-content-center" style={{ width: width !== undefined ? width : '100%' }}>
				<Card
					title="Phiếu thông tin cá nhân"
					className="w-100 w-100-mobile"
					extra={
						hideReset ? null : (
							<button className="btn btn-warning" onClick={handleReset}>
								Reset
							</button>
						)
					}
				>
					<div className="form-staff">
						<Skeleton loading={loadingCustomer}>
							<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
								<div className="row">
									{/** ==== Thông tin cơ bản  ====*/}
									<div className="col-12">
										<div className="info-modal">
											<div className="info-modal-avatar">
												<AvatarBase imageUrl={imageUrl} getValue={(value) => form.setValue('Avatar', value)} />
											</div>
											<div className="info-modal-content">
												{dataRow && (
													<div className="box-info-modal">
														<p className="name">{dataRow.FullNameUnicode}</p>
														<p className="detail">
															<span className="icon mobile">
																<WhatsAppOutlined />
															</span>
															<span className="text">{dataRow.Mobile}</span>
														</p>
														<p className="detail">
															<span className="icon email">
																<MailOutlined />
															</span>
															<span className="text">{dataRow.Email}</span>
														</p>
													</div>
												)}
											</div>
										</div>
									</div>

									<div className="col-12">
										<Divider orientation="center">Thông tin cơ bản</Divider>
									</div>

									<div className="col-md-6 col-12">
										<div className="search-box">
											<Form.Item
												label="Email"
												rules={[
													{
														required: true,
														message: 'Vui lòng điền đủ thông tin!'
													}
												]}
												required={true}
											>
												<Select
													className="style-input"
													showSearch
													loading={isLoading.status}
													defaultValue={708}
													optionFilterProp="children"
													disabled={haveDefault ? true : false}
													value={
														haveDefault
															? dataRow?.UserInformationID
															: userDetail
															? userDetail?.UserInformationID
															: ''
													}
													onChange={(value) => handleChangeUser(value)}
												>
													{userAll?.map((item, index) => (
														<Option key={index} value={item?.UserInformationID}>
															{item.Email}
														</Option>
													))}
												</Select>
											</Form.Item>
										</div>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Họ và tên">
											<Select
												className="style-input"
												showSearch
												loading={isLoading.status}
												optionFilterProp="children"
												disabled={haveDefault ? true : false}
												value={
													haveDefault
														? dataRow?.UserInformationID
														: userDetail
														? userDetail?.UserInformationID
														: ''
												}
												onChange={(value) => handleChangeUser(value)}
											>
												{userAll?.map((item, index) => (
													<Option key={index} value={item?.UserInformationID}>
														{item.FullNameUnicode}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Tên tiếng Trung">
											<Select
												className="style-input"
												showSearch
												loading={isLoading.status}
												optionFilterProp="children"
												disabled={haveDefault ? true : false}
												value={
													haveDefault
														? dataRow?.UserInformationID
														: userDetail
														? userDetail?.UserInformationID
														: ''
												}
												onChange={(value) => handleChangeUser(value)}
											>
												{userAll?.map((item, index) => (
													<Option key={index} value={item?.UserInformationID}>
														{item.ChineseName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
									{/*  */}
									<div className="col-md-6 col-12">
										<Form.Item label="Số điện thoại">
											<Select
												loading={isLoading.status}
												className="style-input"
												showSearch
												optionFilterProp="children"
												disabled={haveDefault ? true : false}
												value={
													haveDefault
														? dataRow?.UserInformationID
														: userDetail
														? userDetail?.UserInformationID
														: ''
												}
												onChange={(value) => handleChangeUser(value)}
											>
												{userAll?.map((item, index) => (
													<Option key={index} value={item?.UserInformationID}>
														{item.Mobile}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<DateField form={form} name="DOB" label="Ngày sinh" placeholder="Chọn ngày sinh" />
									</div>
									<div className="col-md-6 col-12">
										<InputTextField form={form} name="CMND" label="Số CMND" placeholder="Nhập số CMND" />
									</div>
									<div className="col-md-6 col-12">
										<InputTextField
											form={form}
											name="CMNDRegister"
											label="Nơi cấp CMND"
											placeholder="Nhập nơi cấp CMND"
										/>
									</div>
									<div className="col-md-6 col-12">
										<DateField form={form} name="CMNDDate" label="Ngày cấp" placeholder="Chọn ngày cấp" />
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											form={form}
											name="Gender"
											label="Giới tính"
											optionList={optionGender}
											placeholder="Chọn giới tính"
										/>
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											form={form}
											name="JobID"
											label="Công việc"
											optionList={listData.Job}
											placeholder="Chọn công việc"
										/>
									</div>
									<div className="col-12">
										<SelectField
											form={form}
											optionList={[
												{ title: 'Hoạt động', value: 0 },
												{ title: 'Khóa', value: 1 }
											]}
											disabled={userInformation && userInformation?.RoleID == 1 ? false : true}
											name="StatusID"
											label="Trạng thái"
											placeholder="Chọn trạng thái"
										/>
									</div>
									{/** ==== Địa chỉ  ====*/}
									<div className="col-12">
										<Divider orientation="center">Địa chỉ</Divider>
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											form={form}
											name="AreaID"
											label="Tỉnh/TP"
											optionList={listData.Area}
											onChangeSelect={
												(value) => handleChange_select(value, 'DistrictID') // Select Area to load District
											}
											placeholder="Chọn tỉnh/tp"
										/>
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											isLoading={loadingSelect.name == 'DistrictID' && loadingSelect.status}
											form={form}
											name="DistrictID"
											label="Quận/Huyện"
											optionList={listData.DistrictID}
											onChangeSelect={(value) => handleChange_select(value, 'WardID')}
											placeholder="Chọn quận/huyện"
										/>
									</div>
									{/*  */}
									<div className="col-md-6 col-12">
										<SelectField
											isLoading={loadingSelect.name == 'WardID' && loadingSelect.status}
											form={form}
											name="WardID"
											label="Phường/Xã"
											optionList={listData.WardID}
											placeholder="Chọn phường/xã"
										/>
									</div>
									<div className="col-md-6 col-12">
										<InputTextField form={form} name="Address" label="Mô tả thêm" placeholder="Nhập mô tả thêm" />
									</div>
									<div className="col-12">
										<InputTextField
											form={form}
											name="HouseNumber"
											label="Số nhà/tên đường"
											placeholder="Nhập số nhà/tên đường"
										/>
									</div>
									{/** Hẹn Test */}
									<div className="col-12">
										<Divider orientation="center">{isStudentDetail ? 'Trung tâm' : 'Hẹn test'}</Divider>
									</div>
									<div className="col-12">
										<SelectField
											mode={dataRow ? 'multiple' : ''}
											form={form}
											name="Branch"
											label="Trung tâm"
											optionList={listDataForm.Branch}
											placeholder="Chọn trung tâm"
											isRequired={true}
										/>
									</div>
									{!isStudentDetail && (
										<>
											<div className="col-md-6 col-12">
												<DateField
													disabled={isStudentDetail && true}
													form={form}
													name="AppointmentDate"
													label="Ngày hẹn test"
													placeholder="Chọn ngày hẹn test"
												/>
											</div>
											<div className="col-md-6 col-12">
												<TimePickerField
													disabled={isStudentDetail && true}
													form={form}
													name="ExamAppointmentTime"
													label="Giờ hẹn test"
													placeholder="Chọn giờ hẹn test"
												/>
											</div>
											<div className="col-md-6 col-12">
												<SelectField
													form={form}
													name="ExamTopicID"
													label="Đề hẹn test"
													optionList={listData.Exam}
													placeholder="Chọn đề"
												/>
											</div>
											<div className="col-md-6 col-12">
												<SelectField
													form={form}
													name="TeacherID"
													label="Giáo viên chấm bài"
													optionList={listData.Teacher}
													placeholder="Chọn giáo viên"
												/>
											</div>
											<div className="col-md-12 col-12">
												<TextAreaField
													disabled={isStudentDetail && true}
													name="ExamAppointmentNote"
													label="Ghi chú"
													form={form}
													placeholder="Nhập ghi chú"
												/>
											</div>
										</>
									)}
									{/** ==== Khác  ====*/}
									<div className="col-12">
										<Divider orientation="center">Khác</Divider>
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											form={form}
											name="AcademicPurposesID"
											label="Mục đích học"
											optionList={listData.Purposes}
											placeholder="Chọn mục đich học"
										/>
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											form={form}
											name="ParentsOf"
											label="Phụ huynh học sinh"
											optionList={listData.Parent}
											placeholder="Chọn phụ huynh học sinh"
										/>
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											form={form}
											name="SourceInformationID"
											label="Nguồn khách"
											optionList={listData.SourceInformation}
											placeholder="Chọn nguồn khách"
										/>
									</div>
									<div className="col-md-6 col-12">
										<SelectField
											form={form}
											name="CounselorsID"
											label="Tư vấn viên"
											optionList={listData.Counselors}
											placeholder="Chọn tư vấn viên"
											isRequired={true}
										/>
									</div>

									<div className="col-12">
										<InputTextField
											form={form}
											name="LinkFaceBook"
											label="Link Facebook"
											placeholder="Nhập link facebook"
										/>
									</div>
									<div className="col-12">
										<TextAreaField
											name="Extension"
											label="Giới thiệu thêm"
											form={form}
											placeholder="Nhập giới thiệu thêm"
										/>
									</div>
								</div>

								<div className="row" style={{ opacity: !isHideButton ? 1 : 0 }}>
									<div className="col-12 d-flex justify-content-center">
										<div style={{ paddingRight: 5 }}>
											<button type="submit" className="btn btn-primary w-100 btn-submit">
												Lưu
												{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
											</button>
										</div>
									</div>
								</div>
							</Form>
						</Skeleton>
					</div>
				</Card>
			</div>
		</>
	);
};

StudentForm.layout = LayoutBase;
export default StudentForm;
