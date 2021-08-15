import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Input, Checkbox } from "antd";
import Editor from "~/components/Elements/Editor";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";

// let returnSchema = {};
// let schema = null;

const QuestionSimple = {
  Subject: "",
  SubjectType: "",
  QuestionType: "",
  Level: "",
  QuestionData: {
    Question: "",
    AnswerList: [
      {
        isCorrect: true,
        text: "",
      },
    ],
  },
};

const ChoiceForm = (props) => {
  const { isSubmit, questionData } = props;
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
  const [questionBase, setQuestionBase] = useState(questionData);

  console.log("Question base: ", questionBase);

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any, e) => {
    console.log("DATA SUBMIT: ", data);
  });

  // GET VALUE IN EDITOR
  const getDataEditor = (dataEditor) => {
    console.log("Value Editor Form: ", dataEditor);
    questionBase.Content = dataEditor;
  };

  // ON CHANGE IS CORRECT
  const onChange_isCorrect = (e, AnswerID) => {
    console.log(`checked = ${e.target.checked}`);
    let checked = e.target.checked;
    let AnswerIndex = questionBase.ExerciseAnswer.findIndex(
      (item) => item.ID == AnswerID
    );
    questionBase.ExerciseAnswer[AnswerIndex].isTrue = checked;
    setQuestionBase({ ...questionBase });
  };

  // ON CHANGE TEXT
  const onChange_text = (e, AnswerID) => {
    let text = e.target.value;
    let AnswerIndex = questionBase.ExerciseAnswer.findIndex(
      (item) => item.ID == AnswerID
    );
    questionBase.ExerciseAnswer[AnswerIndex].AnswerContent = text;
    setQuestionBase({ ...questionBase });
  };

  useEffect(() => {
    if (isSubmit) {
      console.log("DATA SUBMIT: ", questionBase);
    }
  }, [isSubmit]);

  return (
    <div className="form-create-question">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <Form.Item name="Question" label="Câu hỏi">
                <Editor handleChange={(value) => getDataEditor(value)} />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p className="style-label">Nhập câu trả lời</p>
            </div>
            {questionBase?.ExerciseAnswer.map((item, index) => (
              <div className="col-md-6 col-12">
                <div className="row-ans">
                  <Checkbox
                    onChange={(e) => onChange_isCorrect(e, item.ID)}
                  ></Checkbox>
                  <Form.Item>
                    <Input
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
