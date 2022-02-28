import React, { useState } from 'react';
import AddQuestionModal from '~/components/Global/ExamDetail/AddQuestionModal';
import ChoiceList from '~/components/Global/ExamList/ExamShow/ChoiceList';
import MultipleList from '~/components/Global/ExamList/ExamShow/MultipleList';
import WrapList from '~/components/Global/ExamList/ExamShow/WrapList';
import MapList from '~/components/Global/ExamList/ExamShow/MapList';
import DragList from '~/components/Global/ExamList/ExamShow/DragList';
import TypingList from '~/components/Global/ExamList/ExamShow/TypingList';
import WrittingList from '~/components/Global/ExamList/ExamShow/WrittingList';
import { useDoingTest } from '~/context/useDoingTest';
import { ListAlphabet } from '~/lib/list-alphabet/ListAlphabet';
import SpeakingList from '../ExamList/ExamShow/Speaking';
import { useDoneTest } from '~/context/useDoneTest';

const ListQuestion = (props) => {
	const { dataQuestion, listQuestionID, isMarked, showScore, setChild, openPagi } = props;
	const { doneTestData } = useDoneTest();

	// RETURN QUESTION TYPE
	const returnQuestionType = (dataQuestion) => {
		const type = dataQuestion.Type;
		switch (type) {
			case 1:
				return (
					<ChoiceList
						showScore={showScore}
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				);
				break;
			case 2:
				return (
					<DragList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
						setChild={setChild}
						openPagi={openPagi}
					/>
				);
				break;
			case 3:
				return (
					<TypingList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				);
				break;
			case 4:
				return (
					<MultipleList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				);
				break;
			case 5:
				return (
					<MapList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				);
				break;
			case 6:
				return (
					<WrittingList
						hideScore={!showScore}
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
						isMarked={isMarked}
					/>
				);
				break;
			case 7:
				return (
					<SpeakingList
						hideScore={!showScore}
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
						isMarked={isMarked}
					/>
				);
				break;
			default:
				return;
				break;
		}
	};

	return (
		<div className="question-create">
			<div className="card-detail-exam card-detail-question" style={{ height: '100%' }}>
				<div className="question-list" style={{ height: '100%' }}>
					{returnQuestionType(dataQuestion)}
				</div>
			</div>
		</div>
	);
};

export default ListQuestion;
