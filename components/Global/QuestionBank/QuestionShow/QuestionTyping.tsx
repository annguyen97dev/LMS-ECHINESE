import React, { useEffect, useState } from "react";
import { Skeleton, Modal, Popconfirm } from "antd";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";

import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { exerciseApi, exerciseGroupApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { data } from "~/lib/dashboard/data";

const QuestionTyping = (props: any) => {
  const {
    listQuestion,
    loadingQuestion,
    onFetchData,
    onRemoveData,
    isGroup,
    onEditData,
    listAlphabet,
  } = props;
  const [value, setValue] = React.useState(1);
  const [dataListQuestion, setDataListQuestion] = useState(null);
  const { showNoti } = useWrap();
  const [visible, setVisible] = useState({
    id: null,
    status: false,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingInGroup, setLoadingInGroup] = useState(false);
  const [dataExercise, setDataExercise] = useState([]);
  const [showContent, setShowContent] = useState(false);

  // console.log("List Question: ", listQuestion);

  const onChange = (e) => {
    e.preventDefault();
    // setValue(e.target.value);
  };

  // ON EDIT
  const onEdit = (dataEdit) => {
    if (!isGroup.status) {
      onEditData(dataEdit);
    } else {
      let index = dataListQuestion.findIndex((item) => item.ID == dataEdit.ID);
      dataListQuestion.splice(index, 1, dataEdit);

      setDataListQuestion([...dataListQuestion]);
    }
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

  // Chấp nhận xóa câu hỏi
  const handleOk = async (quesItem) => {
    setConfirmLoading(true);
    quesItem.Enable = false;
    try {
      let res = await exerciseApi.update(quesItem);
      if (res.status == 200) {
        setVisible({
          ...visible,
          status: false,
        });
        onRemoveData(quesItem);
        showNoti("success", "Xóa thành công");
      }
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = (quesID) => {
    setVisible({
      id: quesID,
      status: false,
    });
  };

  const getQuestionInGroup = async () => {
    setLoadingInGroup(true);

    try {
      let res = await exerciseGroupApi.getWithID(isGroup.id);
      if (res.status == 200) {
        setDataListQuestion(res.data.data);
        let filterExerciseList = res.data.data.ExerciseList.filter(
          (item) => item.Enable !== false
        );
        setDataExercise([...filterExerciseList]);
        checkShowContent(res.data.data);
      }

      res.status == 204 && setDataListQuestion([]);
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setLoadingInGroup(false);
    }
  };

  //RETURN INDEX QUESTION - Trả về thứ tự của từng câu hỏi
  const returnIndexQuestion = (itemQues) => {
    let title = "";
    let index = dataExercise.findIndex((ex) => ex.inputID == itemQues.inputID);
    title = `Câu (${index + 1})`;
    return title;
  };

  console.log("Data list question: ", listQuestion);
  console.log("Show content: ", showContent);

  const checkShowContent = (data) => {
    let preventLoop = false;
    data.ExerciseList.length == 0 && setShowContent(false);
    data.ExerciseList.forEach((item, index) => {
      if (item.Enable) {
        if (!preventLoop) {
          setShowContent(true);
          preventLoop = true;
        }
      }
    });

    if (!preventLoop) {
      setShowContent(false);
    }
  };

  useEffect(() => {
    if (listQuestion) {
      checkShowContent(listQuestion);
      let filterExerciseList = listQuestion?.ExerciseList.filter(
        (item) => item.Enable !== false
      );
      setDataListQuestion(listQuestion);
      setDataExercise([...filterExerciseList]);
    }
  }, [listQuestion]);

  useEffect(() => {
    isGroup.status && setDataListQuestion([]);
    isGroup.status && isGroup.id && getQuestionInGroup();
  }, [isGroup]);

  return (
    <>
      <div className="detail-question-typing">
        {showContent && dataListQuestion?.ExerciseList?.length > 0 && (
          <>
            <div className="paragraph mb-3">
              {ReactHtmlParser(dataListQuestion?.Paragraph)}
            </div>
            <div className="box-action">
              <CreateQuestionForm
                isGroup={{ status: false, id: dataListQuestion?.ID }}
                questionData={dataListQuestion}
                onFetchData={onFetchData}
                onEditData={(data) => onEditData(data)}
              />

              {/* <Popconfirm
            title="Bạn có chắc muốn xóa?"
            visible={dataListQuestion.ID == visible.id && visible.status}
            onConfirm={() => handleOk(dataListQuestion)}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={() => handleCancel(dataListQuestion.ID)}
          >
            <button
              className="btn btn-icon delete"
              onClick={() => deleteQuestionItem(dataListQuestion.ID)}
            >
              <Trash2 />
            </button>
          </Popconfirm> */}
            </div>
          </>
        )}
      </div>

      {showContent && dataListQuestion?.ExerciseList?.length > 0 && (
        <table className="table-question mt-3">
          <thead>
            <tr>
              <th>Câu hỏi</th>
              <th>Đáp án</th>
            </tr>
          </thead>
          <tbody>
            {dataListQuestion?.ExerciseList?.map(
              (item, index) =>
                item.Enable && (
                  <tr key={index}>
                    <td>
                      {returnIndexQuestion(item)}
                      {/* {`Câu (${index + 1})`} */}
                    </td>
                    <td>
                      {item.ExerciseAnswer?.map(
                        (ans, i) =>
                          ans.Enable && (
                            <div key={i}>
                              <span className="tick">- </span>
                              <span className="text">{ans.AnswerContent}</span>
                            </div>
                          )
                      )}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}

      {/* {dataListQuestion?.ExerciseList?.map((item, index) => (
        <div className="question-item" key={index}>
          <div className="box-detail">
            <div className="box-title">
              <span className="title-ques">Câu hỏi {index + 1}</span>
            </div>
            <div className="box-answer">
              <div className="question-single question-wrap w-100">
                {item.ExerciseAnswer?.map((ans, i) => (
                  <div>
                    <span className="tick">- </span>
                    <span className="text">{ans.AnswerContent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))} */}

      {isGroup?.status && loadingInGroup ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        !showContent && (
          <p style={{ color: "#dd4667" }}>
            <i>Nhóm này chưa có câu hỏi</i>
          </p>
        )
      )}
      {loadingQuestion && (
        <div>
          <Skeleton />
        </div>
      )}
    </>
  );
};

export default QuestionTyping;
