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

const RegCourseInfo = () => {
  const { TextArea } = Input;
  const { Option } = Select;

  return (
    <div className="container-fluid">
      <Card title="Thông tin đăng kí">
        <Form layout="vertical">
          <div className="row">
            <div className="col-12">
              <Form.Item label="Trung tâm">
                <Select
                  className="style-input w-100"
                  placeholder="Chọn trung tâm"
                >
                  <Option value="1">Mona 1</Option>
                  <Option value="2">Mona 2</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <Form.Item label="Khóa học">
                <Select
                  className="style-input w-100"
                  placeholder="Chọn khóa học"
                >
                  <Option value="1">Class Level 1</Option>
                  <Option value="2">Class Level 2</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <Form.Item label="Đăng ký lớp">
                <Select
                  className="style-input w-100"
                  placeholder="Chọn lớp đăng ký"
                >
                  <Option value="1">TOEIC</Option>
                  <Option value="2">Ai eo</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Trung tâm mong muốn">
                <Select
                  className="style-input w-100"
                  placeholder="Tên trung tâm"
                >
                  <Option value="1">Mona 1</Option>
                  <Option value="2">Mona 2</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Ca học mong muốn">
                <Select className="style-input w-100" placeholder="Ca học">
                  <Option value="1">7:00</Option>
                  <Option value="2">8:30</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Giá khóa học">
                <Input className="style-input" placeholder="0" />
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Mã khuyến mãi">
                <Input className="style-input" placeholder="CODE" />
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Số tiền được giảm">
                <Input className="style-input" placeholder="0" />
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Thanh toán">
                <Input className="style-input" placeholder="0" />
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Số tiền còn lại">
                <Input className="style-input" placeholder="0" />
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Ngày thu nợ học phi">
                <Input className="style-input" placeholder="dd/mm/yyyy" />
              </Form.Item>
            </div>
          </div>

          <div className="row">
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
            <div className="col-md-6 col-12">
              <Form.Item label="Trung tâm thu tiền">
                <Select className="style-input w-100" placeholder="Trung tâm ">
                  <Option value="1">Mona 1</Option>
                  <Option value="2">Mona 2</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <Form.Item label="Cam kết">
                <TextArea />
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

export default RegCourseInfo;
