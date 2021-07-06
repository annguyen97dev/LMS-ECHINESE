import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton, Button, DatePicker, Select, Table, Checkbox, Divider } from "antd";

const dateFormat = 'DD/MM/YYYY';
const monthFormat = 'MM/YYYY';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const columns = [
    {
        title: 'Tên nhân viên',
        dataIndex: 'staffname',
    },
    {
        title: 'Chức vụ',
        dataIndex: 'position',
    },
    {
        title: 'Tài khoản',
        dataIndex: 'user',
    },
];

const data = [
    {
        staffname: 'A',
        position: 'CEO',
        user: '0794412351'
    },
    {
        staffname: 'B',
        position: 'Co-Founder',
        user: '0794412352'
    },
    {
        staffname: 'C',
        position: 'Co-Founder',
        user: '0794412353'
    },
];

const dataPosition = [
    {
      text: 'CEO',
    },
    {
      text: 'Co-Founder',
    },
]
  
const dataStaff = [
{
    text: 'A',
},
{
    text: 'B',
},
{
    text: 'C',
},
]

const AddStaffForm = (props: any) => {
    const [state, setState] = useState({ selectedRowKeys: [] });
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (e) => {
        e.preventDefault();
        setIsModalVisible(true);
    };

    function onChange(value) {
        console.log(`selected ${value}`);
    };

    const onSelectedRowKeysChange = (selectedRowKeys) => {
        setState({ selectedRowKeys });
    };
    const rowSelection = {
        selectedRowKeys: state.selectedRowKeys,
        onChange: onSelectedRowKeysChange,
        hideSelectAll: true,
    };

    useEffect(() => {
        setIsModalVisible(props.isOpen);
    }, [props.isOpen]);

    return (
        <>
            <Modal
            title={`Thêm nhân viên`}
            visible={isModalVisible}
            onCancel={() => {setIsModalVisible(false); props.onCancel(false)}}
            footer={null}
            >
            <div className="container-fluid">
                <Form layout="vertical">
                <div className="row">
                    <div className="col-6">
                    <Form.Item label="Chức vụ">
                        <Select
                        showSearch
                        placeholder="Chọn chức vụ"
                        optionFilterProp="children"
                        onChange={onChange}
                        // onFocus={onFocus}
                        // onBlur={onBlur}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        className="style-input"
                        >
                        {dataPosition.map((item, index) => 
                            <Option value={item.text} key={index}>{item.text}</Option>
                        )}
                        </Select>
                    </Form.Item>
                    </div>
                    <div className="col-6">
                    <Form.Item label="Nhân viên">
                        <Select
                            showSearch
                            placeholder="Chọn nhân viên"
                            optionFilterProp="children"
                            onChange={onChange}
                            // onFocus={onFocus}
                            // onBlur={onBlur}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            className="style-input"
                        >
                            {dataStaff.map((item, index) => 
                            <Option value={item.text} key={index}>{item.text}</Option>
                            )}
                        </Select>
                    </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                    <Form.Item label="Danh sách nhân viên">
                        <div className="wrap-table">
                        <Table
                            dataSource={data} 
                            columns={columns}
                            size="middle"
                            rowSelection={rowSelection}
                        />
                        </div>
                    </Form.Item>
                    </div>
                </div>
                <div className="row ">
                <div className="col-12">
                    <Button className="w-100" type="primary" size="large">
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

export default AddStaffForm;
