import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Tooltip, Select, Spin } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { jobApi } from "~/apiBase";
import { timelineApi } from "~/apiBase/course-detail/timeline";
import router from "next/router";

const CommentCreate = React.memo((props: any) => {
  const { TextArea } = Input;
  const { reloadData } = props;
  const { setValue } = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let res = await timelineApi.add({
        ...data,
        CourseID: parseInt(router.query.slug as string),
      });
      afterSubmit(res?.data.message);
      reloadData();
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
      <button
        className="btn btn-warning add-new"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        Thêm mới
      </button>

      <Modal
        title="Phản hồi mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="Note"
                  label="Phản hồi"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <TextArea
                    className="style-input"
                    onChange={(e) => setValue("Note", e.target.value)}
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
});

export default CommentCreate;
