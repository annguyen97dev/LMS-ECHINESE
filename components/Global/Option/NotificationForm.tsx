import React, {useEffect, useState} from 'react';
import { Modal, Form, Input, Button, Select, Switch, Spin } from "antd";
import { Roles } from "~/lib/roles/listRoles";
import TinyMCE from "~/components/TinyMCE";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import ReactHtmlParser from 'react-html-parser';

const NotificationForm = (props) => {
  const { Option } = Select;


	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	const { showNoti } = useWrap();

  const [sendMail, setSendMail] = useState(false);

  const onChange = () => {
    setSendMail(!sendMail);
  };

  const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted },
	} = useForm();
	  // const { showNoti } = useWrap();
	
	const onSubmit = handleSubmit((data: any) => {
    data.IsSendMail = sendMail;

    console.log("Data submit: ", data);

		let res = props._onSubmit(data);
		res.then(function (rs: any) {
			rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
		});
	});

  const onChangeTinyMCE = (value) => {
    setValue("NotificationContent", value);
  }

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
      <button
        className="btn btn-warning add-new"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        Thêm mới
      </button>

      {/*  */}
      <Modal
        title="Create Notification Form"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            {/*  */}
            <div className="row">
              <div className="col-8">
                <Form.Item 
                label="Tên thông báo" 
                name="Tên thông báo"
                rules={[
                  { required: true, message: "Bạn không được để trống" },
                ]}
                >
                  <Input 
                    placeholder="" 
                    className="style-input" 
                    onChange={(e) => setValue("NotificationTitle", e.target.value)} 
                    allowClear={true}
                    />
                </Form.Item>
              </div>
              <div className="col-4">
                  <Form.Item 
                  label="Send email" 
                  name="Send email"
                  >
                  <Switch onChange={onChange} />
                  </Form.Item>
              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item 
                label="Trung tâm" 
                name="Trung tâm"
                rules={[
                  { required: true, message: "Bạn không được để trống" },
                ]}>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    className="style-input multiple-select"
                    optionLabelProp="label"
                    onChange={(value) => setValue("BranchID", value.toString())}
                    allowClear={true}
                  >
                    <Option
                          value={0}
                          label="Tất cả"
                    >
                      <div className="demo-option-label-item">
                        Tất cả
                      </div>
                    </Option>
                    {props.dataBranch && props.dataBranch.map((item) => (
                        <Option
                          value={item.ID}
                          label={item.BranchName}
                          key={item.ID}
                        >
                          <div className="demo-option-label-item">
                            {item.BranchName}
                          </div>
                        </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item 
                  label="Người nhận"
                  name="Người nhận"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  >
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    // placeholder="select one country"
                    optionLabelProp="label"
                    className="style-input multiple-select"
                    onChange={(value) => setValue("RoleID", value.toString())}
                    allowClear={true}
                  >
                    <Option
                      value={0}
                      label="Tất cả"
                    >
                      <div className="demo-option-label-item">
                        Tất cả
                      </div>
                    </Option>
                    {Roles.map(item => (
                        <Option
                          key={item.id}
                          value={item.id}
                          label={item.RoleName}
                        >
                          <div className="demo-option-label-item">
                            {item.RoleName}
                          </div>
                        </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/*  */}
            <Form.Item label="Nội dung thông báo" name="Nội dung thông báo">
              <TinyMCE onChangeTinyMCE={(value) => onChangeTinyMCE(value)}/>
            </Form.Item>
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

export default NotificationForm;
