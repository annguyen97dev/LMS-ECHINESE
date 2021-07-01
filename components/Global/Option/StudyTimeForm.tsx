import React, { useState } from "react";
import { Modal, Form, Input, Button, Divider, Tooltip, Select } from "antd";
import { RotateCcw } from "react-feather";
const StudyTimeForm = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Option } = Select;
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
        title="Create Study Time"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            <div className="row">
              <div className="col-12">
                <Form.Item label="Study Time">
                  <Input placeholder="" className="style-input" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Lesson">
                  <Select defaultValue="lucy" className="w-100 style-input">
                    <Option value="lucy">Lucy</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Start">
                  <Select
                    defaultValue="lucy"
                    className="w-100 style-input"
                    allowClear
                  >
                    <Option value="lucy">Lucy</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
                <Button className="w-100" type="primary" size="large">
                  Lưu
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default StudyTimeForm;
