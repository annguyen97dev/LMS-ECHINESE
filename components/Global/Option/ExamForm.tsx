import React, { useState } from "react";
import { Modal, Form, Input, Button, Tooltip, Select, Switch } from "antd";
import { RotateCcw, ArrowDownCircle } from "react-feather";
const ExamForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;

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
          <Tooltip title="Tải xuống Excel">
            <button className="btn btn-icon update">
              <ArrowDownCircle color="#ca6702" />
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
        title={<>{props.showAdd ? "Create Exam" : "Update Exam"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Center">
                  <Select
                    defaultValue="British Council"
                    className="w-100 style-input"
                  >
                    <Option value="British Council">British Council</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Supplier">
                  <Select
                    defaultValue="ZIM - 308 Trần Phú"
                    className="w-100 style-input"
                  >
                    <Option value="ZIM - 308 Trần Phú">
                      ZIM - 308 Trần Phú
                    </Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Exam name">
                  <TextArea rows={2} />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Date">
                  <Input className="style-input" type="date" />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item label="Slot">
                  <Input className="style-input" type="number" />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item label="Hour">
                  <Select defaultValue="7:00" className="w-100 style-input">
                    <Option value="1">7:00</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item label="Price">
                  <Input className="style-input" type="number" />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item label="Official exam">
                  <Switch
                    className="style-input "
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                  />
                </Form.Item>
              </div>
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
