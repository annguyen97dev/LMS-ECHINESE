import React, { useState } from "react";
import { Modal, Form, Input, Tooltip, Select, Spin } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";

const JobForm = (props) => {
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const { Option } = Select;
  const { rowData, jobId, isLoading, _onSubmit, getJobDetail } = props;
  const [dataDetail, setDataDetail] = useState<IJob>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loadingSelect, setLoadingSelect] = useState(false);

  const onSubmit = handleSubmit((data: any, e) => {
    let res = _onSubmit(data);

    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
    });
  });

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
        title={<>{props.showAdd ? "Create Job" : "Update Job"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Job Name">
                  <Input className="style-input" />
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <button type="submit" className="btn btn-primary w-100">
                Lưu
                {/* {isLoading.type == "ADD_DATA" && isLoading.status && (
                  <Spin className="loading-base" />
                )} */}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default JobForm;
