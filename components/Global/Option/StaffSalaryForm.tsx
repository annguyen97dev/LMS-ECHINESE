import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Select,
  Skeleton,
  InputNumber,
  Spin,
} from "antd";
import { RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";

const StaffSalaryForm = (props) => {
  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { showNoti } = useWrap();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  // const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    if (typeof data.Salary == "string") {
      data.Salary = Number(data.Salary.replace(/\$\s?|(,*)/g, ""));
    }

    let res = props._onSubmit(data);
    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
    });
  });

  useEffect(() => {
    if (isModalVisible) {
      if (props.rowData) {
        Object.keys(props.rowData).forEach(function (key) {
          setValue(key, props.rowData[key]);
        });
      }
    }
  }, [isModalVisible]);
<<<<<<< HEAD
=======

>>>>>>> master
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
<<<<<<< HEAD
			{/*  */}
			<Modal
				title={
					<>{props.showAdd ? 'Thêm Lương Nhân Viên' : 'Cập Nhật Lương Nhân Viên'}</>
				}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								{props.showAdd ? (
									<Form.Item 
										label="Nhân viên"
										name="Staff"
										rules={[
											{ required: true, message: "Bạn không được để trống" },
										]}
										>
										<Select 
											className="style-input" 
											placeholder="Chọn nhân viên"
											allowClear={true}
											onChange={(value) => setValue("UserInformationID", value)}>
											{props.dataStaff && props.dataStaff.map(row => (
												<Option key={row.UserInformationID} value={row.UserInformationID}>{row.FullNameUnicode}</Option>
											))
											}
											<Option value="disabled" disabled>
												Disabled
											</Option>
										</Select>
									</Form.Item>
								) : (
									<Form.Item label="Ghi chú" name="Note">
										<Input placeholder="Note" className="style-input" allowClear={true}/>
									</Form.Item>
								)}
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item 
									label="Loại"
									name="Salary Type"
									rules={[
										{ required: true, message: "Bạn không được để trống" },
									]}
									initialValue={props.rowData?.StyleName}
									>
									<Select 
										className="style-input"
										placeholder="Salary Type" 
										allowClear={true}
										onChange={(value) => setValue("Style", value)}>
										<Option value="1">Tính lương theo tháng</Option>
										<Option value="2">Tính lương theo giờ</Option>
										<Option value="disabled" disabled>
											Disabled
										</Option>
									</Select>
								</Form.Item>
							</div>
						</div>
						{/*  */}
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item 
									label="Mức Lương"
									name="Salary Const"
									rules={[
										{ required: true, message: "Bạn không được để trống" },
									]}
									initialValue={props.rowData?.Salary}
									>
									<InputNumber
										className='ant-input style-input w-100'
										formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/\$\s?|(,*)/g, '')}
										onChange={value => setValue("Salary", value)}
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
=======

      {/*  */}
      <Modal
        title={
          <>
            {props.showAdd
              ? "Thêm Lương Nhân Viên"
              : "Cập Nhật Lương Nhân Viên"}
          </>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                {props.showAdd ? (
                  <Form.Item
                    label="Nhân viên"
                    name="Staff"
                    rules={[
                      { required: true, message: "Bạn không được để trống" },
                    ]}
                  >
                    <Select
                      className="style-input"
                      placeholder="Chọn nhân viên"
                      allowClear={true}
                      onChange={(value) => setValue("UserInformationID", value)}
                    >
                      {props.dataStaff &&
                        props.dataStaff.map((row) => (
                          <Option
                            key={row.UserInformationID}
                            value={row.UserInformationID}
                          >
                            {row.FullNameUnicode}
                          </Option>
                        ))}
                      <Option value="disabled" disabled>
                        Disabled
                      </Option>
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item label="Ghi chú" name="Note">
                    <Input
                      placeholder="Note"
                      className="style-input"
                      allowClear={true}
                    />
                  </Form.Item>
                )}
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item
                  label="Loại"
                  name="Salary Type"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.StyleName}
                >
                  <Select
                    className="style-input"
                    placeholder="Salary Type"
                    allowClear={true}
                    onChange={(value) => setValue("Style", value)}
                  >
                    <Option value="1">Tính lương theo tháng</Option>
                    <Option value="2">Tính lương theo giờ</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item
                  label="Mức Lương"
                  name="Salary Const"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.Salary}
                >
                  <InputNumber
                    className="ant-input style-input w-100"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={(value) => setValue("Salary", value)}
                  />
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row ">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {props.isLoading.type == "ADD_DATA" &&
                    props.isLoading.status && <Spin className="loading-base" />}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
>>>>>>> master
};

export default StaffSalaryForm;
