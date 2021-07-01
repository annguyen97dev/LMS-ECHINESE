import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, Divider, Tooltip } from "antd";
import { DollarSign } from "react-feather";

const RefundForm = () => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Tooltip title="Thông tin phiếu chi">
        <button
          className="btn btn-icon"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <DollarSign />
        </button>
      </Tooltip>

      <Modal
        title="Thông tin phiếu chi"
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
                <Form.Item label="Số điện thoại">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Địa chi">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="CMND">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Ngày cấp">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Nơi cấp">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Số tiền">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Phương thức thanh toán">
                  <Select defaultValue="lucy" className="w-100 style-input">
                    <Option value="jack">Jack</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Trung tâm">
                  <Select defaultValue="lucy" className="w-100 style-input">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                  </Select>
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

export default RefundForm;
