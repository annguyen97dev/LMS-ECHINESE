import React, { useState } from "react";
import { Card, Form, Select, Input, Divider, Button, Upload } from "antd";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
import ImgCrop from "antd-img-crop";
import { useForm } from "react-hook-form";

const StudentAppointmentCreate = () => {
  // const layout = {
  //   labelCol: { span: 4 },
  //   wrapperCol: { span: 20 },
  // };
  const [fileList, setFileList] = useState([]);
  const { TextArea } = Input;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const [form] = Form.useForm();

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any, e) => {
    console.log("DATA SUBMIT: ", data);
  });

  const onChange_avatar = ({ fileList: newFileList }) => {
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
  return (
    <div>
      <div className="row">
        <div className="col-12 text-center">
          <TitlePage title="Lịch hẹn" />
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center">
        <Card title="Phiếu thông tin cá nhân" className="w-70 w-100-mobile">
          <div className="wrap-form">
            <Form form={form} layout="vertical" onFinish={onSubmit}>
              {/*  */}

              {/** ==== Thông tin cơ bản  ====*/}
              <div className="row">
                <div className="col-12">
                  <ImgCrop rotate>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange_avatar}
                      onPreview={onPreview}
                    >
                      {fileList.length < 5 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Divider orientation="center">Thông tin cơ bản</Divider>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Email">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>

                <div className="col-md-6 col-12">
                  <Form.Item name="FullNameUniCode" label="Họ và tên">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Số điện thoại" name="Mobile">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Ngày sinh" name="DOB">
                    <Input className="style-input" placeholder="" type="date" />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-12">
                  <Form.Item label="Số CMND" name="CMND">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4 col-12">
                  <Form.Item label="Nơi cấp CMND" name="CMNDRegister">
                    <Select className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4 col-12">
                  <Form.Item label="Ngày cấp" name="CMNDDate">
                    <Input className="style-input" placeholder="" type="date" />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              {/** ==== Địa chỉ  ====*/}
              <div className="row">
                <div className="col-12">
                  <Divider orientation="center">Địa chỉ</Divider>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Tỉnh/TP" name="AreaID">
                    <Select className="w-100 style-input">
                      <Option value="jack">Jack</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Quận/Huyện" name="DistrictID">
                    <Select className="w-100 style-input">
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
                  <Form.Item label="Phường/Xã" name="WardID">
                    <Select className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Địa chỉ" name="Address">
                    <Select className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Số nhà/tên đường" name="HouseNumber">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Công việc" name="JobID">
                    <Select className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {/*  */}
              {/** ==== Khác  ====*/}
              <div className="row">
                <div className="col-12">
                  <Divider orientation="center">Khác</Divider>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Tên trung tâm" name="Branch">
                    <Select className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Mục đích học" name="AcademicPurposesID">
                    <Select className="w-100 style-input">
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Phụ huynh" name="ParentsOf">
                    <Input className="style-input" placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Nguồn khách" name="SourceInformationID">
                    <Select className="w-100 style-input">
                      <Option value="jack">Jack</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {/*  */}
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Giới thiệu thêm" name="Extension">
                    <TextArea />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <div style={{ paddingRight: 5 }}>
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {/* {isLoading.type == "ADD_DATA" && isLoading.status && (
                    <Spin className="loading-base" />
                  )} */}
                </button>
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
