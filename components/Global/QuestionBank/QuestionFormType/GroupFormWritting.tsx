import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Upload, Spin, Button, Input } from "antd";
import Editor from "~/components/Elements/Editor";
import { exerciseGroupApi } from "~/apiBase/";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";

let AnsID = 0;
let QuesID = -1;

const GroupFormWritting = (props) => {
  const { isSubmit, questionData, changeIsSubmit, visible } = props;
  const { showNoti } = useWrap();
  const {
    handleSubmit,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const [form] = Form.useForm();
  const [questionDataForm, setQuestionDataForm] = useState({
    ...questionData,
    ExerciseAnswer: null,
    Exercise: [],
  });
  const [isResetEditor, setIsResetEditor] = useState(false);
  const [linkUpload, setLinkUpload] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  console.log("Question Data Form: ", questionData);

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
      showNoti("danger", error);
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
    questionDataForm.Content = dataEditor;
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
    questionDataForm.ExerciseList.splice(
      0,
      questionDataForm.ExerciseList.length
    );
    setQuestionDataForm({ ...questionDataForm });
  };

  // HANDLE DELETE QUESTION
  const deleteQuestion = (QuestionID) => {
    console.log("Question ID cần xóa: ", QuestionID);
    let QuestionIndex = questionDataForm.ExerciseList.findIndex(
      (item) => item.ID == QuestionID
    );

    questionDataForm.ExerciseList.splice(QuestionIndex, 1);
    setQuestionDataForm({ ...questionDataForm });
  };

  // HANDLE ADD QUESTION
  const addQuestion = (inputID) => {
    AnsID++;
    let objAns = {
      ID: inputID,
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
      ExerciseAnswer: [
        {
          ID: AnsID,
          AnswerContent: "",
          isTrue: false,
          Enable: true,
          isAdd: true,
        },
      ],
    };
    questionDataForm.ExerciseList.push(objAns);
    setQuestionDataForm({ ...questionDataForm });
  };

  // ====== HANDLE ADD ANSWER ======
  const handleAddAnswer = (questionID: number) => {
    AnsID++;
    questionDataForm.ExerciseList.every((item) => {
      if (item.ID == questionID) {
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

  // ====== ON CHANGE TEXT ======
  const onChange_text = (e: any, AnswerID: number, QuestionID) => {
    // - Get value
    let text = e.target.value;

    // - Get question index
    let QuestionIndex = questionDataForm.ExerciseList.findIndex(
      (item) => item.ID == QuestionID
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
      (item) => item.ID == QuestionID
    );

    // - Get answer index
    let AnswerIndex = questionDataForm.ExerciseList[
      QuestionIndex
    ].ExerciseAnswer.findIndex((item) => item.ID == AnswerID);

    // answerList.splice(AnswerIndex, 1);
    questionDataForm.ExerciseList[QuestionIndex].ExerciseAnswer[
      AnswerIndex
    ].Enable = false;

    // setAnswerList([...answerList]);
    setQuestionDataForm({ ...questionDataForm });
  };

  // SUBMIT FORM
  const handleSubmitQuestion = async () => {
    console.log("DataSubmit: ", questionDataForm);
    let res = null;
    // let newData = {
    //   Content: questionDataForm.Content,
    //   SubjectID: questionDataForm.SubjectID,
    //   Level: questionDataForm.Level,
    //   Type: questionDataForm.Type,
    // };

    // try {
    //   if (questionDataForm.ID) {
    //     res = await exerciseGroupApi.update({
    //       ...newData,
    //       ID: questionDataForm.ID,
    //     });
    //   } else {
    //     res = await exerciseGroupApi.add(newData);
    //   }
    //   if (res.status == 200) {
    //     changeIsSubmit(questionDataForm.ID ? questionDataForm : res.data.data);
    //     showNoti(
    //       "success",
    //       `${questionDataForm.ID ? "Cập nhật" : "Thêm"} Thành công`
    //     );
    //     if (!questionDataForm.ID) {
    //       resetForm();
    //     }
    //     setIsResetEditor(true);

    //     setTimeout(() => {
    //       setIsResetEditor(false);
    //     }, 500);
    //   }
    // } catch (error) {}
  };

  useEffect(() => {
    // console.log("DATA SUBMIT: ", questionDataForm);
    isSubmit && handleSubmitQuestion();
  }, [isSubmit]);

  useEffect(() => {
    visible && setQuestionDataForm(questionData);
  }, [visible]);

  return (
    <div className="form-create-question">
      {visible && (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item name="Question" label="Nội dung">
                  <Editor
                    deleteAllQuestion={deleteAllQuestion}
                    handleDelete={(quesID: number) => deleteQuestion(quesID)}
                    handleChange={(value: string) => getDataEditor(value)}
                    isReset={isResetEditor}
                    questionContent={questionDataForm?.Content}
                    questionData={questionDataForm}
                    addQuestion={(inputID: number) => addQuestion(inputID)}
                  />
                </Form.Item>
                <Form.Item label="Tải lên link Audio">
                  {/* <input
                    type="file"
                    onChange={(info) => onchange_UploadFile(info)}
                  ></input>
                  {loadingUpload ? <Spin /> : linkUpload && linkUpload} */}
                  <Upload onChange={onchange_UploadFile} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    <div className="d-block">
                      {loadingUpload ? <Spin /> : linkUpload && linkUpload}
                    </div>
                  </Upload>
                </Form.Item>
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
                {questionData?.ExerciseList?.map((itemQues, index) => (
                  <div key={index}>
                    <p
                      className="mt-4"
                      style={{ fontWeight: 500, color: "#525252" }}
                    >
                      Câu ({itemQues.ID + 1})
                    </p>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleAddAnswer(itemQues.ID)}
                    >
                      Thêm đáp án
                    </button>
                    <div className="row">
                      {itemQues.ExerciseAnswer?.map(
                        (itemAns, index) =>
                          itemAns.Enable && (
                            <div className="col-md-6 col-12" key={index}>
                              <div className="row-ans mt-3">
                                <Form.Item>
                                  <Input
                                    value={itemAns.AnswerContent}
                                    className="style-input"
                                    onChange={(e) =>
                                      onChange_text(e, itemAns.ID, itemQues.ID)
                                    }
                                  ></Input>
                                </Form.Item>
                                <button
                                  className="delete-ans"
                                  onClick={() =>
                                    deleteAnswerItem(itemAns.ID, itemQues.ID)
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
                ))}
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default GroupFormWritting;
