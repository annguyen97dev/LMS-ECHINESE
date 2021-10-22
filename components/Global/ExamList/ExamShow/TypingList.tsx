import React, { useEffect, useState } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import index from '~/components/LoginForm';
import { useDoingTest } from '~/context/useDoingTest';
import { useDoneTest } from '~/context/useDoneTest';
import { data } from '~/lib/option/dataOption2';

const TypingList = (props) => {
	const { doneTestData } = useDoneTest();
	const { dataQuestion, listQuestionID, isDoingTest } = props;
	const { activeID, getActiveID, packageResult, getPackageResult, getListPicked } = useDoingTest();
	const [listInput, setListInput] = useState([]);
	const [listCorrectAnswer, setListCorrectAnswer] = useState([]);

	// console.log("List ID Là: ", listQuestionID);
	// console.log("Data question: ", dataQuestion);

	useEffect(() => {
		if (dataQuestion.Paragraph !== '') {
			let spaceEditor = document.querySelectorAll('.box-typing .space-editor');

			if (spaceEditor && spaceEditor.length > 0) {
				spaceEditor.forEach((item, index) => {
					let quesID = parseInt(item.getAttribute('ques-id'));

					// Sắp xếp lại thứ tự các ô input trong đoạn văn
					let indexQues = null;
					if (listQuestionID.includes(quesID)) {
						indexQues = listQuestionID.indexOf(quesID);
					}

					if (indexQues) {
						let positionSpace = document.querySelectorAll('.box-typing .position-space');

						if (positionSpace.length < spaceEditor.length) {
							let span = document.createElement('span');
							span.classList.add('position-space');
							span.id = quesID.toString();
							if (quesID === activeID) {
								span.classList.add('active');
							}
							span.append(`(${indexQues + 1})`);

							item.innerHTML = '';
							item.before(span);
						}
					}
				});
			}
		}
	}, [listQuestionID]);

	// ----------- ALL ACTION IN DOINGTEST -------------

	const returnPosition = (quesID) => {
		let text = '';
		let indexQuestion = listQuestionID.findIndex((id) => id === quesID);
		text = (indexQuestion + 1).toString() + '/';

		return text;
	};

	const handleChangeText = (text, quesID) => {
		getActiveID(quesID);
		getListPicked(quesID);
		// Find index
		let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex((item) => item.ExamTopicDetailID === dataQuestion.ID);

		let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList.findIndex(
			(item) => item.ExerciseID === quesID
		);

		// Add new answer to list - Kiểm tra xem mảng có data chưa, nếu chưa thì thêm mới, ngược lại thì cập nhật object
		// Đối với loại Điền từ thì mảng chỉ có 1 object đáp án
		if (
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
				.SetPackageExerciseAnswerStudentList.length == 0
		) {
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
				indexQuestionDetail
			].SetPackageExerciseAnswerStudentList.push({
				AnswerID: 0,
				AnswerContent: text,
				FileAudio: ''
			});
		} else {
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
				indexQuestionDetail
			].SetPackageExerciseAnswerStudentList[0].AnswerContent = text;
		}

		getPackageResult({ ...packageResult });
	};

	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest) {
				if (dataQuestion.Paragraph !== '') {
					let spaceEditor = document.querySelectorAll('.doingtest-group .box-typing .space-editor');

					if (spaceEditor && spaceEditor.length > 0) {
						spaceEditor.forEach((item, index) => {
							let quesID = parseInt(item.getAttribute('ques-id'));

							// Trường hợp điền từ xong một lát quay lại vẫn còn
							let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
								(item) => item.ExamTopicDetailID === dataQuestion.ID
							);

							let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
								indexQuestion
							].SetPackageExerciseStudentInfoList.findIndex((item) => item.ExerciseID === quesID);

							if (
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList.length > 0
							) {
								item.innerHTML =
									packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
										indexQuestionDetail
									].SetPackageExerciseAnswerStudentList[0].AnswerContent;
							}

							// Tìm và active đúng ô input
							item.classList.remove('active-type-input');
							if (quesID === activeID) {
								item.classList.add('active-type-input');
							}
						});
					}
				}
			}
		} else {
			if (dataQuestion.Paragraph !== '') {
				let spaceEditor = document.querySelectorAll('.doingtest-group .box-typing .space-editor');

				let tooltipAns = document.querySelectorAll('.doingtest-group .tooltip-answer');

				console.log('Tooltip: ', tooltipAns);

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
								if (ques.ExerciseAnswer[0].AnswerContent && ques.ExerciseAnswer[0].AnswerContent !== '') {
									item.innerHTML = ques.ExerciseAnswer[0].AnswerContent;
								} else {
									item.classList.add('center-row');
								}

								// Tạo đáp án đúng để hover
								let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes;
								let node = getNodes(
									`<div class="tooltip-answer" id="${quesID}">${ques.ExerciseAnswer[0].ExerciseAnswerContent}</div>`
								);
								item.appendChild(node[0]);
								listCorrectAnswer.push({
									id: ques.ExerciseAnswer[0].ExerciseAnswerID,
									content: ques.ExerciseAnswer[0].ExerciseAnswerContent
								});
							}

							return false;
						}
						return true;
					});
					setListCorrectAnswer([...listCorrectAnswer]);
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
				let spaceEditor = document.querySelectorAll('.doingtest-group .box-typing .space-editor');
				let tooltipAns = document.querySelectorAll('.doingtest-group .box-typing .tooltip-answer');

				spaceEditor.forEach((item) => {
					// Mouse over
					item.addEventListener('mouseover', (event: MouseEvent) => {
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

	useEffect(() => {
		if (!doneTestData) {
			let el = document.querySelectorAll('.doingtest-group .box-typing .space-editor');

			el.forEach((item) => {
				listInput.push(item.innerHTML);
				let quesID = parseInt(item.getAttribute('ques-id'));

				item.addEventListener('click', (event) => {
					const input = event.target as HTMLElement;
					if (listInput.includes(input.innerHTML)) {
						input.innerHTML = '';
					}
				});

				item.addEventListener('keyup', (event) => {
					const input = event.target as HTMLElement;

					handleChangeText(input.innerText, quesID);

					// Điều kiện đề input co giãn theo text
					let lengthText = input.innerText.length;
					if (lengthText > 14) {
						item.classList.add('auto');
					} else {
						item.classList.remove('auto');
					}
				});
			});

			setListInput([...listInput]);
		}
	}, []);

	return (
		<>
			<div className="box-typing">{ReactHtmlParser(dataQuestion.Paragraph)}</div>
			{doneTestData && (
				<>
					<div className="wrap-list-answer-typing mt-4">
						<h6 className="mb-2">Đáp án</h6>
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
			)}
		</>
	);
};

export default TypingList;
