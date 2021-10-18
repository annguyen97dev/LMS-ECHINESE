import React, { useState, useEffect } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Checkbox, Popconfirm, Tooltip } from "antd";
import { Trash2 } from "react-feather";
import { examDetailApi } from "~/apiBase";
import { useExamDetail } from "~/pages/question-bank/exam-list/exam-detail/[slug]";
import { useWrap } from "~/context/wrap";
import EditPoint from "../ExamForm/EditPoint";
import ChangePosition from "../ExamForm/ChangePosition";
import { useDoingTest } from "~/context/useDoingTest";

const MultipleList = (props) => {
  const { onDeleteQuestion } = useExamDetail();
  const { showNoti } = useWrap();
  const { dataQuestion, listAlphabet, listQuestionID, isDoingTest } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState({
    id: null,
    status: false,
  });
  const { activeID, getActiveID, packageResult, getPackageResult } =
    useDoingTest();

  const returnPosition = (quesID) => {
    let index = listQuestionID.indexOf(quesID);
    let text = "Câu " + (index + 1).toString();
    return text;
  };

  // Chấp nhận xóa câu hỏi
  const handleOk = async (quesItem) => {
    let itemDelete = {
      ID: dataQuestion.ID,
      Enable: false,
      ExerciseOrExerciseGroup: [
        {
          Point: quesItem.Point,
          ExerciseOrExerciseGroupID: quesItem.ExerciseID,
        },
      ],
    };

    setConfirmLoading(true);
    try {
      let res = await examDetailApi.update(itemDelete);
      if (res.status == 200) {
        onDeleteQuestion(itemDelete);
        showNoti("success", "Xóa thành công");
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  // Handle cancel popup delte
  const handleCancel = (quesID) => {
    setVisible({
      id: quesID,
      status: false,
    });
  };

  const deleteQuestionItem = (quesID) => {
    !visible.status
      ? setVisible({
          id: quesID,
          status: true,
        })
      : setVisible({
          id: quesID,
          status: false,
        });
  };

  useEffect(() => {
    if (dataQuestion) {
    }
  }, []);

  // ----------- ALL ACTION IN DOINGTEST -------------

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

  const onChange_selectAnswer = (dataAns, quesID) => {
    getActiveID(quesID);
    // Find index
    let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
      (item) => item.ExamTopicDetailID === dataQuestion.ID
    );

    let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
      indexQuestion
    ].SetPackageExerciseStudentInfoList.findIndex(
      (item) => item.ExerciseID === quesID
    );

    let indexAnswer = packageResult.SetPackageResultDetailInfoList[
      indexQuestion
    ].SetPackageExerciseStudentInfoList[
      indexQuestionDetail
    ].SetPackageExerciseAnswerStudentList.findIndex(
      (item) => item.AnswerID === dataAns.ID
    );

    if (indexAnswer > -1) {
      packageResult.SetPackageResultDetailInfoList[
        indexQuestion
      ].SetPackageExerciseStudentInfoList[
        indexQuestionDetail
      ].SetPackageExerciseAnswerStudentList.splice(indexAnswer, 1);
    } else {
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
    }

    getPackageResult({ ...packageResult });
  };

  return (
    <>
      {dataQuestion.ExerciseTopic.map((ques, ind) => (
        <div
          className={`question-item ${
            ques.ExerciseID === activeID ? "active-doing" : ""
          }`}
          key={ind}
        >
          <div className="box-detail">
            <div className="box-title">
              <span className={`title-ques `}>
                {returnPosition(ques.ExerciseID)}
              </span>
              {/* {returnAudio(item)} */}
              <div className="title-text">{ReactHtmlParser(ques.Content)}</div>
            </div>
            <div className="box-answer">
              <div className="question-single question-wrap w-100">
                {ques.ExerciseAnswer?.map((ans, i) => (
                  <Checkbox
                    className="d-block"
                    key={i}
                    checked={
                      !isDoingTest
                        ? false
                        : returnChecked(ans.ID, ques.ExerciseID)
                    }
                    onChange={(e) =>
                      onChange_selectAnswer(ans, ques.ExerciseID)
                    }
                    disabled={!isDoingTest ? true : false}
                  >
                    <span className="tick">{listAlphabet[i]}</span>
                    <span className="text">{ans.AnswerContent}</span>
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>
          <div className="box-action">
            {!isDoingTest && (
              <>
                <EditPoint quesItem={ques} dataQuestion={dataQuestion} />
                <Popconfirm
                  title="Bạn có chắc muốn xóa?"
                  // visible={item.ID == visible.id && visible.status}
                  onConfirm={() => handleOk(ques)}
                  okButtonProps={{ loading: confirmLoading }}
                  onCancel={() => handleCancel(ques.ID)}
                >
                  <Tooltip title="Xóa câu hỏi" placement="rightTop">
                    <button
                      className="btn btn-icon delete"
                      onClick={() => deleteQuestionItem(ques.ID)}
                    >
                      <Trash2 />
                    </button>
                  </Tooltip>
                </Popconfirm>
                <ChangePosition questionID={dataQuestion.ID} />
              </>
            )}
            <div className="point-question mt-2">
              <p className="text">{ques.Point}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MultipleList;
