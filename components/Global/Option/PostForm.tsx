import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Tooltip,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import { RotateCcw, ArrowDownCircle } from "react-feather";
import { InboxOutlined } from "@ant-design/icons";
import TinyMCE from "~/components/TinyMCE";
const ExamForm = (props) => {
  const { Dragger } = Upload;
  const draggerProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <>
      {props.showIcon && (
        <>
          <Tooltip title="Cập nhật">
            <button
              className="btn btn-icon edit"
              onClick={() => {
                setIsModalVisible(true);
              }}
            >
              <RotateCcw />
            </button>
          </Tooltip>
        </>
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
        width={800}
        title={<>{props.showAdd ? "New Post" : "Update Post"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            {/*  */}
            <div className="row">
              <Form.Item label="Title">
                <Input placeholder="..." className="style-input" />
              </Form.Item>
            </div>
            {/*  */}
            <div className="row">
              <Form.Item label="Banner">
                <Dragger {...draggerProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Dragger>
              </Form.Item>
            </div>
            {/*  */}
            <div className="row">
              <Form.Item label="Content">
                <TinyMCE />
              </Form.Item>
            </div>
            {/*  */}
            <div className="row ">
              <div className="col-12">
                {props.showAdd == true ? (
                  <Button className="w-100" type="primary" size="large">
                    Create
                  </Button>
                ) : (
                  <Button className="w-100" type="primary" size="large">
                    Update
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

export default ExamForm;
