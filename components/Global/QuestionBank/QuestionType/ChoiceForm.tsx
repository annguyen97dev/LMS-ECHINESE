import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Input, Checkbox } from "antd";
import Editor from "~/components/Elements/Editor";
import { exerciseApi } from "~/apiBase/";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";

// let returnSchema = {};
// let schema = null;

const ChoiceForm = (props) => {
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
    questionDataForm.ExerciseAnswer.forEach((item) => {
      item.AnswerContent = "";
      item.isTrue = false;
    });
    setQuestionDataForm({ ...questionDataForm });
  };

  // ON CHANGE IS CORRECT
  const onChange_isCorrect = (e, AnswerID) => {
    console.log(`checked = ${e.target.checked}`);
    let checked = e.target.checked;

    // Xóa các isTrue còn lại (vì là câu hỏi chọn 1 đáp án)
    questionData.ExerciseAnswer.forEach((item) => {
      item.isTrue = false;
    });

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
    try {
      let res = await exerciseApi.add(questionDataForm);
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

  useEffect(() => {
    console.log("DATA SUBMIT: ", questionDataForm);
    isSubmit && handleSubmitQuestion();
  }, [isSubmit]);

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
                />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p className="style-label">Nhập câu trả lời</p>
            </div>
            {questionDataForm?.ExerciseAnswer.map((item, index) => (
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ChoiceForm;
