import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { gradeApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const GradeForm = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading, rowID, _onSubmit, getIndex, index, rowData } = props;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const { showNoti } = useWrap();
  const [form] = Form.useForm();

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any, e) => {
    let res = _onSubmit(data);

    res.then(function (rs: any) {
      rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields());
    });
  });

  useEffect(() => {
    if (isModalVisible) {
      if (rowID) {
        getIndex();
        // Cập nhật giá trị khi show form update
        Object.keys(rowData).forEach(function (key) {
          setValue(key, rowData[key]);
        });
        form.setFieldsValue(rowData);
      }
    }
  }, [isModalVisible]);

  return (
    <>
      {rowID ? (
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

      {/*  */}
      <Modal
        title={`${!props.showAdd ? "Sửa" : "Tạo"} khối học`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="GradeCode"
                  label="Code khóa"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                >
                  <Input
                    placeholder=""
                    className="style-input"
                    defaultValue={props.rowData?.ListCourseCode}
                    onChange={(e) => setValue("GradeCode", e.target.value)}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="GradeName"
                  label="Tên khóa"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                >
                  <Input
                    placeholder=""
                    className="style-input"
                    defaultValue={props.rowData?.ListCourseName}
                    onChange={(e) => setValue("GradeName", e.target.value)}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="Description"
                  label="Mô Tả"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                >
                  <Input
                    placeholder=""
                    className="style-input"
                    defaultValue={props.rowData?.Description}
                    onChange={(e) => setValue("Description", e.target.value)}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {isLoading.type == "ADD_DATA" && isLoading.status && (
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
});

export default GradeForm;
