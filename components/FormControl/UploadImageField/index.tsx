import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {Form, Upload} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Controller} from 'react-hook-form';
import {useWrap} from '~/context/wrap';

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
const UploadImageField = (props) => {
	const {
		form,
		name,
		label,
		disabled,
		handleUploadImage,
		style,
		className,
		// FOR UPLOAD MULTIPLE IMAGE STILL UNDER CONSTRUCTION
		isUploadList,
		handleUploadMultipleImage,
		imageList,
	} = props;
	const [imageListForUploadField, setImageListForUploadField] = useState<
		{
			uid: string;
			name: string;
			url?: string;
		}[]
	>([]);
	const [loadingImage, setLoadingImage] = useState(false);
	const {showNoti} = useWrap();
	const {errors} = form.formState;
	const hasError = errors[name];

	// THIS FUNCTION IS STILL UNDER CONSTRUCTION
	const checkHandleUploadMultipleImage = async (file: IFile[]) => {
		if (!handleUploadMultipleImage) return;
		handleUploadMultipleImage();
	};

	useEffect(() => {
		// MULTI UPLOAD IMAGE NEED ARRAY IMAGE
		isUploadList && setImageListForUploadField(imageList);
	}, [imageList]);

	const checkHandleUploadImage = async (file: IFile) => {
		if (!handleUploadImage) return;
		if (file.status === 'uploading') {
			setLoadingImage(true);
			return;
		}
		try {
			if (file.status === 'done') {
				const res = await handleUploadImage(file.originFileObj);
				return res;
			}
		} finally {
			setLoadingImage(false);
		}
	};

	const switchUploadImage = (obj: IFileList) => {
		if (isUploadList) {
			return checkHandleUploadMultipleImage(obj.fileList);
		} else {
			return checkHandleUploadImage(obj.file);
		}
	};

	const beforeUpload = (file: IFile) => {
		const validTypeList = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'];
		const isValidType = validTypeList.includes(file.type);
		if (!isValidType) {
			showNoti(
				'danger',
				`${file.name} không đúng định dạng (jpg | jpeg | png | bmp).`
			);
		}
		return isValidType;
	};

	const UploadButton = (props) => {
		return (
			<>
				<div className={`bg-upload  ${loadingImage && 'loading'}`}>
					{loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
				</div>
			</>
		);
	};

	return (
		<Form.Item
			style={style}
			label={label}
			className={`${className} ${
				hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''
			}`}
		>
			<Controller
				name={name}
				control={form.control}
				render={({field}) => {
					return (
						<Upload
							{...field}
							listType="picture-card"
							className="avatar-uploader"
							disabled={disabled}
							//
							fileList={imageListForUploadField}
							showUploadList={isUploadList}
							multiple={isUploadList}
							//
							beforeUpload={beforeUpload}
							onChange={(obj) => {
								setImageListForUploadField(obj.fileList);
								switchUploadImage(obj).then((res) => {
									if (res && res.status === 200)
										if (isUploadList) {
										} else {
											field.onChange(res.data.data);
										}
								});
							}}
						>
							{!isUploadList && (
								<img
									src={field.value}
									alt="avatar"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										display: field.value ? 'block' : 'none',
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
UploadImageField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	handleUploadImage: PropTypes.func,
	// FOR UPLOAD MULTIPLE IMAGE STILL UNDER CONSTRUCTION
	isUploadList: PropTypes.bool,
	handleUploadMultipleImage: PropTypes.func,
	imageList: PropTypes.array,
};
UploadImageField.defaultProps = {
	label: '',
	disabled: false,
	style: {},
	className: '',
	handleUploadImage: null,
	// FOR UPLOAD MULTIPLE IMAGE STILL UNDER CONSTRUCTION
	isUploadList: false,
	handleUploadMultipleImage: null,
	imageList: [],
};
export default UploadImageField;
