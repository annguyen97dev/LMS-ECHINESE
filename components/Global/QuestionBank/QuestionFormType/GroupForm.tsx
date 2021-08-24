import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Upload, Spin, Button } from "antd";
import Editor from "~/components/Elements/Editor";
import { exerciseGroupApi } from "~/apiBase/";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";
import { UploadOutlined } from "@ant-design/icons";

const GroupForm = (props) => {
  const { isSubmit, questionData, changeIsSubmit, visible } = props;
  const { showNoti } = useWrap();
  const {
    handleSubmit,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const [form] = Form.useForm();
  const [questionDataForm, setQuestionDataForm] = useState(questionData);
  const [isResetEditor, setIsResetEditor] = useState(false);
  const [linkUpload, setLinkUpload] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  // const propsFile = {
  //   name: "file",
  //   // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //   headers: {
  //     authorization: "authorization-text",
  //   },
  //   async onChange(info) {
  //     console.log("Info File upload: ", info);
  //     try {
  //       let res = await exerciseGroupApi.UploadAudio(info.file);
  //       if(res.status == 200) {
  //         showNoti("success", "Upload file thành công");
  //       }
  //     } catch (error) {

  //     }
  //     // if (info.file.status !== "uploading") {
  //     //   console.log(info.file, info.fileList);
  //     // }
  //     // if (info.file.status === "done") {
  //     //   message.success(`${info.file.name} file uploaded successfully`);
  //     // } else if (info.file.status === "error") {
  //     //   message.error(`${info.file.name} file upload failed.`);
  //     // }
  //   },
  // };

  // Upload file audio
  const onchange_UploadFile = async (info) => {
    console.log("Info File upload: ", info);
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
  // const onChange_isCorrect = (e, AnswerID) => {
  //   console.log(`checked = ${e.target.checked}`);
  //   let checked = e.target.checked;

  //   // Xóa các isTrue còn lại (vì là câu hỏi chọn 1 đáp án)
  //   questionData.ExerciseAnswer.forEach((item) => {
  //     item.isTrue = false;
  //   });

  //   // Tìm vị trí sau đó gán correct vào
  //   let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex(
  //     (item) => item.ID == AnswerID
  //   );
  //   questionDataForm.ExerciseAnswer[AnswerIndex].isTrue = checked;
  //   setQuestionDataForm({ ...questionDataForm });
  // };

  // ON CHANGE TEXT
  // const onChange_text = (e, AnswerID) => {
  //   let text = e.target.value;
  //   let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex(
  //     (item) => item.ID == AnswerID
  //   );
  //   questionDataForm.ExerciseAnswer[AnswerIndex].AnswerContent = text;
  //   setQuestionDataForm({ ...questionDataForm });
  // };

  // SUBMIT FORM
  const handleSubmitQuestion = async () => {
    let res = null;
    let newData = {
      Content: questionDataForm.Content,
      SubjectID: questionDataForm.SubjectID,
      Level: questionDataForm.Level,
      Type: questionDataForm.Type,
    };

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
    console.log("DATA SUBMIT: ", questionDataForm);
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
              <div className="col-12">
                <Form.Item name="Question" label="Nội dung">
                  <Editor
                    handleChange={(value) => getDataEditor(value)}
                    isReset={isResetEditor}
                    questionContent={questionDataForm?.Content}
                    questionData={questionDataForm}
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
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default GroupForm;
