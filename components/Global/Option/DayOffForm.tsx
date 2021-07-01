import React, { useState } from "react";
import { Modal, Form, Input, Button, Divider, Tooltip, Select } from "antd";
import { X, AlertTriangle } from "react-feather";
const DayOffForm = (props) => {
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <>
      {props.showIcon && (
        <>
          <Tooltip title="Cập nhật">
            <button
              className="btn btn-icon delete"
              onClick={() => {
                setIsModalVisible(true);
              }}
            >
              <X />
            </button>
          </Tooltip>
          <Modal
            title={<AlertTriangle color="red" />}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
          >
            Bạn chắc chắc muốn ngày nghỉ này?
          </Modal>
        </>
      )}
      {props.showAdd && (
        <>
          <button
            className="btn btn-warning add-new"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            Thêm mới
          </button>
          <Modal
            title="Create Day Off"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <div className="container-fluid">
              <Form layout="vertical">
                <div className="row">
                  <div className="col-12">
                    <Form.Item label="Day off">
                      <Input className="style-input" type="date" />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                <div className="row">
                  <div className="col-12">
                    <Form.Item label="Note">
                      <TextArea rows={2} />
                    </Form.Item>
                  </div>
                </div>
                {/*  */}
                <div className="row ">
                  <div className="col-12">
                    <Button className="w-100" type="primary" size="large">
                      Create
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </Modal>
        </>
      )}

      {/*  */}
    </>
  );
};

export default DayOffForm;
