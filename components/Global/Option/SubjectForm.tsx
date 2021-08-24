import React, { FC, useEffect, useState } from "react";
import { Modal, Form, Input, Spin, Select, Tooltip, Checkbox } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { branchApi, areaApi, districtApi } from "~/apiBase";

import { useWrap } from "~/context/wrap";
import router from "next/router";
import { RotateCcw } from "react-feather";

const SubjectForm = React.memo((props: any) => {
  const programID = parseInt(router.query.slug as string);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const { isLoading, rowID, _onSubmit, getIndex, index, rowData, dataProgram } =
    props;

  // SUBMI FORM
  const onSubmit = handleSubmit((data: any) => {
    let res = _onSubmit(data);

    res.then(function (rs: any) {
      rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields());
    });
  });

  // FUNCTION SELECT
  const onChangeSelect = (name) => (value) => {};

  console.log("DATA PROGRAM: ", dataProgram);

  useEffect(() => {
    if (isModalVisible) {
      if (programID) {
        setValue("ProGramID", programID);

        form.setFieldsValue({
          ...rowData,
          ProGramID: programID,
        });
      }

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

      <Modal
        title={rowID ? "Sửa môn học" : "Tạo môn học"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <div className="row">
              <div className="col-12">
                <Form.Item
                  label="Chương trình"
                  name="ProGramID"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                >
                  <Select
                    disabled={true}
                    style={{ width: "100%" }}
                    className="style-input"
                    showSearch
                    optionFilterProp="children"
                    onChange={onChangeSelect("BranchID")}
                  >
                    {dataProgram?.map((item, index) => (
                      <Option key={index} value={item.ID}>
                        {item.ProgramName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  label="Tên môn học"
                  name="SubjectName"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                >
                  <Input
                    placeholder=""
                    className="style-input"
                    onChange={(e) => setValue("SubjectName", e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Checkbox
                    onChange={(e) => setValue("Additional", e.target.checked)}
                  >
                    <p style={{ fontWeight: 500 }}> Bổ sung</p>
                  </Checkbox>
                </Form.Item>
              </div>
            </div>

            <div className="row ">
              <div className="col-12 mt-3">
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

export default SubjectForm;
