import React, { Component, useEffect, useState } from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-ru-RU'; // you can import any other locale
import { studentApi } from '~/apiBase';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

// Import bootstrap(v3 or v4) dependencies
import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/tooltip';
import { format } from 'path';
import index from '~/components/LoginForm';
import IdiomsForm from '~/components/Global/Option/IdiomsForm';
import { BorderOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
// import "bootstrap/dist/css/bootstrap.css";
import { Modal, Button, Input } from 'antd';

// let keys = "";
let arrKey = [];
let countEnter = 0;
let indexChar = 0;
let textReplace = '';

type dataTranslate = Array<{
	noteID: number;
	textSelect: string;
	textTranslate: string;
}>;

const EditorSummernote = (props) => {
	const { getDataEditor, isReset, questionContent, addQuestion, deleteSingleQuestion, deleteAllQuestion, questionData, visible } = props;

	// -- For add space --
	const [valueEditor, setValueEditor] = useState(questionContent);
	const [propetyEditor, setPropetyEditor] = useState({
		textNode: null,
		offset: null
	});
	const [isFocus, setIsFocus] = useState(false);
	const [keyEditor, setKeyEditor] = useState({
		id: null,
		key: ''
	});
	const [isAdd, setIsAdd] = useState(false);
	const [reloadContent, setReloadContent] = useState(false);
	const [listInput, setListInput] = useState<Array<number>>([]);
	const [changePosition, setChangePosition] = useState(false);
	const [saveID, setSaveID] = useState(null);

	// -- For translate --
	const [textSelect, setTextSelect] = useState(null);
	const [textTranslate, setTextTranslate] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [dataTranslate, setDataTranslate] = useState<dataTranslate>([]);
	const [isAddTranslate, setIsAddTranslate] = useState(false);
	const [reloadTranslate, setReloadTranslate] = useState(false);

	// console.log("Propety: ", propetyEditor);
	// console.log("Value editor: ", valueEditor);
	// console.log('Count Enter: ', countEnter);
	// console.log("Position is: ", position);
	// console.log('Key Editor: ', keyEditor);
	// console.log("List Input: ", listInput);
	// console.log("Is Focus: ", isFocus);
	// console.log("Index Char:  ", indexChar);
	// console.log('List input: ', listInput);
	// console.log("Text Replace: ", textReplace);
	// console.log('Save Id is: ', saveID);

	// ================= FOR TRANSLATE ===================
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

	const onKeyDownInput = (e) => {
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
		setReloadTranslate(true);
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
		setReloadTranslate(true);
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

	// ================= FOR ADD SPACE ===================
	const formatKey = (e) => {
		switch (e.keyCode) {
			case 16:
				console.log('key 16');
				arrKey.splice(arrKey.length - 1, 1);
				break;
			case 8: // backspace
				arrKey.splice(arrKey.length - 1, 1);

				indexChar--;
				if (indexChar < 0) {
					countEnter--;
					if (countEnter < 0) {
						countEnter = 0;
					}

					indexChar = 0;
				}

				textReplace = textReplace.slice(0, indexChar) + textReplace.slice(indexChar + 1);

				break;
			case 13: // enter
				countEnter++;
				arrKey = [];
				break;
			default:
				indexChar++;
				arrKey.push(e.key);
				break;
		}

		// Remove backspace khỏi mảng
		let newArr = arrKey.filter((item) => item !== 'Backspace');

		// Bóc tách và xóa backspace
		for (let i = 0; i < 10; i++) {
			if (newArr[newArr.length - 1] == ' ') {
				newArr.splice(newArr.length - 1, 1);
			} else {
				break;
			}
		}
		for (let i = 0; i < 5; i++) {
			if (newArr[0] == ' ') {
				newArr.splice(0, 1);
			} else {
				break;
			}
		}

		return newArr;
	};

	// ON KEY UP
	const onKeyDown = (e) => {
		let node = null;
		let id = null;

		// Get id of element
		if (e.currentTarget.childNodes.length > 0) {
			node = e.currentTarget.childNodes[countEnter];
			// if (node && e.currentTarget.childNodes.length == 1) {
			//   node.id = countEnter;
			// }
			if (node) {
				id = node.id;
			}
		}

		// Get array character
		let arrChar = formatKey(e);

		// Get key and set state
		let key = arrChar.join('');
		setKeyEditor({
			id: id,
			key: key
		});

		// Reset propety editor
		// setPropetyEditor({
		//   textNode: null,
		//   offset: null,
		// });
	};

	// ON CHANGE
	const onChange = (content) => {
		setIsFocus(false);
		setIsAdd(false);

		getDataEditor(content);
		setValueEditor(content);
	};

	// ON FOCUS
	const onFocus = (e) => {
		countEnter = e.target.id;

		// setKeyEditor({
		//   ...keyEditor,
		//   id: e.target.id,
		// });

		setIsFocus(true);
		setIsAdd(false);

		let range;
		let textNode;
		let offset;

		if (document.caretRangeFromPoint) {
			range = document.caretRangeFromPoint(e.clientX, e.clientY);
			textNode = range.startContainer;

			offset = range.startOffset;
			//@ts-ignore
		} else if (document.caretPositionFromPoint) {
			//@ts-ignore
			range = document.caretPositionFromPoint(e.clientX, e.clientY);

			textNode = range.offsetNode;
			offset = range.offset;
		} else {
			return;
		}

		if (range.startContainer.previousSibling || range.startContainer.nextSibling) {
			textReplace = range.startContainer.textContent;
			textReplace = textReplace.substring(0, textReplace.length - 1);
		}
		indexChar = offset;

		setPropetyEditor({
			textNode: textNode,
			offset: offset
		});
	};

	// Thao tác click add input vào đoạn văn
	const handleAddSpace = () => {
		// On add space
		const onAddSpace = () => {
			// Set id for input
			let inputID = createInputID();
			let indexInput = listInput.indexOf(inputID);

			// On add space
			let replacement = propetyEditor.textNode.splitText(propetyEditor.offset);
			let inputE = document.createElement('input');
			inputE.id = inputID.toString();
			inputE.className = 'space-editor';
			inputE.setAttribute('placeholder', `(${(indexInput + 1).toString()})`);

			// inputE.innerText = `(${(indexInput + 1).toString()})`;
			// inputE.setAttribute("role", "textbox");
			// inputE.setAttribute("aria-labelledby", "txtboxLabel");
			// inputE.setAttribute("aria-multiline", "true");
			// inputE.setAttribute("contentEditable", "true");
			propetyEditor.textNode.parentNode.insertBefore(inputE, replacement);

			// Reload Content
			setReloadContent(true);
			setTimeout(() => {
				setReloadContent(false);
			}, 200);
		};
		// ---------------------//

		if (!isFocus) {
			setIsAdd(true);
		} else {
			if (propetyEditor.textNode && propetyEditor.textNode.nodeType == 3) {
				onAddSpace();
			}
		}
	};

	// UPLOAD IMAGES
	const onImageUpload = async (fileList) => {
		try {
			let res = await studentApi.uploadImage(fileList[0]);
			if (res.status == 200) {
				ReactSummernote.insertImage(res.data.data);
			}
		} catch (error) {
		} finally {
		}
	};

	// ======== CREATE INPUT ID ==========
	const createInputID = () => {
		let inputID = null;
		// Check add set id for input
		if (listInput.length == 0) {
			if (saveID) {
				inputID = saveID + 1;
			} else {
				inputID = 0;
			}
		} else {
			let max = Math.max(...listInput);
			inputID = max + 1;
		}

		listInput.push(inputID);
		setListInput([...listInput]);

		return inputID;
	};

	// HANDLE RESET
	useEffect(() => {
		isReset && (ReactSummernote.reset(), setValueEditor(''), setListInput([]));
	}, [isReset]);

	// Function any handle delete
	const anyHandleDelete = () => {
		setListInput([]);
		countEnter = 0;
		arrKey = [];
		deleteAllQuestion && deleteAllQuestion();
		setKeyEditor({
			id: null,
			key: ''
		});
	};

	// ========================== ACTION WHEN CHANGE VALUE =======================================
	useEffect(() => {
		let editor = document.querySelectorAll('.note-editable');
		let tagP = document.querySelectorAll('.note-editable p'); // Get node element in editor
		let spaceEditor = document.querySelectorAll('.note-editable .space-editor');

		// Check space is deleted
		let newList = [];
		if (spaceEditor) {
			spaceEditor.forEach((item) => {
				item.id && newList.push(item.id);
			});
		}

		console.log('List Input: ', listInput);
		console.log('New List: ', newList);

		if (listInput.length > 0) {
			let difID = listInput.filter((x) => !newList.includes(x.toString()));

			console.log('DIF ID: ', difID);

			if (difID.length > 0) {
				deleteSingleQuestion && deleteSingleQuestion(difID[0]); // xóa câu hỏi ở ngoài
				let indexID = listInput.indexOf(difID[0]);
				listInput.splice(indexID, 1);
				setListInput([...listInput]);

				// Kiểm tra và thay đổi vị trí của các ô input
				setChangePosition(true);
			}
		}
		// Check delete all
		if (editor[0].childNodes.length == 0) {
			anyHandleDelete();
		} else {
			let isEmpty = true;
			editor[0].childNodes.forEach((item, index) => {
				let node = editor[0].children[index];

				if (node?.innerHTML !== '<br>' && node?.innerHTML !== ' ') {
					isEmpty = false;
				}
			});
			if (isEmpty) {
				anyHandleDelete();
			}
		}

		if (tagP.length > 0) {
			tagP.forEach((item, index) => {
				// CHECK ITEM HAVE ID OR NOT => AND ADD ID FOR ITEM
				item.id = index.toString();

				// CHECK IF HAVE "SPAN" IN TAG P
				if (item.children.length > 0) {
					let node = item.children[0];
					if (node && node.nodeName == 'SPAN') {
						item.innerHTML = node.innerHTML;
					}
				}

				// ON CLICK HTML NODE
				item.addEventListener('click', (e) => {
					onFocus(e);
					arrKey = [];
					return false;
				});
			});
		} else {
			// check trường hợp trong editable là SPAN
		}
	}, [valueEditor]);

	function replaceNbsps(str) {
		var re = new RegExp(String.fromCharCode(160), 'g');
		return str.replace(re, ' ');
	}

	// ========================== HANDLE ADD INPUT =======================================
	useEffect(() => {
		if (isAdd) {
			let inputID = createInputID();
			let indexInput = listInput.indexOf(inputID);

			let editable = document.querySelectorAll('.note-editable');
			let tagP = document.querySelectorAll('.note-editable p');

			// Sau khi backspace tất cả thì mất phần tử <p> => check xem nếu ko tồn tại thì add space thẳng trong editor và ngược lại
			if (tagP.length == 0) {
				let content = editable[0].innerHTML;

				content = content.replace(
					keyEditor.key,
					keyEditor.key + `<input id="${inputID}" class='space-editor' placeholder="(${indexInput + 1})">`
				);

				editable[0].innerHTML = content;
			} else {
				tagP.forEach((item) => {
					if (item.id === keyEditor.id) {
						let content = item.innerHTML;
						content = content.replace('&nbsp;', ' ');

						// --- Check empty key ---
						if (keyEditor.key == '') {
							// TH1: nếu trong text đã có input, sau khi click gần đó thì vị trí bắt đầu tính từ input trở đi nên phải kiểm tra
							if (content.includes('space-editor')) {
								let arrTextReplace = textReplace.split('');

								arrTextReplace.splice(
									indexChar,
									0,
									`<input id="${inputID}" class='space-editor' placeholder="(${indexInput + 1})">`
								);

								let stringTextReplace = arrTextReplace.join('');

								content = content.replace(textReplace, stringTextReplace);
							} else {
								let newContent = content.split('');
								newContent.splice(
									indexChar,
									0,
									`<input id="${inputID}" class='space-editor' placeholder="(${indexInput + 1})">`
								);
								content = newContent.join('');
							}
						} else {
							content = content.replace(
								keyEditor.key,
								keyEditor.key + `<input id="${inputID}" class='space-editor' placeholder="(${indexInput + 1})">`
							);
						}

						item.innerHTML = content;
					}
				});
			}

			// Reset content
			setReloadContent(true);
			setTimeout(() => {
				setReloadContent(false);
			}, 200);
		}
	}, [isAdd]);

	// ========================== RELOAD CONTENT =======================================
	useEffect(() => {
		let spaceEditor = document.querySelectorAll('.note-editable .space-editor');

		// Trường hợp các câu hỏi đã có id mới và cần làm mới lại
		if (saveID == null) {
			if (spaceEditor?.length > 0) {
				spaceEditor.forEach((item, index) => {
					let id = parseInt(item.id);
					if (!listInput.includes(id)) {
						listInput.push(id);
						setListInput([...listInput]);
						setSaveID(Math.max(...listInput));
					}
				});
			}
		}

		if (reloadContent) {
			let allContentNode = document.querySelectorAll('.note-editable');
			let allContent = allContentNode[0].innerHTML;
			getDataEditor(allContent);
			setValueEditor(allContent);

			// Check and add - Check nếu hiện space trong đoạn văn mới add thêm câu hỏi
			let newList = [];
			spaceEditor.forEach((item, index) => {
				newList.push(parseInt(item.id));

				if (parseInt(item.id) === listInput[listInput.length - 1]) {
					addQuestion && addQuestion(listInput[listInput.length - 1]);
				}
			});
			if (!newList.includes(listInput[listInput.length - 1])) {
				listInput.splice(-1);
				setListInput([...listInput]);
			}
		}
	}, [reloadContent]);

	useEffect(() => {
		if (reloadTranslate) {
			let allContentNode = document.querySelectorAll('.note-editable');
			let allContent = allContentNode[0].innerHTML;
			getDataEditor(allContent);
			setValueEditor(allContent);
			setReloadTranslate(false);
		}
	}, [reloadTranslate]);

	// ================ CHECK AND CHANGE POSITION WHEN DELTE 1 INPUT ===================
	useEffect(() => {
		let spaceEditor = document.querySelectorAll('.note-editable .space-editor');
		if (changePosition) {
			if (spaceEditor.length > 0) {
				spaceEditor.forEach((item, index) => {
					if (listInput.includes(parseInt(item.id))) {
						let index = listInput.indexOf(parseInt(item.id));
						item.setAttribute('placeholder', `(${(index + 1).toString()})`);
					}
				});
			}
			setChangePosition(false);
		}
	}, [changePosition]);

	useEffect(() => {
		if (!visible) {
			ReactSummernote.reset(), setValueEditor('');
		} else {
			let editor = document.querySelectorAll('.note-editable');

			// Thay thẻ div = input
			let cloneValueEditor = valueEditor;
			if (questionData?.ExerciseList.length > 0) {
				questionData.ExerciseList.forEach((item) => {
					let indexInput: any = parseInt(item.inputID) + 1;
					indexInput = indexInput.toString();

					cloneValueEditor = cloneValueEditor.replace(
						`<div ques-id="${item.ID}" id="${indexInput}" class='space-editor' role='textbox' aria-labelledby='txtboxLabel' aria-multiline='true' contentEditable="true">(${indexInput})</div>`,
						`<input id="${item.inputID}" class="space-editor" placeholder="(${indexInput})">`
					);

					console.log(
						'Test: ',
						`<div ques-id="${item.ID}" id="${indexInput}" class="space-editor" role="textbox" aria-labelledby="txtboxLabel" aria-multiline="true" contenteditable="true">(${indexInput})</div>`
					);
					console.log('Data Clone: ', cloneValueEditor);
				});

				editor[0].innerHTML = cloneValueEditor;
				setValueEditor(valueEditor);
			}

			// if (valueEditor.includes('<div ques-id')) {
			// 	editor[0].innerHTML = valueEditor.replace('<div ques-id', '<input ques-id');
			// }
		}
	}, [visible]);

	useEffect(() => {
		let elementNote = document.querySelectorAll('#editor-element .note-editable .text-normal-of-translate');

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
							autoFocus
							allowClear
							id="input-translate"
							className="style-input"
							value={textTranslate}
							onChange={onChange_GetTranslateText}
							onKeyDown={onKeyDownInput}
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
			<div className="wrap-editor custom" id="editor-element">
				<button className="btn-editor add-translate d-flex align-items-center" onClick={() => showModal('add')}>
					<PlusOutlined className="mr-2" /> Thêm Phiên âm
				</button>
				<button className="btn-editor fix-translate d-flex align-items-center" onClick={() => showModal('fix')}>
					<EditOutlined className="mr-2" /> Sửa phiên âm
				</button>
				<button className="btn-editor d-flex align-items-center" onClick={handleAddSpace}>
					<BorderOutlined className="mr-2" /> Thêm input
				</button>
				<ReactSummernote
					value={valueEditor}
					children={ReactHtmlParser(valueEditor)}
					// onFocus={onFocus}
					options={{
						lang: 'vn',
						height: 220,
						dialogsInBody: true,
						toolbar: [
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
					onKeyDown={onKeyDown}
					onImageUpload={onImageUpload}
				/>
			</div>
		</>
	);
};

export default EditorSummernote;
