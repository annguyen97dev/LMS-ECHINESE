import React, { createContext, useContext, useEffect, useState } from 'react';

type SetPackageExerciseAnswerStudent = {
	ID: number;
	ExerciseAnswerID: number;
	ExerciseAnswerContent: string;
	isTrue: boolean;
	AnswerID: number;
	AnswerContent: string;
	isResult: boolean;
	FileAudio: string;
	AnswerComment: Array<any>;
};

type SetPackageExerciseStudent = {
	ID: number;
	ExerciseID: number;
	Point: number;
	isDone: boolean;
	Content: string;
	inputID: number;
	LinkAudio: string;
	DescribeAnswer: string;
	isTrue: boolean;
	Level: number;
	LevelName: string;
	Type: number;
	TypeName: string;
	SkillID: number;
	SkillName: string;
	SetPackageExerciseAnswerStudent: Array<SetPackageExerciseAnswerStudent>;
};

type dataMarking = {
	SetPackageResultID: number;
	Note: string;
	setPackageExerciseStudentsList: Array<{
		ID: number;
		Point: number;
	}>;
};

type doneTestData = {
	ID: 7;
	SetPackageResultID: number;
	ExamTopicDetailID: number;
	ExerciseGroupID: number;
	Content: string;
	Paragraph: string;
	Introduce: string;
	LinkAudio: string;
	Level: number;
	LevelName: string;
	Type: number;
	TypeName: string;
	SkillID: number;
	SkillName: string;
	ExerciseType: number;
	ExerciseTypeName: string;
	Index: number;
	SetPackageExerciseStudent: Array<SetPackageExerciseStudent>;
};

export type IProps = {
	doneTestData: Array<doneTestData>;
	getDoneTestData: Function;
	dataMarking: any;
	getDataMarking: Function;
};

const DoneTestContext = createContext<IProps>({
	doneTestData: null,
	dataMarking: null,
	getDoneTestData: () => {},
	getDataMarking: () => {}
});

export const DoneTestProvider = ({ children }) => {
	const [doneTestData, setDoneTestData] = useState<doneTestData[]>(null);
	const [dataMarking, setDataMarking] = useState<any>(null);

	const getDoneTestData = (data) => {
		setDoneTestData(data);
	};

	console.log('Data Marking: ', dataMarking);

	const getDataMarking = (data) => {
		setDataMarking({ ...data });
	};

	return (
		<>
			<DoneTestContext.Provider
				value={{
					dataMarking: dataMarking,
					doneTestData: doneTestData,
					getDoneTestData,
					getDataMarking
				}}
			>
				{children}
			</DoneTestContext.Provider>
		</>
	);
};

export const useDoneTest = () => useContext(DoneTestContext);
