import React, { useState } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { Edit, UserCheck } from "react-feather";

const ExerciseEditGr = () => {
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
      <button
        className="btn btn-success"
        onClick={showModal}
        style={{ marginRight: "10px" }}
      >
        <Edit size={15} />
        <span className="tab-title">Edit Group</span>
      </button>
      <Modal
        width="350px"
        title="Edit group"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="wrap-form">
          <Form layout="vertical">
            <Form.Item label="Edit group">
              <Select className="style-input"></Select>
            </Form.Item>

            <Form.Item label="Group Name">
              <Input className="style-input"></Input>
            </Form.Item>

            <Form.Item className="mb-1">
              <button className="btn btn-primary w-100">Submit</button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ExerciseEditGr;
