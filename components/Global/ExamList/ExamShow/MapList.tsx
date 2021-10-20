import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Checkbox } from "antd";
import { useDoingTest } from "~/context/useDoingTest";

const MapList = (props) => {
  const { dataQuestion, listAlphabet, listQuestionID, isDoingTest } = props;
  const {
    activeID,
    getActiveID,
    packageResult,
    getPackageResult,
    getListPicked,
  } = useDoingTest();
  let indexQuestion = null;
  if (isDoingTest) {
    // Find index
    indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
      (item) => item.ExamTopicDetailID === dataQuestion.ID
    );
  }

  const returnPosition = (quesID) => {
    let index = listQuestionID.indexOf(quesID);
    let text = (index + 1).toString() + "/";
    return text;
  };

  // ---- ALL ACTION IN DOING TEST ----
  const onChange_selectAnswer = (dataAns, quesID) => {
    getActiveID(quesID);
    getListPicked(quesID);
    let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
      indexQuestion
    ].SetPackageExerciseStudentInfoList.findIndex(
      (item) => item.ExerciseID === quesID
    );

    // Remove all data in list answer (because this single question)
    packageResult.SetPackageResultDetailInfoList[
      indexQuestion
    ].SetPackageExerciseStudentInfoList[
      indexQuestionDetail
    ].SetPackageExerciseAnswerStudentList = [];

    // Add new answer to list
    packageResult.SetPackageResultDetailInfoList[
      indexQuestion
    ].SetPackageExerciseStudentInfoList[
      indexQuestionDetail
    ].SetPackageExerciseAnswerStudentList.push({
      AnswerID: dataAns.ID,
      AnswerContent: dataAns.AnswerContent,
      FileAudio: "",
    });

    getPackageResult({ ...packageResult });
  };

  const returnChecked = (ansID, quesID) => {
    let checked = false;

    // Find Index
    let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
      (item) => item.ExamTopicDetailID === dataQuestion.ID
    );

    let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
      indexQuestion
    ].SetPackageExerciseStudentInfoList.findIndex(
      (item) => item.ExerciseID === quesID
    );

    // Find anh return checked
    if (
      packageResult.SetPackageResultDetailInfoList[
        indexQuestion
      ].SetPackageExerciseStudentInfoList[
        indexQuestionDetail
      ].SetPackageExerciseAnswerStudentList.some(
        (object) => object["AnswerID"] === ansID
      )
    ) {
      checked = true;
    }

    return checked;
  };

  return (
    <>
      <div className="box-map-question">
        <h6 className="font-italic mb-3 mt-4">Tích chọn đáp án đúng</h6>

        <table className="table-question w-100" style={{ maxWidth: "100%" }}>
          <thead>
            <tr>
              <th>Stt</th>
              <th>Câu hỏi</th>
              {dataQuestion?.ExerciseTopic.map((item, index) =>
                item.ExerciseAnswer.map((ans, ansIndex) => (
                  <th className="text-center" key={ansIndex}>
                    {ans.AnswerContent}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {dataQuestion?.ExerciseTopic.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    width: "5%",
                    fontWeight: 500,
                    color: `${
                      item.ExerciseID === activeID ? "#dd4667" : "inherit"
                    }`,
                  }}
                  className={`${
                    item.ExerciseID === activeID ? "active-doing" : ""
                  }`}
                >
                  {returnPosition(item.ExerciseID)}
                </td>
                <td
                  className={`w-50 ${
                    item.ExerciseID === activeID ? "active-doing" : ""
                  }`}
                >
                  {" "}
                  {ReactHtmlParser(item.Content)}
                </td>
                {dataQuestion?.ExerciseTopic.map((itemQues, indexQues) =>
                  itemQues.ExerciseAnswer.map((ans, ansIndex) => (
                    <td className="text-center check-box-table" key={ansIndex}>
                      {isDoingTest && (
                        <Checkbox
                          onChange={() =>
                            onChange_selectAnswer(ans, item.ExerciseID)
                          }
                          checked={
                            !isDoingTest
                              ? false
                              : returnChecked(ans.ID, item.ExerciseID)
                          }
                          disabled={!isDoingTest ? true : false}
                        ></Checkbox>
                      )}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MapList;
