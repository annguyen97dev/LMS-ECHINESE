import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Tooltip, Select, Spin } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { consultationStatusApi } from "~/apiBase/options/consultation-status";

const ConsultationStatusForm = React.memo((props: any) => {
  const { infoId, reloadData, infoDetail, currentPage } = props;
  const { setValue } = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (infoId) {
      try {
        let res = await consultationStatusApi.update({
          ...data,
          Enable: true,
          ID: infoId,
        });
        afterSubmit(res?.data.message);
        reloadData(currentPage);
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    } else {
      try {
        let res = await consultationStatusApi.add({ ...data, Enable: true });
        afterSubmit(res?.data.message);
        reloadData(1);
        form.resetFields();
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    }
  };

  const afterSubmit = (mes) => {
    showNoti("success", mes);
    setLoading(false);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (infoDetail) {
      form.setFieldsValue(infoDetail);
    }
  }, [isModalVisible]);

  return (
    <>
      {infoId ? (
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
      ) : (
        <button
          className="btn btn-warning add-new"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          Thêm mới
        </button>
      )}

      <Modal
        title={<>{infoId ? "Cập nhật" : "Thêm mới"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="Name"
                  label="Tình trạng tư vấn khách hàng"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    placeholder="Đã tư vấn"
                    className="style-input"
                    onChange={(e) => setValue("Name", e.target.value)}
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

export default ConsultationStatusForm;
