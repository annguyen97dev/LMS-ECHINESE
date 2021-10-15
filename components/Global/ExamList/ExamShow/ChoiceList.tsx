import React, { useEffect, useState } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Radio, Tooltip, Popconfirm, Modal, Input, Spin, Space } from "antd";
import { Trash2, Edit } from "react-feather";
import { examDetailApi } from "~/apiBase";
import { useExamDetail } from "~/pages/question-bank/exam-list/exam-detail/[slug]";
import { useWrap } from "~/context/wrap";
import EditPoint from "../ExamForm/EditPoint";
import ChangePosition from "../ExamForm/ChangePosition";
import { useDoingTest } from "~/context/useDoingTest";

let dataAnswer = {
  ExamTopicDetailID: null,
  ExerciseGroupID: null,
  Level: null,
  Type: null,
  SkillID: null,
  SetPackageExerciseStudentInfoList: [
    {
      ExerciseID: null,
      //Dạng tự luận thì chỉ cần nhập AnswerContent hoặc FileAudio
      SetPackageExerciseAnswerStudentList: [
        {
          AnswerID: null,
          AnswerContent: "",
          FileAudio: "",
        },
      ],
    },
  ],
};

const ChoiceList = (props) => {
  const { onDeleteQuestion } = useExamDetail();
  const { activeID, packageResult, getPackageResult } = useDoingTest();
  const { showNoti } = useWrap();
  const { dataQuestion, listAlphabet, listQuestionID, isDoingTest } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState({
    id: null,
    status: false,
  });
  const [dataAnswer, setDataAnswer] = useState(null);
  const [activeValue, setAcitveValue] = useState(null);

  const returnPosition = (quesID) => {
    let index = listQuestionID.indexOf(quesID);
    let text = "Câu " + (index + 1).toString();
    return text;
  };

  // console.log("Data Question in choice: ", dataQuestion);

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

  // Delete Question in exam
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

  // ----------- ALL ACTION IN DOINGTEST -------------

  const onChange_selectAnswer = (dataAns, quesID) => {
    setAcitveValue(dataAns.ID);

    // Find index
    let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
      (item) => item.ExamTopicDetailID === dataQuestion.ID
    );

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

  useEffect(() => {
    if (isDoingTest) {
      if (packageResult) {
        let indexQuestion =
          packageResult.SetPackageResultDetailInfoList.findIndex(
            (item) => item.ExamTopicDetailID === dataQuestion.ID
          );

        if (
          packageResult.SetPackageResultDetailInfoList[indexQuestion]
            .SetPackageExerciseStudentInfoList[0]
            .SetPackageExerciseAnswerStudentList.length > 0
        ) {
          let AnswerID =
            packageResult.SetPackageResultDetailInfoList[indexQuestion]
              .SetPackageExerciseStudentInfoList[0]
              .SetPackageExerciseAnswerStudentList[0].AnswerID;
          setAcitveValue(AnswerID);
        }
      }
    }
  }, [packageResult]);

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
              {ques.LinkAudio !== "" && (
                <audio controls>
                  <source src={ques.LinkAudio} type="audio/mpeg" />
                </audio>
              )}
              {/* {returnAudio(item)} */}
              <div className="title-text">{ReactHtmlParser(ques.Content)}</div>
            </div>
            <div className="box-answer">
              <div className="question-single question-wrap w-100">
                {ques.ExerciseAnswer?.map((ans, i) => (
                  <Radio.Group
                    key={i}
                    className="d-block"
                    value={activeValue}
                    onChange={(e) =>
                      onChange_selectAnswer(ans, ques.ExerciseID)
                    }
                  >
                    <Space direction="vertical">
                      <Radio
                        className="d-block"
                        key={i}
                        value={ans.ID}
                        disabled={!isDoingTest ? true : false}
                      >
                        <span className="tick">{listAlphabet[i]}</span>
                        <span className="text">{ans.AnswerContent}</span>
                      </Radio>
                    </Space>
                  </Radio.Group>
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

export default ChoiceList;
