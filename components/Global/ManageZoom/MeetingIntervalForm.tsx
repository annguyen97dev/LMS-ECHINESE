import React, { useState } from "react";
import { Modal, Form, Input, Button, Switch, Tooltip, Select } from "antd";
import { RotateCcw } from "react-feather";

const MeetingIntervalForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [staffList, setStaffList] = useState(false);
  const onChange = () => {
    setStaffList(true);
  };
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
        title="Tạo lịch họp"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setStaffList(false);
        }}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            <div className="row">
              <div className="col-12">
                <Form.Item label="Chủ đề cuộc họp">
                  <Input placeholder="" className="style-input" />
                </Form.Item>
              </div>
            </div>

            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Ngày diễn ra">
                  <Input placeholder="" className="style-input" type="date" />
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Giờ">
                  <Select defaultValue="..." className="w-100 style-input">
                    <Option value="7:30">7:30</Option>
                    <Option value="8:00">8:00</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-9">
                <Form.Item label="Mời tham gia">
                  <Select
                    onChange={onChange}
                    defaultValue="(Mời tất cả)"
                    className="w-100 style-input"
                  >
                    <Option value="(Mời tất cả)">(Mời tất cả)</Option>

                    <Option value="SuperAdmin">SuperAdmin</Option>
                    <Option value="Teacher">Teacher</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-3">
                <Form.Item label="Gửi mail">
                  <Switch
                    defaultChecked
                    onChange={() => console.log("checked")}
                  />
                </Form.Item>
              </div>
            </div>

            {staffList == true && (
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Tên thành viên">
                    <Select
                      mode="multiple"
                      onChange={() => {}}
                      defaultValue={["Staff 1", "Staff 2"]}
                      className="w-100 style-input"
                    >
                      <Option value="Staff 3">Staff 3</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            )}

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

export default MeetingIntervalForm;
