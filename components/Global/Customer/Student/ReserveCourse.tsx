import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, Divider, Tooltip } from "antd";
import { Repeat } from "react-feather";

const ReserveCourse = () => {
  const { TextArea } = Input;

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Tooltip title="Bảo lưu khóa">
        <button
          className="btn btn-icon exchange"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <Repeat />
        </button>
      </Tooltip>

      <Modal
        title="Bảo lưu khóa"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <div style={{ paddingRight: 5 }}>
                <Button type="primary" size="large">
                  Xác nhận
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setIsModalVisible(false)}
                  type="default"
                  size="large"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        }
      >
        <div className="wrap-form">
          <Form layout="vertical">
            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item label="Học viên">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item label="Hạn bảo lưu">
                  <Input className="style-input" placeholder="" type="date" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <Form.Item label="Hạn bảo lưu">
                <TextArea rows={2} />
              </Form.Item>
            </div>
            <div className="col-12"></div>
            {/*  */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ReserveCourse;
