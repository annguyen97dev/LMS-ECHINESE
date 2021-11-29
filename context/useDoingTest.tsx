import React, { createContext, useContext, useEffect, useState } from 'react';
import { examDetailApi } from '~/apiBase';
import { useWrap } from './wrap';

// type answerDetail = {
// 	AnswerID: number;
// 	AnswerContent: string;
// 	FileAudio: string;
// };

// type questionDetail = {
// 	ExerciseID: number;
// 	SetPackageExerciseAnswerStudentList: Array<answerDetail>;
// };

// type packageResultDetail = {
// 	ExamTopicDetailID: number;
// 	ExerciseGroupID: number;
// 	Level: number;
// 	Type: number;
// 	SkillID: number;
// 	SetPackageExerciseStudentInfoList: Array<questionDetail>;
// };

export type IProps = {
	getListQuestionID: Function;
	getActiveID: Function;
	getPackageResult: Function;
	getListPicked: Function;
	removeListPicked: Function;
	packageResult: ITestExamination;
	activeID: number;
	listQuestionID: Array<Number>;
	listPicked: Array<Number>;
};

const DoingTestContext = createContext<IProps>({
	getListQuestionID: () => {},
	getActiveID: () => {},
	getPackageResult: () => {},
	getListPicked: () => {},
	removeListPicked: () => {},
	listQuestionID: [],
	listPicked: [],
	activeID: null,
	packageResult: null
});

export const DoingTestProvider = ({ children }) => {
	const [listQuestionID, setListQuestionID] = useState([]);
	const [activeID, setActiveID] = useState(null);
	const [packageResult, setPackageResult] = useState<ITestExamination>({
		StudentID: null,
		SetPackageDetailID: null,
		SetPackageResultDetailInfoList: []
	});
	const [listPicked, setListPicked] = useState([]);
	const { userInformation } = useWrap();

	// --- GET LIST QUESTION ID ---
	const getListQuestionID = (listQuestionID: Array<Number>) => {
		setListQuestionID(listQuestionID);
	};

	// --- GET LIST PICKED ---
	const getListPicked = (pickedID) => {
		let cloneList = [...listPicked];

		if (listPicked.includes(pickedID) === false) {
			listPicked.push(pickedID);
			setListPicked([...listPicked]);
		}
	};

	// --- REMOVE ID IN LIST PICKED ---
	const removeListPicked = (pickedID) => {
		let index = listPicked.findIndex((id) => id === pickedID);
		listPicked.splice(index, 1);
		// console.log('PICKED ID: ', pickedID);
		// let newList = listPicked.filter((id) => id !== pickedID);
		setListPicked([...listPicked]);
	};

	// --- GET ACTIVE ID ---
	const getActiveID = (activeID: number) => {
		setActiveID(activeID);
	};

	// --- GET PACKAGE RESULT ---
	const getPackageResult = (data: ITestExamination) => {
		setPackageResult(data);
	};

	useEffect(() => {
		if (userInformation) {
			if (!packageResult.StudentID) {
				setPackageResult({
					...packageResult,
					StudentID: userInformation.UserInformationID
				});
			}
		}
	}, [userInformation]);

	return (
		<>
			<DoingTestContext.Provider
				value={{
					getListQuestionID,
					listQuestionID: listQuestionID,
					getActiveID,
					activeID: activeID,
					packageResult: packageResult,
					getPackageResult,
					listPicked: listPicked,
					getListPicked,
					removeListPicked
				}}
			>
				{children}
			</DoingTestContext.Provider>
		</>
	);
};

export const useDoingTest = () => useContext(DoingTestContext);
