import React, {useEffect, useState} from 'react';
import { Modal, Form, Input, Button, Switch, Tooltip, Select, DatePicker, InputNumber, Spin } from "antd";
import { DollarSign } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import moment from 'moment';

const RefundForm = (props) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  
  const currentDay = new Date();

  const [percent, setPercent] = useState(false);
  const onChange = () => {
    setPercent(!percent);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
    // const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    console.log("Data submit", data);
    if(Object.keys(data).length === 1) {
      showNoti("danger", "Bạn chưa chỉnh sửa");
    } else {
      let res = props._onSubmit(data);
      res.then(function (rs: any) {
        rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
      });
    }

  });

  useEffect(() => {
    if(isModalVisible) {
      if (props.rowData) {
        // Object.keys(props.rowData).forEach(function (key) {
        //   setValue(key, props.rowData[key]);
        // });
        setValue("ID", props.rowData.ID);
      }
    }
  }, [isModalVisible]);

  return (
    <>
      <Tooltip title="Thông tin phiếu chi">
        <button
          className="btn btn-icon"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <DollarSign />
        </button>
      </Tooltip>

      <Modal
        title="Thông tin phiếu chi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="wrap-form">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="row">
              <div className="col-12">
                  <Form.Item 
                    label="Trung tâm" 
                    name="Trung tâm"
                    initialValue={props.rowData?.BranchName}  
                  >
                    <Select 
                      className="w-100 style-input"
                      onChange={(value) => setValue("BranchID", value)}  
                    >
                      {props.dataBranch && props.dataBranch.map((item,index) => (
                        <Option key={index} value={item.ID}>{item.BranchName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item 
                  label="Phương thức thanh toán" 
                  name="Phương thức thanh toán"
                  initialValue={props.rowData?.PaymentMethodsName}
                >
                  <Select 
                    className="w-100 style-input"
                    onChange={(value) => setValue("PaymentMethodsID", value)}
                  >
                    <Option value="1">Tiền mặt</Option>
                    <Option value="2">Chuyển khoản</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item 
                  label="Trạng thái" 
                  name="Trạng thái"
                  initialValue={props.rowData?.StatusName}
                  >
                  <Select 
                    className="w-100 style-input"
                    onChange={(value) => setValue("StatusID", value)}
                  >
                    <Option value="1">Chờ duyệt</Option>
                    <Option value="2">Đã duyệt</Option>
                    <Option value="3">Không duyệt</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Ghi chú"
                  name="Ghi chú"
                  initialValue={props.rowData?.Reason}
                  >
                  <TextArea 
                    placeholder=""
                    rows={2} 
                    allowClear={true}
                    onChange={(e) => setValue("Reason", e.target.value)} 
                  />
                </Form.Item>
              </div>
            </div>
            {/*  */}
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

export default RefundForm;
