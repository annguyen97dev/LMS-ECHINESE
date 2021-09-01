import React, { useState } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { Edit2, UserCheck } from "react-feather";
// import { Editor } from "@tinymce/tinymce-react";

const ExerciseCreateQues = () => {
  const { Option } = Select;
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <button className="btn btn-warning" onClick={showModal}>
        <Edit2 size={15} />
        <span className="tab-title">Create Question</span>
      </button>
      <Modal
        width="600px"
        title="Edit group"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="wrap-form">
          <Form layout="vertical">
            <Form.Item label="Group">
              <Select className="style-input"></Select>
            </Form.Item>

            {/* <Form.Item label="Question">
              <Editor
                apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
                init={{
                  height: 340,
                  branding: false,
                  plugins: "link image code",
                  toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright | code",
                }}
              />
            </Form.Item> */}

            <Form.Item className="mb-1">
              <button className="btn btn-primary w-100">Submit</button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ExerciseCreateQues;
