import React, { useState } from "react";
import { Modal, Input, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TinyBox from "~/components/Elements/TinyBox";

const QuestionModal = (props) => {
  const { Option } = Select;

  function onChange(value) {
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
      {props.showBtn && (
        <button className="btn btn-warning" onClick={showModal}>
          New Question
        </button>
      )}

      {props.showIcon && (
        <button className="btn btn-icon edit" onClick={showModal}>
          <EditOutlined />
        </button>
      )}

      <Modal
        title="Create Topic"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={
          <>
            <button className="btn btn-primary" onClick={handleOk}>
              Save
            </button>
            <button
              className="btn btn-light"
              style={{ marginLeft: "10px" }}
              onClick={handleCancel}
            >
              Close
            </button>
          </>
        }
      >
        <div className="modal-topic-content">
          <form action="">
            <div className="form-item">
              <label className="mb-1">Topic Name: </label>
              <Select
                className="style-input d-block"
                showSearch
                style={{ width: 200 }}
                placeholder="Select part.."
                optionFilterProp="children"
                onChange={onChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="p1">Part 1</Option>
                <Option value="p2">Part 2</Option>
                <Option value="p3">Part 3</Option>
              </Select>
            </div>
            <div className="form-item mt-3">
              <label htmlFor="Description" className="mb-1">
                Question:{" "}
              </label>
              <TinyBox />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default QuestionModal;
