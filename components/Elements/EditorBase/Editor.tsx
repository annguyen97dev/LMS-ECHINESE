import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/tooltip';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import ReactHtmlParser from 'react-html-parser';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-vi-VN'; // you can import any other locale

EditorBaseSummerNote.propTypes = {
	isReset: PropTypes.bool,
	content: PropTypes.string,
	handleChangeDataEditor: PropTypes.func,
	handleOnImageUpload: PropTypes.func,
};

EditorBaseSummerNote.defaultProps = {
	isReset: false,
	content: '',
	handleChangeDataEditor: null,
	handleOnImageUpload: null,
};

function EditorBaseSummerNote(props) {
	const {isReset, content, handleChangeDataEditor, handleOnImageUpload} = props;

	const checkHandleChangeDataEditor = (content) => {
		if (!handleChangeDataEditor) return;
		handleChangeDataEditor(content);
	};

	const checkHandleUploadImage = (fileList) => {
		if (!handleOnImageUpload) return;
		handleOnImageUpload(fileList).then((res) => {
			if (res.status === 200) {
				ReactSummernote.insertImage(res.data.data);
			}
		});
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
					height: 600,
					dialogsInBody: true,
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
				onImageUpload={checkHandleUploadImage}
			/>
		</div>
	);
}

export default EditorBaseSummerNote;
