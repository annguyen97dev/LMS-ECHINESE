import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Card, Divider, Input, Select, DatePicker, Button, Avatar, Upload, Spin, Checkbox, Skeleton } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UserOutlined, DeploymentUnitOutlined, WhatsAppOutlined, MailOutlined, AimOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import DateField from '~/components/FormControl/DateField';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { useWrap } from '~/context/wrap';
import AvatarBase from '~/components/Elements/AvatarBase';
import { userApi, userInformationApi } from '~/apiBase';
import TitlePage from '../Elements/TitlePage';
let returnSchema = {};
let schema = null;
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
		value: 0,
		title: 'Khác'
	}
];

const SelectRemark = () => {
	const { Option } = Select;

	function handleChange(value) {
		console.log(`selected ${value}`);
	}
	return (
		<Select defaultValue="trungbinh" onChange={handleChange}>
			<Option value="gioi">Giỏi</Option>
			<Option value="kha">Khá</Option>
			<Option value="trungbinh">Trung bình</Option>
		</Select>
	);
};

const ProfileBase = (props) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	const { showNoti, getDataUser, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [imageUrl, setImageUrl] = useState(null);
	const [loadingImage, setLoadingImage] = useState(false);

	const { dataUser } = props;
	const [dataForm, setDataForm] = useState<IUser>(null);
	const [loading, setLoading] = useState(true);

	const defaultValuesInit = {
		FullNameUnicode: null,
		DOB: null,
		Email: '',
		Gender: null,
		Address: null,
		Mobile: null,
		Avatar: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp');
					break;
				case 'Mobile':
					returnSchema[key] = yup.number().typeError('SDT phải là số');
					break;

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
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res = null;
		try {
			res = await userApi.update(data);
			res?.status == 200 &&
				(showNoti('success', 'Cập nhật thành công'), form.reset(data), setDataForm(res.data.data), getDataUser(res.data.data));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	console.log('Loading: ', loading);

	useEffect(() => {
		if (dataUser) {
			setTimeout(() => {
				setLoading(false);
			}, 500);
			dataUser.Gender = parseInt(dataUser.Gender);

			if (userInformation === null) {
				form.reset(dataUser);
				setDataForm(dataUser);
				setImageUrl(dataUser.Avatar);
			} else {
				setDataForm(userInformation);
				form.reset(userInformation);
				setImageUrl(userInformation.Avatar);
			}
			// dataForm == null && setDataForm(dataUser);
		}
	}, [userInformation]);

	return (
		<>
			<TitlePage title="Profile" />
			<div className="row">
				<div className="col-md-3 col-12">
					<Card className="info-profile-left">
						{loading ? (
							<Skeleton />
						) : (
							<>
								<div className="row mb-3">
									<div className="col-12 d-flex align-items-center justify-content-center flex-wrap">
										<Avatar size={64} src={<img src={dataForm?.Avatar ? dataForm.Avatar : '/images/user.png'} />} />
									</div>
								</div>
								<div className="row pt-3">
									<div className="col-2">
										<UserOutlined />
									</div>
									<div className="col-10  d-flex ">{dataForm?.FullNameUnicode}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<DeploymentUnitOutlined />
									</div>
									<div className="col-10  d-flex ">{dataForm?.RoleName}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<WhatsAppOutlined />
									</div>
									<div className="col-10  d-flex ">{dataForm?.Mobile}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<MailOutlined />
									</div>
									<div className="col-10  d-flex ">{dataForm?.Email}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<AimOutlined />
									</div>
									<div className="col-10  d-flex ">{dataForm?.Address}</div>
								</div>
							</>
						)}
					</Card>
				</div>

				{/** Form */}
				<div className="col-md-8 col-12">
					<Card className="space-top-card">
						{loading ? (
							<Skeleton />
						) : (
							<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
								<div className="row d-flex justify-content-center align-items-center">
									<h5>Tài khoản cá nhân</h5>

									<Divider></Divider>
								</div>
								<div className="row mb-3">
									<div className="col-12">
										<AvatarBase imageUrl={imageUrl} getValue={(value) => form.setValue('Avatar', value)} />
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-12">
										<InputTextField form={form} name="FullNameUnicode" label="Họ tên" />
									</div>
									<div className="col-md-4 col-12">
										<SelectField form={form} name="Gender" label="Giới tính" optionList={optionGender} />
									</div>
									<div className="col-md-4 col-12">
										<DateField form={form} name="DOB" label="Ngày sinh" />
									</div>
								</div>

								<div className="row">
									<div className="col-md-6 col-12">
										<InputTextField form={form} name="Email" label="Email" />
									</div>
									<div className="col-md-6 col-12">
										<InputTextField form={form} name="Mobile" label="Số điện thoại" />
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<InputTextField form={form} name="Address" label="Địa chỉ" />
									</div>
								</div>

								<div className="row mt-3">
									<div className="col-12 d-flex justify-content-center">
										<button type="submit" className="btn btn-primary">
											Lưu
											{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Card>
				</div>
			</div>

			<div></div>
		</>
	);
};

export default ProfileBase;
