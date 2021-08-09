import React, { useState } from "react";
import { Modal, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Editor from "~/components/Elements/Editor";

const TopicModal = (props) => {
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
          New Topic
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
              <Input className="style-input" placeholder="Topic name..." />
            </div>
            <div className="form-item mt-3">
              <label htmlFor="Description" className="mb-1">
                Description:{" "}
              </label>
              <Editor />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default TopicModal;
