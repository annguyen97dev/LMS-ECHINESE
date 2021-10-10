import {
	DeploymentUnitOutlined,
	MailOutlined,
	WhatsAppOutlined,
} from '@ant-design/icons';
import {yupResolver} from '@hookform/resolvers/yup';
import {Divider, Form, Modal, Spin, Tooltip} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputPassField from '~/components/FormControl/InputPassField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import UploadAvatarField from '~/components/FormControl/UploadAvatarField';
import {optionCommonPropTypes} from '~/utils/proptypes';

const TeacherForm = (props) => {
	const {
		handleCreateTeacher,
		isUpdate,
		handleUpdateTeacher,
		updateObj,
		isLoading,
		indexUpdateObj,
		//
		isClearForm,
		//
		optionStatusList,
		optionGenderList,
		optionAreaSystemList,
		handleFetchDistrict,
		handleFetchWard,
		optionBranchList,
		handleFetchBranch,
	} = props;
	const {areaList, districtList, wardList} = optionAreaSystemList;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => {
		setIsModalVisible(true);
		if (isUpdate && updateObj && updateObj.AreaID) {
			if (handleFetchBranch) {
				handleFetchBranch(updateObj.AreaID);
			}
			if (handleFetchDistrict) {
				handleFetchDistrict(updateObj.AreaID);
			}
			if (handleFetchWard && updateObj.DistrictID) {
				handleFetchWard(updateObj.DistrictID);
			}
		}
	};
	const closeModal = () => setIsModalVisible(false);
	const schemaBase = yup.object().shape({
		AreaID: yup.number().nullable().required('Bạn không được để trống'),
		Branch: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 trung tâm')
			.required('Bạn không được để trống'),
		FullNameUnicode: yup.string().required('Bạn không được để trống'),
		Jobdate: yup.string().required('Bạn không được để trống'),
		Email: yup
			.string()
			.email('Email không đúng định dạng')
			.required('Bạn không được để trống'),
		Mobile: yup
			.string()
			.required('Bạn không được để trống')
			.matches(
				/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
				'Sdt không đúng định dạng'
			),
		Address: yup.string(),
	});
	const schemaUpdate = yup.object().shape({
		DistrictID: yup.number().nullable(),
		WardID: yup.number().nullable(),
		HouseNumber: yup.string().nullable(),
		Avatar: yup.string().nullable(),
		DOB: yup.string().nullable(),
		Gender: yup.number().nullable().oneOf([0, 1, 2]),
		CMND: yup.string().nullable(),
		CMNDDate: yup.string().nullable(),
		CMNDRegister: yup.string().nullable(),
		Extension: yup.string().nullable(),
		StatusID: yup.number().nullable().oneOf([0, 1]),
		Password: yup.string().nullable(),
	});

	const schema = isUpdate ? schemaBase.concat(schemaUpdate) : schemaBase;

	const defaultValuesInit = {
		AreaID: null,
		Branch: undefined,
		FullNameUnicode: '',
		ChineseName: '',
		LinkFaceBook: '',
		Jobdate: moment().format('YYYY/MM/DD'),
		Email: '',
		Mobile: '',
		Address: '',
		DistrictID: null,
		WardID: null,
		HouseNumber: '',
		Avatar: '',
		DOB: '',
		Gender: 0,
		CMND: '',
		CMNDDate: '',
		CMNDRegister: '',
		Extension: '',
		StatusID: 1,
		Password: '',
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj,
				Branch: updateObj.Branch.map((obj) => obj.ID),
			});
		}
	}, [updateObj]);

	useEffect(() => {
		isClearForm && form.reset({...defaultValuesInit});
	}, [isClearForm]);

	const checkHandleFetchBranch = (value) => {
		if (!handleFetchBranch) return;
		form.setValue('Branch', undefined);
		form.setValue('DistrictID', null);
		form.setValue('WardID', null);
		handleFetchBranch(value);
	};
	const checkHandleFetchDistrict = (value) => {
		if (!handleFetchDistrict) return;
		handleFetchDistrict(value);
	};
	const checkHandleFetchWard = (value) => {
		if (!handleFetchWard) return;
		form.setValue('WardID', null);
		handleFetchWard(value);
	};

	const teacherSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateTeacher) return;
				handleUpdateTeacher(data, indexUpdateObj).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			case false:
				if (!handleCreateTeacher) return;
				handleCreateTeacher(data).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			default:
				break;
		}
	};

	return (
		<>
			{isUpdate ? (
				<button className="btn btn-icon edit" onClick={openModal}>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Thêm mới
				</button>
			)}
			<Modal
				style={{top: isUpdate ? 20 : 100}}
				title={isUpdate ? 'Cập nhật giáo viên' : 'Thêm giáo viên'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={
					isUpdate ? (
						<div className="row">
							<div className="col-12 d-flex justify-content-center">
								<button
									type="submit"
									className="btn btn-primary w-100"
									onClick={form.handleSubmit(teacherSwitchFunc)}
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Cập nhật
									{isLoading.type === 'ADD_DATA' && isLoading.status && (
										<Spin className="loading-base" />
									)}
								</button>
							</div>
						</div>
					) : null
				}
				className={`${isUpdate ? 'modal-50 modal-scroll' : ''}`}
			>
				<div className="box-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(teacherSwitchFunc)}
					>
						{isUpdate ? (
							<div className="row">
								<div className="col-12">
									<div className="info-modal">
										<div className="info-modal-avatar">
											<UploadAvatarField
												style={{marginBottom: 0}}
												form={form}
												name="Avatar"
											/>
										</div>
										<div className="info-modal-content">
											{isUpdate && (
												<div className="box-info-modal">
													<p className="name">{updateObj.FullNameUnicode}</p>
													<p className="detail">
														<span className="icon role">
															<DeploymentUnitOutlined />
														</span>
														<span className="text">
															{updateObj.Branch.map((b) => b.BranchName).join(
																', '
															)}
														</span>
													</p>
													<p className="detail">
														<span className="icon mobile">
															<WhatsAppOutlined />
														</span>
														<span className="text">{updateObj.Mobile}</span>
													</p>
													<p className="detail">
														<span className="icon email">
															<MailOutlined />
														</span>
														<span className="text">{updateObj.Email}</span>
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
									<InputTextField
										form={form}
										name="Email"
										label="Email"
										placeholder="Nhập email"
										isRequired={true}
									/>
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
									<InputTextField
										form={form}
										name="ChineseName"
										label="Tên tiếng Trung"
										placeholder="Nhập tên tiếng Trung"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="Mobile"
										label="Số điện thoại"
										placeholder="Nhập số điện thoại"
									/>
								</div>
								<div className="col-md-6 col-12">
									<DateField
										form={form}
										name="DOB"
										label="Ngày sinh"
										placeholder="Chọn ngày sinh"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="CMND"
										label="Số CMND"
										placeholder="Nhập số CMND"
									/>
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
									<DateField
										form={form}
										name="CMNDDate"
										label="Ngày cấp CMND"
										placeholder="Chọn ngày cấp CMND"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Gender"
										label="Giới tính"
										optionList={optionGenderList}
										placeholder="Chọn giới tính"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="StatusID"
										label="Trạng thái hoạt động"
										optionList={optionStatusList}
										placeholder="Chọn trạng thái hoạt động"
									/>
								</div>
								<div className="col-12">
									<InputPassField
										form={form}
										name="Mật khẩu"
										label="Mật khẩu"
										placeholder="Nhập mật khẩu"
									/>
								</div>
								<div className="col-12">
									<Divider orientation="center">Địa chỉ</Divider>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="AreaID"
										label="Tỉnh/Thành phố"
										optionList={areaList}
										onChangeSelect={(value) => {
											checkHandleFetchBranch(value);
											checkHandleFetchDistrict(value);
										}}
										placeholder="Chọn tỉnh/thành phố"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="DistrictID"
										label="Quận/Huyện"
										optionList={districtList}
										onChangeSelect={checkHandleFetchWard}
										isLoading={
											isLoading.type === 'FETCH_DATA_BY_AREA' &&
											isLoading.status
										}
										placeholder="Chọn quận/huyện"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="WardID"
										label="Phường/Xã"
										optionList={wardList}
										isLoading={
											isLoading.type === 'FETCH_WARD_BY_DISTRICT' &&
											isLoading.status
										}
										placeholder="Chọn phường/xã"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="Extension"
										label="Mô tả thêm"
										placeholder="Nhập mô tả thêm"
									/>
								</div>
								<div className="col-12">
									<InputTextField
										form={form}
										name="HouseNumber"
										label="Số nhà/Tên đường"
										placeholder="Nhập số nhà/tên đường"
									/>
								</div>
								<div className="col-12">
									<Divider orientation="center">Khác</Divider>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Branch"
										label="Trung tâm"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={
											isLoading.type === 'FETCH_DATA_BY_AREA' &&
											isLoading.status
										}
										placeholder="Chọn trung tâm"
									/>
								</div>
								<div className="col-md-6 col-12">
									<DateField
										form={form}
										name="Jobdate"
										label="Ngày nhận việc"
										placeholder="Chọn ngày nhận việc"
									/>
								</div>

								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="LinkFaceBook"
										label="Link Facebook"
										placeholder="Nhập link facebook"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="Address"
										label="Địa chỉ"
										placeholder="Nhập địa chỉ"
									/>
								</div>
							</div>
						) : (
							<div className="row">
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="AreaID"
										label="Tỉnh/thành phố"
										optionList={areaList}
										onChangeSelect={checkHandleFetchBranch}
										placeholder="Chọn tỉnh/thành phố"
										isRequired={true}
									/>
									<InputTextField
										form={form}
										name="FullNameUnicode"
										label="Họ và tên"
										placeholder="Nhập họ và tên"
										isRequired={true}
									/>
									<InputTextField
										form={form}
										name="Email"
										label="Email"
										placeholder="Nhập email"
										isRequired={true}
									/>
									<DateField
										form={form}
										name="Jobdate"
										label="Ngày nhận việc"
										placeholder="Chọn ngày nhận việc"
										isRequired={true}
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Branch"
										label="Trung tâm"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={
											isLoading.type === 'FETCH_DATA_BY_AREA' &&
											isLoading.status
										}
										placeholder="Chọn trung tâm"
										isRequired={true}
									/>
									<InputTextField
										form={form}
										name="ChineseName"
										label="Tên tiếng Trung"
										placeholder="Nhập tên tiếng Trung"
									/>
									<InputTextField
										form={form}
										name="Mobile"
										label="Số điện thoại"
										placeholder="Nhập số điện thoại"
										isRequired={true}
									/>
									<InputTextField
										form={form}
										name="LinkFaceBook"
										label="Link Facebook"
										placeholder="Nhập link faebook"
									/>
								</div>
								<div className="col-12">
									<InputTextField
										form={form}
										name="Address"
										label="Địa chỉ"
										placeholder="Nhập địa chỉ"
									/>
								</div>
								<div className="col-12 mt-3">
									<button
										type="submit"
										className="btn btn-primary w-100"
										disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
									>
										Thêm mới
										{isLoading.type === 'ADD_DATA' && isLoading.status && (
											<Spin className="loading-base" />
										)}
									</button>
								</div>
							</div>
						)}
					</Form>
				</div>
			</Modal>
		</>
	);
};

TeacherForm.propTypes = {
	handleCreateTeacher: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdateTeacher: PropTypes.func,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	isClearForm: PropTypes.bool,
	indexUpdateObj: PropTypes.number,
	//
	optionStatusList: optionCommonPropTypes,
	optionGenderList: optionCommonPropTypes,
	optionAreaSystemList: PropTypes.shape({
		areaList: optionCommonPropTypes,
		districtList: optionCommonPropTypes,
		wardList: optionCommonPropTypes,
	}),
	handleFetchDistrict: PropTypes.func,
	handleFetchWard: PropTypes.func,
	optionBranchList: optionCommonPropTypes,
	handleFetchBranch: PropTypes.func,
};
TeacherForm.defaultProps = {
	handleCreateTeacher: null,
	isUpdate: false,
	handleUpdateTeacher: null,
	updateObj: {},
	isLoading: {type: '', status: false},
	isClearForm: false,
	indexUpdateObj: -1,
	optionStatusList: [],
	optionGenderList: [],
	optionAreaSystemList: {
		areaList: [],
		districtList: [],
		wardList: [],
	},
	handleFetchDistrict: null,
	handleFetchWard: null,
	optionBranchList: [],
	handleFetchBranch: null,
};
export default TeacherForm;
