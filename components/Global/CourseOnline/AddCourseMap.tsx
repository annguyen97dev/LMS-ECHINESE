import React from "react";
import { Modal, Form, Input, Button } from "antd";

const AddCourse = ({ visible, onCancel }) => {
  return (
    <Modal
      title="Lộ trình học"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <div className="container-fluid">
        <Form layout="vertical">
          <div className="row">
            <div className="col-12">
              <Form.Item label="Tên lộ trình">
                <Input
                  className="style-input"
                  size="large"
                  placeholder="Nhập tên lộ trình ..."
                />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item label="Mô tả">
                <Input
                  className="style-input"
                  size="large"
                  placeholder="Nhập mô tả ..."
                />
              </Form.Item>
            </div>
          </div>

          <div className="row ">
            <div className="col-12">
              <Button className="w-100" size="large" type="primary">
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddCourse;
