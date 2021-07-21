import React, {useEffect, useState} from 'react';
import { Modal, Form, Input, Button, Divider, Tooltip, Select } from "antd";
import { RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";

const CustomerSupplier = (props) => {
  const { Option } = Select;

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
        title={
          <>
            {props.showAdd
              ? "Thêm Nguồn Khách Hàng"
              : "Cập Nhật Nguồn Khách Hàng"}
          </>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Tên Nguồn khách hàng" 
                  name="Customer Supplier" 
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.SourceInformationName}
                  >
                  <Input 
                    className="style-input" 
                    onChange={(e) => setValue("SourceInformationName", e.target.value)} 
                    allowClear={true} 
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {/* {isLoading.type == "ADD_DATA" && isLoading.status && (
                    <Spin className="loading-base" />
                  )} */}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default CustomerSupplier;
