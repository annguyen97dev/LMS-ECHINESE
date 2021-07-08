import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton, Button, DatePicker, Select, Table, Checkbox, Divider } from "antd";
import moment from 'moment';
import { RotateCcw, UserPlus, FilePlus, XSquare } from "react-feather";
import AddStaffForm from"./AddStaffForm";
import AddSubTaskForm from "./AddSubTaskForm";

const dateFormat = 'DD/MM/YYYY';
const monthFormat = 'MM/YYYY';

const TaskForm = React.memo((props: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalAddStaffVisible, setIsModalAddStaffVisible] = useState(false);
    const [isModalAddSubTaskVisible, setIsModalAddSubTaskVisible] = useState(false);

    const [indeterminate, setIndeterminate] = React.useState(true);
    const { isLoading } = props;

    return (
      <>
        {props.showIcon && (
            <>
                <button
                    className="btn btn-icon add"
                    onClick={() => {
                      setIsModalAddSubTaskVisible(true);
                    }}
                >
                    <Tooltip title="Thêm sub task">
                    <FilePlus />
                    </Tooltip>
                </button>
                <button
                    className="btn btn-icon add"
                    onClick={() => {
                        setIsModalAddStaffVisible(true);
                    }}
                >
                    <Tooltip title="Thêm nhân viên">
                        <UserPlus />
                    </Tooltip>
                </button>
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
  
        {/* Create and Edit */}
        <Modal
          title={`${!props.showAdd ? "Sửa" : "Tạo"} task`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <div className="container-fluid">
            <Form layout="vertical">
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Tên Task">
                    <Input
                        placeholder=""
                        className="style-input"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Ghi Chú">
                    <Input
                        placeholder=""
                        className="style-input"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Thời Hạn">
                    <DatePicker 
                      defaultValue={moment('2015/01/01', dateFormat)} 
                      format={dateFormat} 
                      className="style-input"/>
                  </Form.Item>
                </div>
              </div>
              {/* <div className="row">
                <div className="col-12">
                  <Form.Item>
                    <Radio.Group
                      onChange={onChange_Status("Enable")}
                      value={status}
                    >
                      <Radio value={1}>Hiện</Radio>
                      <Radio value={2}>Ẩn</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div> */}
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
        {/* Add staff to task */}
        <AddStaffForm isOpen={isModalAddStaffVisible} onCancel={(status) => setIsModalAddStaffVisible(status)}/>
        {/* Add sub task to task */}
        <AddSubTaskForm isOpen={isModalAddSubTaskVisible} onCancel={(status) => setIsModalAddSubTaskVisible(status)}/>
      </>
    );
})

export default TaskForm;