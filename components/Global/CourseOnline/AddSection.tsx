import React from "react";
import { Modal, Form, Input, Button } from "antd";

const AddSection = ({ visible, onCancel }) => {
  return (
    <Modal title="Thêm mới" visible={visible} onCancel={onCancel} footer={null}>
      <div className="container-fluid">
        <Form layout="vertical">
          <div className="row">
            <div className="col-12">
              <Form.Item label="Section name">
                <Input placeholder="Nhập ..." />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Button className="w-100" type="primary">
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddSection;
