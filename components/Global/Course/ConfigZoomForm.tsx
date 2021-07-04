import React, { useState } from "react";
import { Modal, Form, Input, Button, Divider, Tooltip, Select } from "antd";
import { RotateCcw } from "react-feather";

const ConfigZoomForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const [isModalVisible, setIsModalVisible] = useState(false);
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
        onCancel={() => setIsModalVisible(false)}
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
                  <Input
                    className="style-input"
                    placeholder="taikhoanzoom@gmail.com"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="API Secret">
                  <Input
                    className="style-input"
                    placeholder="taikhoanzoom@gmail.com"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <Form.Item label="Mã xác thực">
                <TextArea />
              </Form.Item>
            </div>
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
