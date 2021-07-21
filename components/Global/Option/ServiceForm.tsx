import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Divider, Tooltip, Select, Skeleton } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
const ServiceForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { showNoti } = useWrap();
  const status = [
    {
      id: 1,
      text: "Chưa hoạt động",
    },
    {
      id: 2,
      text: "Hoạt động",
    },
    {
      id: 3,
      text: "Ngưng hoạt động",
    },
  ]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  // const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    console.log("Data submit: ", data);

    let res = props._onSubmit(data);

    res.then(function (rs: any) {
      console.log("Res in form: ", rs);
      rs && rs.status == 200 && setIsModalVisible(false);
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
        title={<>{props.showAdd ? "Thêm Dịch Vụ" : "Cập Nhật Dịch Vụ"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Dịch vụ"
                  name="ServiceName"
                  rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                  initialValue={props.rowData?.ServiceName}
                  >
                    <Input 
                    placeholder=""
                    className="style-input"
                    onChange={(e) => setValue("ServiceName", e.target.value)} 
                  />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Thông tin dịch vụ"
                  name="DescribeService"
                  initialValue={props.rowData?.DescribeService}
                >
                    <TextArea
                      placeholder=""
                      rows={2} 
                      onChange={(e) => setValue("DescribeService", e.target.value)}  
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="NCC Dịch vụ"
                  name="SupplierServicesName"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.SupplierServicesName}  
                >
                    <Select 
											className="style-input" 
											// defaultValue={props.rowData?.SupplierServicesName || "Chọn nhà cung cấp"}
                      allowClear={true}
											onChange={(value) => setValue("SupplierServicesID", value)}>
                        {props.dataSupplier && props.dataSupplier.map(row => (
                          <Option key={row.ID} value={row.ID}>{row.SupplierName}</Option>
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
                  label="Nhân viên quản lí"
                  name="Person In Charge"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.PersonInChargeOfServicesName}
                >
                    <Select 
											className="style-input" 
											// defaultValue={props.rowData?.PersonInChargeOfServicesName || "Chọn nhân viên quản lí"}
                      allowClear={true}
											onChange={(value) => setValue("PersonInChargeOfServicesID", value)}>
                        {props.dataStaff && props.dataStaff.map(row => (
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
                  label="Trạng thái"
                  name="Services Status"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.StatusName}
                  >
                    <Select 
											className="style-input" 
											// defaultValue={props.rowData?.StatusName || "Trạng thái dịch vụ"}
                      allowClear={true}
											onChange={(value) => setValue("Status", value)}>
                        {status.map(row => (
                          <Option key={row.id} value={row.id}>{row.text}</Option>
                        ))
                        }
                        <Option value="disabled" disabled>
                          Disabled
                        </Option>
										</Select>
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

export default ServiceForm;
