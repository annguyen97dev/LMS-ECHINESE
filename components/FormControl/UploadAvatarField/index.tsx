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
	const { form, name, label, disabled, style, className } = props;

	const [imgUrl, setImgUrl] = useState('');
	const [loadingImage, setLoadingImage] = useState(false);
	const { showNoti } = useWrap();
	const { errors } = form.formState;
	const hasError = errors[name];

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
							}}
						>
							{loadingImage ? (
								<Spin size="large" />
							) : (
								<img
									src={imgUrl || field.value}
									alt="avatar"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										display: imgUrl || field.value ? 'block' : 'none'
									}}
								/>
							)}
							{/* <UploadButton /> */}
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
	className: PropTypes.string
};
UploadAvatarField.defaultProps = {
	label: '',
	disabled: false,
	style: {},
	className: ''
};
export default UploadAvatarField;
