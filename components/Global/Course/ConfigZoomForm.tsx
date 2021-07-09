import React, { Fragment, useState } from "react";
import { Modal, Form, Input, Button, Divider, Tooltip, Select } from "antd";
import { RotateCcw } from "react-feather";

const ConfigZoomForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);

  const showMoreInfo = () => {
    setMoreInfo(!moreInfo);
  };
  return (
    <>
      {props.showIcon && (
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <Tooltip title="Cập nhật">
            <RotateCcw />
          </Tooltip>
        </button>
      )}
      {props.showAdd && (
        <button
          className="btn btn-warning add-new"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          Thêm mới
        </button>
      )}

      {/*  */}
      <Modal
        title={<>{props.showAdd ? "Cấu hình" : "Cập nhật cấu hình"}</>}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setMoreInfo(false);
        }}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            <div className="row">
              <div className="col-12">
                <Form.Item label="Giáo viên">
                  <Select className="w-100 style-input">
                    <Option value="Echinese">Echinese</Option>
                    <Option value="Giáo viên 1">Giáo viên 1</Option>
                    <Option value="Echinese 2">Echinese 2</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Tài khoản">
                  <Input
                    className="style-input"
                    placeholder="taikhoanzoom@gmail.com"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="API Key">
                  <Input className="style-input" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="API Secret">
                  <Input className="style-input" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Mã xác thực">
                  <TextArea />
                </Form.Item>
              </div>
            </div>

            <div className="row instructions" onClick={() => showMoreInfo()}>
              <div className="col-12 d-flex">
                <i className="far fa-question-circle" />
                <div style={{ marginTop: "-4px", paddingLeft: "6px" }}>
                  Hướng dẫn
                </div>
              </div>
            </div>

            {moreInfo && <MoreInfo />}

            <div className="row ">
              <div className="col-12">
                {props.showAdd == true ? (
                  <Button className="w-100" type="primary" size="large">
                    Tạo
                  </Button>
                ) : (
                  <Button className="w-100" type="primary" size="large">
                    Lưu
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ConfigZoomForm;

export const ImageInstructions = (props) => {
  const [imageVisible, setImageVisible] = useState(false);
  return (
    <Fragment>
      <button
        className="btn-show-image"
        onClick={() => {
          setImageVisible(true);
        }}
      >
        Xem ảnh
      </button>
      <Modal
        visible={imageVisible}
        onCancel={() => setImageVisible(false)}
        footer={null}
        width={1000}
      >
        {props.zoomIns1 && (
          <img src="/images/zoomIns1.png" alt="img" style={{ width: "100%" }} />
        )}
        {props.zoomIns2 && (
          <img src="/images/zoomIns2.png" alt="img" style={{ width: "100%" }} />
        )}
        {props.zoomIns3 && (
          <img src="/images/zoomIns3.png" alt="img" style={{ width: "100%" }} />
        )}
        {props.zoomIns4 && (
          <img src="/images/zoomIns4.png" alt="img" style={{ width: "100%" }} />
        )}
      </Modal>
    </Fragment>
  );
};

export const MoreInfo = () => {
  return (
    <div className="row">
      <div className="col-12">
        <div>
          1. Đăng kí tài khoản Zoom Developer
          <a
            href="https://zoom.us/signin"
            style={{ paddingLeft: "5px", textDecoration: "underline" }}
          >
            tại đây
          </a>
        </div>
        <ul>
          <li>
            Chọn đăng ký/đăng nhập bằng Google.
            <span>
              <ImageInstructions zoomIns1={true} />
            </span>
          </li>
          <li>
            Tài khoản mail cũng là tài khoản cấu hình cần nhập. Có thể xem
            <a
              href="https://zoom.us/signin"
              style={{
                paddingLeft: "5px",
                textDecoration: "underline",
                color: "blue",
              }}
            >
              tại đây
            </a>
            . (Chọn show Sign-In Email và Copy){" "}
          </li>
        </ul>

        <div>
          2. Sau khi đăng nhập ➝ Chọn "Develop" góc trên bên trái ➝ Build App ➝
          Create App JWT.
          <span>
            <ImageInstructions zoomIns2={true} />
          </span>
        </div>
        <ul>
          <li>
            Tại mục Information: nhập App Name và Company Name.{" "}
            <span>
              <ImageInstructions zoomIns3={true} />
            </span>
          </li>
          <li>
            Tại mục App Credentials: Sao chép API Key và API Secret.{" "}
            <span>
              <ImageInstructions zoomIns4={true} />
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
