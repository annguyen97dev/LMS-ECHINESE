import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Divider, Tooltip, Select, Skeleton, InputNumber } from 'antd';
import { RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";

const SupplierForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
    });
  const { showNoti } = useWrap();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
    // const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    let res = props._onSubmit(data);
    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
    });
  });

  useEffect(() => {
    if(isModalVisible) {
      if (props.rowData) {
        Object.keys(props.rowData).forEach(function (key) {
          setValue(key, props.rowData[key]);
        });
      }
    }
  }, [isModalVisible]);


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
        title={<>{props.showAdd ? "Create Supplier" : "Update Supplier"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={onSubmit}>
            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item 
                  label="Supplier Name" 
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                  <Input 
                    className="style-input"
                    allowClear={true}
                    defaultValue={props.rowData?.SupplierName}
                    onChange={(e) => setValue("SupplierName", e.target.value)} 
                    />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item 
                  label="Taxcode"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                  <Input 
                    className="style-input"
                    allowClear={true}
                    defaultValue={props.rowData?.Taxcode}
                    onChange={(e) => setValue("Taxcode", e.target.value)} 
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Item 
                  label="Represent"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                  <Input 
                    className="style-input"
                    allowClear={true}
                    defaultValue={props.rowData?.Represent}
                    onChange={(e) => setValue("Represent", e.target.value)} 
                    />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item 
                  label="Number Of Represent"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                  <Input 
                    className="style-input"
                    allowClear={true}
                    defaultValue={props.rowData?.NumberOfRepresent}
                    onChange={(e) => setValue("NumberOfRepresent", e.target.value)} 
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Person In Charge"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                    <Select 
											className="style-input" 
											defaultValue={props.rowData?.PersonInChargeName || "Chọn nhân viên quản lí"}
											onChange={(value) => setValue("PersonInChargeID", value)}>
                        {props.dataStaffManage && props.dataStaffManage.map(row => (
                          <Option key={row.UserInformationID} value={row.UserInformationID}>{row.FullNameUnicode}</Option>
                        ))
                        }
                        <Option value="disabled" disabled>
                          Disabled
                        </Option>
										</Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Address"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                  <Input 
                    className="style-input"
                    allowClear={true}
                    defaultValue={props.rowData?.Address}
                    onChange={(e) => setValue("Address", e.target.value)} 
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Introduce">
                  <TextArea
                    placeholder=""
                    rows={2} 
                    defaultValue={props.rowData?.Introduce}
                    onChange={(e) => setValue("Introduce", e.target.value)}  
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
                {props.showAdd == true ? (
                  <Button className="w-100" type="primary" size="large" onClick={onSubmit}>
                    Create
                  </Button>
                ) : (
                  <Button className="w-100" type="primary" size="large" onClick={onSubmit}>
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

export default SupplierForm;
