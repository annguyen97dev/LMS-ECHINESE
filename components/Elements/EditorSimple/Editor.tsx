import React, { Component, useEffect, useState, useRef, createRef, useLayoutEffect } from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-ru-RU'; // you can import any other locale
import { studentApi } from '~/apiBase';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Modal, Button, Input } from 'antd';

// Import bootstrap(v3 or v4) dependencies
import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/tooltip';
import { format } from 'path';
import { data } from '~/lib/invoice/data';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

type dataTranslate = Array<{
	noteID: number;
	textSelect: string;
	textTranslate: string;
}>;

const EditorSummernote = (props) => {
	const { getDataEditor, questionContent, isReset, isTranslate, defaultValue, isSimpleTool, height } = props;
	const [valueEditor, setValueEditor] = useState(questionContent);
	const [textSelect, setTextSelect] = useState(null);
	const [textTranslate, setTextTranslate] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [dataTranslate, setDataTranslate] = useState<dataTranslate>([]);
	const [isAddTranslate, setIsAddTranslate] = useState(false);
	const [reloadContent, setReloadContent] = useState(false);
	let inputTranslate = useRef(null);

	// Châu thêm defaultValue
	useEffect(() => {
		if (defaultValue !== undefined && defaultValue !== null) {
			setValueEditor(defaultValue);
		}
	}, []);

	const showModal = (type) => {
		setIsModalVisible(true);
		if (type == 'add') {
			setIsAddTranslate(true);
		} else {
			setIsAddTranslate(false);
		}
	};

	const handleOk = () => {
		if (isAddTranslate) {
			if (textSelect) {
				handleAddTranslate();
			}
		} else {
			handleFixTranslate();
		}
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setTextSelect(null);
		setTextTranslate(null);
	};

	// GET TRANSLATE TEXT
	const onChange_GetTranslateText = (e) => {
		let text = e.target.value;
		setTextTranslate(text);
	};

	const onKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleAddTranslate();
			setIsModalVisible(false);
		}
	};

	// HANDLE FIX TRANSLATE
	const handleFixTranslate = () => {
		let elementNote = document.querySelectorAll('#editor-element .note-editable .text-note-of-translate');
		elementNote.forEach((item, index) => {
			let noteID = parseInt(item.getAttribute('data-note'));
			let textItem = item.innerHTML;

			let indexData = dataTranslate.findIndex((e) => e.noteID === noteID);
			if (dataTranslate[indexData].textTranslate !== textItem) {
				item.innerHTML = dataTranslate[indexData].textTranslate;
				item.setAttribute('title', dataTranslate[indexData].textTranslate);
			}
		});
		setReloadContent(true);
	};

	// HANDLE ADD TRANSLATE
	const handleAddTranslate = () => {
		let elementEditor = document.querySelectorAll('#editor-element .note-editable');
		let elementP = document.querySelectorAll('#editor-element .note-editable p');

		const onAdd = (item) => {
			let innerText = item.innerHTML;
			if (innerText.includes(textSelect)) {
				let noteID = null;
				if (dataTranslate.length < 1) {
					noteID = 0;
				} else {
					noteID = dataTranslate[dataTranslate.length - 1].noteID + 1;
				}

				item.innerHTML = innerText.replace(
					textSelect,
					`<input class="input-prevent-translate"/><span title="${textTranslate}" class="text-normal-of-translate">${textSelect}<span data-note="${noteID}" class="text-note-of-translate">${textTranslate}</span></span><input class="input-prevent-translate"/>`
				);

				dataTranslate.push({
					noteID: noteID,
					textSelect: textSelect,
					textTranslate: textTranslate
				});
				setDataTranslate([...dataTranslate]);
			}
		};

		if (elementP.length > 0) {
			elementP.forEach((item) => {
				onAdd(item);
			});
		} else {
			onAdd(elementEditor[0]);
		}

		setTextTranslate(null);
		setTextSelect(null);
		setReloadContent(true);
	};

	const onFixTextTranslate = (e, noteID) => {
		let text = e.target.value;
		let index = dataTranslate.findIndex((item) => item.noteID == noteID);

		console.log('Index: ', index);

		dataTranslate[index].textTranslate = text;
		setDataTranslate([...dataTranslate]);
	};

	useEffect(() => {
		let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes;

		let editorElement = document.getElementById('editor-element');
		editorElement.addEventListener('mouseup', (e) => {
			var sel = window.getSelection && window.getSelection();
			if (sel && sel.rangeCount > 0) {
				let textSelect = window.getSelection().toString();
				setTextSelect(textSelect);
			}
		});
	});

	// ON CHANGE
	const onChange = (content) => {
		getDataEditor(content);
	};

	// UPLOAD IMAGES
	const onImageUpload = async (fileList) => {
		try {
			let res = await studentApi.uploadImage(fileList[0]);
			if (res.status == 200) {
				ReactSummernote.insertImage(res.data.data);
			}
		} catch (error) {
			console.log('Error', error);
		} finally {
		}
	};

	useLayoutEffect(() => {
		if (isModalVisible) {
			inputTranslate.current && inputTranslate.current.select();
		}
	}, [isModalVisible]);

	useEffect(() => {
		if (reloadContent) {
			let elementEditor = document.querySelectorAll('#editor-element .note-editable');
			setValueEditor(elementEditor[0].innerHTML);
			getDataEditor(elementEditor[0].innerHTML);
			setReloadContent(false);
		}
	}, [reloadContent]);

	// HANDLE RESET
	useEffect(() => {
		isReset && (ReactSummernote.reset(), setValueEditor(''));
	}, [isReset]);

	useEffect(() => {
		let elementNote = document.querySelectorAll('#editor-element .note-editable .text-normal-of-translate');

		console.log('Element Note: ', elementNote);

		if (elementNote.length > 0) {
			elementNote.forEach((item) => {
				//@ts-ignore
				let noteID = item.lastChild.attributes[0].nodeValue;
				let textSelect = item.firstChild.nodeValue;
				let textTranslate = item.lastChild.childNodes[0].nodeValue;
				dataTranslate.push({
					noteID: parseInt(noteID),
					textSelect: textSelect,
					textTranslate: textTranslate
				});
			});
			setDataTranslate([...dataTranslate]);
		}
	}, []);

	return (
		<>
			<Modal title="Phiên âm" visible={isModalVisible} okText="Lưu" cancelText="Hủy" onOk={handleOk} onCancel={handleCancel}>
				{isAddTranslate ? (
					textSelect ? (
						<Input
							allowClear
							id="input-translate"
							className="style-input"
							value={textTranslate}
							onChange={onChange_GetTranslateText}
							onKeyDown={onKeyDown}
							ref={inputTranslate}
						/>
					) : (
						<p style={{ fontWeight: 500 }}>Vui lòng chọn nội dung cần phiên âm</p>
					)
				) : (
					<div className="detail-translate">
						<table>
							<thead>
								<th className="text-center">Nội dung</th>
								<th className="text-center">Phiên âm</th>
							</thead>
							<tbody>
								{dataTranslate.map((item, index) => (
									<tr key={index}>
										<td>{item.textSelect}</td>
										<td className="text-center">
											<input
												className="show-text-translate"
												type="text"
												value={item.textTranslate}
												onChange={(e) => {
													onFixTextTranslate(e, item.noteID);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														handleFixTranslate();
														setIsModalVisible(false);
													}
												}}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Modal>
			<div className="wrap-editor" id="editor-element" style={{ borderRadius: 8 }}>
				{isTranslate && (
					<>
						<button className="btn-editor d-flex align-items-center" onClick={() => showModal('add')}>
							<PlusOutlined className="mr-2" /> Thêm Phiên âm
						</button>
						<button className="btn-editor fix-translate d-flex align-items-center" onClick={() => showModal('fix')}>
							<EditOutlined className="mr-2" /> Sửa phiên âm
						</button>
					</>
				)}

				<ReactSummernote
					value={valueEditor}
					children={ReactHtmlParser(valueEditor)}
					options={{
						lang: 'vn',
						height: height || 220,
						dialogsInBody: true,
						toolbar: isSimpleTool
							? [
									['style', ['style']],
									['font', ['bold', 'underline']],
									['fontname', ['fontname']],
									['para', ['ul', 'ol', 'paragraph']],
									['insert', ['link']]
							  ]
							: [
									['style', ['style']],
									['font', ['bold', 'underline', 'clear']],
									['fontname', ['fontname']],
									['para', ['ul', 'ol', 'paragraph']],
									['table', ['table']],
									['insert', ['link', 'picture', 'video']],
									['view', ['fullscreen', 'codeview']]
							  ]
					}}
					onChange={(content) => onChange(content)}
					onImageUpload={onImageUpload}
				/>
			</div>
		</>
	);
};

export default EditorSummernote;
