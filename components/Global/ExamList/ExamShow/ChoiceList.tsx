import React, { useEffect, useState } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Radio, Tooltip, Popconfirm, Modal, Input, Spin } from "antd";
import { Trash2, Edit } from "react-feather";
import { examDetailApi } from "~/apiBase";
import { useExamDetail } from "~/pages/question-bank/exam-list/exam-detail/[slug]";
import { useWrap } from "~/context/wrap";
import EditPoint from "../ExamForm/EditPoint";
import ChangePosition from "../ExamForm/ChangePosition";

const ChoiceList = (props) => {
  const { onDeleteQuestion } = useExamDetail();
  const { showNoti } = useWrap();
  const { dataQuestion, listAlphabet, listQuestionID, isDoingTest } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState({
    id: null,
    status: false,
  });

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

  return (
    <>
      {dataQuestion.ExerciseTopic.map((ques, ind) => (
        <div className={`question-item`} key={ind}>
          <div className="box-detail">
            <div className="box-title">
              <span className="title-ques">
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
                  <Radio
                    className="d-block"
                    key={i}
                    value={ans.ID}
                    onChange={(e) => e.preventDefault()}
                    disabled={!isDoingTest ? true : false}
                  >
                    <span className="tick">{listAlphabet[i]}</span>
                    <span className="text">{ans.AnswerContent}</span>
                  </Radio>
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
