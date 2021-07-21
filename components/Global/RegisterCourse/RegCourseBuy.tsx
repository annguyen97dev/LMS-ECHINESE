import React, { Fragment } from "react";

import {
  Modal,
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Select,
  Card,
  Switch,
} from "antd";

const RegCourseBuy = () => {
  const { TextArea } = Input;
  const { Option } = Select;

  return (
    <div className="container-fluid">
      <Card title="Thông tin đăng kí">
        <Form layout="vertical">
          <div className="row">
            <div className="col-12">
              <Form.Item label="Dịch vụ">
                <Select
                  className="style-input w-100"
                  placeholder="Đăng ký thi IELTS tại BC hoặc IDP"
                >
                  <Option value="1">Đăng ký thi IELTS tại BC hoặc IDP</Option>
                  <Option value="2">Mua dịch vụ</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Nhà cung cấp">
                <Select
                  className="style-input w-100"
                  placeholder="Nhà cung cấp"
                >
                  <Option value="1">Checker</Option>
                  <Option value="2">Dev pro</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Đợt thi">
                <Select className="style-input w-100" placeholder="Đợt thi">
                  <Option value="1">Thi thử</Option>
                  <Option value="2">Ngày 29/07/2021</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Ngày đặt dịch vụ">
                <Input className="style-input" placeholder="dd/mm/yyyy" />
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Hình thức thanh toán">
                <Select
                  className="style-input w-100"
                  placeholder="Thanh toán trực tiếp"
                >
                  <Option value="1">Thanh toán qua ví điện tử</Option>
                  <Option value="2">Thanh toán trực tiếp</Option>
                  <Option value="3">Thanh toán tài khoản ngân hàng</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Số tiền">
                <Input className="style-input" placeholder="0" />
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Trung tâm nhập phiếu">
                <Select
                  className="style-input w-100"
                  placeholder="Trung tâm nhập phiếu"
                >
                  <Option value="1">Mona Media</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <Form.Item label="Ghi chú">
                <TextArea />
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-12 text-center text-left-mobile">
              <Button type="primary" size="large">
                Xác nhận
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegCourseBuy;
