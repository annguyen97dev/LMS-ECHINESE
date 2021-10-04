import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Input, Checkbox } from "antd";
import Editor from "~/components/Elements/Editor";
import { exerciseApi } from "~/apiBase/";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";
import EditorSimple from "~/components/Elements/EditorSimple";
import UploadAudio from "~/components/Elements/UploadAudio";

const listAlphabet = [
  "A",
  "B",
  "C",
  "D",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
];

const ChoiceForm = (props) => {
  const {
    isSubmit,
    questionData,
    changeIsSubmit,
    visible,
    isGroup,
    changeData,
  } = props;
  const { showNoti } = useWrap();
  const {
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const [form] = Form.useForm();
  const [questionDataForm, setQuestionDataForm] = useState(null);
  const [isResetEditor, setIsResetEditor] = useState(false);
  const [loadAtFirst, setLoadAtFirst] = useState(true);

  // GET VALUE IN EDITOR
  const getDataEditor = (dataEditor) => {
    if (questionDataForm) {
      questionDataForm.Content = dataEditor;
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

  // ON CHANGE IS CORRECT
  const onChange_isCorrect = (e, AnswerID) => {
    let checked = e.target.checked;

    // Xóa các isTrue còn lại (vì là câu hỏi chọn 1 đáp án)
    questionDataForm.ExerciseAnswer.forEach((item) => {
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
    console.log("Question SUBMIT in form: ", questionDataForm);

    let res = null;
    try {
      if (questionDataForm.ID) {
        res = await exerciseApi.update(questionDataForm);
      } else {
        res = await exerciseApi.add(questionDataForm);
      }
      if (res.status == 200) {
        changeIsSubmit(questionDataForm.ID ? questionDataForm : res.data.data);
        showNoti(
          "success",
          `${questionDataForm.ID ? "Cập nhật" : "Thêm"} Thành công`
        );
        if (!questionDataForm.ID) {
          resetForm();
        }
        setIsResetEditor(true);

        setTimeout(() => {
          setIsResetEditor(false);
        }, 500);
      }
    } catch (error) {}
  };

  useEffect(() => {
    isSubmit && handleSubmitQuestion();
  }, [isSubmit]);

  useEffect(() => {
    if (visible) {
      if (!questionData.ID) {
        questionData.Content = "";
        questionData.ExerciseAnswer.forEach((item: any) => {
          item.AnswerContent = "";
          item.isTrue = false;
        });
      }
      setQuestionDataForm(questionData);
    } else {
      setQuestionDataForm(null);
      setLoadAtFirst(true);
    }
  }, [visible]);

  useEffect(() => {
    if (questionDataForm) {
      if (!loadAtFirst) {
        changeData && changeData();
      }
      setLoadAtFirst(false);
    }
  }, [questionDataForm]);

  return (
    <div className="form-create-question">
      {visible && questionDataForm && (
        <Form form={form} layout="vertical">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Form.Item name="Question" label="Câu hỏi">
                  <EditorSimple
                    visible={visible}
                    handleChange={(value) => getDataEditor(value)}
                    isReset={isResetEditor}
                    questionContent={questionDataForm?.Content}
                    questionData={questionData}
                  />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item label="File nghe">
                  <UploadAudio
                    getFile={(file) => {
                      questionDataForm.LinkAudio = file;
                      setQuestionDataForm({ ...questionDataForm });
                    }}
                    valueFile={questionDataForm?.LinkAudio}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <p className="style-label">Đáp án</p>
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
                        placeholder={listAlphabet[index]}
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
      )}
    </div>
  );
};

export default ChoiceForm;
