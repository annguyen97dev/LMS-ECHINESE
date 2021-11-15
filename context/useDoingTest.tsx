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

	console.log('Package Result: ', packageResult);

	// --- GET LIST QUESTION ID ---
	const getListQuestionID = (listQuestionID: Array<Number>) => {
		setListQuestionID(listQuestionID);
	};

	// --- GET LIST PICKED ---
	const getListPicked = (pickedID) => {
		if (!listPicked.includes(pickedID)) {
			listPicked.push(pickedID);
			setListPicked([...listPicked]);
		}
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
					getListPicked
				}}
			>
				{children}
			</DoingTestContext.Provider>
		</>
	);
};

export const useDoingTest = () => useContext(DoingTestContext);
