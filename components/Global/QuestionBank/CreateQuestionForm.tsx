import React, { useState } from "react";
import { Drawer, Form, Select, Input, Radio, Spin } from "antd";
import Editor from "~/components/Elements/Editor";
import { Edit } from "react-feather";
import ChoiceForm from "./QuestionType/ChoiceForm";
import MultipleForm from "./QuestionType/MultipleForm";

const CreateQuestionForm = (props) => {
  const { questionData, isEdit, onFetchData } = props;
  // console.log("props", props);
  // console.log("QuestionData Drawer: ", questionData);

  const [visible, setVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onSubmitData = () => {
    !isSubmit && setIsSubmit(true);
    setIsLoading(true);
  };

  const onSuccessSubmit = () => {
    isSubmit &&
      (setIsSubmit(false),
      setIsLoading(false),
      onFetchData(),
      setVisible(false));
    console.log("chạy vô đây");
  };

  const renderFormContent = (type: number) => {
    // console.log("Type is: ", type);
    switch (type) {
      case 0:
        return <p className="font-weight-bold">Vui lòng chọn dạng câu hỏi</p>;
        break;
      case 1:
        return (
          <ChoiceForm
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={onSuccessSubmit}
          />
        );
        break;
      case 4:
        return (
          <MultipleForm
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={onSuccessSubmit}
          />
        );
        break;
      default:
        return <p>Vui lòng chọn dạng câu hỏi</p>;
        break;
    }
  };

  return (
    <>
      {questionData.ID ? (
        <button className="btn btn-icon" onClick={showDrawer}>
          <Edit />
        </button>
      ) : (
        <button className="btn btn-success" onClick={showDrawer}>
          Tạo câu hỏi
        </button>
      )}

      <Drawer
        title={isEdit ? "Form sửa câu hỏi" : "Form tạo câu hỏi"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={900}
        footer={
          <div className="text-center">
            <button className="btn btn-light mr-2" onClick={onClose}>
              Đóng
            </button>
            {questionData?.Type !== 0 && (
              <button
                className="btn btn-primary"
                onClick={() => onSubmitData()}
              >
                Lưu
                {isLoading && <Spin className="loading-base" />}
              </button>
            )}
          </div>
        }
      >
        {renderFormContent(questionData.Type)}
      </Drawer>
    </>
  );
};

export default CreateQuestionForm;
