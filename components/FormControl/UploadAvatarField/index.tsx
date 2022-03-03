import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Spin, Upload } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { studentApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

interface RcFile extends File {
	uid: string;
	lastModifiedDate: Date;
}
type IFile = {
	uid: string;
	size?: number;
	name: string;
	fileName?: string;
	lastModified?: number;
	lastModifiedDate?: Date;
	url?: string;
	status?: 'error' | 'success' | 'done' | 'uploading' | 'removed';
	percent?: number;
	thumbUrl?: string;
	originFileObj?: RcFile;
	response?: string;
	error?: any;
	linkProps?: any;
	type?: string;
	xhr?: any;
	preview?: string;
};
type IFileList = {
	file: IFile;
	fileList: IFile[];
};
const UploadAvatarField = (props) => {
	const { form, name, label, disabled, style, className, isUploadWeb } = props;

	const [imgUrl, setImgUrl] = useState('');
	const [loadingImage, setLoadingImage] = useState(false);
	const { showNoti } = useWrap();
	const { errors } = form.formState;
	const hasError = errors[name];

	const fetchWebsiteImage = (data) => {
		var axios = require('axios');

		var config = {
			method: 'post',
			url: 'https://echineseweb.monamedia.net/wp-json/wp/v2/media',
			headers: {
				'Content-Disposition': 'attachment;filename=img-group1.jpg',
				Authorization: 'Basic bW9uYW1lZGlhOmlhQmEgQUI4NiA5OUhnIG9ZN3Qgd3MzaiBUaHhx',
				'Content-Type': 'image/jpeg'
			},
			data: data.originFileObj
		};

		axios(config)
			.then(function (res) {
				console.log(res.data.id);
				localStorage.setItem('webImageID', res.data.id);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const handleUploadAvatar = async (file: any) => {
		try {
			if (file.status === 'uploading') {
				setLoadingImage(true);
				return;
			}
			if (file.status === 'done') {
				const res = await studentApi.uploadImage(file.originFileObj);
				if (res.status === 200) {
					setImgUrl(res.data.data);
					return res;
				}
			}
		} catch (err) {
			console.log('UploadAvatarField-handleUploadAvatar', err);
		} finally {
			setLoadingImage(false);
		}
	};

	const beforeUpload = (file: any) => {
		const validTypeList = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'];
		const isValidType = validTypeList.includes(file.type);
		if (!isValidType) {
			showNoti('danger', `${file.name} không đúng định dạng (jpg | jpeg | png | bmp).`);
		}
		return isValidType;
	};

	const UploadButton = (props) => {
		return (
			<>
				<div className={`bg-upload  ${loadingImage && 'loading'}`}>{loadingImage ? <LoadingOutlined /> : <PlusOutlined />}</div>
			</>
		);
	};

	return (
		<Form.Item
			style={style}
			label={label}
			className={`${className} ${hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''}`}
		>
			<Controller
				name={name}
				control={form.control}
				render={({ field }) => {
					return (
						<Upload
							name={field.name}
							ref={field.ref}
							listType="picture-card"
							className="avatar-uploader"
							disabled={disabled}
							showUploadList={false}
							beforeUpload={beforeUpload}
							onChange={(obj: any) => {
								handleUploadAvatar(obj.file).then((res) => res?.status === 200 && field.onChange(res.data.data));
								isUploadWeb && isUploadWeb && fetchWebsiteImage(obj.file);
							}}
						>
							{loadingImage ? (
								<Spin size="large" />
							) : (
								<img
									src={field.value}
									alt="avatar"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										display: field.value ? 'block' : 'none'
									}}
								/>
							)}
							<UploadButton />
						</Upload>
					);
				}}
			/>
			{hasError && (
				<div className="ant-form-item-explain ant-form-item-explain-error">
					<div role="alert">{errors[name]?.message}</div>
				</div>
			)}
		</Form.Item>
	);
};
UploadAvatarField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	isUploadWeb: PropTypes.bool
};
UploadAvatarField.defaultProps = {
	label: '',
	disabled: false,
	style: {},
	className: ''
};
export default UploadAvatarField;
