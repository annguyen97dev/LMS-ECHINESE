import React, { useState, useEffect } from "react";
import { Modal } from "antd";

const DecideModal = (props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (e) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    props.isOk();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    props.isCancel();
  };

  useEffect(() => {
    setIsModalVisible(props.isOpen);
  }, [props.isOpen]);

  return (
    <>
      <a href="#" onClick={showModal}>
        {props.addBtn && props.addBtn}
      </a>

      <Modal
        title="Xác nhận"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal-decide"
      >
        <p
          className={`modal-decide__text ${props.addClass && props.addClass}`}
          style={{ fontWeight: 600 }}
        >
          {props.content ? props.content : ""}
        </p>
      </Modal>
    </>
  );
};

export default DecideModal;
