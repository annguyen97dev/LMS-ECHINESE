import React, { useState } from "react";
import { Modal, Form, Input, Button, Switch, Tooltip, Select } from "antd";
import { RotateCcw } from "react-feather";
const DiscountForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [percent, setPercent] = useState(false);
  const onChange = () => {
    setPercent(!percent);
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
        title="Create Discount"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            {props.showAdd ? (
              <div className="row">
                <div className="col-9">
                  {percent ? (
                    <Form.Item label="Percent">
                      <Input placeholder="25%" className="style-input" />
                    </Form.Item>
                  ) : (
                    <Form.Item label="Price">
                      <Input placeholder="" className="style-input" />
                    </Form.Item>
                  )}
                </div>
                <div className="col-3 d-flex justify-content-center">
                  <Form.Item label="Percent">
                    <Switch onChange={onChange} />
                  </Form.Item>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-6">
                  <Form.Item label="Code">
                    <Input placeholder="" className="style-input" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item label="Price">
                    <Input placeholder="" className="style-input" />
                  </Form.Item>
                </div>
              </div>
            )}

            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item label="Number of uses">
                  <Input placeholder="" className="style-input" type="number" />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item label="Expires">
                  <Input placeholder="" className="style-input" type="date" />
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

export default DiscountForm;
