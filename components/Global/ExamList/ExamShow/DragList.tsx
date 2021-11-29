import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDoingTest } from '~/context/useDoingTest';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { useDoneTest } from '~/context/useDoneTest';
import { ExclamationCircleOutlined } from '@ant-design/icons';

let activeDrag = null;

const DragList = (props) => {
	const { activeID, getActiveID, packageResult, getPackageResult, getListPicked, removeListPicked } = useDoingTest();
	const { dataQuestion, listQuestionID, isDoingTest } = props;
	const { doneTestData } = useDoneTest();
	const [dataQuestionClone, setDataQuestionClone] = useState(dataQuestion);
	const [dataAnswer, setDataAnswer] = useState([]);
	const [listCorrectAnswer, setListCorrectAnswer] = useState([]);
	// console.log("Data question in drag: ", dataQuestion);
	// console.log('Data Answer is: ', dataAnswer);
	// console.log("DATA QUESTION IN DRAG: ", dataQuestionClone);
	const [isDrop, setIsDrop] = useState(false);

	if (isDoingTest) {
		var indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex((item) => item.ExamTopicDetailID === dataQuestion.ID);
	}

	useEffect(() => {
		if (dataQuestion.Paragraph !== '') {
			let spaceEditor = document.querySelectorAll('.drag-list .space-editor');

			if (spaceEditor && spaceEditor.length > 0) {
				spaceEditor.forEach((item, index) => {
					let quesID = parseInt(item.getAttribute('ques-id'));

					// Sắp xếp lại thứ tự các ô input trong đoạn văn
					let indexQues = null;
					if (listQuestionID.includes(quesID)) {
						indexQues = listQuestionID.indexOf(quesID);
					}

					if (indexQues !== null) {
						let positionSpace = document.querySelectorAll('.drag-list .position-space');

						if (positionSpace.length < spaceEditor.length) {
							let span = document.createElement('span');
							span.classList.add('position-space');
							span.id = quesID.toString();
							if (quesID === activeID) {
								span.classList.add('active');
							}
							span.append(`(${indexQues + 1})`);

							item.innerHTML = `${(indexQues + 1).toString()}`;
							item.before(span);
						} else {
							if (item.innerHTML == '') {
								item.innerHTML = `${(indexQues + 1).toString()}`;
							}
						}
					}
				});
			}
		}
	}, [listQuestionID, dataAnswer]);

	// ---- ALL ACTION IN DOING TEST ----

	// On Drop
	const drop = (ev) => {
		ev.preventDefault();
		var data = ev.dataTransfer.getData('text');
		data && ev.target.appendChild(document.getElementById(data));

		let nodeList = [...ev.target.childNodes];

		nodeList.forEach((item) => {
			dataAnswer.every((element) => {
				if (element.ansID === parseInt(item.id)) {
					// Xử lí mảng dataAnswer
					element.ansID = null;
					element.html = null;
					element.text = null;
					setDataAnswer([...dataAnswer]);

					// Xử lí package
					let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
						indexQuestion
					].SetPackageExerciseStudentInfoList.findIndex((e) => e.ExerciseID === element.quesID);
					packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
						indexQuestionDetail
					].SetPackageExerciseAnswerStudentList = [];

					getPackageResult({ ...packageResult });
					return false;
				}
				return true;
			});
		});
	};

	// Allow Drop
	const allowDrop = (ev) => {
		ev.preventDefault();
		const input = ev.target as HTMLElement;
	};

	// On Drag
	const drag = (ev) => {
		ev.dataTransfer.setData('text', ev.target.id);
	};

	// -- ACTION DROP AND DRAG
	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest) {
				let el = document.querySelectorAll('.doingtest-group .drag-list .space-editor');

				el.forEach((item) => {
					const quesID = parseInt(item.getAttribute('ques-id'));

					dataAnswer.push({
						quesID: quesID,
						ansID: null,
						html: null,
						text: null
					});

					item.addEventListener('dragleave', (event) => {
						item.classList.remove('space-left');
						item.classList.remove('is-hover');
					});

					// ==================== DRAGOVER  ==============
					item.addEventListener('dragover', (event) => {
						const input = event.target as HTMLElement;
						event.preventDefault();

						input.classList.add('is-hover');

						// -- Đầy thành phần drop qua 1 bên khi có hành động drop khác
						if (item.childNodes.length > 0) {
							if (item.childNodes[0].nodeName === 'DIV') {
								item.classList.add('space-left');
							}
						}
					});

					// ======================= DROP=========================
					item.addEventListener(
						'drop',
						(
							ev: CustomEvent & {
								dataTransfer?: DataTransfer;
							} = new CustomEvent(null, { bubbles: true, cancelable: true })
						) => {
							// -- Thêm class auto và xóa khoảng cách sau khi đã drop xong
							item.classList.add('auto');
							item.classList.remove('space-left');
							item.classList.remove('is-hover');

							// Active input
							getActiveID(parseInt(item.getAttribute('ques-id')));

							// Đổi trạng thái để useeffect chứa active không chạy lại nữa
							setIsDrop(true);

							getListPicked(parseInt(item.getAttribute('ques-id')));

							const actionDragAndDrop = () => {
								// -- Khởi tạo và xóa bên trong trước khi drop
								const input = ev.target as HTMLElement;
								input.innerHTML = '';

								ev.preventDefault();
								var data = ev.dataTransfer.getData('text');

								input.appendChild(document.getElementById(data));

								// Kiểm tra sau khi drop thành công thì add vào mảng

								if (input.childNodes[0].nodeName === 'DIV') {
									let indexQues = dataAnswer.findIndex((item) => item.quesID === quesID);

									// -- Chặn drop thành phần bên trong
									input.childNodes[0].addEventListener('drop', (e) => {
										e.preventDefault(), e.stopPropagation();
									});

									input.childNodes[0].addEventListener(
										'dragstart',
										(
											e: CustomEvent & {
												dataTransfer?: DataTransfer;
											} = new CustomEvent(null, {
												bubbles: true,
												cancelable: true
											})
										) => {
											const inputChild = e.target as HTMLElement;
											activeDrag = inputChild.id;
										}
									);

									// -- Kiểm tra phần tử drop xuất phát từ vùng nào
									if (dataAnswer.some((e) => e['ansID'] === parseInt(input.children[0].id))) {
										let iQuestion = dataAnswer.findIndex((e) => e.quesID === quesID);

										dataAnswer.every((element) => {
											if (element.ansID === parseInt(input.children[0].id)) {
												element.html = dataAnswer[iQuestion].html;
												element.ansID = dataAnswer[iQuestion].ansID;
												element.text = dataAnswer[iQuestion].text;

												return false;
											}
											return true;
										});
									} else {
										// -- Thay thế cái mới và trả về vùng chứa câu trả lời

										if (dataAnswer[indexQues].html && dataAnswer[indexQues].ansID) {
											let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes;

											let node = getNodes(dataAnswer[indexQues].html);

											document.getElementById('area-drop').appendChild(node[0]);
										}
									}

									// -- Add phần tử mới vào mảng
									dataAnswer[indexQues].ansID = parseInt(input.children[0].id);
									dataAnswer[indexQues].html = input.innerHTML;
									dataAnswer[indexQues].text = input.children[0].children[0].innerHTML;
									setDataAnswer([...dataAnswer]);
								}
							};

							if (item.children.length == 0) {
								actionDragAndDrop();
							} else {
								if (item.children[0].nodeName === 'TEXT') {
									actionDragAndDrop();
								} else {
									if (item.children[0].id !== activeDrag) {
										actionDragAndDrop();
									}
								}
							}
						}
					);
				});

				setDataAnswer([...dataAnswer]);
			}
		}
	}, []);

	console.log('DATA ANSWER: ', dataAnswer);

	// -- UPDATE AFTER DROP AND DRAG
	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest) {
				if (dataAnswer?.length > 0) {
					let spaceEditor = document.querySelectorAll('.drag-list .space-editor');

					let boxAns = document.querySelectorAll('.drag-list .drag-list-answer');

					spaceEditor.forEach((item) => {
						const quesID = parseInt(item.getAttribute('ques-id'));

						let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
							indexQuestion
						].SetPackageExerciseStudentInfoList.findIndex((e) => e.ExerciseID === quesID);

						// --- Kiểm tra nếu có thành phần drop thì thêm class auto và ngược lại
						if (item.childNodes.length > 0) {
							if (item.childNodes[0].nodeName === 'DIV') {
								item.classList.add('auto');
							} else {
								item.classList.remove('auto');
							}
						} else {
							item.classList.remove('auto');
						}

						// --- Sắp xếp lại  vị trí ---
						let indexQues = null;
						if (listQuestionID.includes(quesID)) {
							indexQues = listQuestionID.indexOf(quesID);
						}
						// --- --------------- ---

						let indexFind = dataAnswer.findIndex((item) => item.quesID === quesID);

						if (dataAnswer[indexFind].ansID == null) {
							if (
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList.length < 1
							) {
								item.innerHTML = `(${(indexQues + 1).toString()})`;
							}
						} else {
							if (item.childNodes.length == 0) {
								let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes;
								let node = getNodes(dataAnswer[indexFind].html);
								item.appendChild(node[0]);
								item.classList.add('auto');
							}
						}

						const checkAndReplace = () => {
							dataAnswer.forEach((ans, index) => {
								if (quesID === ans.quesID) {
									if (ans.ansID !== null) {
										// -- TRẢ VỀ KQ CŨ
										let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes;
										let node = getNodes(
											`<div class="drag-list-answer" draggable="true" id="${ans.ansID}"><span>${ans.text}</span></div>`
										);
										item.innerHTML = '';
										item.appendChild(node[0]);
										item.classList.add('auto');
									}
								}
							});
						};

						if (item.children.length == 0) {
							checkAndReplace();
						} else {
							if (item.children[0].nodeName !== 'DIV') {
								checkAndReplace();
							}
						}
					});

					boxAns.forEach((item) => {
						item.addEventListener(
							'dragstart',
							(
								ev: CustomEvent & {
									dataTransfer?: DataTransfer;
								} = new CustomEvent(null, { bubbles: true, cancelable: true })
							) => {
								ev.dataTransfer.setData('text', item.id);
							}
						);

						// -- Chặn drop thành phần bên trong
						item.addEventListener('drop', (e) => {
							e.preventDefault(), e.stopPropagation();
						});
					});

					// -- ADD VÀO MẢNG --
					// Find index

					dataAnswer.forEach((item) => {
						if (item.ansID) {
							let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
								indexQuestion
							].SetPackageExerciseStudentInfoList.findIndex((e) => e.ExerciseID === item.quesID);

							// Add new answer to list - Kiểm tra xem mảng có data chưa, nếu chưa thì thêm mới, ngược lại thì cập nhật object
							// Đối với loại Điền từ thì mảng chỉ có 1 object đáp án
							if (
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList.length == 0
							) {
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList.push({
									AnswerID: item.ansID,
									AnswerContent: item.text,
									FileAudio: ''
								});
							} else {
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList[0].AnswerContent = item.text;
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList[0].AnswerID = item.ansID;
							}
							getPackageResult({ ...packageResult });
						}
					});
				}
			}
		}
	}, [dataAnswer]);

	// Hiện lại những câu đã trả lời sau khi quay lai
	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest && !isDrop) {
				let newDataQuestion: any = { ...dataQuestion };

				// console.log("New DATA: ", newDataQuestion);
				if (dataQuestion.Paragraph !== '') {
					let spaceEditor = document.querySelectorAll('.drag-list .space-editor');
					let dragAns = document.querySelectorAll('.drag-list .area-drop .drag-list-answer');

					// -- Kiểm tra các ô drop
					spaceEditor.forEach((item, index) => {
						let quesID = parseInt(item.getAttribute('ques-id'));

						const checkAllElement = () => {
							let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
								indexQuestion
							].SetPackageExerciseStudentInfoList.findIndex((item) => item.ExerciseID === quesID);

							let indexDataAnswer = dataAnswer.findIndex((item) => item.quesID === quesID);

							if (
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList.length > 0
							) {
								let AnsIDPackage = null;
								let AnsContentPackage = null;

								if (dataAnswer[indexDataAnswer].ansID) {
									AnsIDPackage = dataAnswer[indexDataAnswer].ansID;
									AnsContentPackage = dataAnswer[indexDataAnswer].text;
								} else {
									AnsIDPackage =
										packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
											indexQuestionDetail
										].SetPackageExerciseAnswerStudentList[0].AnswerID;
									AnsContentPackage =
										packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
											indexQuestionDetail
										].SetPackageExerciseAnswerStudentList[0].AnswerContent;
								}

								// -- TRẢ VỀ KQ CŨ
								let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes;
								let node = getNodes(
									`<div class="drag-list-answer" draggable="true" id="${AnsIDPackage}"><span>${AnsContentPackage}</span></div>`
								);
								item.innerHTML = '';
								item.appendChild(node[0]);

								// -- Cập nhật Data Answer
								dataAnswer.every((element) => {
									if (element.quesID === quesID) {
										element.ansID = AnsIDPackage;
										element.text = AnsContentPackage;
										element.html = `<div class="drag-list-answer" draggable="true" id="${AnsIDPackage}"><span>${AnsContentPackage}</span></div>`;
										return false;
									}
									return true;
								});
								setDataAnswer([...dataAnswer]);

								// -- XÓA TRONG AREA-DROP
								dragAns.forEach((element) => {
									if (parseInt(element.id) === AnsIDPackage) {
										element.remove();
									}
								});
							}
							// -- Reset data
							setDataQuestionClone({ ...dataQuestionClone });
						};

						if (item.children.length == 0) {
							checkAllElement();
						} else {
							if (item.children[0].nodeName !== 'DIV') {
								checkAllElement();
							}
						}
					});
				}
			}
		} else {
			if (dataQuestion.Paragraph !== '') {
				let spaceEditor = document.querySelectorAll('.drag-list .space-editor');

				spaceEditor.forEach((item) => {
					item.setAttribute('contenteditable', 'false');
					let quesID = parseInt(item.getAttribute('ques-id'));
					dataQuestion.ExerciseTopic.every((ques) => {
						if (ques.ExerciseID === quesID) {
							// Check this answer is right or wrong
							if (ques.isTrue) {
								item.classList.add('right-answer');
							} else {
								item.classList.add('wrong-answer');
							}

							// Find answer content of user
							if (ques.ExerciseAnswer.length > 0) {
								let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes;

								if (ques.ExerciseAnswer[0].AnswerContent && ques.ExerciseAnswer[0].AnswerContent !== '') {
									item.classList.add('auto');
									item.innerHTML = '';

									let nodeYourAns = getNodes(
										`<div class="drag-list-answer" id="${ques.ExerciseAnswer[0].AnswerID}"><span>${ques.ExerciseAnswer[0].AnswerContent}</span></div>`
									);

									item.appendChild(nodeYourAns[0]);
								}
								// Tạo đáp án đúng để hover
								let nodeCorrectAns = getNodes(
									`<div class="tooltip-answer" id="${quesID}">${ques.ExerciseAnswer[0].ExerciseAnswerContent}</div>`
								);
								item.appendChild(nodeCorrectAns[0]);

								listCorrectAnswer.push({
									id: ques.ExerciseAnswer[0].ExerciseAnswerID,
									content: ques.ExerciseAnswer[0].ExerciseAnswerContent
								});

								setListCorrectAnswer([...listCorrectAnswer]);
							}

							return false;
						}
						return true;
					});
				});
			}
		}

		if (doneTestData || isDoingTest) {
			// -- Sắp xếp lại vị trí
			let positionSpace = document.querySelectorAll('.position-space');
			positionSpace.forEach((item) => {
				item.classList.remove('active');
				if (parseInt(item.id) === activeID) {
					item.classList.add('active');
				}
			});
		}
	}, [activeID]);

	useEffect(() => {
		if (doneTestData) {
			if (listCorrectAnswer.length > 0) {
				let spaceEditor = document.querySelectorAll('.test-wrapper .drag-list .space-editor');
				let tooltipAns = document.querySelectorAll('.test-wrapper .drag-list .tooltip-answer');

				spaceEditor.forEach((item) => {
					// Mouse over
					item.addEventListener('mouseover', () => {
						let quesID = item.getAttribute('ques-id');
						tooltipAns.forEach((e) => {
							if (e.id === quesID) {
								e.classList.remove('d-none');
								e.classList.add('d-block');
							}
						});
					});

					// Mouse out
					item.addEventListener('mouseout', () => {
						let quesID = item.getAttribute('ques-id');
						tooltipAns.forEach((e) => {
							if (e.id === quesID) {
								e.classList.remove('d-block');
								e.classList.add('d-none');
							}
						});
					});
				});
			}
		}
	}, [listCorrectAnswer]);

	const returnPosition = (quesID) => {
		let text = '';
		let indexQuestion = listQuestionID.findIndex((id) => id === quesID);
		text = (indexQuestion + 1).toString() + '/';

		return text;
	};

	return (
		<div className="drag-list h-100">
			<h6 className="font-italic mb-3 mt-4">Kéo đáp án vào ô thích hợp</h6>

			{ReactHtmlParser(dataQuestion.Paragraph)}

			{doneTestData ? (
				<>
					<div className="wrap-list-answer-typing mt-4">
						<h6 className="mb-2">
							<ExclamationCircleOutlined /> Đáp án
						</h6>
						<ul className="list-answer-typing w-100  pl-0">
							{dataQuestion?.ExerciseTopic.map(
								(item) =>
									item.ExerciseAnswer.length > 0 && (
										<li className="answer-item">
											<span className="number">{returnPosition(item.ExerciseID)}</span>
											<span className="text">{item.ExerciseAnswer[0].ExerciseAnswerContent}</span>
										</li>
									)
							)}
						</ul>
					</div>
				</>
			) : (
				<div className="area-drop h-100" id="area-drop" onDrop={(e) => drop(e)} onDragOver={(e) => allowDrop(e)}>
					{dataQuestionClone?.ExerciseTopic.map((item, index) =>
						item.ExerciseAnswer.map((ans, indexAns) => (
							<div
								className="drag-list-answer"
								key={indexAns}
								draggable="true"
								onDrop={(e) => (e.preventDefault(), e.stopPropagation())}
								onDragStart={(e) => drag(e)}
								id={ans.ID}
							>
								<span> {ans.AnswerContent}</span>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default DragList;
