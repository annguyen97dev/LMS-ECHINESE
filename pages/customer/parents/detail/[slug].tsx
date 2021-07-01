import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Form,
  Card,
  Input,
  Select,
  DatePicker,
  Avatar,
  Upload,
  Rate,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  UserOutlined,
  DeploymentUnitOutlined,
  WhatsAppOutlined,
  MailOutlined,
  AimOutlined,
} from "@ant-design/icons";
import TitlePage from "~/components/Elements/TitlePage";
import PowerTable from "~/components/PowerTable";
import { Tooltip } from "antd";
import { Eye } from "react-feather";
import Link from "next/link";
import ModalAddStudent from "~/components/Global/ParentsList/ModalAddStudent";
import LayoutBase from "~/components/LayoutBase";

const dataSource = [];

for (let i = 0; i < 50; i++) {
  dataSource.push({
    key: i,
    StudentName: "Student " + i,
    Center: "Trung tâm Zim cơ sở " + i,
    Email: "Student@gmail.com",
    Phone: "01203899009",
    Action: "",
  });
}

const columns = [
  {
    title: "Họ tên",
    dataIndex: "StudentName",
    key: "studentname",
    render: (text) => <p className="font-weight-blue">{text}</p>,
  },
  {
    title: "Trung tâm",
    dataIndex: "Center",
    key: "center",
    render: (text) => <p className="font-weight-black">{text}</p>,
  },
  {
    title: "Email",
    dataIndex: "Email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "Phone",
    key: "phone",
  },
  {
    title: "",
    dataIndex: "Action",
    key: "action",
    align: "center",
    render: (Action) => (
      <Link
        href={{
          pathname: "/customer/student/detail/[slug]",
          query: { slug: 2 },
        }}
      >
        <a className="btn btn-icon view">
          <Tooltip title="Chi tiết">
            <Eye />
          </Tooltip>
        </a>
      </Link>
    ),
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

const ParentsDetail = (props) => {
  // Get path and slug
  const router = useRouter();
  const slug = router.query.slug;
  let path: string = router.pathname;
  let pathString: string[] = path.split("/");
  path = pathString[pathString.length - 2];
  // --------------- //

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

  useEffect(() => {}, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          <Card className="info-profile-left">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center flex-wrap">
                <Avatar size={64} src={<img src="/images/user.png" />} />
                {path === "teacher-detail" && (
                  <Rate
                    disabled
                    value={4}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-2">
                <UserOutlined />
              </div>
              <div className="col-10  d-flex ">Nguyễn An</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <DeploymentUnitOutlined />
              </div>
              <div className="col-10  d-flex ">Teacher</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <WhatsAppOutlined />
              </div>
              <div className="col-10  d-flex ">0978111222</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <MailOutlined />
              </div>
              <div className="col-10  d-flex ">anhandsome@gmail.com</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <AimOutlined />
              </div>
              <div className="col-10  d-flex ">London, England</div>
            </div>
          </Card>
          {/* {
            path === "teacher-detail"  &&
            <Card title="Ratings" className="mt-2">
                hello
            </Card>
          } */}
        </div>
        <TitlePage title="Profile phụ huynh" />
        <div className="col-9">
          <Card title="Profile">
            <Form layout="vertical">
              <div className="row">
                <div className="col-4">
                  <Form.Item label="Họ và tên">
                    <Input className="style-input" size="large" />
                  </Form.Item>
                </div>
                <div className="col-4">
                  <Form.Item label="Giới tính">
                    <Select
                      className="style-input"
                      size="large"
                      defaultValue="Không xác định"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Không xác định">Không xác định</option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-4">
                  <Form.Item label="Ngày sinh">
                    <DatePicker size="large" className="w-100 style-input" />
                  </Form.Item>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <Form.Item label="Địa chỉ email">
                    <Input className="style-input" size="large" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item label="Số điện thoại">
                    <Input className="style-input" size="large" />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Địa chỉ">
                    <Input className="style-input" size="large" />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Item label="Tên tài khoản">
                    <Input className="style-input" size="large" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item label="Mật khẩu mới">
                    <Input
                      className="style-input"
                      size="large"
                      type="password"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Hình đại diện">
                    <ImgCrop grid>
                      <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                      >
                        {fileList.length < 1 && "+ Upload"}
                      </Upload>
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
            <div className="d-lock w-100 m-5"></div>
            <PowerTable
              TitleCard={<ModalAddStudent />}
              Extra="Danh sách học viên liên kết với phụ huynh"
              dataSource={dataSource}
              columns={columns}
            />
          </Card>
        </div>
      </div>

      <div></div>
    </div>
  );
};
ParentsDetail.layout = LayoutBase;

export default ParentsDetail;
