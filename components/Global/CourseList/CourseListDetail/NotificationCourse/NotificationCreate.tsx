import { Modal, Button, Form, Input, Select, Spin } from "antd";
import { useState } from "react";
import { useWrap } from "~/context/wrap";
import { notificationCourseApi } from "~/apiBase/course-detail/notification-course";
import router from "next/router";
import TextAreaField from "~/components/FormControl/TextAreaField";
import * as yup from "yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const NotificationCreate = (props: any) => {
  const { TextArea } = Input;
  const { reloadData } = props;
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const { setValue } = useForm();
  const [form] = Form.useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let res = await notificationCourseApi.add({
        ...data,
        CourseID: parseInt(router.query.slug as string),
      });
      afterSubmit(res?.data.message);
      reloadData(1);
      form.resetFields();
    } catch (error) {
      showNoti("danger", error.message);
      setLoading(false);
    }
  };

  const afterSubmit = (mes) => {
    showNoti("success", mes);
    setLoading(false);
    setIsModalVisible(false);
  };

  return (
    <>
      <button className="btn btn-warning add-new" onClick={openModal}>
        Thêm mới
      </button>
      <Modal
        title="Tạo thông báo mới"
        visible={isModalVisible}
        footer={null}
        onCancel={closeModal}
      >
        <div className="wrap-form">
          <Form layout="vertical" onFinish={onSubmit} form={form}>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="NotificationTitle"
                  label="Thông báo"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    placeholder="Thông báo 1"
                    className="style-input"
                    onChange={(e) =>
                      setValue("NotificationTitle", e.target.value)
                    }
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="NotificationContent"
                  label="Nội dung"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <TextArea
                    placeholder="Thông báo nghỉ dịch"
                    className="style-input"
                    onChange={(e) =>
                      setValue("NotificationTitle", e.target.value)
                    }
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {loading == true && <Spin className="loading-base" />}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default NotificationCreate;
