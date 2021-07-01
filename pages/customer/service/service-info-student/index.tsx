import React from "react";
import { Card, Form, Select, Input, Divider, Button } from "antd";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
const StudentAppointmentCreate = () => {
  // const layout = {
  //   labelCol: { span: 4 },
  //   wrapperCol: { span: 20 },
  // };
  const { TextArea } = Input;

  const { Option } = Select;
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <TitlePage title="Lịch hẹn" />
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center">
        <Card title="Phiếu thông tin cá nhân" className="w-50 w-100-mobile">
          <div className="wrap-form">
            {/* <Form {...layout} labelAlign="left"> */}
            <Form layout="vertical">
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Họ và tên">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="SĐT">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Email">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Ngày sinh">
                    <Input className="style-input" placeholder="" type="date" />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Quốc tịch">
                    <Select
                      defaultValue="Việt Nam"
                      className="w-100 style-input"
                    >
                      <Option value="jack">Jack</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Quận/Huyện">
                    <Select
                      defaultValue="Tân Bình"
                      className="w-100 style-input"
                    >
                      <Option value="jack">Jack</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Phường/Xã">
                    <Select
                      defaultValue="Phường 8"
                      className="w-100 style-input"
                    >
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Đường">
                    <Select
                      defaultValue="Lý Thường Kiệt"
                      className="w-100 style-input"
                    >
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Số nhà">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Số CMND">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
              </div>

              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Nơi cấp">
                    <Select defaultValue="TP.HCM" className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Ngày cấp">
                    <Input className="style-input" placeholder="" type="date" />
                  </Form.Item>
                </div>
              </div>

              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Công việc">
                    <Select
                      defaultValue="Học sinh"
                      className="w-100 style-input"
                    >
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Nơi làm việc">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
              </div>

              <hr />
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Tên trung tâm">
                    <Select defaultValue="lucy" className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Được tạo bởi">
                    <Select defaultValue="lucy" className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-12">
                  <Form.Item label="Giờ tạo">
                    <Select defaultValue="lucy" className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4 col-12">
                  <Form.Item label="Ngày tạo">
                    <Input className="style-input" placeholder="" type="date" />
                  </Form.Item>
                </div>
                <div className="col-md-4 col-12">
                  <Form.Item label="Nguồn khách">
                    <Select defaultValue="lucy" className="w-100 style-input">
                      <Option value="jack">Jack</Option>
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
            </Form>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <div style={{ paddingRight: 5 }}>
                <Button type="primary" size="large">
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
StudentAppointmentCreate.layout = LayoutBase;
export default StudentAppointmentCreate;
