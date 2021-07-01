import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, Divider, Tooltip } from "antd";
import { CreditCard } from "react-feather";

const PaymentService = () => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Tooltip title="Thông tin thanh toán">
        <button
          className="btn btn-icon"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <CreditCard />
        </button>
      </Tooltip>

      <Modal
        title="Thông tin thanh toán"
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
              <div className="col-md-6 col-12">
                <Form.Item label="Học viên">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Tên set">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Giá">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Trung tâm thu tiền">
                  <Select defaultValue="lucy" className="w-100 style-input">
                    <Option value="jack">Jack</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-md-4 col-12">
                <Form.Item label="Còn lại">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-4 col-12">
                <Form.Item label="Số tiền thu">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-4 col-12">
                <Form.Item label="Discount">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Ghi chú">
                  <TextArea />
                </Form.Item>
              </div>
            </div>
            {/*  */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default PaymentService;
