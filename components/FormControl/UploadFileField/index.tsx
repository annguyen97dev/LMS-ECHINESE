import {PlusOutlined} from '@ant-design/icons';
import {Form, Upload} from 'antd';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
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
const UploadFileField = (props) => {
	const {
		form,
		name,
		label,
		text,
		disabled,
		handleUploadFile,
		style,
		className,
		max,
		selectMultiple,
		isUploadList,
	} = props;

	const [fileListForUploadField, setFileListForUploadField] = useState<
		{
			uid: string;
			name: string;
			url?: string;
		}[]
	>([]);
	const {errors} = form.formState;
	const hasError = errors[name];

	const onPreview = async (file) => {
		console.log(file);
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
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
				render={({field, fieldState, formState}) => {
					const checkFileList = () => {
						if (Array.isArray(field.value) && field.value.length) {
							return field.value;
						}
						if (field.value) {
							return [field.value];
						}
						if (!field.value) {
							return null;
						}
					};
					return (
						<Upload
							{...field}
							accept="audio/*,video/*,image/png,image/jpg,image/jpeg,image/bmp,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"
							listType="picture-card"
							className="file-uploader"
							disabled={disabled}
							multiple={selectMultiple}
							maxCount={max}
							onPreview={() => console.log(123)}
							fileList={checkFileList()}
							onRemove={() => {
								field.onChange(null);
							}}
							onChange={(obj) => {
								setFileListForUploadField(obj.fileList);
								if (isUploadList) {
									field.onChange(obj.fileList.map((f) => f.originFileObj));
								} else {
									field.onChange(obj.file.originFileObj);
								}
							}}
						>
							{checkFileList()?.length >= max ? null : (
								<div className={`bg-upload`}>
									<PlusOutlined />
								</div>
							)}
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
UploadFileField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	text: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	handleUploadFile: PropTypes.func,
	max: PropTypes.number,
	selectMultiple: PropTypes.bool,
	// FOR UPLOAD MULTIPLE IMAGE STILL UNDER CONSTRUCTION
	isUploadList: PropTypes.bool,
	handleUploadMultipleFile: PropTypes.func,
	fileList: PropTypes.array,
};
UploadFileField.defaultProps = {
	label: '',
	text: '',
	disabled: false,
	style: {},
	className: '',
	handleUploadFile: null,
	max: 1,
	selectMultiple: false,
	// FOR UPLOAD MULTIPLE IMAGE STILL UNDER CONSTRUCTION
	isUploadList: false,
	handleUploadMultipleFile: null,
	fileList: [],
};
export default UploadFileField;
