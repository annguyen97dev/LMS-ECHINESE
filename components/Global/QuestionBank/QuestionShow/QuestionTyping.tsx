import React, { useEffect, useState } from "react";
import { Skeleton, Modal, Popconfirm, Form, Input, Tooltip, Spin } from "antd";
import { Edit, Trash2 } from "react-feather";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { exerciseGroupApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { CloseOutlined } from "@ant-design/icons";
import { Plus } from "react-feather";
import { data } from "~/lib/customer-student/data";

let AnsID = 0;

const EditQuestion = (props) => {
  const { dataGroup, exerciseID, onEdit } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataForm, setDataForm] = useState(dataGroup);
  const [indexExercise, setIndexExercise] = useState(null);
  const [reloadContent, setReloadContent] = useState(false);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let newData = JSON.parse(JSON.stringify(dataForm));
    newData.ExerciseAnswer.forEach((item) => {
      if (item.isAdd) {
        delete item.ID;
      }
    });

    dataGroup.ExerciseList[indexExercise] = newData;

    try {
      let res = await exerciseGroupApi.update(dataGroup);
      if (res.status == 200) {
        setReloadContent(true);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // ====== HANDLE ADD ANSWER ======
  const handleAddAnswer = (questionID: number) => {
    AnsID++;
    dataForm.ExerciseAnswer.push({
      ID: AnsID,
      AnswerContent: "",
      isTrue: true,
      Enable: true,
      isAdd: true,
    });

    setDataForm({ ...dataForm });
  };

  // ====== HANDLE ON CHANGE ======
  const onChange_text = (e: any, AnswerID: number, QuestionID) => {
    let text = e.target.value;
    let indexAnswer = dataForm.ExerciseAnswer.findIndex(
      (item) => item.ID == AnswerID
    );
    dataForm.ExerciseAnswer[indexAnswer].AnswerContent = text;
    setDataForm({ ...dataForm });
  };

  const deleteAnswerItem = (AnswerID: number, QuestionID) => {
    let indexAnswer = dataForm.ExerciseAnswer.findIndex(
      (item) => item.ID == AnswerID
    );
    if (dataForm.ExerciseAnswer[indexAnswer].isAdd) {
      dataForm.ExerciseAnswer.splice(indexAnswer, 1);
    } else {
      dataForm.ExerciseAnswer[indexAnswer].Enable = false;
    }

    setDataForm({ ...dataForm });
  };

  useEffect(() => {
    if (reloadContent) {
      (async function loadData() {
        try {
          let res = await exerciseGroupApi.getWithID(dataGroup.ID);

          if (res.status == 200) {
            showNoti("success", `Thành công`);

            onEdit && onEdit(res.data.data);
          }

          res.status == 204 && showNoti("danger", "Không thành công");
        } catch (error) {
          showNoti("danger", error.message);
        } finally {
          setReloadContent(false);
          setIsModalVisible(false);
          setIsLoading(false);
          setDataForm(null);
        }
      })();
    }
  }, [reloadContent]);

  useEffect(() => {
    if (isModalVisible) {
      // Make new data
      let index = dataGroup.ExerciseList.findIndex(
        (item) => item.ID == exerciseID
      );

      let data = dataGroup.ExerciseList[index];
      setDataForm(data);
      setIndexExercise(index);

      // Find max id in arr
      let newArr = [];
      data.ExerciseAnswer.forEach((item) => {
        newArr.push(parseInt(item.ID));
      });
      AnsID = Math.max(...newArr);
      console.log("Ans ID: ", AnsID);
    }
  }, [isModalVisible]);

  return (
    <>
      <Tooltip title="Thêm/sửa đáp án">
        <button className="btn btn-icon edit" onClick={showModal}>
          <Edit />
        </button>
      </Tooltip>
      <Modal
        footer={
          <div className="text-center">
            <button className="btn btn-light mr-2" onClick={handleCancel}>
              Hủy tác vụ
            </button>
            <button className="btn btn-primary" onClick={() => handleSubmit()}>
              Lưu
              {isLoading && <Spin className="loading-base" />}
            </button>
          </div>
        }
        title="Sửa/thêm đáp án"
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        {dataForm?.ExerciseAnswer?.map(
          (itemAns, index) =>
            itemAns.Enable && (
              <>
                <div
                  className="w-100 d-flex align-items-center mt-2"
                  key={index}
                >
                  <Form.Item className="mb-0" style={{ width: "80%" }}>
                    <Input
                      value={itemAns.AnswerContent}
                      className="style-input"
                      onChange={(e) =>
                        onChange_text(e, itemAns.ID, dataForm.inputID)
                      }
                    ></Input>
                  </Form.Item>
                  <button
                    className="delete-ans"
                    onClick={() =>
                      deleteAnswerItem(itemAns.ID, dataForm.inputID)
                    }
                  >
                    <CloseOutlined />
                  </button>
                </div>
              </>
            )
        )}
        <Tooltip title="Thêm đáp án">
          <button
            className="btn-add-answer mt-2"
            onClick={() => handleAddAnswer(dataForm.inputID)}
          >
            <Plus />
          </button>
        </Tooltip>
      </Modal>
    </>
  );
};

const QuestionTyping = (props: any) => {
  const {
    listQuestion,
    loadingQuestion,
    onFetchData,
    onRemoveData,
    isGroup,
    onEditData,
    listAlphabet,
    groupID,
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

  const onChange = (e) => {
    e.preventDefault();
    // setValue(e.target.value);
  };

  // ON EDIT
  const onEdit = (dataEdit) => {
    onEditData(dataEdit);
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
  const handleOk = async (data) => {
    setConfirmLoading(true);

    let quesItem = JSON.parse(JSON.stringify(dataListQuestion));

    quesItem?.ExerciseList?.forEach((item) => {
      item.Enable = false;
    });
    quesItem.isDeleteExercise = true;
    quesItem.Paragraph = "<p><br></p>";
    quesItem.ExerciseGroupID = null;

    try {
      let res = await exerciseGroupApi.update(quesItem);
      if (res.status == 200) {
        setVisible({
          ...visible,
          status: false,
        });
        onRemoveData(quesItem);
        showNoti("success", "Xóa thành công");
      }
    } catch (error) {
      showNoti("danger", error.message);
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
      showNoti("danger", error.message);
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
    isGroup.status &&
      isGroup.id &&
      isGroup.id === groupID &&
      getQuestionInGroup();
    if (!isGroup) {
      return;
    }
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
              {/* <CreateQuestionForm
                isGroup={{ status: false, id: dataListQuestion?.ID }}
                questionData={dataListQuestion}
                onFetchData={onFetchData}
                onEditData={(data) => onEditData(data)}
              /> */}

              <Popconfirm
                title="Bạn có chắc muốn xóa?"
                onConfirm={() => handleOk(dataListQuestion)}
                okButtonProps={{ loading: confirmLoading }}
                onCancel={() => handleCancel(dataListQuestion.ID)}
              >
                <Tooltip title="Xóa hết câu hỏi" placement="rightTop">
                  <button
                    className="btn btn-icon delete"
                    onClick={() => deleteQuestionItem(dataListQuestion.ID)}
                  >
                    <Trash2 />
                  </button>
                </Tooltip>
              </Popconfirm>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataListQuestion?.ExerciseList?.map(
              (item, index) =>
                item.Enable && (
                  <tr key={index}>
                    <td style={{ width: "20%" }}>
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
                    <td style={{ width: "10%" }}>
                      {
                        <EditQuestion
                          dataGroup={dataListQuestion}
                          exerciseID={item.ID}
                          onEdit={(dataEdit) => onEdit(dataEdit)}
                        />
                      }
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}

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
