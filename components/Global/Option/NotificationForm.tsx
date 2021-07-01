import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, Switch } from "antd";
import TinyMCE from "~/components/TinyMCE";
import SortBox from "~/components/Elements/SortBox";

const NotificationForm = (props) => {
  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <>
      <button
        className="btn btn-warning add-new"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        Thêm mới
      </button>

      {/*  */}
      <Modal
        title="Create Notification Form"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            <div className="row">
              <div className="col-12">
                <Form layout="vertical">
                  {/*  */}
                  <div className="row">
                    <div className="col-8">
                      <Form.Item label="Title Notification">
                        <Input placeholder="" className="style-input" />
                      </Form.Item>
                    </div>
                    <div className="col-4">
                      <Form.Item label="Sort">
                        <SortBox />
                      </Form.Item>
                    </div>
                  </div>
                  {/*  */}
                  <div className="row">
                    <div className="col-8">
                      <Form.Item label="Title Notification">
                        <Select
                          mode="multiple"
                          style={{ width: "100%" }}
                          placeholder="select one country"
                          defaultValue={["MONA Lý Thường Kiệt"]}
                          optionLabelProp="label"
                        >
                          <Option
                            value="ZIM - 20L5 Thái Hà"
                            label="ZIM - 20L5 Thái Hà"
                          >
                            <div className="demo-option-label-item">
                              ZIM - 20L5 Thái Hà
                            </div>
                          </Option>
                          <Option
                            value="ZIM - 1A - 1B Dân Chủ"
                            label="  ZIM - 1A - 1B Dân Chủ"
                          >
                            <div className="demo-option-label-item">
                              ZIM - 1A - 1B Dân Chủ
                            </div>
                          </Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="col-4">
                      <Form.Item label="Send email">
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                      </Form.Item>
                    </div>
                  </div>
                  {/*  */}
                  <Form.Item label="Content">
                    <TinyMCE />
                  </Form.Item>
                </Form>
              </div>
            </div>
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
  );
};

export default NotificationForm;
