import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Divider, Tooltip, Select, Skeleton, InputNumber, Spin } from 'antd';
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
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item 
                  label="Nhà cung cấp (NCC)"
                  name="Supplier Name" 
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.SupplierName}
                  >
                  <Input 
                    className="style-input"
                    allowClear={true}
                    onChange={(e) => setValue("SupplierName", e.target.value)} 
                    />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item 
                  label="Mã số thuế"
                  name="Tax Code"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.Taxcode}
                  >
                  <Input 
                    className="style-input"
                    allowClear={true}
                    onChange={(e) => setValue("Taxcode", e.target.value)} 
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Item 
                  label="Người đại diện NCC"
                  name="Represent"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.Represent}
                  >
                  <Input 
                    className="style-input"
                    allowClear={true}
                    onChange={(e) => setValue("Represent", e.target.value)} 
                    />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item 
                  label="Số điện thoại"
                  name="Number Of Represent"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.NumberOfRepresent}
                  >
                  <Input 
                    className="style-input"
                    allowClear={true}
                    onChange={(e) => setValue("NumberOfRepresent", e.target.value)} 
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Nhân viên quản lí"
                  name="Person In Charge"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
									initialValue={props.rowData?.PersonInChargeName}
                  
                  >
                    <Select 
											className="style-input" 
                      allowClear={true}
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
                  label="Địa chỉ"
                  name="Address"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.Address}
                  >
                  <Input 
                    className="style-input"
                    allowClear={true}
                    onChange={(e) => setValue("Address", e.target.value)} 
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Giới thiệu ngắn" 
                  name="Introduce"
                  initialValue={props.rowData?.Introduce}
                >
                  <TextArea
                    placeholder=""
                    rows={2} 
                    allowClear={true}
                    onChange={(e) => setValue("Introduce", e.target.value)}  
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {props.isLoading.type == "ADD_DATA" && props.isLoading.status && (
                    <Spin className="loading-base" />
                  )}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default SupplierForm;
