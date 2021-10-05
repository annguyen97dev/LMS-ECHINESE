import React, { useState } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Radio, Tooltip, Popconfirm } from "antd";
import { Trash2 } from "react-feather";
import { examDetailApi } from "~/apiBase";
import { useExamDetail } from "~/pages/question-bank/exam-list/exam-detail/[slug]";
import { useWrap } from "~/context/wrap";
import EditPoint from "../ExamForm/EditPoint";

const WrittingList = (props) => {
  const { onDeleteQuestion } = useExamDetail();
  const { showNoti } = useWrap();
  const { dataQuestion, listAlphabet, listQuestionID } = props;
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

    console.log("Item delete: ", itemDelete);
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

              <div className="title-text">{ReactHtmlParser(ques.Content)}</div>
            </div>
          </div>
          <div className="box-action">
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
            <div className="point-question mt-2">
              <p className="text">{ques.Point}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WrittingList;
