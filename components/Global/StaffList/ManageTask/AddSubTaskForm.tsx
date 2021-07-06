import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton, Button, DatePicker, Select, Table, Checkbox, Divider } from "antd";
import { RotateCcw, UserPlus, FilePlus, XSquare } from "react-feather";

const dateFormat = 'DD/MM/YYYY';
const monthFormat = 'MM/YYYY';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const dataSubTask = [
    {
        title: "A",
        ofStaff: "Thanh Tú",
        CreateOn: "05/07/2021 11:30 AM"
    },
    {
        title: "B",
        ofStaff: "Thanh Tú",
        CreateOn: "05/07/2021 11:31 AM"
    },
    {
        title: "C",
        ofStaff: "Thanh Tú",
        CreateOn: "05/07/2021 11:32 AM"
    },
]

const AddSubTaskForm = (props: any) => {
    const [state, setState] = useState({ selectedRowKeys: [] });
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (e) => {
        e.preventDefault();
        setIsModalVisible(true);
    };

    const [listSubTask, setListSubTask] = useState({
        list: dataSubTask,
        isShowList: true
    });
    const [titleTask, setTitleTask] = useState('');

    function handleChange(e) {
        // track input field's state
        setTitleTask(e.target.value);
    }
     
    function handleAdd() {
        // add item
        const newList = listSubTask.list.concat({
            title: titleTask,
            ofStaff: 'Thanh Tú',
            CreateOn: Date().toLocaleString()
        });

        setListSubTask({ ...listSubTask, list: newList });

        console.log(listSubTask);

        setTitleTask('');
    }

    function onChange(value) {
    console.log(`selected ${value}`);
    }

    useEffect(() => {
        setIsModalVisible(props.isOpen);
    }, [props.isOpen]);

    return (
        <>
        <Modal
          title={`Sub task`}
          visible={isModalVisible}
          onCancel={() => { setIsModalVisible(false); props.onCancel(false) }}
          footer={null}
        >
          <div className="container-fluid">
            <Form layout="vertical">
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Title task">
                    <Input
                          placeholder="..."
                          className="style-input"
                          onChange={handleChange}
                      />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12 list-subtask">
                  <Form.Item label="List sub task">
                    <CheckboxGroup className="w-100" onChange={onChange} >
                    {listSubTask.list.map((item, i) => (
                      <div className="item-subtask d-flex justify-content-between" key={i}>
                        <Checkbox className="d-flex m-0" value={item.title}>
                          {item.title}
                        </Checkbox>
                        <div className="info-subtask">
                          {/* After checked */}
                          {/* <span className="info-subtask__ofstaff">Nhân viên hoàn thành: {item.ofStaff}</span> */}
                          <span className="info-subtask__status">
                            <button
                              className="btn btn-icon chose"
                            >
                              <Tooltip title="Nhận task">
                                <UserPlus />
                              </Tooltip>
                            </button>
                            <button
                              className="btn btn-icon delete"
                            >
                              <Tooltip title="Xóa task">
                                <XSquare />
                              </Tooltip>
                            </button>
                          </span>
                        </div>
                      </div>
                    ))}
                  </CheckboxGroup>
                  </Form.Item>
                </div>
              </div>
              <div className="row ">
                <div className="col-12">
                  <Button className="w-100" type="primary" size="large" onClick={handleAdd}>
                      Add
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
        </>
    );
};

export default AddSubTaskForm;
