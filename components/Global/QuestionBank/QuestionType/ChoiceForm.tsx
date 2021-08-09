import React from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { Form, Input } from "antd";
import Editor from "~/components/Elements/Editor";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import InputTextField from "~/components/FormControl/InputTextField";
// import DateField from "~/components/FormControl/DateField";
// import SelectField from "~/components/FormControl/SelectField";
// import TextAreaField from "~/components/FormControl/TextAreaField";

// let returnSchema = {};
// let schema = null;

const ChoiceForm = () => {
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

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any, e) => {
    console.log("DATA SUBMIT: ", data);
  });

  // GET VALUE IN TINY BOX
  const getValueEditor = (value) => {
    console.log("Value Editor Form: ", value);
  };

  return (
    <div className="form-create-question">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="container-fluid">
          <Form.Item name="Question" label="Câu hỏi">
            <Editor handleChange={(value) => getValueEditor(value)} />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ChoiceForm;
