import React, { createContext, useContext, useState } from "react";
import { examDetailApi } from "~/apiBase";

type answerDetail = {
  AnswerID: number;
  AnswerContent: string;
  FileAudio: string;
};

type questionDetail = {
  ExerciseID: number;
  SetPackageExerciseAnswerStudentList: Array<answerDetail>;
};

type packageResultDetail = {
  ExamTopicDetailID: number;
  ExerciseGroupID: number;
  Level: number;
  Type: number;
  SkillID: number;
  SetPackageExerciseStudentInfoList: Array<questionDetail>;
};

type packageResult = {
  StudentID: number;
  SetPackageDetailID: number;
  SetPackageResultDetailInfoList: Array<packageResultDetail>;
};

export type IProps = {
  getListQuestionID: Function;
  getActiveID: Function;
  getPackageResult: Function;
  packageResult: packageResult;
  activeID: number;
  listQuestionID: Array<Number>;
};

const DoingTestContext = createContext<IProps>({
  getListQuestionID: () => {},
  getActiveID: () => {},
  getPackageResult: () => {},
  listQuestionID: [],
  activeID: null,
  packageResult: null,
});

export const DoingTestProvider = ({ children }) => {
  const [listQuestionID, setListQuestionID] = useState([]);
  const [activeID, setActiveID] = useState(null);
  const [packageResult, setPackageResult] = useState<packageResult>({
    StudentID: null,
    SetPackageDetailID: null,
    SetPackageResultDetailInfoList: [],
  });

  console.log("Package Result: ", packageResult);

  // --- GET LIST QUESTION ID ---
  const getListQuestionID = (listQuestionID: Array<Number>) => {
    setListQuestionID(listQuestionID);
  };

  // --- GET ACTIVE ID ---
  const getActiveID = (activeID: number) => {
    setActiveID(activeID);
  };

  // --- GET PACKAGE RESULT ---
  const getPackageResult = (data: packageResult) => {
    setPackageResult(data);
  };

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
        }}
      >
        {children}
      </DoingTestContext.Provider>
    </>
  );
};

export const useDoingTest = () => useContext(DoingTestContext);
