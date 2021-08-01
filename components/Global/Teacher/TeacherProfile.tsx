import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Card,
  Divider,
  Input,
  Select,
  DatePicker,
  Button,
  Avatar,
  Upload,
  Rate,
  Table,
  Checkbox,
  Tabs,
  Spin,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import PowerTable from "~/components/PowerTable";
import AvatarBase from "~/components/Elements/AvatarBase.tsx";

import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const { TabPane } = Tabs;

const dataSource = [
  {
    key: "1",
    ClassName: "AS - IELTS Intermediate",
    Check: "",
    Listening: "",
    Wrting: "",
    Speaking: "",
    Reading: "",
    SpeakingWork: "",
    ReadingWork: "",
    width: "",
    fixed: "",
  },
];

const columns = [
  {
    title: "Tên lớp học",
    width: 200,
    dataIndex: "ClassName",
    // key: "classname",

    render: (text) => <p className="color-primary">{text}</p>,
  },
  {
    title: "Dạy",
    dataIndex: "Check",
    // key: "check",
    render: () => <Checkbox />,
  },
  {
    title: "Listening",
    dataIndex: "Listening",
    // key: "listening",
    render: () => <SelectRemark />,
  },
  {
    title: "Wrting",
    dataIndex: "Wrting",
    // key: "wrting",
    render: () => <SelectRemark />,
  },
  {
    title: "Reading",
    dataIndex: "Reading",
    // key: "reading",
    render: () => <SelectRemark />,
  },

  {
    title: "BT Listening",
    dataIndex: "ListeningWork",
    // key: "listeningwork",
    render: () => <SelectRemark />,
  },
  {
    title: "BT Reading",
    dataIndex: "ReadingWork",
    // key: "readingwork",
    render: () => <SelectRemark />,
  },
];

const SelectRemark = () => {
  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <Select defaultValue="trungbinh" onChange={handleChange}>
      <Option value="gioi">Giỏi</Option>
      <Option value="kha">Khá</Option>
      <Option value="trungbinh">Trung bình</Option>
    </Select>
  );
};

function callback(key) {
  console.log(key);
}

const TeacherProfile = (props) => {
  const [form] = Form.useForm();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const { showNoti } = useWrap();
  
  // --- GET DATA USER
  // let dataUser = null;
  // if (props.dataUser) {
  //   dataUser = props.dataUser;
  // }
  const { dataUser, isLoading } = props;

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  const { Option } = Select;


  useEffect(() => {
  }, []);

  if(isLoading.status == true) {
    return (
      <>
        <Card className="space-top-card text-center">
          <Spin></Spin>
        </Card>
      </>
    );
  } else {
    return (
      <>
        <Card className="space-top-card">
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Tài khoản nhân viên" key="1">
              <div className="row justify-content-center">
                <div className="col-md-8 col-12">
                  <Form form={form} layout="vertical">
                    <div className="row">
                      <div className="col-md-4 col-12">
                        <Form.Item 
                          label="Họ và tên" 
                          name="họ và tên" 
                          initialValue={dataUser?.FullNameUnicode}>
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) =>
                              setValue("FullNameUnicode", e.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                      <div className="col-md-4 col-12">
                        <Form.Item 
                          label="Giới tính" 
                          name="Giới tính" 
                          initialValue={dataUser?.Gender == 1 ? "Nữ" : "Nam"}>
                          <Select
                            className="style-input"
                            size="large"
                          >
                            <Option value={0}>Nam</Option>
                            <Option value={1}>Nữ</Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-md-4 col-12">
                        <Form.Item 
                          label="Ngày sinh"
                          name="DOB"
                          initialValue={moment(dataUser?.DOB)}
                        >
                            <DatePicker
                              className="style-input"
                              format={dateFormat}
                              onChange={(date, dateString) => setValue("DOB", dateString)}
                            >
                            </DatePicker>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <Form.Item 
                          label="Địa chỉ email" 
                          name="Địa chỉ email" 
                          initialValue={dataUser?.Email}>
                          <Input
                            className="style-input"
                            size="large"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-md-6 col-12">
                        <Form.Item 
                          label="Số điện thoại" 
                          name="Số điện thoại" 
                          initialValue={dataUser?.Mobile}>
                          <Input
                            className="style-input"
                            size="large"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form.Item 
                          label="Địa chỉ" 
                          name="Địa chỉ" 
                          initialValue={dataUser?.Address}>
                          <Input
                            className="style-input"
                            size="large"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    {/* <div className="row">
                      <div className="col-md-6 col-12">
                        <Form.Item label="Tên tài khoản">
                          <Input
                            className="style-input"
                            defaultValue={dataUser?.UserName}
                            size="large"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-md-6 col-12">
                        <Form.Item label="Mật khẩu mới">
                          <Input
                            className="style-input"
                            size="large"
                            type="password"
                          />
                        </Form.Item>
                      </div>
                    </div> */}
                    <div className="row">
                      <div className="col-12">
                        <Form.Item label="Hình đại diện">
                          <ImgCrop grid>
                            <AvatarBase
                              imageUrl={dataUser?.Avatar}
                              getValue={(value) => setValue("Avatar", value)}
                            />
                          </ImgCrop>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <button className="btn btn-primary">
                          Cập nhật thông tin
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Thông tin lớp học" key="2">
                <div className="row">
                  <div className="col-12">
                    <div className="wrap-table table-expand mb-16">
                      <Table
                        columns={columns}
                        dataSource={dataSource}
                        size="middle"
                        pagination={false}
                      />
                    </div>
                    <div className="wrap-table table-expand mb-16">
                      <Table
                        columns={columns}
                        dataSource={dataSource}
                        size="middle"
                        pagination={false}
                      />
                    </div>
  
                    <div className="wrap-table table-expand mb-16">
                      <Table
                        columns={columns}
                        dataSource={dataSource}
                        size="middle"
                        pagination={false}
                      />
                    </div>
                    <div className="wrap-table table-expand mb-16">
                      <Table
                        columns={columns}
                        dataSource={dataSource}
                        size="middle"
                        pagination={false}
                      />
                    </div>
                    <div className="wrap-table table-expand mb-16">
                      <Table
                        columns={columns}
                        dataSource={dataSource}
                        size="middle"
                        pagination={false}
                      />
                    </div>
                  </div>
                </div>
            </TabPane>
          </Tabs>
        </Card>
      </>
    );
  }
};

export default TeacherProfile;
