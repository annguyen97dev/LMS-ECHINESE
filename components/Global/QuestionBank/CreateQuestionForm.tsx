import React, { useState } from "react";
import { Drawer, Form, Select, Input, Radio } from "antd";
import Editor from "~/components/Elements/Editor";
import { Edit } from "react-feather";
import ChoiceForm from "./QuestionType/ChoiceForm";

const CreateQuestionForm = (props) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = React.useState(1);
  const [openAns, setOpenAns] = useState(false);

  const { isEdit } = props;

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
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
      >
        <ChoiceForm />
      </Drawer>
    </>
  );
};

export default CreateQuestionForm;
