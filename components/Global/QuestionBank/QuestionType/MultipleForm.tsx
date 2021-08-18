import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Input, Checkbox } from "antd";
import Editor from "~/components/Elements/Editor";
import { exerciseApi } from "~/apiBase/";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";
import { CloseOutlined } from "@ant-design/icons";
import { data } from "~/lib/option/dataOption";

// let returnSchema = {};
// let schema = null;

let AnsID = 0;

const MultipleForm = (props) => {
  const { isSubmit, questionData, changeIsSubmit } = props;
  const { showNoti } = useWrap();
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const [form] = Form.useForm();
  const [questionDataForm, setQuestionDataForm] = useState(questionData);
  const [isResetEditor, setIsResetEditor] = useState(false);
  const [answerList, setAnswerList] = useState(questionData.ExerciseAnswer);

  console.log("Question base: ", questionDataForm);

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any, e) => {
    console.log("DATA SUBMIT: ", data);
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
    questionDataForm.ExerciseAnswer = [];
    setQuestionDataForm({ ...questionDataForm });
  };

  // ON CHANGE IS CORRECT
  const onChange_isCorrect = (e, AnswerID) => {
    console.log(`checked = ${e.target.checked}`);
    let checked = e.target.checked;

    // Tìm vị trí sau đó gán correct vào
    let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex(
      (item) => item.ID == AnswerID
    );
    questionDataForm.ExerciseAnswer[AnswerIndex].isTrue = checked;
    setQuestionDataForm({ ...questionDataForm });
  };

  // ON CHANGE TEXT
  const onChange_text = (e, AnswerID) => {
    let text = e.target.value;
    let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex(
      (item) => item.ID == AnswerID
    );
    questionDataForm.ExerciseAnswer[AnswerIndex].AnswerContent = text;
    setQuestionDataForm({ ...questionDataForm });
  };

  // SUBMIT FORM
  const handleSubmitQuestion = async () => {
    let res = null;
    try {
      if (questionDataForm.ID) {
        let cloneData = { ...questionDataForm };
        cloneData.ExerciseAnswer.forEach((item, index) => {
          if (item.isAdd) {
            delete item.ID;
          }
        });

        res = await exerciseApi.update(cloneData);
      } else {
        res = await exerciseApi.add(questionDataForm);
      }
      if (res.status == 200) {
        changeIsSubmit();
        resetForm();
        setIsResetEditor(true);
        setTimeout(() => {
          setIsResetEditor(false);
        }, 500);
      }
    } catch (error) {}
  };

  // HANLDE ADD ANSWER
  const handleAddAnswer = () => {
    AnsID++;
    questionDataForm.ExerciseAnswer.push({
      ID: AnsID,
      AnswerContent: "",
      isTrue: false,
      Enable: true,
      isAdd: true,
    });
    setQuestionDataForm({ ...questionDataForm });
  };

  // HANDLE DELETE ANSWER ITEM
  const deleteAnswerItem = async (AnswerID) => {
    let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex(
      (item) => item.ID == AnswerID
    );
    // answerList.splice(AnswerIndex, 1);
    questionDataForm.ExerciseAnswer[AnswerIndex].Enable = false;

    // setAnswerList([...answerList]);
    setQuestionDataForm({ ...questionDataForm });
  };

  useEffect(() => {
    console.log("Data submit: ", questionDataForm);
    isSubmit &&
      (handleSubmitQuestion(), console.log("DATA SUBMIT: ", questionDataForm));
  }, [isSubmit]);

  // useEffect(() => {
  //   if (!questionData.ID) {
  //     setQuestionDataForm({
  //       ...questionDataForm,
  //       ExerciseAnswer: [],
  //     });
  //   }
  // }, [questionData]);

  return (
    <div className="form-create-question">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <Form.Item name="Question" label="Câu hỏi">
                <Editor
                  handleChange={(value) => getDataEditor(value)}
                  isReset={isResetEditor}
                  questionContent={questionDataForm?.Content}
                  questionData={questionDataForm}
                />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-4">
              <p className="style-label">Đáp án</p>
              <button className="btn btn-warning" onClick={handleAddAnswer}>
                Thêm đáp án
              </button>
            </div>
            {questionData?.ExerciseAnswer?.map(
              (item, index) =>
                item.Enable && (
                  <div className="col-md-6 col-12" key={index}>
                    <div className="row-ans">
                      <Checkbox
                        checked={item.isTrue}
                        onChange={(e) => onChange_isCorrect(e, item.ID)}
                      ></Checkbox>
                      <Form.Item>
                        <Input
                          value={item.AnswerContent}
                          className="style-input"
                          onChange={(e) => onChange_text(e, item.ID)}
                        ></Input>
                      </Form.Item>
                      <button
                        className="delete-ans"
                        onClick={() => deleteAnswerItem(item.ID)}
                      >
                        <CloseOutlined />
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default MultipleForm;
