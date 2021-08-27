import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {Form, Upload} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Controller} from 'react-hook-form';

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
	const [fileList, setFileList] = useState<
		{
			uid: string;
			name: string;
			url?: string;
		}[]
	>([]);
	const [loadingImage, setLoadingImage] = useState(false);
	const [imgUrl, setImgUrl] = useState();

	const {errors} = form.formState;
	const hasError = errors[name];

	// THIS FUNCTION IS STILL UNDER CONSTRUCTION
	const checkHandleUploadMultipleImage = async (file: IFile[]) => {
		console.log('THIS FUNCTION IS STILL UNDER CONSTRUCTION', file);
		if (!handleUploadMultipleImage) return;
		handleUploadMultipleImage();
	};
	const checkHandleUploadImage = async (file: IFile) => {
		if (!handleUploadImage) return;
		if (file.status === 'uploading') {
			setLoadingImage(true);
			return;
		}
		try {
			const res = await handleUploadImage(file.originFileObj);
			return res;
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

	useEffect(() => {
		// MULTI UPLOAD IMAGE NEED ARRAY IMAGE
		isUploadList && setFileList(imageList);
	}, [imageList]);

	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
			setImgUrl(src);
		}
	};

	const UploadButton = (props) => {
		return (
			<>
				<div
					className={`bg-upload ${imgUrl && 'have-img'} ${
						loadingImage && 'loading'
					}`}
				>
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
							fileList={fileList}
							listType="picture-card"
							className="avatar-uploader"
							disabled={disabled}
							showUploadList={isUploadList}
							multiple={isUploadList}
							onChange={(obj) => {
								setFileList(obj.fileList);
								onPreview(obj.file);
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
									src={imgUrl || field.value}
									alt="avatar"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										display: imgUrl || field.value ? 'block' : 'none',
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
