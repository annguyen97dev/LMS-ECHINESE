import { Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { AlertTriangle, X } from "react-feather";

const DeleteItem = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const { onDelete } = props;

  const handleDelete = () => {
    onDelete();
    setIsVisible(false);
  };

  return (
    <>
      <Tooltip title="Xóa">
        <button
          className="btn btn-icon delete"
          onClick={() => setIsVisible(true)}
        >
          <X />
        </button>
      </Tooltip>
      <Modal
        title={<AlertTriangle color="red" />}
        visible={isVisible}
        onOk={handleDelete}
        onCancel={() => setIsVisible(false)}
      >
        <p className="text-confirm">Bạn có chắc muốn xóa?</p>
      </Modal>
    </>
  );
};

export default DeleteItem;
