import {
  Card,
  Checkbox,
  DatePicker,
  Form,
  Select,
  Spin,
  Table,
  Tabs,
} from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

const { TabPane } = Tabs;

const columns = [
  {
    title: "Tên Chương trình học",
    width: 200,
    dataIndex: "ProgramName",
    // key: "classname",

    render: (text) => <p className="font-weight-blue">{text}</p>,
  },
];

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
  const {
    dataUser,
    isLoading,
    updateTeacherID,
    userID,
    dataSubject,
    updateTeacherForSubject,
  } = props;
  const { Option } = Select;

  const onSubmit = handleSubmit((data) => {
    console.log("Data submit:", data);
    if (Object.keys(data).length === 1) {
      showNoti("danger", "Bạn chưa chỉnh sửa");
    } else {
      let res = updateTeacherID(data);
      res.then(function (rs: any) {
        rs && rs.status == 200;
      });
    }
  });

  const expandedRowRender = (record) => {
    const columns = [];
    const data = [
      {
        Subject: "Subject",
      },
    ];

    for (let i = 0; i < Object.keys(record.Subject).length; i++) {
      columns.push({
        key: record.Subject[i].SubjectID,
        title: record.Subject[i].SubjectName,
        dataIndex: "Subject",
        render: () => (
          <Checkbox
            value={record.Subject[i].SubjectID}
            checked={record.Subject[i].IsSelected ? true : false}
            onChange={onChangeCheckBox}
          />
        ),
      });
    }

    const onChangeCheckBox = (e) => {
      // console.log(`checked = ${e.target.value}`);
      const data = {
        UserInformationID: userID,
        SubjectID: e.target.value,
      };
      console.log("Data submit:", data);
      let res = updateTeacherForSubject(data);
      res.then(function (rs: any) {
        rs && rs.status == 200;
      });
    };

    if (Object.keys(record.Subject).length) {
      return (
        <div className="mini-table">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="tb-expand"
          />
        </div>
      );
    } else {
      return <p>Chưa có môn học</p>;
    }
  };

  useEffect(() => {
    setValue("UserInformationID", userID);
    console.log("Data Subject", dataSubject);
  }, []);

  if (isLoading.status == true) {
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
          <Tabs defaultActiveKey="1">
            {/* <TabPane tab="Tài khoản nhân viên" key="1">
              <div className="row justify-content-center">
                <div className="col-md-8 col-12">
                  <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <div className="row">
                      <div className="col-md-4 col-12">
                        <Form.Item
                          label="Họ và tên"
                          name="họ và tên"
                          initialValue={dataUser?.FullNameUnicode}
                        >
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
                          initialValue={dataUser?.Gender == 0 ? "Nữ" : "Nam"}
                        >
                          <Select
                            className="style-input"
                            size="large"
                            onChange={(value) => setValue("Gender", value)}
                          >
                            <Option value={0}>Nữ</Option>
                            <Option value={1}>Nam</Option>
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
                            onChange={(date, dateString) =>
                              setValue("DOB", dateString)
                            }
                          ></DatePicker>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <Form.Item
                          label="Địa chỉ email"
                          name="Địa chỉ email"
                          initialValue={dataUser?.Email}
                        >
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) => setValue("Email", e.target.value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-md-6 col-12">
                        <Form.Item
                          label="Số điện thoại"
                          name="Số điện thoại"
                          initialValue={dataUser?.Mobile}
                        >
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) => setValue("Mobile", e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          label="Địa chỉ"
                          name="Địa chỉ"
                          initialValue={dataUser?.Address}
                        >
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) =>
                              setValue("Address", e.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
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
                        <button className="btn btn-primary" type="submit">
                          Cập nhật thông tin
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </TabPane> */}
            <TabPane tab="Thông tin lớp học" key="2">
              <div className="row justify-content-center">
                <div className="col-md-8 col-12">
                  <div className="wrap-table table-expand">
                    <Table
                      dataSource={dataSubject}
                      columns={columns}
                      size="middle"
                      scroll={{ x: 600 }}
                      expandable={{
                        expandedRowRender: (record) =>
                          expandedRowRender(record),
                      }}
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
