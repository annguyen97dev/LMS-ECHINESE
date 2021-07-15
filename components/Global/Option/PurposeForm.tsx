import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Divider, Tooltip, Select, Skeleton, InputNumber } from 'antd';
import { RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";

const PurposeForm = (props) => {
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
        <Tooltip title="Cập nhật">
          <button
            className="btn btn-icon edit"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            <RotateCcw />
          </button>
        </Tooltip>
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
        title={<>{props.showAdd ? "Create Purposes" : "Update Purposes"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={onSubmit}>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Purpose"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                >
                  <Input 
                    className="style-input"
                    allowClear={true}
                    defaultValue={props.rowData?.PurposesName}
                    onChange={(e) => setValue("PurposesName", e.target.value)}
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

export default PurposeForm;
