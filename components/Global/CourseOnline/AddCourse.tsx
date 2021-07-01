import React from "react";
import { Modal, Form, Input, Button } from "antd";

const AddCourse = ({visible, onCancel}) => {
  return (
    <Modal
      title="Tạo khóa học"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <div className="container-fluid">
        <Form layout="vertical">
          <div className="row">
            <div className="col-12">
              <Form.Item label="Tên khóa học">
                <Input placeholder="Nhập tên khóa học ..." />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item label="Mô tả">
                <Input placeholder="Nhập mô tả ..." />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item label="Giá tiền">
                <Input placeholder="5.000.000 ..." />
              </Form.Item>
            </div>
          </div>
          <div className="row ">
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

export default AddCourse;
