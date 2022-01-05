import { PlusOutlined } from '@ant-design/icons';
import { Form, Modal, Upload } from 'antd';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

// const checkFileTypeDemo = (file: File) => {
// 	const {type, name} = file;
// 	if (type.includes('image')) {
// 		return {
// 			name,
// 			type,
// 			Type: 2, // in dependent field of api
// 		};
// 	}
// 	if (type.includes('audio')) {
// 		return {
// 			name,
// 			type,
// 			Type: 3,
// 			preview: '',  // in dependent field of api
// 		};
// 	}
// 	if (type.includes('video')) {
// 		return {
// 			name,
// 			type,
// 			Type: 4,
// 			preview: '',
// 		};
// 	}
// 	return {
// 		Type: 0,
// 	};
// };
// const handleUploadFileDemo = async (fileList) => {
// 	try {
// 		let nextPost = 0;
// 		const resArr = await Promise.all(
// 			fileList.reduce((newArr, file, idx) => {
// 				if (file.originFileObj) {
// 					newArr.push(newsFeedApi.uploadFile(file.originFileObj));
// 				} else {
// 					nextPost = idx + 1;
// 					newArr;
// 				}
// 				return newArr;
// 			}, [])
// 		);
// 		const rs = resArr.map((r: any) => {
// 			return {
// 				uid: r.data.data,
// 				url: r.data.data,
// 				...checkFileType(fileList[nextPost]),
// 			};
// 		});
// 		return rs;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

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

const UploadFileField = (props) => {
	const { form, name, label, disabled, handleBeforeUpload, handleUploadFile, style, className, max, selectMultiple, accept } = props;

	const { errors } = form.formState;
	const hasError = errors[name];
	const isUploadImages = useRef(true);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewUrl, setPreviewUrl] = useState('');
	const [fileTypePreview, setFileTypePreview] = useState('');
	const refList = useRef([]);

	const closeModal = () => {
		setPreviewVisible(false);
		if (refList.current.length) {
			refList.current.map((r) => r?.pause());
		}
	};

	const checkHandleBeforeUpload = (file, fileList) => {
		if (!handleBeforeUpload) return;
		return handleBeforeUpload(file, fileList);
	};

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		// audio/*,video/*,image/*
		setFileTypePreview(file.type.slice(0, file.type.indexOf('/')));
		setPreviewUrl(file.url || file.preview);
		setPreviewVisible(true);
	};

	const uiPreview = () => {
		if (fileTypePreview === 'image') {
			return <img alt="preview-img" style={{ width: '100%' }} src={previewUrl} />;
		}
		if (fileTypePreview === 'video') {
			return (
				<video
					ref={(video) => {
						refList.current.push(video);
					}}
					controls
					style={{ width: '100%' }}
				>
					<source src={previewUrl} type="video/mp4" />
					<source src={previewUrl} type="video/ogg" />
					Your browser does not support the video tag.
				</video>
			);
		}
		if (fileTypePreview === 'audio') {
			return (
				<audio
					ref={(audio) => {
						refList.current.push(audio);
					}}
					controls
					style={{ width: '100%' }}
				>
					<source src={previewUrl} type="audio/ogg" />
					<source src={previewUrl} type="audio/mpeg" />
					Your browser does not support the audio element.
				</audio>
			);
		}
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
				render={({ field, fieldState, formState }) => {
					/** VALUE OF FIELD MUST BE OBJECT IN ARRAY IFILE[]*/
					const checkFileList = () => {
						if (Array.isArray(field.value) && field.value.length) {
							const rs: IFile[] = field.value;
							return rs;
						}
						return null;
					};
					return (
						<>
							<Upload
								{...field}
								accept={
									accept ||
									'audio/*,video/*,image/png,image/jpg,image/jpeg,image/bmp,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf'
								}
								listType="picture-card"
								className="file-uploader"
								disabled={disabled}
								multiple={selectMultiple || max > 1 ? true : false}
								maxCount={max}
								fileList={checkFileList()}
								onPreview={handlePreview}
								beforeUpload={checkHandleBeforeUpload}
								onRemove={(file) => {
									if (handleUploadFile) {
										isUploadImages.current = true;
										if (field.value?.length) {
											const newValue = field.value.filter((f) => f.uid !== file.uid);
											field.onChange(newValue);
										}
									}
								}}
								onChange={(obj) => {
									console.log(obj.fileList);
									if (handleUploadFile) {
										const itemAlready = field.value?.length ?? 0;
										if (itemAlready < max && isUploadImages.current) {
											// AVOID CALL DOUBLE API BECAUSE UPLOAD ANTD COMPONENT RE-RENDER
											isUploadImages.current = false;
											// HANDLE UPLOAD FILE RETURN ARRAY
											handleUploadFile(obj.fileList).then((res) => {
												isUploadImages.current = true;
												if (Array.isArray(res) && res.length) {
													field.value ? field.onChange([...field.value, ...res]) : field.onChange(res);
												}
											});
										}
										return;
									}
									if (obj.fileList.length < 1) {
										field.onChange(null);
										return;
									}
									field.onChange(obj.fileList);
								}}
							>
								{checkFileList()?.length >= max ? null : (
									<div className={`bg-upload`}>
										<PlusOutlined />
									</div>
								)}
							</Upload>
							<Modal
								key={Math.floor(Math.random() * 130698)}
								title="Xem trước"
								visible={previewVisible}
								footer={null}
								onCancel={closeModal}
							>
								{uiPreview()}
							</Modal>
						</>
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
UploadFileField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	max: PropTypes.number,
	accept: PropTypes.string,
	selectMultiple: PropTypes.bool,
	handleUploadFile: PropTypes.func,
	handleBeforeUpload: PropTypes.func
};
UploadFileField.defaultProps = {
	label: '',
	disabled: false,
	style: {},
	className: '',
	max: 9999,
	accept: '',
	selectMultiple: false,
	handleUploadFile: null,
	handleBeforeUpload: null
};
export default UploadFileField;
