import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/tooltip';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import ReactHtmlParser from 'react-html-parser';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-vi-VN'; // you can import any other locale
import {studentApi} from '~/apiBase';
import {useWrap} from '~/context/wrap';

EditorBaseSummerNote.propTypes = {
	isReset: PropTypes.bool,
	content: PropTypes.string,
	height: PropTypes.number,
	handleChangeDataEditor: PropTypes.func,
	// PROP TYPES FOR CUSTOM FIELD. CAN SKIP
	customFieldProps: PropTypes.shape({
		name: PropTypes.string.isRequired,
		onBlur: PropTypes.func.isRequired,
		onChange: PropTypes.func.isRequired,
		innerRef: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.shape({current: PropTypes.any}),
		]).isRequired,
		value: PropTypes.string.isRequired,
		disabled: PropTypes.bool.isRequired,
	}),
};

EditorBaseSummerNote.defaultProps = {
	isReset: false,
	content: '',
	height: 600,
	handleChangeDataEditor: null,
};

function EditorBaseSummerNote(props) {
	const {isReset, content, height, handleChangeDataEditor, customFieldProps} =
		props;
	const {showNoti} = useWrap();
	const checkHandleChangeDataEditor = (content) => {
		if (!handleChangeDataEditor) return;
		handleChangeDataEditor(content);
	};

	const handleUploadImage = async (fileList) => {
		try {
			const validType = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'];
			if (!validType.includes(fileList[0].type)) {
				showNoti(
					'danger',
					`${fileList[0].name} không đúng định dạng (jpg | jpeg | png | bmp).`
				);
				return;
			}
			let res = await studentApi.uploadImage(fileList[0]);
			if (res.status === 200) {
				ReactSummernote.insertImage(res.data.data);
			}
		} catch (error) {
			error?.status === 400 &&
				showNoti(
					'danger',
					'Ảnh không đúng định dạng (jpg | jpeg | png | bmp).'
				);
			console.log('handleUploadImage', error);
		}
	};

	useEffect(() => {
		isReset && ReactSummernote.reset();
	}, [isReset]);

	return (
		<div className="wrap-editor">
			<ReactSummernote
				children={ReactHtmlParser(content)}
				value={content}
				options={{
					lang: 'vn',
					height: height,
					dialogsInBody: true,
					disableDragAndDrop: true,
					toolbar: [
						['style', ['style']],
						['font', ['bold', 'underline', 'clear']],
						['fontname', ['fontname']],
						['para', ['ul', 'ol', 'paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture', 'video']],
						['view', ['fullscreen', 'codeview']],
					],
				}}
				onChange={checkHandleChangeDataEditor}
				onImageUpload={handleUploadImage}
				{...customFieldProps}
			/>
		</div>
	);
}

export default EditorBaseSummerNote;
