import React, { useState } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { UserCheck } from "react-feather";

const ModalUpdate = () => {
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
      <button className="btn btn-icon" onClick={showModal}>
        <UserCheck />
      </button>
      <Modal
        width="350px"
        title="Update Staff"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="wrap-form">
          <Form layout="vertical">
            <Form.Item label="Academic Officer:">
              <Select
                defaultValue="lucy"
                className="style-input"
                onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Teacher Leader:">
              <Select
                defaultValue="lucy"
                className="style-input"
                onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
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

export default ModalUpdate;
