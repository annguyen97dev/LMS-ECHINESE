import React, { useState } from "react";
import { Drawer, Form, Select, Input, Radio } from "antd";
import Editor from "~/components/Elements/Editor";
import { Edit } from "react-feather";
import ChoiceForm from "./QuestionType/ChoiceForm";

const CreateQuestionForm = (props) => {
  const { questionData, isEdit } = props;
  console.log("props", props);
  console.log("QuestionData Drawer: ", questionData);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = React.useState(1);
  const [openAns, setOpenAns] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onSubmitData = () => {
    !isSubmit && setIsSubmit(true);

    setTimeout(() => {
      setIsSubmit(false);
    }, 500);
  };

  const renderFormContent = (type: number) => {
    console.log("Type is: ", type);
    switch (type) {
      case 0:
        return <p className="font-weight-bold">Vui lòng chọn dạng câu hỏi</p>;
        break;
      case 1:
        return <ChoiceForm questionData={questionData} isSubmit={isSubmit} />;
        break;
      default:
        return <p>Vui lòng chọn dạng câu hỏi</p>;
        break;
    }
  };

  return (
    <>
      {props.isEdit ? (
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
            {questionData?.Type !== 0 && (
              <button
                className="btn btn-primary"
                onClick={() => onSubmitData()}
              >
                Lưu
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
