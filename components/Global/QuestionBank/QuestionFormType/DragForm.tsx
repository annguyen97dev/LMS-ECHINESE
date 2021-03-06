import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Spin, Checkbox, Input, Tooltip } from "antd";
import Editor from "~/components/Elements/Editor";
import { exerciseGroupApi } from "~/apiBase/";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { Plus } from "react-feather";

let AnsID = 0;
let QuesID = -1;

const DragForm = (props) => {
  console.log("Câu hỏi kéo thả");
  const { isSubmit, questionData, changeIsSubmit, visible } = props;
  const { showNoti } = useWrap();
  const {
    handleSubmit,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const [form] = Form.useForm();
  const [questionDataForm, setQuestionDataForm] = useState(null);
  const [isResetEditor, setIsResetEditor] = useState(false);
  const [linkUpload, setLinkUpload] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [reloadContent, setReloadContent] = useState(false);
  const [dataExercise, setDataExercise] = useState([]);

  console.log("Question Data Form: ", questionDataForm);
  console.log("Data Exercise in form: ", dataExercise);

  // Upload file audio
  const onchange_UploadFile = async (info) => {
    // console.log("Info File upload: ", info);
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
      return;
    }
    setLoadingUpload(true);
    try {
      let res = await exerciseGroupApi.UploadAudio(info.file.originFileObj);
      if (res.status == 200) {
        setLinkUpload(res.data.data);
        showNoti("success", "Upload file thành công");
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any, e) => {
    // console.log("DATA SUBMIT: ", data);
  });

  // GET VALUE IN EDITOR
  const getDataEditor = (dataEditor) => {
    console.log("Value Editor Form: ", dataEditor);
    if (questionDataForm) {
      questionDataForm.Paragraph = dataEditor;
    }
    setQuestionDataForm({ ...questionDataForm });
  };

  // Reset value in form
  const resetForm = () => {
    questionDataForm.Content = "";
    questionDataForm.ExerciseAnswer.forEach((item) => {
      item.AnswerContent = "";
      item.isTrue = false;
    });
    setQuestionDataForm({ ...questionDataForm });
  };

  // HANDLE DELETE ALL QUESTION
  const deleteAllQuestion = () => {
    dataExercise?.splice(0, dataExercise.length);
    questionDataForm?.ExerciseList?.forEach((item) => {
      item.Enable = false;
    });

    setDataExercise([...dataExercise]);
    setQuestionDataForm({ ...questionDataForm });
  };

  // HANDLE DELETE QUESTION
  const deleteSingleQuestion = (QuestionID) => {
    console.log("Question ID cần xóa: ", QuestionID);
    let QuestionIndex = questionDataForm.ExerciseList.findIndex(
      (item) => item.inputID == QuestionID
    );
    let ExerciseIndex = dataExercise.findIndex(
      (item) => item.inputID == QuestionID
    );

    dataExercise.splice(ExerciseIndex, 1);

    if (questionDataForm.ExerciseList[QuestionIndex]) {
      if (questionDataForm.ExerciseList[QuestionIndex].isAdd) {
        questionDataForm.ExerciseList.splice(QuestionIndex, 1);
      } else {
        questionDataForm.ExerciseList[QuestionIndex].Enable = false;
      }
    } else {
      showNoti("danger", "Câu hỏi không tồn tại");
    }

    setDataExercise([...dataExercise]);
    setQuestionDataForm({ ...questionDataForm });
  };

  // HANDLE ADD QUESTION
  const addQuestion = (inputID) => {
    AnsID++;
    let objAns = {
      // ID: inputID,
      inputID: inputID,
      Content: "",
      ExerciseGroupID: questionDataForm.ID,
      SubjectID: questionDataForm.SubjectID,
      SubjectName: questionDataForm.SubjectName,
      DescribeAnswer: "",
      Level: questionDataForm.Level,
      LevelName: questionDataForm.LevelName,
      LinkAudio: null,
      Type: questionDataForm.Type,
      TypeName: questionDataForm.TypeName,
      isAdd: true,
      Enable: true,
      ExerciseAnswer: [
        {
          ID: AnsID,
          AnswerContent: "",
          isTrue: true,
          Enable: true,
          isAdd: true,
        },
      ],
    };
    questionDataForm.ExerciseList.push(objAns);
    dataExercise.push(objAns);

    setDataExercise([...dataExercise]);
    setQuestionDataForm({ ...questionDataForm });
  };

  // ====== HANDLE ADD ANSWER ======
  const handleAddAnswer = (questionID: number) => {
    AnsID++;
    questionDataForm.ExerciseList.every((item) => {
      if (item.inputID == questionID) {
        item.ExerciseAnswer.push({
          ID: AnsID,
          AnswerContent: "",
          isTrue: false,
          Enable: true,
          isAdd: true,
        });
        return false;
      }
      return true;
    });

    setQuestionDataForm({ ...questionDataForm });
  };

  const onChange_isCorrect = (e, AnswerID, QuestionID) => {
    let checked = e.target.checked;

    // - Get question index
    let QuestionIndex = questionDataForm?.ExerciseList?.findIndex(
      (item) => item.inputID == QuestionID
    );

    // - Get answer index
    let AnswerIndex = questionDataForm.ExerciseList[
      QuestionIndex
    ].ExerciseAnswer.findIndex((item) => item.ID == AnswerID);

    // Delete all is true before and new isTrue
    questionDataForm.ExerciseList[QuestionIndex].ExerciseAnswer.forEach(
      (item) => {
        item.isTrue = false;
      }
    );

    // - add isTrue
    questionDataForm.ExerciseList[QuestionIndex].ExerciseAnswer[
      AnswerIndex
    ].isTrue = checked;

    setQuestionDataForm({ ...questionDataForm });
  };

  console.log("QUESTION DATA FORM IN DRAG: ", questionDataForm);

  // ====== ON CHANGE TEXT ======
  const onChange_text = (e: any, AnswerID: number, QuestionID) => {
    console.log("QuestionID: ", QuestionID);
    // - Get value
    let text = e.target.value;

    // - Get question index
    let QuestionIndex = questionDataForm?.ExerciseList?.findIndex(
      (item) => item.inputID == QuestionID
    );

    // - Get answer index
    let AnswerIndex = questionDataForm.ExerciseList[
      QuestionIndex
    ].ExerciseAnswer.findIndex((item) => item.ID == AnswerID);

    // - add text
    questionDataForm.ExerciseList[QuestionIndex].ExerciseAnswer[
      AnswerIndex
    ].AnswerContent = text;

    setQuestionDataForm({ ...questionDataForm });
  };

  // ====== DELETE ANSWER ======
  const deleteAnswerItem = (AnswerID: number, QuestionID: number) => {
    // - Get question index
    let QuestionIndex = questionDataForm.ExerciseList.findIndex(
      (item) => item.inputID == QuestionID
    );

    // - Get answer index
    let AnswerIndex = questionDataForm.ExerciseList[
      QuestionIndex
    ].ExerciseAnswer.findIndex((item) => item.ID == AnswerID);

    // Action delete
    if (
      questionDataForm.ExerciseList[QuestionIndex].ExerciseAnswer[AnswerIndex]
        .isAdd
    ) {
      questionDataForm.ExerciseList[QuestionIndex].ExerciseAnswer.splice(
        AnswerIndex,
        1
      );
    } else {
      questionDataForm.ExerciseList[QuestionIndex].ExerciseAnswer[
        AnswerIndex
      ].Enable = false;
    }

    // setAnswerList([...answerList]);
    setQuestionDataForm({ ...questionDataForm });
  };

  // SUBMIT FORM
  const handleSubmitQuestion = async () => {
    let res = null;

    let newData = JSON.parse(JSON.stringify(questionDataForm));

    // custom data
    newData.ExerciseList.forEach((item, index) => {
      item.ExerciseAnswer.forEach((ans, ind) => {
        if (ans.isAdd) {
          delete ans.ID;
        }
      });
    });
    if (questionDataForm.ExerciseGroupID) {
      newData.ID = questionDataForm.ExerciseGroupID;
    }

    newData.ExerciseGroupID = null;
    console.log("DataSubmit: ", newData);
    // ----------

    try {
      res = await exerciseGroupApi.update(newData);

      if (res.status == 200) {
        handleSubmitChange(res.data.data);
      }
    } catch (error) {
      showNoti("danger", error.message);
    }
  };

  // SUBMIT AND CHANGE PARAGRAPH
  const handleSubmitChange = async (dataSubmit) => {
    let res = null;

    let cloneParagraph = dataSubmit.Paragraph;

    console.log("DATA submit after: ", dataSubmit);

    dataSubmit.ExerciseList.forEach((item, index) => {
      let indexInput: any = parseInt(item.inputID) + 1;
      indexInput = indexInput.toString();
      cloneParagraph = cloneParagraph.replace(
        `<input id="${item.inputID}" class="space-editor" placeholder="(${indexInput})">`,
        `<div ques-id="${item.ID}" id="${item.inputID}" class='space-editor drag-item' ondrop="drop(event)" ondragover="allowDrop(event)">(${indexInput})</div>`
      );

      let test = `<input id="${item.inputID}" class='space-editor' placeholder="(${indexInput})">`;
      console.log("COI THỬ NÀY LÀ GÌ: ", test);
    });

    console.log("Paragraph new: ", cloneParagraph);

    dataSubmit.Paragraph = cloneParagraph;

    console.log("Paragraph new in submit: ", dataSubmit.Paragraph);

    // ----------

    try {
      res = await exerciseGroupApi.update(dataSubmit);

      if (res.status == 200) {
        changeIsSubmit(res.data.data);
        if (!questionDataForm.ID) {
          resetForm();
        }
        showNoti("success", `Tạo câu hỏi thành công`);
        setIsResetEditor(true);
      }
    } catch (error) {
      showNoti("danger", error.message);
    }
  };

  //RETURN INDEX QUESTION - Trả về thứ tự của từng câu hỏi
  const returnIndexQuestion = (itemQues) => {
    let title = "";
    let index = dataExercise.findIndex((ex) => ex.inputID == itemQues.inputID);
    title = `Câu (${index + 1})`;
    return title;
  };

  // GET GROUP DETAIL DATA
  const dataGroupDetail = async () => {
    setLoadingForm(true);

    let id = null;
    if (questionData.ID) {
      id = questionData.ID;
    } else {
      id = questionData.ExerciseGroupID;
    }

    try {
      let res = await exerciseGroupApi.getWithID(id);
      res.status == 200 && reloadNewContent(res.data.data);
      res.status == 204 && showNoti("danger", "Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingForm(false);
    }
  };

  const reloadNewContent = (data) => {
    let filterExerciseList = data.ExerciseList.filter(
      (item) => item.Enable !== false
    );
    data.ExerciseList = [...filterExerciseList];

    setDataExercise([...filterExerciseList]);
    setQuestionDataForm({ ...data });
  };

  useEffect(() => {
    if (isSubmit) {
      handleSubmitQuestion();
      return;
    }
  }, [isSubmit]);

  useEffect(() => {
    console.log("Visible: ", visible);
    console.log("Question Data: ", questionData);
    if (visible) {
      dataGroupDetail();
    }
  }, [visible]);

  // useEffect(() => {
  //   if (reloadContent) {
  //     (async function loadData() {
  //       try {
  //         let res = await exerciseGroupApi.getWithID(questionDataForm.ID);

  //         if (res.status == 200) {
  //           changeIsSubmit(res.data.data);
  //           showNoti("success", `Thành công`);
  //           if (!questionDataForm.ID) {
  //             resetForm();
  //           }
  //           setIsResetEditor(true);

  //           setTimeout(() => {
  //             setIsResetEditor(false);
  //           }, 500);
  //         }

  //         res.status == 204 && showNoti("danger", "Không có dữ liệu");
  //       } catch (error) {
  //         showNoti("danger", error.message);
  //       } finally {
  //         setReloadContent(false);
  //       }
  //     })();
  //   }
  // }, [reloadContent]);

  return (
    <div className="form-create-question">
      {visible && loadingForm ? (
        <div className="w-100 text-center mt-3">
          <Spin />
        </div>
      ) : (
        visible && (
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item name="Question" label="Nội dung">
                    <Editor
                      exerciseList={dataExercise}
                      deleteAllQuestion={deleteAllQuestion}
                      deleteSingleQuestion={(quesID: number) =>
                        deleteSingleQuestion(quesID)
                      }
                      handleChange={(value: string) => getDataEditor(value)}
                      isReset={isResetEditor}
                      questionContent={questionDataForm?.Paragraph}
                      questionData={questionDataForm}
                      addQuestion={(inputID: number) => addQuestion(inputID)}
                      visible={visible}
                    />
                  </Form.Item>
                  {/* <Form.Item label="Tải lên link Audio">
                    <Upload
                      onChange={onchange_UploadFile}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      <div className="d-block">
                        {loadingUpload ? <Spin /> : linkUpload && linkUpload}
                      </div>
                    </Upload>
                  </Form.Item> */}
                </div>
                <div
                  className="col-md-6 col-12"
                  style={{ borderLeft: "2px dotted #dbdbdb" }}
                >
                  <p
                    className="style-label"
                    style={{ textDecoration: "underline" }}
                  >
                    Đáp án
                  </p>
                  {questionDataForm?.ExerciseList?.map(
                    (itemQues, index) =>
                      itemQues.Enable && (
                        <div key={index} className="question-item-group">
                          <p
                            className=""
                            style={{ fontWeight: 500, color: "#525252" }}
                          >
                            {returnIndexQuestion(itemQues)}
                          </p>
                          <Tooltip title="Thêm đáp án">
                            <button
                              className="btn-add-answer mb-3"
                              onClick={() => handleAddAnswer(itemQues.inputID)}
                            >
                              <Plus />
                            </button>
                          </Tooltip>

                          <div className="row">
                            {itemQues.ExerciseAnswer?.map(
                              (itemAns, index) =>
                                itemAns.Enable && (
                                  <div className="col-md-6 col-12" key={index}>
                                    <div className="row-ans">
                                      <Checkbox
                                        checked={itemAns.isTrue}
                                        onChange={(e) =>
                                          onChange_isCorrect(
                                            e,
                                            itemAns.ID,
                                            itemQues.inputID
                                          )
                                        }
                                      ></Checkbox>
                                      <Form.Item className="mb-0">
                                        <Input
                                          value={itemAns.AnswerContent}
                                          className="style-input"
                                          onChange={(e) =>
                                            onChange_text(
                                              e,
                                              itemAns.ID,
                                              itemQues.inputID
                                            )
                                          }
                                        ></Input>
                                      </Form.Item>
                                      <button
                                        className="delete-ans"
                                        onClick={() =>
                                          deleteAnswerItem(
                                            itemAns.ID,
                                            itemQues.inputID
                                          )
                                        }
                                      >
                                        <CloseOutlined />
                                      </button>
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </Form>
        )
      )}
    </div>
  );
};

export default DragForm;
