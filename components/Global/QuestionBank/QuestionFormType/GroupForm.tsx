import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Upload, Spin, Button } from "antd";
import Editor from "~/components/Elements/Editor";
import { exerciseGroupApi } from "~/apiBase/";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";
import { UploadOutlined } from "@ant-design/icons";
import UploadAudio from "~/components/Elements/UploadAudio";
import EditorSimple from "~/components/Elements/EditorSimple";

const GroupForm = (props) => {
  const { isSubmit, questionData, changeIsSubmit, visible, changeData } = props;
  const { showNoti } = useWrap();
  const {
    handleSubmit,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const [form] = Form.useForm();
  const [questionDataForm, setQuestionDataForm] = useState(questionData);
  const [isResetEditor, setIsResetEditor] = useState(false);
  const [loadAtFirst, setLoadAtFirst] = useState(true);

  console.log("question data Form: ", questionDataForm);
  console.log("Question Data: ", questionData);

  // GET INTRODUCE EDITOR
  const getIntroduceEditor = (dataEditor: any) => {
    if (questionDataForm) {
      questionDataForm.Introduce = dataEditor;
    }
    setQuestionDataForm({ ...questionDataForm });
  };

  // GET VALUE IN EDITOR
  const getDataEditor = (dataEditor: any) => {
    if (questionDataForm) {
      console.log("Data content: ", dataEditor);
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

  // SUBMIT FORM
  const handleSubmitQuestion = async () => {
    let res = null;
    let newData = {
      Content: questionDataForm.Content,
      SubjectID: questionDataForm.SubjectID,
      Level: questionDataForm.Level,
      Type: questionDataForm.Type,
      LinkAudio: questionDataForm.LinkAudio,
      Introduce: questionDataForm.Introduce,
      SkillID: questionDataForm.SkillID,
    };

    console.log("Data submit is: ", newData);

    try {
      if (questionDataForm.ID) {
        res = await exerciseGroupApi.update({
          ...newData,
          ID: questionDataForm.ID,
        });
      } else {
        res = await exerciseGroupApi.add(newData);
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
        questionData.Introduce = "";
        questionData.LinkAudio = "";
      }

      setQuestionDataForm(questionData);
    } else {
      setQuestionDataForm(null);
      setLoadAtFirst(true);
    }
  }, [visible]);

  useEffect(() => {
    console.log("chạy vô");
    if (questionDataForm) {
      if (!loadAtFirst) {
        if (
          questionDataForm.Content !== "" ||
          questionDataForm.Introduce !== "" ||
          questionDataForm.LinkAudio !== ""
        ) {
          changeData && changeData();
        }
      }
      setLoadAtFirst(false);
    }
  }, [questionDataForm]);

  return (
    <div className="form-create-question">
      {visible && questionDataForm && (
        <Form form={form} layout="vertical" onFinish={handleSubmitQuestion}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Form.Item name="Question" label="Giới thiệu">
                  <EditorSimple
                    handleChange={(value) => getIntroduceEditor(value)}
                    isReset={isResetEditor}
                    questionContent={questionDataForm?.Introduce}
                    questionData={questionDataForm}
                  />
                </Form.Item>
                <Form.Item name="Question" label="Nội dung">
                  <EditorSimple
                    handleChange={(value) => getDataEditor(value)}
                    isReset={isResetEditor}
                    questionContent={questionDataForm?.Content}
                    questionData={questionDataForm}
                  />
                </Form.Item>
                <Form.Item label="Tải lên link Audio">
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
          </div>
        </Form>
      )}
    </div>
  );
};

export default GroupForm;
