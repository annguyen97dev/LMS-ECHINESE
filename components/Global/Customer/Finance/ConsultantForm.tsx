import React, {useEffect, useState} from 'react';
import { Modal, Button, Form, Input, Select, Divider, Tooltip, Spin } from "antd";
import { Edit } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import moment from 'moment';
import ImgCrop from "antd-img-crop";
import AvatarBase from "~/components/Elements/AvatarBase.tsx";

const ConsultantForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;
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
    console.log("Data submit", data);

    if(Object.keys(data).length === 1) {
      showNoti("danger", "Bạn chưa chỉnh sửa");
    } else {
      let res = props._onSubmit(data);
      res.then(function (rs: any) {
        rs && rs.status == 200 && setIsModalVisible(false), form.resetFields;
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
      <Tooltip title={props.title}>
        <button
          className="btn btn-icon"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <Edit />
        </button>
      </Tooltip>

      <Modal
        title={props.title}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="wrap-form">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Lý do" 
                  name="Lý do"
                  initialValue={props.rowData?.Reason} 
                >
                    <TextArea
                      placeholder=""
                      rows={2} 
                      onChange={(e) => setValue("Reason", e.target.value)}  
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="QR Code" 
                  name="QR Code"
                  initialValue={props.rowData?.Qrcode}  
                >
                  <ImgCrop grid>
                    <AvatarBase
                      imageUrl={props.rowData?.Qrcode}
                      getValue={(value) => setValue("Qrcode", value)}
                    />
                  </ImgCrop>
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

export default ConsultantForm;
