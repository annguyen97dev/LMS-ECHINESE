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

    let res = props._onSubmit(data);

    res.then(function (rs: any) {
      console.log("Res in form: ", rs);
      rs
        ? res.status == 200 && setIsModalVisible(false)
        : showNoti("danger", "Server lỗi")
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
        title={<>{props.showAdd ? "Create Service" : "Update Service"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Service Name">
                    <Input 
                    placeholder=""
                    className="style-input"
                    defaultValue={props.rowData?.ServiceName}
                    onChange={(e) => setValue("ServiceName", e.target.value)} 
                  />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item label="Description">
                    <TextArea
                      placeholder=""
                      rows={2} 
                      defaultValue={props.rowData?.DescribeService}
                      onChange={(e) => setValue("DescribeService", e.target.value)}  
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Supplier Services"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                    <Select 
											className="style-input" 
											defaultValue={props.rowData?.SupplierServicesName || "Chọn nhà cung cấp"}
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
                  label="Person In Charge"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                    <Select 
											className="style-input" 
											defaultValue={props.rowData?.PersonInChargeOfServicesName || "Chọn nhân viên quản lí"}
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
                  label="Services Status"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}>
                    <Select 
											className="style-input" 
											defaultValue={props.rowData?.StatusName || "Trạng thái dịch vụ"}
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

export default ServiceForm;
