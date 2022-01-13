import { LoadingOutlined, MailOutlined, SearchOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divider, Form, Modal, Spin, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { districtApi, studentApi, wardApi } from '~/apiBase';
import AvatarBase from '~/components/Elements/AvatarBase';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import TimePickerField from '~/components/FormControl/TimePickerField';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';

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

const StudentFormModal = (props) => {
	const { dataRow, listDataForm, _handleSubmit, index } = props;
	const router = useRouter();
	const url = router.pathname;

	// console.log('listDataForm: ', listDataForm);

	const [isStudentDetail, setIsStudentDetail] = useState(url.includes('student-list') || url.includes('student-detail'));
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { showNoti } = useWrap();
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
	const [valueEmail, setValueEmail] = useState();
	const [isSearch, setIsSearch] = useState(false);
	const showModal = () => {
		setIsModalVisible(true);
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
					value: item.UserInformationID
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
					value: item.UserInformationID
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

			res.status == 204 && showNoti('danger', name + ' không có dữ liệu');
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
		FullNameUnicode: null,
		ChineseName: null,
		LinkFaceBook: null,
		Email: '',
		Mobile: null,
		AreaID: null, //int id Tỉnh/TP
		DistrictID: null, //int id Quận/Huyện
		WardID: null, //int id Phường/Xã
		HouseNumber: null, //Nhập số nhà tên đường
		Address: null, //bỏ trống - chỉ nhập khi khách hàng có địa chỉ không cụ thể
		Avatar: null, //Lưu link file hình
		DOB: null, //ngày sinh
		Gender: null, //int 0-Nữ 1-Nam 2-Khác
		CMND: null, //int số CMND
		CMNDDate: null, //Ngày làm
		CMNDRegister: null, //Nơi làm CMND
		Extension: null, //giới thiệu thêm
		Branch: undefined, //string : id của trung tâm - LƯU Ý NẾU TỪ 2 TRUNG TÂM TRỞ LÊN THÌ NHẬP(ID,ID,ID)
		AcademicPurposesID: null, // int id mục đích học
		JobID: null, //int mã công việc
		SourceInformationID: null, //int id nguồn
		ParentsOf: null, //int id phụ huynh
		CounselorsID: null,
		AppointmentDate: null,
		ExamAppointmentTime: null,
		ExamAppointmentNote: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống');
					break;
				case 'Mobile':
					returnSchema[key] = yup.number().typeError('SDT phải là số').required('Bạn không được để trống');
					break;
				case 'FullNameUnicode':
					returnSchema[key] = yup.string().typeError('Họ tên phải là chữ').required('Bạn không được để trống');
					break;
				case 'CounselorsID':
					returnSchema[key] = yup.mixed();
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
				default:
					// returnSchema[key] = yup.mixed().required("Bạn không được để trống");
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
		console.log(data);
		let dataUpdate = {
			UserInformationID: data.UserInformationID,
			FullNameUnicode: data.FullNameUnicode,
			ChineseName: data.ChineseName,
			LinkFaceBook: data.LinkFaceBook,
			Email: data.Email,
			Mobile: data.Mobile,
			AreaID: data.AreaID,
			DistrictID: data.DistrictID,
			WardID: data.WardID,
			HouseNumber: data.HouseNumber,
			Address: data.Address,
			Avatar: data.Avatar,
			DOB: data.DOB,
			Gender: data.Gender,
			CMND: data.CMND,
			CMNDDate: data.CMNDDate,
			CMNDRegister: data.CMNDRegister,
			Extension: data.Extension,
			Branch: data.Branch.toString(),
			AcademicPurposesID: data.AcademicPurposesID,
			JobID: data.JobID,
			SourceInformationID: data.SourceInformationID,
			ParentsOf: data.ParentsOf,
			StatusID: data.StatusID,
			CounselorsID: data.CounselorsID,
			Password: data.Password
		};
		data.Branch = data.Branch.toString();

		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res = null;
		try {
			if (data.UserInformationID) {
				if (isSearch) {
					res = await studentApi.add(data);
				} else {
					res = await studentApi.update(dataUpdate);
					res?.status == 200 && _handleSubmit && _handleSubmit(data, index);
				}
			} else {
				res = await studentApi.add(data);
			}

			res?.status == 200 &&
				(showNoti('success', data.UserInformationID ? 'Cập nhật học viên thành công' : 'Tạo học viên thành công'),
				setIsModalVisible(false),
				!dataRow && !isSearch && (form.reset(defaultValuesInit), setImageUrl('')));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	// Search Email to compare with data
	const searchValue = async () => {
		setIsLoading({
			type: 'SEARCH_EMAIL',
			status: true
		});
		try {
			let res = await studentApi.getAll({ Email: valueEmail });

			res?.status == 200 && (showNoti('success', 'Tìm kiếm thành công'), handleDataRow(res.data.data[0]), setIsSearch(true));
			res?.status == 204 &&
				(showNoti('danger', 'Không tìm thấy email'), form.reset(defaultValuesInit), setIsSearch(false), setImageUrl(''));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'SEARCH_EMAIL',
				status: false
			});
		}
	};

	const handleDataRow = (data) => {
		let arrBranch = [];
		let cloneRowData = { ...data };
		cloneRowData.Branch.forEach((item, index) => {
			arrBranch.push(item.ID);
		});
		cloneRowData.Branch = [...arrBranch];

		// console.log('CloneRow: ', cloneRowData);

		form.reset(cloneRowData);
		cloneRowData.AreaID && getDataWithID(cloneRowData.AreaID, 'DistrictID');
		cloneRowData.DistrictID && getDataWithID(cloneRowData.DistrictID, 'WardID');
		setImageUrl(cloneRowData.Avatar);
	};

	useEffect(() => {
		if (isModalVisible) {
			if (dataRow) {
				handleDataRow(dataRow);

				// console.log('Data Row: ', dataRow);

				// let arrBranch = [];
				// let cloneRowData = { ...dataRow };
				// cloneRowData.Branch.forEach((item, index) => {
				//   arrBranch.push(item.ID);
				// });
				// cloneRowData.Branch = arrBranch;
				// form.reset(cloneRowData);
				// cloneRowData.AreaID && getDataWithID(cloneRowData.AreaID, "DistrictID");
				// cloneRowData.DistrictID &&
				//   getDataWithID(cloneRowData.DistrictID, "WardID");
				// setImageUrl(cloneRowData.Avatar);
			}
		}
	}, [isModalVisible]);

	useEffect(() => {
		setListData(listDataForm);
	}, [listDataForm]);

	return (
		<>
			<button className="btn btn-icon edit" onClick={showModal}>
				<Tooltip title="Cập nhật">
					<RotateCcw />
				</Tooltip>
			</button>
			<Modal
				style={{ top: 20 }}
				title="Cập nhật học viên"
				visible={isModalVisible}
				footer={
					<div className="row">
						<div className="col-12 d-flex justify-content-center">
							<div style={{ paddingRight: 5 }}>
								<button
									type="button"
									className="btn btn-primary w-100"
									onClick={form.handleSubmit(onSubmit)}
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Lưu học viên
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</div>
				}
				onCancel={() => setIsModalVisible(false)}
				className="modal-50 modal-scroll"
			>
				<div className="box-form form-staff">
					<Form layout="vertical">
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
									<InputTextField
										form={form}
										name="Email"
										label="Email"
										handleChange={(value) => setValueEmail(value)}
										placeholder="Nhập email"
										isRequired={true}
									/>
									{!dataRow && (
										<button type="button" className="btn-search" onClick={searchValue}>
											{isLoading.type == 'SEARCH_EMAIL' && isLoading.status ? (
												<Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
											) : (
												<SearchOutlined />
											)}
										</button>
									)}
								</div>
							</div>

							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="FullNameUnicode"
									label="Họ và tên"
									placeholder="Nhập họ và tên"
									isRequired={true}
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="ChineseName" label="Tên tiêng Trung" placeholder="Nhập tên tiếng Trung" />
							</div>
							{/*  */}
							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="Mobile"
									label="Số điện thoại"
									placeholder="Nhập số điện thoại"
									isRequired={true}
								/>
							</div>
							<div className="col-md-6 col-12">
								<DateField form={form} name="DOB" label="Ngày sinh" placeholder="Chọn ngày sinh" />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="CMND" label="Số CMND" placeholder="Nhập số CMND" />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="CMNDRegister" label="Nơi cấp CMND" placeholder="Nhập nơi cấp CMND" />
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
									onChangeSelect={
										(value) => handleChange_select(value, 'WardID') // Select District to load Ward
									}
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
									optionList={listData.Branch}
									placeholder="Chọn trung tâm"
								/>
							</div>
							{!isStudentDetail && (
								<>
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
										<DateField
											disabled={isStudentDetail && true}
											form={form}
											name="AppointmentDate"
											label="Ngày hẹn test"
											placeholder="Chọn ngày hẹn test"
										/>
									</div>
									<div className="col-md-6 col-12">
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
								/>
							</div>
							<div className="col-12">
								<InputTextField form={form} name="LinkFaceBook" label="Link Facebook" placeholder="Nhập link facebook" />
							</div>
							<div className="col-12">
								<TextAreaField name="Extension" label="Giới thiệu thêm" form={form} placeholder="Nhập giới thiệu thêm" />
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};
StudentFormModal.layout = LayoutBase;
export default StudentFormModal;
