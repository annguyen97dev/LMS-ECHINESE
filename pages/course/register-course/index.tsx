import React, { Fragment, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
import { Copy, Power } from "react-feather";
import TitlePage from "~/components/Elements/TitlePage";
import SelectField from "~/components/FormControl/SelectField";
import InputTextField from "~/components/FormControl/InputTextField";
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
import RegInfo from "~/components/Global/RegisterCourse/RegCourseBuy";
import RegCourseInfo from "~/components/Global/RegisterCourse/RegCourseBuy";
import RegCourseBuy from "~/components/Global/RegisterCourse/RegCourseInfo";
import RegCoursePayment from "~/components/Global/RegisterCourse/RegCoursePayment";

const RegisterCourse = () => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [option, setOption] = useState(null);

  const onChange = (value) => {
    setOption(value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
          <Card title="Thông tin cá nhân">
            <Form layout="vertical">
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Loại đăng ký">
                    <Select
                      onChange={onChange}
                      className="style-input w-100"
                      placeholder="Đăng ký học"
                    >
                      <Option value={1}>Đăng ký học</Option>
                      <Option value={2}>Mua dịch vụ</Option>
                      <Option value={3}>Thanh toán</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Có hơp đồng">
                    <Switch defaultChecked />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Họ và tên">
                    <Input className="style-input" placeholder="Mona Media" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Số điện thoại">
                    <Input className="style-input" placeholder="0909123123" />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Ngày sinh">
                    <Input
                      className="style-input"
                      type="date"
                      placeholder="dd/mm/yyyy"
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Email">
                    <Input
                      className="style-input"
                      placeholder="mona@media.com"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Tỉnh/Thành phố">
                    <Select className="style-input w-100">
                      <Option value="1">HCM</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Quận/Huyện">
                    <Select className="style-input w-100">
                      <Option value="1">Quận 11</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Phường xã">
                    <Select className="style-input w-100">
                      <Option value="1">Phường 8</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Địa chỉ">
                    <Input
                      className="style-input"
                      placeholder="Số nhà, tên đường"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="CMND">
                    <Input className="style-input" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Nơi cấp">
                    <Select className="style-input w-100">
                      <Option value="1">CA.Quận Tân Bình</Option>
                      <Option value="2">CA.Quận Thủ Đức</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Ngày cấp">
                    <Input
                      className="style-input"
                      type="date"
                      placeholder="dd/mm/yyyy"
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Công việc">
                    <Select className="style-input w-100">
                      <Option value="1">Checker</Option>
                      <Option value="2">Dev pro</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Nơi công tác">
                    <Input className="style-input" placeholder="Mona media" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Người nhà, liên hệ">
                    <Input
                      className="style-input"
                      placeholder="Tên, sđt người nhà"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Đầu vào">
                    <Input className="style-input" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Mục tiêu">
                    <Input className="style-input" />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Thời gian thi">
                    <Input className="style-input" placeholder="dd/mm/yyyy" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Mục đích học">
                    <Select className="style-input w-100">
                      <Option value="1">Checker</Option>
                      <Option value="2">Dev pro</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
            </Form>
          </Card>
        </div>
        <div className="col-6">
          {option == 1 && <RegCourseInfo />}
          {option == 2 && <RegCourseBuy />}
          {option == 3 && <RegCoursePayment />}
        </div>
      </div>
    </div>
  );
};
RegisterCourse.layout = LayoutBase;
export default RegisterCourse;
